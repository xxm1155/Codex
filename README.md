# OpenAI Codex 学习知识库与交互式系统 (Codex Knowledge Base)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Status: Complete](https://img.shields.io/badge/Status-Complete-brightgreen.svg)]()
[![Platform: Web](https://img.shields.io/badge/Platform-Web-blue.svg)]()
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-success.svg)](https://xxm1155.github.io/Codex/)

一个系统、通俗易懂且功能完备的 **OpenAI Codex** 学习知识库与交互式 Web 系统。本知识库不仅梳理了官方核心最佳实践，还深入剖析了进阶架构与隐秘黑客特性（FIM 光标补全、语法约束、Self-Correction 闭环、安全防御等）。

---

## 🌐 在线直接访问地址 (GitHub Pages)

本项目已配置 GitHub Pages 自动化部署，合并到主分支后可直接通过以下公网地址访问：

🔗 **[https://xxm1155.github.io/Codex/](https://xxm1155.github.io/Codex/)**

> **提示**：如果在仓库中尚未开启 GitHub Pages，只需在 GitHub 仓库页面进入 **Settings -> Pages**：
> 1. **Source** 选择 **GitHub Actions**（推荐，仓库内已包含自动化工作流 `.github/workflows/deploy.yml`）。
> 2. 或者 **Source** 选择 **Deploy from a branch**，分支选择 `main`，目录选择 `/ (root)`，点击保存即可在上述地址直接在线体验！

---

## 🌟 核心特色与系统功能

1. **体系化教程与深度解析**：
   - **Codex 概览与核心原理**：模型演进（code-cushman / davinci 到 GPT-4o / o1）、Token 预测原理与超参数矩阵。
   - **官方实战技巧与 Prompt 范式**：Clear is Better Than Clever 原则、类型契约、Few-Shot 少样本示范法、TDD 测试用例先行。
   - **进阶核心与隐秘黑客技巧**：IDE 补全基石 FIM (Fill-in-the-Middle)、Grammar 语法状态机约束、自动化 Agent 自愈闭环（Self-Correction Loop）。
   - **陷阱、安全漏洞与生产防御**：幽灵依赖（Hallucinated Packages）防投毒、OWASP Top 10 安全提示词防御。

2. **交互式 Prompt 试验工坊（Playground）**：
   - 包含多种工业级实战场景预设模板（类型契约、算法优化、FIM 光标补全、SQL 注入审计）。
   - 支持动态模拟调整 Temperature、Top_p、Stop Sequences 及 System Role，并可实时一键复制代码与 Prompt。

3. **终极速查手册（Cheat Sheet）**：
   - 浓缩超参数设置规则、Prompt 骨架结构与调试修复技巧，随时对照查阅。

4. **现代化交互体验**：
   - **全局极速搜索**：支持快捷键 `Ctrl + K` / `Cmd + K` 全文检索与一键跳转。
   - **阅读进度管理**：支持打卡标记已学完，进度实时计算并持久化至浏览器 LocalStorage。
   - **双主题模式**：优雅的深色模式（Dark Mode）与浅色模式（Light Mode）无缝切换。
   - **多端响应式自适应**：完美兼容桌面宽屏、平板以及移动端设备。

---

## 🚀 本地快速启动

该项目采用极简、高效的纯静态前端架构（无需配置复杂的 Node 打包编译链），支持任何静态文件服务器即开即用：

### 使用 Python（推荐）
```bash
python3 -m http.server 8080
```
在浏览器中访问：`http://localhost:8080`

### 使用 Node.js / npx
```bash
npx serve .
```

---

## 📂 项目结构

```
.
├── index.html          # 系统主页面结构（导航、文章视图、试验工坊、速查表、搜索弹窗）
├── css/
│   └── style.css       # 现代 UI 样式系统（深浅色变量、响应式排版、代码高亮美化）
├── js/
│   ├── data.js         # 知识库完整核心数据（教程篇目、Prompt 模板库、速查表）
│   └── app.js          # 系统交互驱动逻辑（搜索、路由、沙盒模拟、学习进度打卡）
├── test/
│   └── verify.js       # Playwright 自动化前端端到端测试与截图脚本
└── README.md           # 项目系统说明文档
```

---

## 🧪 自动化测试与验证

本项目包含 Playwright 自动化测试脚本，用于验证：
- 各章节教程文章平滑切换与渲染
- 全局搜索模态窗与关键词匹配
- 深色 / 浅色主题切换
- 交互式 Prompt 试验沙盒调参与模拟运行
- 移动端适配与自适应响应

运行端到端测试命令：
```bash
python3 test/verify.py
```
