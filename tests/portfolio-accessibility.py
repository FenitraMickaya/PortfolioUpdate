import os
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:3000")


def assert_mobile_dialog(page):
    trigger = page.get_by_role("button", name="Menu")
    trigger.focus()
    trigger.click()

    dialog = page.get_by_role("dialog")
    dialog.wait_for(state="visible")

    assert page.evaluate("document.body.style.overflow") == "hidden"
    assert dialog.evaluate("el => el.matches(':modal')")
    assert page.evaluate("document.activeElement?.closest('[role=dialog]') !== null")

    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement?.closest('[role=dialog]') !== null")

    page.keyboard.press("Escape")
    dialog.wait_for(state="hidden")
    assert page.evaluate("document.activeElement === document.querySelector('button[aria-controls=mobile-nav-menu]')")
    assert page.evaluate("document.body.style.overflow") == ""


def assert_language_listbox(page):
    trigger = page.get_by_role("button", name="Langue : Français")
    trigger.focus()
    trigger.click()

    listbox = page.get_by_role("listbox")
    options = listbox.get_by_role("option")
    options.nth(0).wait_for(state="visible")
    assert listbox.get_attribute("aria-label") == "Langue"
    assert options.nth(0).get_attribute("aria-selected") == "true"
    assert options.nth(0).evaluate("el => document.activeElement === el")

    page.keyboard.press("ArrowDown")
    assert options.nth(1).evaluate("el => document.activeElement === el")
    assert options.nth(1).get_attribute("aria-selected") == "false"

    page.keyboard.press("ArrowUp")
    assert options.nth(0).evaluate("el => document.activeElement === el")
    page.keyboard.press("End")
    assert options.nth(1).evaluate("el => document.activeElement === el")
    page.keyboard.press("Home")
    assert options.nth(0).evaluate("el => document.activeElement === el")
    page.keyboard.press("ArrowDown")
    assert options.nth(1).evaluate("el => document.activeElement === el")

    page.keyboard.press("Space")
    page.wait_for_function("document.documentElement.lang === 'en'")
    assert page.evaluate("document.activeElement === document.querySelector('button[aria-haspopup=listbox]')")
    assert page.get_by_role("button", name="Language: English").is_visible()

    page.keyboard.press("Enter")
    listbox.wait_for(state="visible")
    assert listbox.get_attribute("aria-label") == "Language"
    assert options.nth(1).evaluate("el => document.activeElement === el")
    page.keyboard.press("Home")
    page.keyboard.press("Enter")
    page.wait_for_function("document.documentElement.lang === 'fr'")
    assert page.evaluate("document.activeElement === document.querySelector('button[aria-haspopup=listbox]')")

    page.keyboard.press("Enter")
    listbox.wait_for(state="visible")
    page.keyboard.press("Escape")
    listbox.wait_for(state="hidden")
    assert page.evaluate("document.activeElement === document.querySelector('button[aria-haspopup=listbox]')")

    page.keyboard.press("Enter")
    listbox.wait_for(state="visible")
    page.keyboard.press("Tab")
    listbox.wait_for(state="hidden")
    assert page.evaluate("document.activeElement?.getAttribute('role') !== 'option'")
    assert page.evaluate("document.activeElement !== document.body")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.goto(BASE_URL, wait_until="networkidle")
        assert_mobile_dialog(page)
        assert_language_listbox(page)
        browser.close()


if __name__ == "__main__":
    main()
