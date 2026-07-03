#!/usr/bin/env python3
"""Capture website screenshots for presentation."""

import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "http://localhost:3000"
OUT = Path(__file__).resolve().parent.parent / "docs" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
    ("01-login", "/login", None),
    ("02-dashboard", "/dashboard", {"username": "corpsec", "password": "corpsec123"}),
    ("03-memorandum", "/dashboard/memorandum", {"username": "corpsec", "password": "corpsec123"}),
    ("04-pengusul", "/pengusul", {"username": "pengusul", "password": "pengusul123"}),
    ("05-pimpinan", "/pimpinan-bidang", {"username": "pimpinan", "password": "pimpinan123"}),
    ("06-agenda", "/agenda", {"username": "corpsec", "password": "corpsec123"}),
]


async def login(page, creds):
    await page.goto(f"{BASE}/login", wait_until="networkidle")
    await page.fill('input[autoComplete="username"], input[placeholder*="username" i]', creds["username"])
    await page.fill('input[type="password"]', creds["password"])
    await page.click('button[type="submit"]')
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(1500)


async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1,
        )

        for name, path, creds in PAGES:
            page = await context.new_page()
            try:
                if creds:
                    await login(page, creds)
                    await page.goto(f"{BASE}{path}", wait_until="networkidle")
                else:
                    await page.goto(f"{BASE}{path}", wait_until="networkidle")

                await page.wait_for_timeout(2000)
                outfile = OUT / f"{name}.png"
                await page.screenshot(path=str(outfile), full_page=False)
                print(f"Saved: {outfile}")
            except Exception as e:
                print(f"Failed {name}: {e}")
            finally:
                await page.close()

        await browser.close()

    manifest = [{"file": f"{name}.png", "label": label} for name, _, _ in PAGES for label in [name.split("-", 1)[1]]]
    (OUT / "manifest.json").write_text(json.dumps(PAGES, indent=2))
    print(f"Done. {len(list(OUT.glob('*.png')))} screenshots in {OUT}")


if __name__ == "__main__":
    asyncio.run(capture())
