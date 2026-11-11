/**
 * OpenAI Codex 学习知识库交互系统主逻辑
 * 涵盖：路由/文章渲染、全文本地搜索、深浅主题切换、阅读进度同步、代码块复制、交互式 Prompt 试验沙盒
 */

(function () {
  'use strict';

  // 状态管理
  const state = {
    currentTab: 'articles', // 'articles' | 'playground' | 'cheatsheet'
    currentArticleId: 'what-is-codex',
    readArticleIds: new Set(),
    theme: 'dark',
    searchTerm: '',
    selectedPlaygroundTplId: 'tpl-1'
  };

  // DOM 元素缓存
  const elements = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.getElementById('sidebar'),
    sidebarNav: document.getElementById('sidebar-nav'),
    readProgressBar: document.getElementById('read-progress-bar'),
    readProgressText: document.getElementById('read-progress-text'),

    // 视图面板
    viewArticles: document.getElementById('view-articles'),
    viewPlayground: document.getElementById('view-playground'),
    viewCheatsheet: document.getElementById('view-cheatsheet'),

    // 导航 Tab 按钮
    tabArticlesBtn: document.getElementById('tab-articles-btn'),
    tabPlaygroundBtn: document.getElementById('tab-playground-btn'),
    tabCheatsheetBtn: document.getElementById('tab-cheatsheet-btn'),

    // 文章区域
    articleTitle: document.getElementById('article-title'),
    articleBadgeCat: document.getElementById('article-badge-cat'),
    articleBadgeTime: document.getElementById('article-badge-time'),
    articleBadgeDiff: document.getElementById('article-badge-diff'),
    articleSummary: document.getElementById('article-summary'),
    articleBody: document.getElementById('article-body'),
    markReadBtn: document.getElementById('mark-read-btn'),
    prevArticleBtn: document.getElementById('prev-article-btn'),
    nextArticleBtn: document.getElementById('next-article-btn'),

    // 全文搜索模态窗
    searchTriggerBtn: document.getElementById('search-trigger-btn'),
    searchModalBackdrop: document.getElementById('search-modal-backdrop'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    searchEmptyState: document.getElementById('search-empty-state'),

    // Playground 相关
    tplSelect: document.getElementById('tpl-select'),
    temperatureInput: document.getElementById('param-temperature'),
    temperatureVal: document.getElementById('temperature-val'),
    topPInput: document.getElementById('param-topp'),
    topPVal: document.getElementById('topp-val'),
    stopSeqInput: document.getElementById('param-stop'),
    systemRoleInput: document.getElementById('system-role-input'),
    userPromptInput: document.getElementById('user-prompt-input'),
    runPromptBtn: document.getElementById('run-prompt-btn'),
    copyPromptBtn: document.getElementById('copy-prompt-btn'),
    copyOutputBtn: document.getElementById('copy-output-btn'),
    outputContent: document.getElementById('output-content'),

    // Cheat Sheet
    cheatsheetContainer: document.getElementById('cheatsheet-container')
  };

  // 展平所有文章列表以供查找和上一篇/下一篇遍历
  const flatArticles = [];
  CODEX_DATA.categories.forEach(cat => {
    cat.articles.forEach(art => {
      flatArticles.push({
        ...art,
        categoryTitle: cat.title,
        categoryId: cat.id
      });
    });
  });

  // 初始化本地持久化状态
  function loadPersistedState() {
    try {
      const savedTheme = localStorage.getItem('codex_theme');
      if (savedTheme) {
        state.theme = savedTheme;
      } else {
        state.theme = 'dark';
      }

      const savedReads = localStorage.getItem('codex_read_articles');
      if (savedReads) {
        state.readArticleIds = new Set(JSON.parse(savedReads));
      }

      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'playground' || hash === 'cheatsheet') {
          state.currentTab = hash;
        } else if (flatArticles.some(a => a.id === hash)) {
          state.currentTab = 'articles';
          state.currentArticleId = hash;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function saveReadArticles() {
    try {
      localStorage.setItem('codex_read_articles', JSON.stringify(Array.from(state.readArticleIds)));
    } catch (e) {
      console.warn('Save localStorage error:', e);
    }
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.innerHTML = state.theme === 'light'
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
      elements.themeToggleBtn.setAttribute('title', state.theme === 'light' ? '切换至深色模式' : '切换至浅色模式');
    }
  }

  // 渲染侧边栏目录与进度
  function renderSidebar() {
    if (!elements.sidebarNav) return;

    let html = '';
    CODEX_DATA.categories.forEach(category => {
      html += `
        <div class="category-group">
          <div class="category-header">
            <span><i class="fa-solid ${category.icon}"></i> ${category.title}</span>
            <span class="badge badge-primary">${category.articles.length}篇</span>
          </div>
          <ul class="article-list">
      `;

      category.articles.forEach(art => {
        const isActive = (state.currentTab === 'articles' && state.currentArticleId === art.id);
        const isRead = state.readArticleIds.has(art.id);
        html += `
          <li>
            <a href="#${art.id}" class="article-item-link ${isActive ? 'active' : ''} ${isRead ? 'read' : ''}" data-id="${art.id}">
              <span>${art.title}</span>
              <i class="fa-solid fa-circle-check read-check-icon"></i>
            </a>
          </li>
        `;
      });

      html += `
          </ul>
        </div>
      `;
    });

    elements.sidebarNav.innerHTML = html;
    updateProgressIndicator();

    // 绑定侧栏点击
    elements.sidebarNav.querySelectorAll('.article-item-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const artId = link.getAttribute('data-id');
        navigateToArticle(artId);
        if (window.innerWidth <= 768 && elements.sidebar) {
          elements.sidebar.classList.remove('open');
        }
      });
    });
  }

  function updateProgressIndicator() {
    const total = flatArticles.length;
    const readCount = state.readArticleIds.size;
    const percent = total > 0 ? Math.round((readCount / total) * 100) : 0;

    if (elements.readProgressBar) {
      elements.readProgressBar.style.width = `${percent}%`;
    }
    if (elements.readProgressText) {
      elements.readProgressText.textContent = `${readCount} / ${total} (${percent}%)`;
    }
  }

  // 简易 Markdown / 表格 / 代码解析渲染器
  function parseMarkdownToHTML(md) {
    if (!md) return '';

    let content = md.trim();

    // 1. 代码块提取与包装
    content = content.replace(/```([a-zA-Z0-9_\-\+]*)\n([\s\S]*?)```/g, function (match, lang, code) {
      const displayLang = lang || 'text';
      const escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `
        <div class="code-block-wrapper">
          <div class="code-header">
            <span class="code-lang-tag">${displayLang}</span>
            <button class="copy-btn" data-code="${encodeURIComponent(code)}">
              <i class="fa-regular fa-copy"></i> 复制
            </button>
          </div>
          <pre><code class="language-${displayLang}">${escapedCode}</code></pre>
        </div>
      `;
    });

    // 2. 表格转换 (简单 Markdown 表格转 HTML Table)
    const tableRegex = /\|(.+)\|\n\|(?:\s*[-:]+\s*\|)+\n((?:\|.*\|\n?)*)/g;
    content = content.replace(tableRegex, function (match, headerRow, bodyRows) {
      const headers = headerRow.split('|').filter(c => c.trim().length > 0).map(c => `<th>${c.trim()}</th>`).join('');
      const rows = bodyRows.trim().split('\n').map(row => {
        const cells = row.split('|').filter(c => c.trim().length > 0).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="table-wrapper"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
    });

    // 3. 标题与段落
    content = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^> 💡 (.*$)/gim, '<blockquote><strong>💡 技巧提示：</strong>$1</blockquote>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // 4. 列表与段落分割
    const lines = content.split('\n');
    let inList = false;
    let formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (/^\s*[-*]\s+(.*)/.test(line)) {
        if (!inList) {
          formattedLines.push('<ul>');
          inList = true;
        }
        formattedLines.push(line.replace(/^\s*[-*]\s+(.*)/, '<li>$1</li>'));
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(line);
      }
    }
    if (inList) formattedLines.push('</ul>');

    let html = formattedLines.join('\n');
    // 段落包装（避免包裹 div/pre/h3/h4/ul/blockquote）
    html = html.replace(/^(?!<[a-z]|<\/[a-z]|```)(.+)$/gim, function (m) {
      if (m.trim().startsWith('<') || m.trim() === '') return m;
      return `<p>${m.trim()}</p>`;
    });

    return html;
  }

  // 渲染当前文章
  function renderArticle() {
    const article = flatArticles.find(a => a.id === state.currentArticleId) || flatArticles[0];
    if (!article) return;

    if (elements.articleTitle) elements.articleTitle.textContent = article.title;
    if (elements.articleBadgeCat) elements.articleBadgeCat.textContent = article.categoryTitle;
    if (elements.articleBadgeTime) elements.articleBadgeTime.textContent = article.readingTime;
    if (elements.articleBadgeDiff) elements.articleBadgeDiff.textContent = article.difficulty;
    if (elements.articleSummary) elements.articleSummary.textContent = article.summary;

    if (elements.articleBody) {
      elements.articleBody.innerHTML = parseMarkdownToHTML(article.content);
      // 绑定复制按钮事件
      elements.articleBody.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawCode = decodeURIComponent(btn.getAttribute('data-code'));
          copyToClipboard(rawCode, btn);
        });
      });
    }

    // 更新阅读标记按钮状态
    const isRead = state.readArticleIds.has(article.id);
    if (elements.markReadBtn) {
      if (isRead) {
        elements.markReadBtn.classList.add('is-read');
        elements.markReadBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> 已标记完成学习';
      } else {
        elements.markReadBtn.classList.remove('is-read');
        elements.markReadBtn.innerHTML = '<i class="fa-regular fa-circle-check"></i> 标记为已学完';
      }
    }

    // 上一篇 / 下一篇控制
    const currentIndex = flatArticles.findIndex(a => a.id === article.id);
    if (elements.prevArticleBtn) {
      if (currentIndex > 0) {
        elements.prevArticleBtn.style.visibility = 'visible';
        elements.prevArticleBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> 上一篇: ${flatArticles[currentIndex - 1].title}`;
        elements.prevArticleBtn.onclick = () => navigateToArticle(flatArticles[currentIndex - 1].id);
      } else {
        elements.prevArticleBtn.style.visibility = 'hidden';
      }
    }

    if (elements.nextArticleBtn) {
      if (currentIndex < flatArticles.length - 1) {
        elements.nextArticleBtn.style.visibility = 'visible';
        elements.nextArticleBtn.innerHTML = `下一篇: ${flatArticles[currentIndex + 1].title} <i class="fa-solid fa-arrow-right"></i>`;
        elements.nextArticleBtn.onclick = () => navigateToArticle(flatArticles[currentIndex + 1].id);
      } else {
        elements.nextArticleBtn.style.visibility = 'hidden';
      }
    }

    renderSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 导航到指定文章
  function navigateToArticle(articleId) {
    state.currentTab = 'articles';
    state.currentArticleId = articleId;
    window.location.hash = articleId;
    switchTab('articles');
    renderArticle();
  }

  // 切换选项卡
  function switchTab(tabName) {
    state.currentTab = tabName;
    window.location.hash = (tabName === 'articles') ? state.currentArticleId : tabName;

    // 面板显隐
    if (elements.viewArticles) elements.viewArticles.classList.toggle('active', tabName === 'articles');
    if (elements.viewPlayground) elements.viewPlayground.classList.toggle('active', tabName === 'playground');
    if (elements.viewCheatsheet) elements.viewCheatsheet.classList.toggle('active', tabName === 'cheatsheet');

    // Tab 样式
    if (elements.tabArticlesBtn) elements.tabArticlesBtn.classList.toggle('active', tabName === 'articles');
    if (elements.tabPlaygroundBtn) elements.tabPlaygroundBtn.classList.toggle('active', tabName === 'playground');
    if (elements.tabCheatsheetBtn) elements.tabCheatsheetBtn.classList.toggle('active', tabName === 'cheatsheet');

    if (tabName === 'articles') {
      renderArticle();
    }
  }

  // 复制文字至剪切板辅助函数
  function copyToClipboard(text, triggerEl) {
    navigator.clipboard.writeText(text).then(() => {
      if (triggerEl) {
        const originalHTML = triggerEl.innerHTML;
        triggerEl.classList.add('copied');
        triggerEl.innerHTML = '<i class="fa-solid fa-check"></i> 已复制!';
        setTimeout(() => {
          triggerEl.classList.remove('copied');
          triggerEl.innerHTML = originalHTML;
        }, 1800);
      }
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }

  // 初始化 Playground 模板与交互
  function initPlayground() {
    if (!elements.tplSelect) return;

    elements.tplSelect.innerHTML = CODEX_DATA.interactiveTemplates.map(tpl => {
      return `<option value="${tpl.id}">${tpl.category} - ${tpl.name}</option>`;
    }).join('');

    function loadTemplate(tplId) {
      const tpl = CODEX_DATA.interactiveTemplates.find(t => t.id === tplId) || CODEX_DATA.interactiveTemplates[0];
      if (!tpl) return;

      if (elements.temperatureInput) {
        elements.temperatureInput.value = tpl.temperature;
        if (elements.temperatureVal) elements.temperatureVal.textContent = tpl.temperature;
      }
      if (elements.topPInput) {
        elements.topPInput.value = tpl.topP;
        if (elements.topPVal) elements.topPVal.textContent = tpl.topP;
      }
      if (elements.stopSeqInput) {
        elements.stopSeqInput.value = tpl.stopSequences.join(', ');
      }
      if (elements.systemRoleInput) {
        elements.systemRoleInput.value = tpl.systemRole;
      }
      if (elements.userPromptInput) {
        elements.userPromptInput.value = tpl.userPrompt;
      }
      if (elements.outputContent) {
        elements.outputContent.textContent = tpl.simulatedOutput;
      }
    }

    // 默认加载第一个
    loadTemplate(state.selectedPlaygroundTplId);

    elements.tplSelect.addEventListener('change', (e) => {
      state.selectedPlaygroundTplId = e.target.value;
      loadTemplate(state.selectedPlaygroundTplId);
    });

    if (elements.temperatureInput && elements.temperatureVal) {
      elements.temperatureInput.addEventListener('input', (e) => {
        elements.temperatureVal.textContent = e.target.value;
      });
    }

    if (elements.topPInput && elements.topPVal) {
      elements.topPInput.addEventListener('input', (e) => {
        elements.topPVal.textContent = e.target.value;
      });
    }

    if (elements.runPromptBtn) {
      elements.runPromptBtn.addEventListener('click', () => {
        // 模拟运行过程
        const originalText = elements.runPromptBtn.innerHTML;
        elements.runPromptBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Codex 推理计算中...';
        elements.runPromptBtn.disabled = true;

        setTimeout(() => {
          const tpl = CODEX_DATA.interactiveTemplates.find(t => t.id === state.selectedPlaygroundTplId);
          if (elements.outputContent && tpl) {
            elements.outputContent.textContent = tpl.simulatedOutput;
          }
          elements.runPromptBtn.innerHTML = originalText;
          elements.runPromptBtn.disabled = false;
        }, 500);
      });
    }

    if (elements.copyPromptBtn && elements.userPromptInput) {
      elements.copyPromptBtn.addEventListener('click', () => {
        copyToClipboard(elements.userPromptInput.value, elements.copyPromptBtn);
      });
    }

    if (elements.copyOutputBtn && elements.outputContent) {
      elements.copyOutputBtn.addEventListener('click', () => {
        copyToClipboard(elements.outputContent.textContent, elements.copyOutputBtn);
      });
    }
  }

  // 渲染速查表 CheatSheet
  function renderCheatsheet() {
    if (!elements.cheatsheetContainer) return;

    let html = '<div class="cheatsheet-grid">';
    CODEX_DATA.cheatSheet.forEach(section => {
      html += `
        <div class="cheatsheet-card">
          <div class="cheatsheet-card-title">
            <i class="fa-solid fa-bolt"></i> ${section.category}
          </div>
      `;

      section.items.forEach(item => {
        html += `
          <div class="cheat-item">
            <span class="cheat-key">${item.key}</span>
            <p class="cheat-desc">${item.desc}</p>
          </div>
        `;
      });

      html += `</div>`;
    });
    html += '</div>';

    elements.cheatsheetContainer.innerHTML = html;
  }

  // 全文搜索模块
  function initSearch() {
    function openSearchModal() {
      if (elements.searchModalBackdrop) {
        elements.searchModalBackdrop.classList.add('open');
        if (elements.searchInput) {
          elements.searchInput.value = '';
          elements.searchInput.focus();
        }
        performSearch('');
      }
    }

    function closeSearchModal() {
      if (elements.searchModalBackdrop) {
        elements.searchModalBackdrop.classList.remove('open');
      }
    }

    if (elements.searchTriggerBtn) {
      elements.searchTriggerBtn.addEventListener('click', openSearchModal);
    }

    // 快捷键 Ctrl+K / Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape' && elements.searchModalBackdrop?.classList.contains('open')) {
        closeSearchModal();
      }
    });

    if (elements.searchModalBackdrop) {
      elements.searchModalBackdrop.addEventListener('click', (e) => {
        if (e.target === elements.searchModalBackdrop) {
          closeSearchModal();
        }
      });
    }

    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value.trim());
      });
    }

    function performSearch(query) {
      if (!elements.searchResults || !elements.searchEmptyState) return;

      if (!query) {
        // 显示全部或推荐文章
        const topArticles = flatArticles.slice(0, 6);
        renderResults(topArticles, '');
        return;
      }

      const q = query.toLowerCase();
      const matched = flatArticles.filter(art => {
        return art.title.toLowerCase().includes(q) ||
               art.summary.toLowerCase().includes(q) ||
               art.content.toLowerCase().includes(q);
      });

      renderResults(matched, query);
    }

    function renderResults(results, query) {
      if (results.length === 0) {
        elements.searchResults.innerHTML = '';
        elements.searchEmptyState.style.display = 'block';
        return;
      }

      elements.searchEmptyState.style.display = 'none';
      let html = '';
      results.forEach(art => {
        html += `
          <li class="search-result-item" data-id="${art.id}">
            <div class="result-item-title">${art.title}</div>
            <div class="result-item-snippet">${art.summary}</div>
          </li>
        `;
      });
      elements.searchResults.innerHTML = html;

      elements.searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          closeSearchModal();
          navigateToArticle(id);
        });
      });
    }
  }

  // 绑定全局通用事件
  function bindEvents() {
    // 主题切换
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('codex_theme', state.theme);
        applyTheme();
      });
    }

    // 移动端侧栏伸缩
    if (elements.mobileMenuBtn && elements.sidebar) {
      elements.mobileMenuBtn.addEventListener('click', () => {
        elements.sidebar.classList.toggle('open');
      });
    }

    // 顶部 Tab 切换
    if (elements.tabArticlesBtn) elements.tabArticlesBtn.addEventListener('click', () => switchTab('articles'));
    if (elements.tabPlaygroundBtn) elements.tabPlaygroundBtn.addEventListener('click', () => switchTab('playground'));
    if (elements.tabCheatsheetBtn) elements.tabCheatsheetBtn.addEventListener('click', () => switchTab('cheatsheet'));

    // 标记已读/未读按钮
    if (elements.markReadBtn) {
      elements.markReadBtn.addEventListener('click', () => {
        const id = state.currentArticleId;
        if (state.readArticleIds.has(id)) {
          state.readArticleIds.delete(id);
        } else {
          state.readArticleIds.add(id);
        }
        saveReadArticles();
        renderArticle();
      });
    }

    // 监听 URL Hash 变化
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'playground' || hash === 'cheatsheet') {
        switchTab(hash);
      } else if (flatArticles.some(a => a.id === hash)) {
        if (state.currentTab !== 'articles' || state.currentArticleId !== hash) {
          state.currentArticleId = hash;
          switchTab('articles');
        }
      }
    });
  }

  // 系统初始化启动函数
  function init() {
    loadPersistedState();
    applyTheme();
    bindEvents();
    initSearch();
    initPlayground();
    renderCheatsheet();

    if (state.currentTab === 'articles') {
      renderArticle();
    } else {
      switchTab(state.currentTab);
    }
  }

  // DOM 准备好后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
