import asyncio
from playwright.async_api import async_playwright

async def run_tests():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        # 1. 访问主页 (中文模式验证)
        print("Visiting http://localhost:8000...")
        await page.goto("http://localhost:8000")
        await page.wait_for_selector("#article-title")
        title_zh = await page.inner_text("#article-title")
        print(f"Loaded Chinese title: {title_zh}")
        assert "Codex 是什么" in title_zh

        # 截图 1: 中文首页
        await page.screenshot(path="screenshot_home_dark_zh.png")
        print("Captured screenshot_home_dark_zh.png")

        # 2. 测试中英双语切换
        print("Testing language switch to English...")
        lang_btn = page.locator("#lang-toggle-btn")
        await lang_btn.click()
        await page.wait_for_timeout(300)

        title_en = await page.inner_text("#article-title")
        print(f"Loaded English title: {title_en}")
        assert "What is Codex" in title_en

        tab_articles_text = await page.inner_text("#ui-tab-articles")
        print(f"Tab text in EN: {tab_articles_text}")
        assert tab_articles_text == "Articles"

        # 截图 2: 英文模式
        await page.screenshot(path="screenshot_english_mode.png")
        print("Captured screenshot_english_mode.png")

        # 3. 英文模式下的 Playground 验证
        tab_pg = page.locator("#tab-playground-btn")
        await tab_pg.click()
        await page.wait_for_selector("#view-playground.active")
        pg_title = await page.inner_text("#ui-pg-title")
        print(f"Playground title in EN: {pg_title}")
        assert "Codex Prompt Playground" in pg_title

        # 运行 Playground 生成
        run_btn = page.locator("#run-prompt-btn")
        await run_btn.click()
        await page.wait_for_timeout(600)
        output_code = await page.inner_text("#output-content")
        assert len(output_code) > 50

        # 截图 3: 英文 Playground
        await page.screenshot(path="screenshot_playground_en.png")
        print("Captured screenshot_playground_en.png")

        # 4. 英文模式下的 Cheat Sheet 验证
        tab_cs = page.locator("#tab-cheatsheet-btn")
        await tab_cs.click()
        await page.wait_for_selector("#view-cheatsheet.active")
        cs_title = await page.inner_text("#ui-cs-title")
        print(f"CheatSheet title in EN: {cs_title}")
        assert "High-Frequency Cheat Sheet" in cs_title

        # 5. 切回中文模式并验证文章导航与阅读进度
        await lang_btn.click()
        await page.wait_for_timeout(300)
        await page.locator("#tab-articles-btn").click()
        await page.wait_for_selector("#view-articles.active")

        fim_link = page.locator("a[data-id='fim-fill-in-the-middle']")
        await fim_link.click()
        await page.wait_for_selector("text=FIM (Fill-in-the-Middle)")

        # 标记为已读
        await page.locator("#mark-read-btn").click()
        progress_text = await page.inner_text("#read-progress-text")
        print(f"Progress updated: {progress_text}")
        assert "1 / 10" in progress_text

        # 6. 测试全文本地搜索 (Cmd+K)
        await page.locator("#search-trigger-btn").click()
        await page.wait_for_selector("#search-modal-backdrop.open")
        await page.locator("#search-input").fill("FIM")
        await page.wait_for_selector("#search-results .search-result-item")
        results_count = await page.locator("#search-results .search-result-item").count()
        print(f"Search results for 'FIM': {results_count}")
        assert results_count > 0

        # 关闭搜索
        await page.keyboard.press("Escape")

        # 7. 移动端视图响应测试
        await page.set_viewport_size({"width": 375, "height": 667})
        await page.locator("#mobile-menu-btn").click()
        is_sidebar_open = await page.locator("#sidebar").evaluate("el => el.classList.contains('open')")
        print(f"Mobile sidebar open: {is_sidebar_open}")
        assert is_sidebar_open

        # 截图 4: 移动端视图
        await page.screenshot(path="screenshot_mobile_bilingual.png")
        print("Captured screenshot_mobile_bilingual.png")

        await browser.close()
        print("Bilingual E2E tests fully passed!")

if __name__ == "__main__":
    asyncio.run(run_tests())
