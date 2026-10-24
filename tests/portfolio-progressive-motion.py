import os
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:3000")


def assert_visibly_rendered(page, selector):
    assert page.locator(selector).evaluate(
        "el => { const style = getComputedStyle(el); "
        "return style.display !== 'none' && style.visibility === 'visible' "
        "&& Number(style.opacity) > 0 }"
    )


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        no_js_context = browser.new_context(java_script_enabled=False)
        no_js_page = no_js_context.new_page()
        no_js_page.goto(BASE_URL, wait_until="domcontentloaded")
        assert no_js_page.locator("#about").is_visible()
        assert no_js_page.locator("#experience").is_visible()
        assert no_js_page.locator("#projets").is_visible()
        assert_visibly_rendered(no_js_page, "#about")
        assert_visibly_rendered(no_js_page, "#experience")
        assert_visibly_rendered(no_js_page, "#projets")
        assert no_js_page.locator("#experience article").count() == 2
        assert no_js_page.locator("header").count() == 1
        assert no_js_page.locator("main").count() == 1
        assert no_js_page.locator("footer").count() == 1
        assert no_js_page.locator("footer").evaluate("el => !el.closest('main')")
        assert no_js_page.locator("a.skip-link").get_attribute("href") == "#main"
        no_js_context.close()

        reduced_context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            reduced_motion="reduce",
        )
        reduced_page = reduced_context.new_page()
        reduced_page.goto(BASE_URL, wait_until="networkidle")
        reduced_page.locator("#experience").scroll_into_view_if_needed()
        reduced_page.wait_for_timeout(400)

        assert reduced_page.locator("#experience").evaluate(
            "el => getComputedStyle(el).transform === 'none'"
        )
        assert reduced_page.locator("#experience article").first.evaluate(
            "el => getComputedStyle(el).transform === 'none'"
        )
        assert reduced_page.locator("#experience article").first.evaluate(
            "el => getComputedStyle(el.parentElement).transform === 'none'"
        )
        assert reduced_page.locator("nav").evaluate(
            "el => getComputedStyle(el).position === 'fixed' && !el.closest('main')"
        )
        nav_box = reduced_page.locator("nav").bounding_box()
        assert nav_box is not None and abs(nav_box["y"]) < 0.5
        assert reduced_page.locator("header > [aria-hidden]").evaluate(
            "el => !el.closest('main')"
        )
        reduced_context.close()

        browser.close()


if __name__ == "__main__":
    main()
