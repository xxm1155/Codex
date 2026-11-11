import asyncio
from playwright.async_api import async_playwright

async def run_tests():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        # 1. 访问主页
        print("Visiting http://localhost:8000...")
        await page.goto("http://localhost:8000")
        await page.wait_for_selector("#article-title")
        title = await page.inner_text("#article-title")
        print(f"Loaded page. Article title: {title}")
        assert "Codex 是什么" in title

        # 截图 1: 首页深色模式
        await page.screenshot(path="screenshot_home_dark.png")
        print("Captured screenshot_home_dark.png")

        # 2. 测试文章切换与阅读标记
        print("Testing article switching...")
        fim_link = page.locator("a[data-id='fim-fill-in-the-middle']")
        await fim_link.click()
        await page.wait_for_selector("text=FIM (Fill-in-the-Middle)")
        fim_title = await page.inner_text("#article-title")
        print(f"Switched article: {fim_title}")
        assert "FIM" in fim_title

        # 标记为已读并检查进度
        mark_btn = page.locator("#mark-read-btn")
        await mark_btn.click()
        progress_text = await page.inner_text("#read-progress-text")
        print(f"Progress updated: {progress_text}")
        assert "1 / 10" in progress_text

        # 3. 测试主题切换 (切换至浅色模式)
        theme_btn = page.locator("#theme-toggle-btn")
        await theme_btn.click()
        html_theme = await page.get_attribute("html", "data-theme")
        print(f"Theme switched to: {html_theme}")
        assert html_theme == "light"

        # 截图 2: 浅色模式
        await page.screenshot(path="screenshot_article_light.png")
        print("Captured screenshot_article_light.png")

        # 4. 测试全局搜索功能
        search_btn = page.locator("#search-trigger-btn")
        await search_btn.click()
        await page.wait_for_selector("#search-modal-backdrop.open")
        search_input = page.locator("#search-input")
        await search_input.fill("Stop Sequences")
        await page.wait_for_selector("#search-results .search-result-item")
        results = await page.locator("#search-results .search-result-item").count()
        print(f"Search results count for 'Stop Sequences': {results}")
        assert results > 0

        # 点击搜索结果项
        await page.locator("#search-results .search-result-item").first.click()
        active_title = await page.inner_text("#article-title")
        print(f"Navigated via search to: {active_title}")
        assert "Stop Sequences" in active_title

        # 5. 测试交互式 Playground 试验工坊
        tab_playground = page.locator("#tab-playground-btn")
        await tab_playground.click()
        await page.wait_for_selector("#view-playground.active")

        # 切换案例模板
        tpl_select = page.locator("#tpl-select")
        await tpl_select.select_option("tpl-2") # 复杂算法与性能优化
        run_btn = page.locator("#run-prompt-btn")
        await run_btn.click()
        await page.wait_for_timeout(700)
        output_text = await page.inner_text("#output-content")
        print("Playground simulation completed. Output length:", len(output_text))
        assert "aggregateEventsOptimized" in output_text

        # 截图 3: Playground 工坊
        await page.screenshot(path="screenshot_playground.png")
        print("Captured screenshot_playground.png")

        # 6. 测试速查手册 Cheat Sheet
        tab_cheatsheet = page.locator("#tab-cheatsheet-btn")
        await tab_cheatsheet.click()
        await page.wait_for_selector("#view-cheatsheet.active")
        cheat_cards = await page.locator(".cheatsheet-card").count()
        print(f"Cheatsheet cards count: {cheat_cards}")
        assert cheat_cards >= 3

        # 截图 4: 速查手册
        await page.screenshot(path="screenshot_cheatsheet.png")
        print("Captured screenshot_cheatsheet.png")

        # 7. 测试移动端响应式布局
        await page.set_viewport_size({"width": 375, "height": 667})
        tab_articles = page.locator("#tab-articles-btn")
        await tab_articles.click()
        mobile_menu_btn = page.locator("#mobile-menu-btn")
        await mobile_menu_btn.click()
        sidebar = page.locator("#sidebar")
        is_open = await sidebar.evaluate("el => el.classList.contains('open')")
        print(f"Mobile menu toggled open: {is_open}")
        assert is_open

        # 截图 5: 移动端视图
        await page.screenshot(path="screenshot_mobile.png")
        print("Captured screenshot_mobile.png")

        await browser.close()
        print("All automated end-to-end tests passed successfully!")

if __name__ == "__main__":
    asyncio.run(run_tests())
