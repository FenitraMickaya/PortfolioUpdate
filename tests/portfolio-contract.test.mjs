import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { dict } from "../lib/i18n.ts";

const pageSource = readFileSync(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
const mobileNavSource = readFileSync(
  new URL("../components/landing/mobile-nav.tsx", import.meta.url),
  "utf8",
);

const expected = {
  fr: {
    nav: "Expérience",
    label: "Expérience",
    title1: "Expérience",
    title2: "en production.",
    count: "(02)",
    status: "En cours",
    organizations: [
      "Tynoc Tech",
      "UN T’ELLE SUCCÈS & ÉLITE by Dayana Ouederni",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
    ],
  },
  en: {
    nav: "Experience",
    label: "Experience",
    title1: "Experience",
    title2: "in production.",
    count: "(02)",
    status: "In progress",
    organizations: [
      "Tynoc Tech",
      "UN T’ELLE SUCCÈS & ÉLITE by Dayana Ouederni",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
    ],
  },
};

function findUrlEvidence(value, path = "experience") {
  if (typeof value === "string") {
    return /\b(?:https?:\/\/|www\.)/i.test(value) ? [path] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      findUrlEvidence(entry, `${path}[${index}]`),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) => {
      const keyPath = `${path}.${key}`;
      const keyEvidence = ["url", "href"].includes(key.toLowerCase())
        ? [keyPath]
        : [];
      return [...keyEvidence, ...findUrlEvidence(entry, keyPath)];
    });
  }

  return [];
}

for (const locale of ["fr", "en"]) {
  test(`${locale.toUpperCase()} dictionary exposes the experience contract`, () => {
    const contract = expected[locale];
    const translations = dict[locale];

    assert.equal(translations.nav.experience, contract.nav);
    assert.ok(translations.experience, "experience dictionary is required");
    assert.equal(translations.experience.label, contract.label);
    assert.equal(translations.experience.title1, contract.title1);
    assert.equal(translations.experience.title2, contract.title2);
    assert.equal(translations.experience.count, contract.count);

    assert.equal(translations.experience.items.length, 2);
    assert.deepEqual(
      translations.experience.items.map((item) => item.organization),
      contract.organizations,
    );
    assert.deepEqual(
      translations.experience.items.map((item) => item.status),
      [contract.status, contract.status],
    );

    const [tynoc] = translations.experience.items;
    assert.equal(tynoc.technologies.length, 5);
    assert.ok(tynoc.technologies.includes("Tailwind CSS"));
    assert.deepEqual(tynoc.technologies, contract.technologies);

    assert.deepEqual(findUrlEvidence(translations.experience), []);
  });
}

function assertHrefOrder(source, hrefs) {
  let cursor = 0;

  for (const href of hrefs) {
    const markers = [`href="${href}"`, `href: "${href}"`];
    const positions = markers
      .map((marker) => source.indexOf(marker, cursor))
      .filter((position) => position >= 0);
    assert.ok(positions.length > 0, `missing ${href}`);
    const position = Math.min(...positions);
    cursor = position + href.length;
  }
}

function renderPosition(source, field, tag) {
  const escapedField = field.replace(".", "\\.");
  const pattern = new RegExp(
    `>\\s*\\{\\s*${escapedField}\\s*\\}\\s*</${tag}>`,
  );
  return pattern.exec(source)?.index ?? -1;
}

test("experience section sits between about and projects with stacked editorial cards", () => {
  const aboutPosition = pageSource.indexOf('id="about"');
  const experiencePosition = pageSource.indexOf('<Reveal id="experience"');
  const projectsPosition = pageSource.indexOf('<Reveal id="projets"');

  assert.notEqual(aboutPosition, -1, "about section anchor is required");
  assert.notEqual(experiencePosition, -1, "experience section is required");
  assert.notEqual(projectsPosition, -1, "projects section anchor is required");
  assert.ok(aboutPosition < experiencePosition);
  assert.ok(experiencePosition < projectsPosition);

  const experienceSection = pageSource.slice(experiencePosition, projectsPosition);
  assert.match(experienceSection, /className="grid gap-5"/);
  assert.doesNotMatch(experienceSection, /md:grid-cols-2/);
  assert.match(experienceSection, /md:grid-cols-\[[^\]]*32%[^\]]*_1fr\]/);
  assert.match(experienceSection, /t\.experience\.items\.map/);
  assert.match(experienceSection, /padStart\(2, "0"\)/);

  const positions = [
    renderPosition(experienceSection, "copy.status", "p"),
    renderPosition(experienceSection, "copy.context", "p"),
    renderPosition(experienceSection, "copy.organization", "h3"),
    renderPosition(experienceSection, "copy.summary", "p"),
    experienceSection.indexOf("copy.technologies.map"),
    renderPosition(experienceSection, "copy.role", "p"),
    renderPosition(experienceSection, "copy.period", "p"),
  ];

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("experience cards render no external links", () => {
  const experiencePosition = pageSource.indexOf('<Reveal id="experience"');
  const projectsPosition = pageSource.indexOf('<Reveal id="projets"');
  const experienceSection = pageSource.slice(experiencePosition, projectsPosition);

  assert.notEqual(experiencePosition, -1);
  assert.notEqual(projectsPosition, -1);
  assert.doesNotMatch(experienceSection, /<a\b/i);
  assert.doesNotMatch(experienceSection, /https?:\/\//i);
  assert.doesNotMatch(experienceSection, /target=/i);
});

test("desktop and mobile navigation use about, experience, projects, skills order", () => {
  const order = ["#about", "#experience", "#projets", "#skills"];

  assertHrefOrder(pageSource, order);
  assertHrefOrder(mobileNavSource, order);
});
