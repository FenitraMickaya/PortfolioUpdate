import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const nextConfig = await readFile(new URL("../next.config.mjs", import.meta.url), "utf8");
const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const progressSource = await readFile(
  new URL("../components/landing/scroll-progress.tsx", import.meta.url),
  "utf8",
);
const planetSource = await readFile(
  new URL("../components/landing/planet-sculpture.tsx", import.meta.url),
  "utf8",
);
const desktopPlanetSource = await readFile(
  new URL("../components/landing/desktop-planet-sculpture.tsx", import.meta.url),
  "utf8",
).catch(() => "");

test("production configuration validates TypeScript and optimizes images", () => {
  assert.doesNotMatch(nextConfig, /ignoreBuildErrors/);
  assert.doesNotMatch(nextConfig, /unoptimized/);
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit");
});

test("responsive images declare viewport-aware sizes", () => {
  assert.match(pageSource, /src="\/images\/profil-fenitra\.png"[\s\S]*?sizes="/);
  assert.match(pageSource, /src=\{project\.image\}[\s\S]*?sizes=(?:"|\{)/);
});

test("scroll progress is frame-caded and avoids React scroll renders", () => {
  assert.match(progressSource, /requestAnimationFrame/);
  assert.doesNotMatch(progressSource, /setProgress/);
  assert.doesNotMatch(progressSource, /useState/);
});

test("planet scene does not fetch a remote HDR preset", () => {
  assert.doesNotMatch(planetSource, /preset=["']studio["']/);
});

test("reduced motion stops the WebGL animation loop", () => {
  assert.match(
    planetSource,
    /frameloop=\{reducedMotion\s*\?\s*["']demand["']\s*:\s*["']always["']\}/,
  );
});

test("Three.js is isolated behind desktop and near-viewport gates", () => {
  assert.match(
    pageSource,
    /import\s*\{\s*DesktopPlanetSculpture\s*\}\s*from\s*["']@\/components\/landing\/desktop-planet-sculpture["']/,
  );
  assert.doesNotMatch(
    pageSource,
    /from\s*["']@\/components\/landing\/planet-sculpture["']/,
  );
  assert.match(desktopPlanetSource, /\(min-width: 768px\)/);
  assert.match(desktopPlanetSource, /IntersectionObserver/);
  assert.match(desktopPlanetSource, /rootMargin/);
  assert.match(
    desktopPlanetSource,
    /import\(["']\.\/planet-sculpture["']\)/,
  );
  assert.doesNotMatch(
    desktopPlanetSource,
    /from\s*["'](?:three|@react-three\/)/,
  );
});

test("header provides a compact contact label and 44px controls", () => {
  assert.match(pageSource, /contactCompact/);
  assert.match(pageSource, /min-h-11/);
});
