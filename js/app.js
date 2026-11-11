/**
 * OpenAI Codex 学习知识库交互系统主逻辑 (中英双语切换支持 / i18n)
 * 涵盖：多语言切换 (zh/en)、路由/文章渲染、全文本地搜索、深浅主题切换、阅读进度同步、代码块复制、交互式沙盒
 */

(function () {
  'use strict';

  // UI 多语言词条字典
  const I18N_DICT = {
    zh: {
      brandTag: "v2.5 官方指南",
      searchTrigger: "搜索知识库...",
      searchPlaceholder: "搜索使用技巧、进阶语法、FIM、Stop序列... (ESC 退出)",
      searchEmpty: "未找到匹配的技巧或文章，换个关键词试试看？",
      tabArticles: "教程文章",
      tabPlayground: "Prompt 试验工坊",
      tabCheatsheet: "速查手册",
      progressLabel: "学习完成度",
      sectionTitle: "知识库章节索引",
      prevArticle: "上一篇",
      nextArticle: "下一篇",
      markRead: "标记为已学完",
      markReadDone: "已标记完成学习",
      copyCode: "复制",
      copied: "已复制!",
      articlesCountSuffix: "篇",

      // Playground
      pgTitle: "Codex Prompt 试验工坊",
      pgDesc: "实时调节 OpenAI 官方核心采样参数，试验 Few-Shot、类型契约、FIM 光标补全与安全审计 Prompt 的实战输出。",
      lblTpl: "预设 Prompt 案例库",
      lblTemp: "Temperature (随机性)",
      tipTemp: "生产级代码推荐 0.0 ~ 0.2 之间",
      lblTopp: "Top_p (核采样截断)",
      lblStop: "Stop Sequences (终止符)",
      lblSystem: "System Role (专家设定)",
      lblPrompt: "Prompt 提词内容",
      btnCopyPrompt: "复制提词",
      btnRun: "执行推理生成 (Simulate Codex)",
      btnRunning: "Codex 推理计算中...",
      lblOutput: "Codex 推荐输出与解析",
      btnCopyOutput: "复制代码",

      // Cheatsheet
      csTitle: "Codex 工程师高频速查手册",
      csDesc: "浓缩超参数设置规则、Prompt 范式模板及调试闭环技巧，方便编码时随时对照查阅。",

      langBtnText: "EN",
      langTitle: "切换至英文 (Switch to English)"
    },
    en: {
      brandTag: "v2.5 Official Guide",
      searchTrigger: "Search knowledge base...",
      searchPlaceholder: "Search tips, advanced patterns, FIM, Stop sequences... (ESC to exit)",
      searchEmpty: "No matching articles found. Try another search term?",
      tabArticles: "Articles",
      tabPlayground: "Prompt Playground",
      tabCheatsheet: "Cheat Sheet",
      progressLabel: "Learning Progress",
      sectionTitle: "Table of Contents",
      prevArticle: "Previous",
      nextArticle: "Next",
      markRead: "Mark as Completed",
      markReadDone: "Completed",
      copyCode: "Copy",
      copied: "Copied!",
      articlesCountSuffix: " articles",

      // Playground
      pgTitle: "Codex Prompt Playground",
      pgDesc: "Adjust official OpenAI sampling hyperparameters in real-time. Test type contracts, FIM completion, and security prompts.",
      lblTpl: "Preset Prompt Scenarios",
      lblTemp: "Temperature (Randomness)",
      tipTemp: "Recommended 0.0 ~ 0.2 for production code",
      lblTopp: "Top_p (Nucleus Cutoff)",
      lblStop: "Stop Sequences",
      lblSystem: "System Role",
      lblPrompt: "Prompt Specification",
      btnCopyPrompt: "Copy Prompt",
      btnRun: "Simulate Codex Completion",
      btnRunning: "Codex is reasoning...",
      lblOutput: "Codex Recommended Output",
      btnCopyOutput: "Copy Code",

      // Cheatsheet
      csTitle: "Codex Engineer High-Frequency Cheat Sheet",
      csDesc: "Condensed hyperparameter matrix, prompt structures, and self-healing agent loop blueprints.",

      langBtnText: "中文",
      langTitle: "切换至中文 (Switch to Chinese)"
    }
  };

  // 状态管理
  const state = {
    lang: 'zh', // 'zh' | 'en'
    currentTab: 'articles', // 'articles' | 'playground' | 'cheatsheet'
    currentArticleId: 'what-is-codex',
    readArticleIds: new Set(),
    theme: 'dark',
    searchTerm: '',
    selectedPlaygroundTplId: 'tpl-1'
  };

  // DOM 元素缓存
  const elements = {
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    langIndicator: document.getElementById('lang-indicator'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.getElementById('sidebar'),
    sidebarNav: document.getElementById('sidebar-nav'),
    readProgressBar: document.getElementById('read-progress-bar'),
    readProgressText: document.getElementById('read-progress-text'),

    // UI 翻译元素
    uiBrandTitle: document.getElementById('ui-brand-title'),
    uiBrandTag: document.getElementById('ui-brand-tag'),
    uiSearchTriggerText: document.getElementById('ui-search-trigger-text'),
    uiTabArticles: document.getElementById('ui-tab-articles'),
    uiTabPlayground: document.getElementById('ui-tab-playground'),
    uiTabCheatsheet: document.getElementById('ui-tab-cheatsheet'),
    uiProgressLabel: document.getElementById('ui-progress-label'),
    uiSectionTitle: document.getElementById('ui-section-title'),
    prevArticleText: document.getElementById('prev-article-text'),
    nextArticleText: document.getElementById('next-article-text'),
    markReadText: document.getElementById('mark-read-text'),
    uiSearchEmptyText: document.getElementById('ui-search-empty-text'),

    // Playground UI 元素
    uiPgTitle: document.getElementById('ui-pg-title'),
    uiPgDesc: document.getElementById('ui-pg-desc'),
    uiLblTpl: document.getElementById('ui-lbl-tpl'),
    uiLblTemp: document.getElementById('ui-lbl-temp'),
    uiTipTemp: document.getElementById('ui-tip-temp'),
    uiLblTopp: document.getElementById('ui-lbl-topp'),
    uiLblStop: document.getElementById('ui-lbl-stop'),
    uiLblSystem: document.getElementById('ui-lbl-system'),
    uiLblPrompt: document.getElementById('ui-lbl-prompt'),
    uiBtnCopyprompt: document.getElementById('ui-btn-copyprompt'),
    uiBtnRun: document.getElementById('ui-btn-run'),
    uiLblOutput: document.getElementById('ui-lbl-output'),
    uiBtnCopyoutput: document.getElementById('ui-btn-copyoutput'),

    // CheatSheet UI
    uiCsTitle: document.getElementById('ui-cs-title'),
    uiCsDesc: document.getElementById('ui-cs-desc'),

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

    // Playground 交互
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

  // 获取当前语言下的平铺文章列表
  function getFlatArticles() {
    const list = [];
    CODEX_DATA.categories.forEach(cat => {
      const catLang = cat[state.lang] || cat['zh'];
      cat.articles.forEach(art => {
        const artLang = art[state.lang] || art['zh'];
        list.push({
          id: art.id,
          readingTime: art.readingTime,
          categoryTitle: catLang.title,
          categoryId: cat.id,
          title: artLang.title,
          difficulty: artLang.difficulty,
          summary: artLang.summary,
          content: artLang.content
        });
      });
    });
    return list;
  }

  // 初始化本地持久化状态
  function loadPersistedState() {
    try {
      const savedLang = localStorage.getItem('codex_lang');
      if (savedLang === 'en' || savedLang === 'zh') {
        state.lang = savedLang;
      }

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
      const flat = getFlatArticles();
      if (hash) {
        if (hash === 'playground' || hash === 'cheatsheet') {
          state.currentTab = hash;
        } else if (flat.some(a => a.id === hash)) {
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
      elements.themeToggleBtn.setAttribute('title', state.theme === 'light' ? '切换至深色模式 / Switch to Dark' : '切换至浅色模式 / Switch to Light');
    }
  }

  // 应用当前语言界面的静态文案
  function applyLanguage() {
    const dict = I18N_DICT[state.lang];
    document.documentElement.setAttribute('lang', state.lang === 'zh' ? 'zh-CN' : 'en');

    if (elements.langIndicator) elements.langIndicator.textContent = dict.langBtnText;
    if (elements.langToggleBtn) elements.langToggleBtn.setAttribute('title', dict.langTitle);

    if (elements.uiBrandTitle) elements.uiBrandTitle.textContent = CODEX_DATA.metadata[state.lang]?.title || "Codex Knowledge Base";
    if (elements.uiBrandTag) elements.uiBrandTag.textContent = dict.brandTag;
    if (elements.uiSearchTriggerText) elements.uiSearchTriggerText.textContent = dict.searchTrigger;
    if (elements.searchInput) elements.searchInput.placeholder = dict.searchPlaceholder;
    if (elements.uiSearchEmptyText) elements.uiSearchEmptyText.textContent = dict.searchEmpty;

    if (elements.uiTabArticles) elements.uiTabArticles.textContent = dict.tabArticles;
    if (elements.uiTabPlayground) elements.uiTabPlayground.textContent = dict.tabPlayground;
    if (elements.uiTabCheatsheet) elements.uiTabCheatsheet.textContent = dict.tabCheatsheet;
    if (elements.uiProgressLabel) elements.uiProgressLabel.textContent = dict.progressLabel;
    if (elements.uiSectionTitle) elements.uiSectionTitle.textContent = dict.sectionTitle;

    // Playground
    if (elements.uiPgTitle) elements.uiPgTitle.textContent = dict.pgTitle;
    if (elements.uiPgDesc) elements.uiPgDesc.textContent = dict.pgDesc;
    if (elements.uiLblTpl) elements.uiLblTpl.textContent = dict.lblTpl;
    if (elements.uiLblTemp) elements.uiLblTemp.textContent = dict.lblTemp;
    if (elements.uiTipTemp) elements.uiTipTemp.textContent = dict.tipTemp;
    if (elements.uiLblTopp) elements.uiLblTopp.textContent = dict.lblTopp;
    if (elements.uiLblStop) elements.uiLblStop.textContent = dict.lblStop;
    if (elements.uiLblSystem) elements.uiLblSystem.textContent = dict.lblSystem;
    if (elements.uiLblPrompt) elements.uiLblPrompt.textContent = dict.lblPrompt;
    if (elements.uiBtnCopyprompt) elements.uiBtnCopyprompt.textContent = dict.btnCopyPrompt;
    if (elements.uiBtnRun) elements.uiBtnRun.textContent = dict.btnRun;
    if (elements.uiLblOutput) elements.uiLblOutput.textContent = dict.lblOutput;
    if (elements.uiBtnCopyoutput) elements.uiBtnCopyoutput.textContent = dict.btnCopyOutput;

    // Cheatsheet
    if (elements.uiCsTitle) elements.uiCsTitle.textContent = dict.csTitle;
    if (elements.uiCsDesc) elements.uiCsDesc.textContent = dict.csDesc;
  }

  // 渲染侧边栏目录与进度
  function renderSidebar() {
    if (!elements.sidebarNav) return;

    const dict = I18N_DICT[state.lang];
    let html = '';
    CODEX_DATA.categories.forEach(category => {
      const catLang = category[state.lang] || category['zh'];
      html += `
        <div class="category-group">
          <div class="category-header">
            <span><i class="fa-solid ${category.icon}"></i> ${catLang.title}</span>
            <span class="badge badge-primary">${category.articles.length}${dict.articlesCountSuffix}</span>
          </div>
          <ul class="article-list">
      `;

      category.articles.forEach(art => {
        const artLang = art[state.lang] || art['zh'];
        const isActive = (state.currentTab === 'articles' && state.currentArticleId === art.id);
        const isRead = state.readArticleIds.has(art.id);
        html += `
          <li>
            <a href="#${art.id}" class="article-item-link ${isActive ? 'active' : ''} ${isRead ? 'read' : ''}" data-id="${art.id}">
              <span>${artLang.title}</span>
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
    const flat = getFlatArticles();
    const total = flat.length;
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

    const dict = I18N_DICT[state.lang];
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
              <i class="fa-regular fa-copy"></i> ${dict.copyCode}
            </button>
          </div>
          <pre><code class="language-${displayLang}">${escapedCode}</code></pre>
        </div>
      `;
    });

    // 2. 表格转换 (Markdown 表格转 HTML Table)
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
    const tipPrefix = state.lang === 'zh' ? '💡 技巧提示：' : '💡 Pro Tip: ';
    content = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^> 💡 (.*$)/gim, `<blockquote><strong>${tipPrefix}</strong>$1</blockquote>`)
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
    html = html.replace(/^(?!<[a-z]|<\/[a-z]|```)(.+)$/gim, function (m) {
      if (m.trim().startsWith('<') || m.trim() === '') return m;
      return `<p>${m.trim()}</p>`;
    });

    return html;
  }

  // 渲染当前文章
  function renderArticle() {
    const flat = getFlatArticles();
    const article = flat.find(a => a.id === state.currentArticleId) || flat[0];
    if (!article) return;

    const dict = I18N_DICT[state.lang];

    if (elements.articleTitle) elements.articleTitle.textContent = article.title;
    if (elements.articleBadgeCat) elements.articleBadgeCat.textContent = article.categoryTitle;
    if (elements.articleBadgeTime) elements.articleBadgeTime.textContent = article.readingTime;
    if (elements.articleBadgeDiff) elements.articleBadgeDiff.textContent = article.difficulty;
    if (elements.articleSummary) elements.articleSummary.textContent = article.summary;

    if (elements.articleBody) {
      elements.articleBody.innerHTML = parseMarkdownToHTML(article.content);
      // 绑定复制代码按钮
      elements.articleBody.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawCode = decodeURIComponent(btn.getAttribute('data-code'));
          copyToClipboard(rawCode, btn);
        });
      });
    }

    // 更新阅读标记按钮状态
    const isRead = state.readArticleIds.has(article.id);
    if (elements.markReadBtn && elements.markReadText) {
      if (isRead) {
        elements.markReadBtn.classList.add('is-read');
        elements.markReadBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span id="mark-read-text">${dict.markReadDone}</span>`;
      } else {
        elements.markReadBtn.classList.remove('is-read');
        elements.markReadBtn.innerHTML = `<i class="fa-regular fa-circle-check"></i> <span id="mark-read-text">${dict.markRead}</span>`;
      }
    }

    // 上一篇 / 下一篇控制
    const currentIndex = flat.findIndex(a => a.id === article.id);
    if (elements.prevArticleBtn) {
      if (currentIndex > 0) {
        elements.prevArticleBtn.style.visibility = 'visible';
        elements.prevArticleBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${dict.prevArticle}: ${flat[currentIndex - 1].title}`;
        elements.prevArticleBtn.onclick = () => navigateToArticle(flat[currentIndex - 1].id);
      } else {
        elements.prevArticleBtn.style.visibility = 'hidden';
      }
    }

    if (elements.nextArticleBtn) {
      if (currentIndex < flat.length - 1) {
        elements.nextArticleBtn.style.visibility = 'visible';
        elements.nextArticleBtn.innerHTML = `${dict.nextArticle}: ${flat[currentIndex + 1].title} <i class="fa-solid fa-arrow-right"></i>`;
        elements.nextArticleBtn.onclick = () => navigateToArticle(flat[currentIndex + 1].id);
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
    const dict = I18N_DICT[state.lang];
    navigator.clipboard.writeText(text).then(() => {
      if (triggerEl) {
        const originalHTML = triggerEl.innerHTML;
        triggerEl.classList.add('copied');
        triggerEl.innerHTML = `<i class="fa-solid fa-check"></i> ${dict.copied}`;
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

    function renderTplOptions() {
      elements.tplSelect.innerHTML = CODEX_DATA.interactiveTemplates.map(tpl => {
        const tplLang = tpl[state.lang] || tpl['zh'];
        return `<option value="${tpl.id}" ${tpl.id === state.selectedPlaygroundTplId ? 'selected' : ''}>${tplLang.category} - ${tplLang.name}</option>`;
      }).join('');
    }

    renderTplOptions();

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
        const dict = I18N_DICT[state.lang];
        elements.runPromptBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${dict.btnRunning}`;
        elements.runPromptBtn.disabled = true;

        setTimeout(() => {
          const tpl = CODEX_DATA.interactiveTemplates.find(t => t.id === state.selectedPlaygroundTplId);
          if (elements.outputContent && tpl) {
            elements.outputContent.textContent = tpl.simulatedOutput;
          }
          elements.runPromptBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>${dict.btnRun}</span>`;
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

    const sections = CODEX_DATA.cheatSheet[state.lang] || CODEX_DATA.cheatSheet['zh'];
    let html = '<div class="cheatsheet-grid">';
    sections.forEach(section => {
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

      const flat = getFlatArticles();
      if (!query) {
        const topArticles = flat.slice(0, 6);
        renderResults(topArticles, '');
        return;
      }

      const q = query.toLowerCase();
      const matched = flat.filter(art => {
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

  // 切换语言核心处理
  function toggleLanguage() {
    state.lang = (state.lang === 'zh') ? 'en' : 'zh';
    try {
      localStorage.setItem('codex_lang', state.lang);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    applyLanguage();
    renderSidebar();
    renderCheatsheet();
    initPlayground();

    if (state.currentTab === 'articles') {
      renderArticle();
    }
  }

  // 绑定全局通用事件
  function bindEvents() {
    // 语言切换
    if (elements.langToggleBtn) {
      elements.langToggleBtn.addEventListener('click', toggleLanguage);
    }

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
      const flat = getFlatArticles();
      if (hash === 'playground' || hash === 'cheatsheet') {
        switchTab(hash);
      } else if (flat.some(a => a.id === hash)) {
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
    applyLanguage();
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
