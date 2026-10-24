import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:3000")
OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", "/tmp/opencode/portfolio-final"))
AXE_PATH = Path(os.environ.get("AXE_PATH", "/tmp/opencode/axe.min.js"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def set_locale(context, locale):
    context.add_init_script(
        f"window.localStorage.setItem('portfolio-locale', {json.dumps(locale)})"
    )


def overflow(page):
    return page.evaluate(
        "Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)"
    )


def run_axe(page):
    page.add_script_tag(path=str(AXE_PATH))
    return page.evaluate(
        """async () => {
          const result = await axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
          });
          return result.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
          }));
        }"""
    )


def inspect_viewport(browser, locale, width, height, screenshot_name, axe_enabled=False):
    context = browser.new_context(viewport={"width": width, "height": height})
    set_locale(context, locale)
    page = context.new_page()
    console_errors = []
    failed_requests = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.on("requestfailed", lambda request: failed_requests.append({
        "url": request.url,
        "error": request.failure,
    }))

    page.goto(BASE_URL, wait_until="networkidle")
    page.locator("#experience").scroll_into_view_if_needed()
    page.wait_for_timeout(500)

    section = page.locator("#experience")
    assert section.locator("article").count() == 2
    assert section.locator("a").count() == 0
    assert overflow(page) == 0
    assert section.locator("h2").is_visible()
    assert all(section.locator("article").nth(i).is_visible() for i in range(2))

    section.screenshot(path=str(OUTPUT_DIR / screenshot_name))
    axe_violations = run_axe(page) if axe_enabled else []

    result = {
        "locale": locale,
        "viewport": [width, height],
        "overflow": overflow(page),
        "cards": section.locator("article").count(),
        "externalLinks": section.locator("a").count(),
        "consoleErrors": console_errors,
        "failedRequests": failed_requests,
        "axeViolations": axe_violations,
    }
    context.close()
    return result


def inspect_assets(browser):
    results = []
    for width in (390, 768, 1440):
        context = browser.new_context(viewport={"width": width, "height": 844})
        page = context.new_page()
        script_bodies = []
        requested_urls = []
        page.on("request", lambda request: requested_urls.append(request.url))
        page.on(
            "response",
            lambda response: script_bodies.append(response)
            if response.request.resource_type == "script"
            else None,
        )
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(600)

        bodies = []
        for response in script_bodies:
            try:
                bodies.append(response.body().decode("utf-8", errors="ignore"))
            except Exception:
                pass
        combined = "\n".join(bodies)
        results.append({
            "width": width,
            "canvasCount": page.locator("canvas").count(),
            "containsThreeMarker": any(
                marker in combined
                for marker in ("WebGLRenderer", "PerspectiveCamera", "SphereGeometry")
            ),
            "imageOptimizerRequests": sum("/_next/image?" in url for url in requested_urls),
            "remoteHdrRequests": sum(
                "github.com" in url.lower() and ("hdr" in url.lower() or "potsdamer_platz" in url.lower())
                for url in requested_urls
            ),
        })
        context.close()
    return results


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        views = []
        for locale, width, height, name, axe_enabled in (
            ("fr", 1440, 900, "experience-fr-desktop.png", True),
            ("en", 1440, 900, "experience-en-desktop.png", True),
            ("fr", 768, 1024, "experience-fr-tablet.png", False),
            ("fr", 390, 844, "experience-fr-mobile.png", True),
            ("en", 390, 844, "experience-en-mobile.png", False),
            ("fr", 320, 800, "experience-fr-narrow.png", False),
        ):
            views.append(inspect_viewport(browser, locale, width, height, name, axe_enabled))

        assets = inspect_assets(browser)
        browser.close()

    report = {"views": views, "assets": assets}
    (OUTPUT_DIR / "validation.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
