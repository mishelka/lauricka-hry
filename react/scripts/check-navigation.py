"""Regression check for answers hidden below the fixed header after SPA navigation.

Requires Python Playwright and Chromium. Start the dev server or production
preview, then run:
  python3 scripts/check-navigation.py --base-url http://127.0.0.1:4173/lauricka-hry/react/
The check uses isolated browser profiles; it never changes a real player's data.
"""

import argparse
import json
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


def assert_controls(page, selector):
    controls = page.locator(selector)
    expect(controls).to_be_visible()
    # Allow the fixed header's ResizeObserver to synchronize its spacer.
    # A bounding-box read in the middle of a React commit precedes that update.
    page.evaluate("() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
    page.wait_for_function("window.scrollY === 0")
    measurements = controls.evaluate("""group => {
      const headerBottom = document.querySelector('.game-chrome').getBoundingClientRect().bottom;
      return [...group.querySelectorAll('button, select')].map(button => {
        const rect = button.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return { label: button.textContent, top: rect.top, bottom: rect.bottom,
          headerBottom, viewport: innerHeight, reachable: button === hit || button.contains(hit) };
      });
    }""")
    assert measurements, "No answer controls were rendered"
    for item in measurements:
        assert item["top"] >= item["headerBottom"], item
        assert item["bottom"] <= item["viewport"], item
        assert item["reachable"], item


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:5173/lauricka-hry/react/")
    parser.add_argument("--browser", help="Optional Chromium executable path")
    args = parser.parse_args()
    executable = args.browser
    if not executable and Path("/usr/lib/chromium/chromium").exists():
        executable = "/usr/lib/chromium/chromium"

    games = [
        (".btn-menu-vybrane-opakovanie", False),
        (".btn-menu-yi", False),
        (".btn-menu-obojake", False),
        (".btn-menu-slova", True),
        (".btn-menu-ratanie", True),
        (".btn-menu-adaptivne", False),
        *[(f".btn-menu-vybrane-{letter.lower()}", True) for letter in "BMPRSVZ"],
    ]
    seed = {"playerName": "Navigation test", "games": {
        **{f"vybrane{letter}": {"levelStars": [5] * 9} for letter in "BMPRSVZ"},
        "ratanie": {"levelStars": [5] * 10}, "slovaYi": {"levelStars": [5] * 8},
    }}
    answer_selector = '.word-answer-grid, .quiz-answer-list, [aria-label="Číselná klávesnica"]'

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=executable, headless=True, args=["--no-sandbox"])
        try:
            for width, height in [(1024, 650), (375, 667), (568, 320)]:
                context = browser.new_context(viewport={"width": width, "height": height})
                context.add_init_script("""
                  if (!localStorage.getItem('laurickaPlayerV1')) localStorage.setItem('laurickaPlayerV1', %s);
                  localStorage.setItem('laurickaSoundPreferencesV1', JSON.stringify({muted: true}));
                """ % json.dumps(json.dumps(seed)))
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                # Only one full navigation. Every subsequent entry uses the real menu.
                page.goto(args.base_url, wait_until="networkidle")
                for menu_selector, has_levels in games:
                    for attempt in range(2):
                        page.locator(menu_selector).click()
                        if has_levels:
                            # Choosing a lower level card scrolls a long menu before entering play.
                            page.locator('.level-btn').last.click()
                        assert_controls(page, answer_selector)
                        if has_levels:
                            page.get_by_role('button', name='Späť', exact=True).click()
                            page.wait_for_function("window.scrollY === 0")
                            page.locator('.level-btn').last.click()
                            assert_controls(page, answer_selector)
                        page.get_by_role('button', name='Domov', exact=True).click()
                        page.wait_for_function("window.scrollY === 0")
                    assert not errors, errors
                # Worksheets need body scrolling. Entering/leaving them must still reset it.
                page.locator('.btn-menu-doplnovacky').click()
                page.locator('.btn-menu-doplnovacky-dtnl').click()
                page.locator('.level-btn').first.click()
                page.get_by_role('button', name='Skontrolovať', exact=True).scroll_into_view_if_needed()
                assert page.evaluate('window.scrollY') > 0
                page.get_by_role('button', name='Späť', exact=True).click()
                page.wait_for_function("window.scrollY === 0")
                page.locator('.level-btn').first.click()
                page.wait_for_function("window.scrollY === 0")
                page.get_by_role('button', name='Domov', exact=True).click()
                page.locator('.btn-menu-vybrane-opakovanie').click()
                assert_controls(page, answer_selector)
                # Browser back/forward must also leave answers visible.
                page.get_by_role('button', name='Domov', exact=True).click()
                page.go_back(wait_until="domcontentloaded")
                assert_controls(page, answer_selector)
                page.reload(wait_until="networkidle")
                assert_controls(page, answer_selector)
                assert not errors, errors
                print(f"{width}×{height}: repeated menu/level entry, worksheet return, back and reload passed", flush=True)
                context.close()
        finally:
            browser.close()


if __name__ == "__main__":
    main()
