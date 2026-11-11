/**
 * OpenAI Codex 学习知识库数据中心 (中英双语版 / Dual-Language Edition)
 * 包含：体系化教程文章、官方最佳实践、进阶/隐藏特性、交互式 Prompt 模板库、速查清单
 */

const CODEX_DATA = {
  metadata: {
    version: "2.5.0",
    lastUpdated: "2025",
    author: "AI Engineer & Community",
    zh: {
      title: "Codex 开发者学习知识库",
      subtitle: "从入门到精通：官方技巧、进阶架构与隐秘特性全解析",
    },
    en: {
      title: "Codex Developer Knowledge Base",
      subtitle: "From Zero to Hero: Official Best Practices, Advanced Architecture & Hidden Gems",
    }
  },

  categories: [
    {
      id: "fundamentals",
      icon: "fa-compass",
      zh: {
        title: "1. Codex 概览与核心原理",
        description: "揭开代码大模型的神秘面纱，理解生成机理与上下文视窗",
        badge: "基础必备",
      },
      en: {
        title: "1. Codex Overview & Core Mechanisms",
        description: "Demystify Code LLMs: generation mechanisms, token prediction & context windows",
        badge: "Fundamentals",
      },
      articles: [
        {
          id: "what-is-codex",
          readingTime: "6 min",
          zh: {
            title: "Codex 是什么：前世今生与模型演进",
            difficulty: "入门",
            summary: "从 GPT-3 到专用 Codex (code-cushman/davinci)，再到融入 GPT-4、o1、GPT-4o 与 Codex CLI 的全链路演化史。",
            content: `
### 1. 什么是 OpenAI Codex？

**OpenAI Codex** 是基于 GPT 架构衍生、专为**理解与生成计算机代码**而深度微调的预训练语言模型。它最初在包含数以千万计的 GitHub 公开代码库与技术文档上进行了海量参数的自监督预训练。

#### 核心认知转变：从「打字机」到「结对编程智能体」
很多初学者容易将 Codex 仅仅当成“更聪明的自动补全工具（Autocomplete）”，但其真正的本质是一个**「多语言自然语言与抽象语法树（AST）之间的双向编译器」**。它可以：
1. 将**自然语言意图（Intent）**翻译为**可执行机器代码**。
2. 将**混乱遗留代码**逆向解释为**清晰的业务逻辑规范**。
3. 在**数十种主流编程语言之间进行零样本语义迁移（Transpilation）**。

---

### 2. 演进历程与现代形态

* **第一阶段：独立 Codex 模型族（2021~2022）**
  - \`code-cushman-001\`：小巧迅速，专为低延迟单行代码补全设计。
  - \`code-davinci-002\`：能力极其强悍的大参数基座，能够进行复杂逻辑设计、多函数协作与代码补全。
* **第二阶段：合流与通用大模型（2023~2024）**
  - OpenAI 将 Codex 在代码领域学到的“代码即逻辑（Chain of Code）”推理能力全面注入主干模型（GPT-4, GPT-4 Turbo）。模型的数学、逻辑解题能力随之大幅提升。
* **第三阶段：推理与多模态代码智能体时代（2024~至今）**
  - **GPT-4o**：极速流式响应，多模态（UI草图/架构图直接生成前端代码与数据流）。
  - **OpenAI o1 / o3 系列**：内置深度思维链（Deep Thought / Reasoning Tokens），能够攻克复杂竞赛编程（LeetCode Hard / Codeforces 2000+）及大型工程重构。
  - **Codex CLI / Agent 模式**：从被动的 Prompt 响应演进为具有工具调用（Tools/Function Calling）、命令行终端执行、自动测试与自我纠错闭环的独立编码智能体。

---

### 3. Codex 的代码生成底层机制

Codex 生成代码的本质依然是**自回归下一个 Token 预测（Autoregressive Next-Token Prediction）**：

$$\\mathcal{P}(w_t \\mid w_1, w_2, ..., w_{t-1})$$

与普通自然语言相比，代码生成具备高度的**语法严谨性**与**作用域强约束**：
- **缩进敏感性**：尤其在 Python / YAML 中，空格数目直接决定逻辑层级。Codex 对空白符（Indentation Tokens）有极敏感的概率分布。
- **括号闭合与符号配对**：模型内部通过注意力机制维持跨越成百上千 Token 的符号引用链（如函数参数定义到函数体末尾的变量闭合）。
- **上下文感知**：它并不只是看到当前光标，而是将光标上方的代码、光标下方的代码（FIM 模式）、相关文件定义通过上下文窗口协同计算。
            `
          },
          en: {
            title: "What is Codex: Evolution and Architecture",
            difficulty: "Beginner",
            summary: "The full evolution path from GPT-3 to specialized Codex (code-cushman/davinci), merging into GPT-4, o1, GPT-4o, and modern Codex CLI agents.",
            content: `
### 1. What is OpenAI Codex?

**OpenAI Codex** is a deep-learning language model derived from the GPT architecture, specialized and fine-tuned for **understanding and generating computer code**. It was trained on tens of millions of public GitHub repositories alongside extensive technical documentation.

#### Mindset Shift: From "Typing Assistant" to "Pair-Programming Agent"
Beginners often view Codex merely as an "enhanced autocomplete tool." However, its fundamental capability is serving as a **bidirectional compiler between natural language intent and Abstract Syntax Trees (AST)**. It can:
1. Translate **human natural language intents** into **executable machine code**.
2. Reverse-engineer **legacy code** back into **concise technical specifications**.
3. Perform zero-shot semantic migration (**transpilation**) across dozens of programming languages.

---

### 2. Evolution & Modern Implementations

* **Phase 1: Dedicated Codex Models (2021~2022)**
  - \`code-cushman-001\`: Ultra-low latency, tailored for inline completion.
  - \`code-davinci-002\`: High-capacity foundation model capable of orchestrating complex logic, multi-function design, and scaffolding.
* **Phase 2: Convergence with General Foundation Models (2023~2024)**
  - OpenAI folded the "Chain of Code" reasoning learned from Codex back into flagship general models (GPT-4, GPT-4 Turbo), boosting mathematical, reasoning, and logical problem-solving capabilities across the board.
* **Phase 3: Reasoning & Multimodal Autonomous Coding Agents (2024~Present)**
  - **GPT-4o**: Near-instantaneous streaming with vision-to-code capabilities (generating responsive UI components from wireframe drawings).
  - **OpenAI o1 / o3 series**: Deep reasoning tokens enabling autonomous solutions for LeetCode Hard and complex codebase refactoring.
  - **Codex CLI / Agent Paradigm**: Evolving from passive prompt completions into full loop autonomous agents with terminal execution, tool use, testing, and self-repair capabilities.

---

### 3. Autoregressive Foundations of Code Generation

Codex generates code via **Autoregressive Next-Token Prediction**:

$$\\mathcal{P}(w_t \\mid w_1, w_2, ..., w_{t-1})$$

Unlike natural language prose, code demands strict **syntactic precision** and **scope constraints**:
- **Indentation sensitivity**: Crucial in languages like Python and YAML, where space count directly governs scoping hierarchy.
- **Bracket and delimiter pairing**: Internal attention heads track bracket balance across thousands of tokens.
- **Bi-directional contextual awareness**: Through FIM (Fill-In-The-Middle), Codex reasons over both the prefix before the cursor and the suffix after the cursor.
            `
          }
        },
        {
          id: "token-and-sampling",
          readingTime: "8 min",
          zh: {
            title: "核心参数密码：Temperature、Top_P 与 Stop Sequences",
            difficulty: "入门",
            summary: "彻底搞懂为什么代码有时候会陷入死循环或乱生成？精确操控采样超参数与终止序列。",
            content: `
### 1. 代码生成的采样困境

写自然语言故事需要天马行空的想象力，但**编写工业级代码绝大多数时候需要 100% 的确定性与标准规范**。如何让 Codex 在该严谨的时候严谨，在需要创造算法策略的时候富有创意？关键就在于控制采样参数！

---

### 2. 核心超参数矩阵指南

| 参数名 | 典型取值区间 | 在代码场景中的核心作用 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| **Temperature** | \`0.0 ~ 0.2\` | 贪婪/低发散采样。永远选取概率最高的下一个 Token，生成最具共识、标准的解法。 | 生产代码编写、单元测试生成、Bug 修复、SQL 查询 |
| **Temperature** | \`0.5 ~ 0.8\` | 适度发散。用于构思多个架构方案、头脑风暴函数命名或生成多种实现路径。 | 算法思路设计、技术选型方案探讨 |
| **Top_p (核采样)** | \`0.05 ~ 0.2\` | 截断概率累积低于阈值的 Token。配合低温使用，彻底杜绝语法幻觉。 | 严格类型定义、格式化序列化 |
| **Stop Sequences** | 字符串数组 | 强制模型在生成指定标记时立刻停机，防止无限输出或重复废话。 | 语法块截断、单行补全、防止自问自答 |

> 💡 **官方铁律**：建议只调整 \`Temperature\` 或 \`Top_p\` 其中之一，不要同时大幅调整两者，否则采样空间会变得难以预测！

---

### 3. Stop Sequences（终止序列）的实战绝技

在没有聊天界面的原始 Codex API 调用中，模型非常喜欢在生成完你要求的函数后，自作聪明地接着生成 \`# Test cases\`、\`print(solve())\` 甚至是下一段无关代码。

#### 常用 Stop 标记策略：
1. **防止超出当前函数作用域**：
   - Python: \`stop: ["\\ndef ", "\\nclass ", "\\nif __name__"]\`
   - JavaScript/TypeScript: \`stop: ["\\nfunction ", "\\nexport ", "\\nclass "]\`
2. **截断 Markdown 代码块逃逸**：
   - \`stop: ["\`\`\`", "\\n\\n\\n"]\`
3. **单行补全（Inline Completion）**：
   - \`stop: ["\\n"]\`：当只要补全当前这行代码时，用换行符截断能瞬间节省 90% 的延迟和 Token 开销！
            `
          },
          en: {
            title: "Sampling Hyperparameters: Temperature, Top_P & Stop Sequences",
            difficulty: "Beginner",
            summary: "Master decoding parameters: learn why code hallucinates or loops infinitely and how to control sampling and stop boundaries.",
            content: `
### 1. The Dilemma of Sampling in Code Generation

While creative writing flourishes with high randomness, **industrial code demands near 100% determinism, idempotency, and canonical syntax**. Controlling hyperparameters unlocks both bulletproof reliability and creative algorithmic explorations.

---

### 2. Core Hyperparameter Cheat Sheet

| Parameter | Recommended Range | Core Role in Code Scenarios | Best Use Case |
| :--- | :--- | :--- | :--- |
| **Temperature** | \`0.0 ~ 0.2\` | Greedy / low-entropy sampling. Selects the highest likelihood tokens for canonical patterns. | Production code, unit tests, bug fixing, SQL queries |
| **Temperature** | \`0.5 ~ 0.8\` | Controlled diversity. Inspires distinct architectural approaches and naming options. | Brainstorming algorithms, comparative benchmarks |
| **Top_p (Nucleus)** | \`0.05 ~ 0.2\` | Truncates low-probability tail tokens. Combined with low temp, eliminates invalid tokens. | Strict schema definitions, AST migrations |
| **Stop Sequences** | String array | Halts model decoding immediately upon hitting specified delimiters. | Scope isolation, inline completion, token conservation |

> 💡 **Official Rule of Thumb**: Tune either \`Temperature\` or \`Top_p\`, but not both aggressively at the same time!

---

### 3. Practical Stop Sequence Tactics

Raw Codex API completion without delimiters often rambles into generating subsequent unrequested functions or test scripts.

#### Recommended Stop Strategies:
1. **Prevent Scope Overflow**:
   - Python: \`stop: ["\\ndef ", "\\nclass ", "\\nif __name__"]\`
   - JavaScript/TypeScript: \`stop: ["\\nfunction ", "\\nexport ", "\\nclass "]\`
2. **Prevent Markdown Escaping**:
   - \`stop: ["\`\`\`", "\\n\\n\\n"]\`
3. **Low-Latency Inline Completion**:
   - \`stop: ["\\n"]\`: Cuts completion cost and latency by up to 90% when completing a single statement!
            `
          }
        }
      ]
    },
    {
      id: "practical-prompts",
      icon: "fa-code",
      zh: {
        title: "2. 官方实战技巧与 Prompt 范式",
        description: "遵循 OpenAI 官方推荐的黄金 Prompt 范式，掌握高效代码提示工程",
        badge: "核心技能",
      },
      en: {
        title: "2. Official Best Practices & Prompt Engineering",
        description: "Master official prompting patterns, type contracts, few-shot examples, and TDD strategies",
        badge: "Core Skills",
      },
      articles: [
        {
          id: "official-prompting-principles",
          readingTime: "7 min",
          zh: {
            title: "官方指导原则：清晰度胜过聪明（Clear is Better Than Clever）",
            difficulty: "进阶",
            summary: "官方 5 大提示词黄金法则：如何通过注释、类型标注、文档字符串让 Codex 给出完美实现。",
            content: `
### 1. 官方黄金法则：给上下文注入精准锚点

OpenAI 研究团队在 Codex 论文与最佳实践文档中反复强调：**Codex 就像一个刚刚加入团队、掌握全部开源库知识，但对你当前业务背景一无所知的实习生**。

#### 黄金法则一：使用精确类型提示与输入输出示例（Type Hints & I/O Examples）
❌ **糟糕的提词**：
\`\`\`python
# 写一个提取邮箱的函数
def get_emails(text):
\`\`\`

✅ **极佳的提词（包含 Docstring、参数类型、返回值契约与示例）**：
\`\`\`python
from typing import List
import re

def extract_valid_emails(raw_text: str) -> List[str]:
    """
    从非结构化文本中提取所有符合 RFC 5322 规范的电子邮件地址。

    规则：
    1. 自动过滤掉尾随的标点符号（如逗号、句号）。
    2. 结果去重并按字母顺序升序排序。
    3. 不区分大小写，统一转换为小写。

    Examples:
        >>> extract_valid_emails("联系 admin@example.com, 以及 support@test.org.")
        ['admin@example.com', 'support@test.org']
    """
\`\`\`
*当输入上述 Prompt 时，Codex 会将注释内的规则转化为抽象语法判定条件，准确度高达 99%！*

---

### 2. 引导代码风格：指定技术栈版本与库选择

在现实工程中，同一种功能有几十种第三方库实现。如果不加限定，Codex 可能给你输出过时的 \`urllib2\` 或早已被废弃的 API。

#### 显式约束技术栈模板：
\`\`\`markdown
请使用以下技术栈实现用户鉴权拦截器：
- Node.js 20+ (ES Modules)
- Fastify 4.x
- @fastify/jwt 8.x
- 错误处理严格遵循 RFC 7807 规范（Problem Details）
\`\`\`
            `
          },
          en: {
            title: "Official Principle: Clear is Better Than Clever",
            difficulty: "Intermediate",
            summary: "5 official rules: how type annotations, unambiguous docstrings, and runtime contracts guarantee flawless code.",
            content: `
### 1. Anchor Context with Unambiguous Contracts

OpenAI researchers emphasize: **Treat Codex like a brilliant junior engineer who has read all public GitHub repositories, but knows nothing about your exact project requirements unless specified.**

#### Rule #1: Supply Strict Type Annotations & I/O Doctests
❌ **Vague Prompt**:
\`\`\`python
# extract emails
def get_emails(text):
\`\`\`

✅ **Mastery Prompt (Strict Types, Specifications & Doctests)**:
\`\`\`python
from typing import List
import re

def extract_valid_emails(raw_text: str) -> List[str]:
    """
    Extracts all RFC 5322 compliant email addresses from unstructured text.

    Requirements:
    1. Strip trailing punctuation marks (commas, periods).
    2. Deduplicate results and return sorted in ascending alphabetical order.
    3. Case-insensitive; normalize to lowercase.

    Examples:
        >>> extract_valid_emails("Contact admin@example.com, and support@test.org.")
        ['admin@example.com', 'support@test.org']
    """
\`\`\`
*Providing precise input/output examples triggers pattern completion that drives accuracy to 99%.*

---

### 2. Pinpoint Dependency Versions Explicitly

Avoid obsolete packages or deprecated APIs by declaring version constraints upfront:
\`\`\`markdown
Implement the authentication middleware using:
- Node.js 20+ (ES Modules)
- Fastify 4.x
- @fastify/jwt 8.x
- Error responses strictly compliant with RFC 7807 (Problem Details)
\`\`\`
            `
          }
        },
        {
          id: "few-shot-coding",
          readingTime: "6 min",
          zh: {
            title: "Few-Shot 示例法：驯服代码风格与边缘处理",
            difficulty: "进阶",
            summary: "当 Zero-shot 无法满足定制需求时，如何通过 1~2 个精挑细选的范例彻底锁定输出格式。",
            content: `
### 1. 为什么代码领域更需要 Few-Shot？

在编写数据迁移脚本、自定义 ORM 转换器或内部私有 DSL 时，通用知识无法奏效，**Few-Shot（少样本学习）就是终极武器**。

---

### 2. 实战案例：私有 DSL 转标准 SQL

\`\`\`sql
-- 示例 1：用户活跃度查询 DSL 转换为标准 PostgreSQL
-- [INPUT DSL]: FILTER users AGE > 18 AND status == 'ACTIVE' | SELECT id, name, created_at | LIMIT 10
-- [OUTPUT SQL]:
SELECT id, name, created_at
FROM users
WHERE age > 18 AND status = 'ACTIVE'
LIMIT 10;

-- 任务：将以下 DSL 转换为标准 PostgreSQL
-- [INPUT DSL]: FILTER products category IN ['Electronics', 'Books'] | SORT price DESC | SELECT title, price | LIMIT 5
-- [OUTPUT SQL]:
\`\`\`
给出 1~2 个规范输入输出对，Codex 能瞬间掌握转换语法规律。
            `
          },
          en: {
            title: "Few-Shot Prompting: Taming Custom Syntax & Conventions",
            difficulty: "Intermediate",
            summary: "Lock down output conventions, private DSLs, and edge cases with 1-2 curated input-output exemplar pairs.",
            content: `
### 1. The Power of Few-Shot in Domain-Specific Languages (DSLs)

When dealing with proprietary internal libraries, schema migration scripts, or custom DSLs where zero-shot models lack pre-trained knowledge, **Few-Shot examples provide instant few-token in-context alignment**.

---

### 2. Practical Case: Converting Custom DSL to PostgreSQL

\`\`\`sql
-- Example 1: User activity query DSL to PostgreSQL
-- [INPUT DSL]: FILTER users AGE > 18 AND status == 'ACTIVE' | SELECT id, name, created_at | LIMIT 10
-- [OUTPUT SQL]:
SELECT id, name, created_at
FROM users
WHERE age > 18 AND status = 'ACTIVE'
LIMIT 10;

-- Task: Convert the following DSL query
-- [INPUT DSL]: FILTER products category IN ['Electronics', 'Books'] | SORT price DESC | SELECT title, price | LIMIT 5
-- [OUTPUT SQL]:
\`\`\`
Providing paired demonstrations anchors parsing syntax reliably.
            `
          }
        },
        {
          id: "tdd-test-generation",
          readingTime: "8 min",
          zh: {
            title: "测试驱动开发（TDD）与边界用例爆破",
            difficulty: "进阶",
            summary: "让 Codex 充当 QA 杀手：反向生成极端边界条件、Mock 数据、Fuzzing 模糊测试与压力测试用例。",
            content: `
### 1. TDD（测试先行）模式的威力

先写实现再写测试容易陷入相同的思维盲区。**更高效的工程范式是：先让 Codex 写出覆盖所有极端情况的单元测试！**

---

### 2. 官方推荐的高级测试 Prompt 模板

\`\`\`python
# 待测目标接口规范：
# 函数名: calculate_tax(income: float, country_code: str, deductions: dict) -> float

# 请编写基于 pytest 的工业级全覆盖测试集。
# 必须包含以下维度的测试用例：
# 1. 正常路径（Happy Path）：典型收入与常规抵扣。
# 2. 边界路径（Boundary Cases）：0 收入、负数收入、极大值收入（float 精度极限）。
# 3. 异常路径（Negative Cases）：不支持的 country_code、无效的 deductions 格式，验证是否抛出自定义异常。
# 4. 参数化测试（@pytest.mark.parametrize）：针对不同税率梯度的矩阵覆盖。
# 5. 浮点数比较严格使用 pytest.approx 避免精度误差。
\`\`\`
            `
          },
          en: {
            title: "Test-Driven Development (TDD) & Edge-Case Probing",
            difficulty: "Intermediate",
            summary: "Turn Codex into a relentless QA adversary: generate boundary fuzzing, mock fixtures, and parametrized matrices.",
            content: `
### 1. Why Test-First Prevents Confirmation Bias

Writing code before tests allows implementation blind spots to carry over into the test suite. Generating unit tests first enforces rigorous contract specifications before writing a single line of business logic.

---

### 2. High-Coverage Pytest Prompt Template

\`\`\`python
# Target Interface Contract:
# calculate_tax(income: float, country_code: str, deductions: dict) -> float

# Write an exhaustive pytest suite covering:
# 1. Happy Path: standard salary brackets and typical deductions.
# 2. Boundary Cases: zero income, negative values, float precision overflows.
# 3. Negative Cases: invalid country codes, malformed deductions dictionary.
# 4. Parametrization: @pytest.mark.parametrize for full matrix verification.
# 5. Floating point assertions strictly utilizing pytest.approx.
\`\`\`
            `
          }
        }
      ]
    },
    {
      id: "advanced-hacks",
      icon: "fa-wand-magic-sparkles",
      zh: {
        title: "3. 进阶核心与隐秘黑客技巧",
        description: "探索 FIM (Fill-in-the-Middle)、Grammar 约束、Self-Correction 与深度 Agent 架构",
        badge: "高阶黑客",
      },
      en: {
        title: "3. Advanced Architectures & Hidden Hacker Gems",
        description: "Master Fill-in-the-Middle (FIM), grammar masking, self-correction loops, and coding agents",
        badge: "Advanced",
      },
      articles: [
        {
          id: "fim-fill-in-the-middle",
          readingTime: "9 min",
          zh: {
            title: "FIM (Fill-in-the-Middle)：代码中间插入补全黑科技",
            difficulty: "专家",
            summary: "揭秘现代 IDE 智能插件（Copilot/Cursor）背后的底层机制：如何在光标两侧同时注入 Prefix 与 Suffix。",
            content: `
### 1. 为什么传统从左到右补全在真实编码中不够用？

传统生成模型是纯从左往右（Prefix-only）自回归生成的。但在日常编码中，光标往往在函数正中间，下方已经存在调用代码或闭合大括号。
如果只把上半部分交给模型，模型会以为后面什么都没有，导致重复定义变量、重复声明甚至重复闭合大括号。

为了解决这个问题，OpenAI 团队在训练 Codex 时引入了划时代的 **FIM (Fill-in-the-Middle)** 技术！

---

### 2. FIM 架构原理与特殊 Token

在支持 FIM 的模型中，上下文通过 3 个特殊的保留 Token 重组：
- \`<|fim_prefix|>\`：光标上方的代码（前缀）
- \`<|fim_suffix|>\`：光标下方的代码（后缀）
- \`<|fim_middle|>\`：模型需要填补的内容（中间代码）

#### 训练重排方式（PSM 范式）：
\`\`\`text
<|fim_prefix|>Prefix 内容<|fim_suffix|>Suffix 内容<|fim_middle|>
\`\`\`
模型的目标是预测接在 \`<|fim_middle|>\` 后面的代码，直到遇到结束符！
            `
          },
          en: {
            title: "FIM (Fill-in-the-Middle): The Cursor Completion Secret",
            difficulty: "Expert",
            summary: "Uncover the engine behind GitHub Copilot & Cursor: how bidirectional Prefix and Suffix injection enables surgical inline edits.",
            content: `
### 1. The Limitation of Unidirectional Left-to-Right Generation

Standard language generation is causal: it predicts token $t$ given tokens $1$ to $t-1$. In real-world editing, the cursor sits between existing code lines, with valid closing brackets and subsequent calls already present below.
Without context below the cursor, models frequently re-declare existing variables or create mismatched closing tags.

OpenAI solved this by training Codex with **Fill-in-the-Middle (FIM)** capabilities.

---

### 2. FIM Architecture & Reserved Tokens

The prompt structure re-assembles the context using 3 reserved tokens:
- \`<|fim_prefix|>\`: Code before the cursor
- \`<|fim_suffix|>\`: Code after the cursor
- \`<|fim_middle|>\`: Target slot to be generated

#### Prefix-Suffix-Middle (PSM) Layout:
\`\`\`text
<|fim_prefix|>Prefix Content<|fim_suffix|>Suffix Content<|fim_middle|>
\`\`\`
The model attends simultaneously to both the header and footer, generating code seamlessly connecting the two halves!
            `
          }
        },
        {
          id: "grammar-constrained-generation",
          readingTime: "7 min",
          zh: {
            title: "语法约束与结构化输出（BNF / JSON Schema）",
            difficulty: "专家",
            summary: "如何让 Codex 的输出 100% 遵守编译期语法树？解析 Logits Masking 与强制 Schema 校验。",
            content: `
### 1. 痛点：大模型的「幻觉标点」与结构损坏

即使指令再详尽，大模型有时候仍会漏掉一个引号、多生成一个逗号导致 \`JSON.parse()\` 崩溃。
在工业界代码管道中，我们需要 Codex 产出绝对可靠的结构化 AST、配置或数据库迁移语句。

---

### 2. 解决方案：Logits Bias 与 Grammar Masking

现代代码生成系统在解码每个 Token 时，引入了**语法状态机（Parser State Machine / Pushdown Automaton）**：
1. **词法分析**：当前已经生成了 \`{"name": "foo", "age":\`。
2. **状态判定**：根据 JSON 语法规范，紧随其后的合法 Token 只能是数字或对象开括号。
3. **Logits 屏蔽（Logits Masking）**：将所有非法 Token 的输出概率（Logits）硬编码置为 $-\\infty$。
4. **结果**：从数学原理上彻底消灭语法错误可能！
            `
          },
          en: {
            title: "Grammar-Constrained Decoding & Structured Outputs",
            difficulty: "Expert",
            summary: "Guarantee 100% syntactically valid JSON and AST outputs using state-machine logit masking and schemas.",
            content: `
### 1. The Hazard of Malformed Parsing

Even slight hallucinations (e.g. trailing commas, unescaped quotes) trigger fatal exceptions in downstream automated pipelines.

---

### 2. Solution: Pushdown Automata Logits Masking

Structured generation engines enforce syntax at decoding time:
1. **Parser State**: Tracking the AST / grammar state at step $t$.
2. **Grammar Filter**: Determining the subset of syntactically legal next tokens.
3. **Logits Masking**: Setting logits of invalid tokens to $-\\infty$.
4. **Outcome**: Mathematically impossible to produce invalid syntax!
            `
          }
        },
        {
          id: "self-correcting-agent-loop",
          readingTime: "10 min",
          zh: {
            title: "Self-Correction 自我修复循环与 ReAct 代码智能体",
            difficulty: "专家",
            summary: "从单次回答到工程智能体：打造具备 执行 -> 捕获 Traceback -> 自省修复 闭环的自动化体系。",
            content: `
### 1. 为什么“一次生成”行不通？

编程本质上是一个**「假设 -> 编码 -> 运行 -> 观察报错（Traceback） -> 定位根因 -> 修改重试」**的迭代反馈闭环。

**真正的 Codex 高手绝不会只用单轮对话，而是构建自动化的闭环 Agent！**

---

### 2. 核心 Prompt 模板：错误回传诊断模式

\`\`\`markdown
你之前编写的代码在沙盒自动化测试中遇到以下异常：

【执行环境】: Python 3.12, Linux x86_64
【执行命令】: pytest tests/test_payment.py
【完整错误堆栈 (Traceback)】:
Traceback (most recent call last):
  File "payment.py", line 42, in process_refund
    balance = account.get_balance() - amount
TypeError: unsupported operand type(s) for -: 'Decimal' and 'float'

【任务要求】:
1. 深入分析导致该报错的根本原因（Root Cause）。
2. 不要全量重写无关代码，给出针对该 Bug 的最小化补丁（Diff 或修复后的函数）。
3. 解释为何引入 Decimal 与 float 混用会导致精度隐患。
\`\`\`
            `
          },
          en: {
            title: "Self-Correction Loops & Autonomous ReAct Coding Agents",
            difficulty: "Expert",
            summary: "Build an automated closed loop: Execute -> Capture Traceback -> Introspect -> Apply Minimal Patch.",
            content: `
### 1. Beyond Single-Turn Generations

Professional software engineering is inherently an iterative feedback loop: hypothesis -> implement -> execute -> inspect traceback -> remediate.

Codex excels when integrated into closed-loop agent topologies equipped with sandboxed terminals.

---

### 2. Traceback Remediation Prompt Pattern

\`\`\`markdown
The previously generated code failed in automated sandbox testing:

[Environment]: Python 3.12, Linux x86_64
[Command]: pytest tests/test_payment.py
[Traceback]:
Traceback (most recent call last):
  File "payment.py", line 42, in process_refund
    balance = account.get_balance() - amount
TypeError: unsupported operand type(s) for -: 'Decimal' and 'float'

[Instructions]:
1. Identify the root cause behind the type mismatch.
2. Provide a minimal surgical patch without rewriting unrelated code.
3. Detail why Decimal/float arithmetic causes precision loss in monetary flows.
\`\`\`
            `
          }
        }
      ]
    },
    {
      id: "pitfalls-and-security",
      icon: "fa-shield-halved",
      zh: {
        title: "4. 陷阱、安全漏洞与生产防御",
        description: "避开幻觉库、SQL 注入、死循环与上下文溢出等致命陷阱",
        badge: "工程避坑",
      },
      en: {
        title: "4. Pitfalls, Security Vulnerabilities & Hardening",
        description: "Defend against package hallucination supply-chain attacks, SQL injections, and unsafe deserialization",
        badge: "Security",
      },
      articles: [
        {
          id: "hallucinated-packages",
          readingTime: "6 min",
          zh: {
            title: "幻觉包与安全供应链投毒（Package Hallucination）",
            difficulty: "必看",
            summary: "小心幽灵依赖！黑客如何利用 Codex 随机发明的库名实施钓鱼，以及企业级防御手段。",
            content: `
### 1. 致命现象：幽灵包（Hallucinated Packages）

在需要某个冷门功能时，大模型经常会自信满满地在代码开头写上：
\`\`\`python
import advanced_pdf_streamer  # 实际上 PyPI 上根本没有这个官方库！
\`\`\`

黑客抓住了大模型的这种统计规律：抢先在 PyPI、npm 注册该名称的同名包，并在包中埋入恶意 Payload。程序员一旦执行 \`pip install\`，供应链攻击瞬间达成！

---

### 2. 生产防御铁律

1. **白名单校验与私有源镜像**：在 CI/CD 中配置安全审计工具（如 Socket.dev, Snyk, pip-audit）。
2. **锁文件（Lockfiles）强制**：永远提交 \`package-lock.json\` 或 \`poetry.lock\`，禁止在生产构建中执行自由版本拉取。
            `
          },
          en: {
            title: "Package Hallucination & Supply Chain Poisoning",
            difficulty: "Must Read",
            summary: "Beware of phantom dependencies: how adversaries squat LLM-invented package names and how to defend pipelines.",
            content: `
### 1. The Threat: Phantom Dependencies

When asked for esoteric utilities, models occasionally invent plausible-sounding packages:
\`\`\`python
import advanced_pdf_streamer  # Does not exist on official PyPI!
\`\`\`

Adversaries scan common hallucination patterns, register the packages on registries (PyPI, npm), and embed malicious payloads. Unsuspecting developers copy-pasting code unwittingly execute supply-chain exploits!

---

### 2. Production Defensive Posture

1. **Registry Auditing**: Integrate tools like Snyk or pip-audit in CI/CD.
2. **Strict Lockfiles**: Always enforce \`poetry.lock\` / \`package-lock.json\`.
            `
          }
        },
        {
          id: "security-patterns",
          readingTime: "7 min",
          zh: {
            title: "安全编码规范：防止把漏洞写进代码",
            difficulty: "必看",
            summary: "Codex 很容易继承开源代码中的不良习惯。如何强制其遵循 OWASP Top 10 安全规范。",
            content: `
### 1. 常见的 AI 生成漏洞

Codex 很容易默认生成：
- **SQL 注入**：使用字符串拼接 SQL。
- **硬编码秘钥**：\`api_key = "sk-..."\`。
- **ReDoS（正则表达式拒绝服务）**。
- **反序列化漏洞**：随意使用 \`pickle.loads()\`。

---

### 2. 官方防护提示词框架（Security-First Prompt）

\`\`\`markdown
你是一名资深网络安全与代码审计专家。
在编写该功能时，请严格遵守以下安全基线：
1. 【参数化查询】：所有数据库操作必须强制使用 ORM 参数化绑定，禁止任何字符串拼接。
2. 【秘密管理】：所有 API Token、数据库密码必须通过环境变量提取。
3. 【输入验证】：对所有外部输入进行严格白名单清洗（推荐 Pydantic v2 / Zod）。
\`\`\`
            `
          },
          en: {
            title: "Secure Coding Patterns: OWASP Top 10 Guardrails",
            difficulty: "Must Read",
            summary: "Codex inherits legacy flaws from training data. Enforce security guardrails against injections and deserialization.",
            content: `
### 1. Common Generative Vulnerabilities

Without constraints, models often default to unsafe idioms:
- **SQL Injections**: Raw string formatting in queries.
- **Hardcoded Secrets**: Embedded credentials.
- **ReDoS**: Catastrophic backtracking in regexes.
- **Unsafe Deserialization**: Naive use of \`pickle.loads()\`.

---

### 2. Security-First System Prompt Framework

\`\`\`markdown
You are a senior Application Security (AppSec) architect.
Strictly adhere to the following baseline:
1. [Parameterized Queries]: Mandate ORM parameterized bindings; forbid string formatting.
2. [Secrets Hygiene]: Load tokens and passwords strictly via environment variables.
3. [Input Validation]: Enforce schema validation (Zod / Pydantic v2) on all inbound payloads.
\`\`\`
            `
          }
        }
      ]
    }
  ],

  // 交互式 Prompt 试验沙盒模板
  interactiveTemplates: [
    {
      id: "tpl-1",
      zh: {
        name: "函数编写与类型契约（Type Contract）",
        category: "代码生成",
        description: "生成高健壮性、类型完备、带 Docstring 的工业级函数",
      },
      en: {
        name: "Function Contract & Type Hints",
        category: "Code Gen",
        description: "Generate robust, strongly typed, production-grade functions with docstrings",
      },
      systemRole: "You are an expert Python staff engineer. Write production-ready, highly readable code.",
      temperature: 0.1,
      topP: 0.1,
      stopSequences: ["\ndef ", "\nclass "],
      userPrompt: `def parse_semver(version_str: str) -> dict:
    """
    解析语义化版本字符串 (Semantic Versioning 2.0.0)。

    格式: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILDMETADATA]
    例如: "1.0.0-alpha+001", "2.1.3"

    返回字段:
      - major (int)
      - minor (int)
      - patch (int)
      - prerelease (str or None)
      - build (str or None)

    异常处理:
      格式非法时抛出 ValueError 并带有详尽说明。
    """`,
      simulatedOutput: `    import re

    SEMVER_PATTERN = re.compile(
        r"^(?P<major>0|[1-9]\\d*)\\."
        r"(?P<minor>0|[1-9]\\d*)\\."
        r"(?P<patch>0|[1-9]\\d*)"
        r"(?:-(?P<prerelease>(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)"
        r"(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?"
        r"(?:\\+(?P<build>[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"
    )

    match = SEMVER_PATTERN.match(version_str.strip())
    if not match:
        raise ValueError(f"Invalid SemVer string: {version_str!r}")

    data = match.groupdict()
    return {
        "major": int(data["major"]),
        "minor": int(data["minor"]),
        "patch": int(data["patch"]),
        "prerelease": data["prerelease"],
        "build": data["build"],
    }`
    },
    {
      id: "tpl-2",
      zh: {
        name: "复杂算法与性能优化（Time Complexity）",
        category: "算法优化",
        description: "将 O(N^2) 暴力解法重构为 O(N) 的最优算法",
      },
      en: {
        name: "Algorithm Optimization & Complexity",
        category: "Performance",
        description: "Refactor O(N^2) brute force logic into optimal O(N) hash-based execution",
      },
      systemRole: "You are an algorithms researcher specializing in competitive programming and systems optimization.",
      temperature: 0.2,
      topP: 0.15,
      stopSequences: ["\n\n\n"],
      userPrompt: `// 以下是存在严重性能瓶颈的前端历史数据去重与聚合逻辑：
// 数据量可达 500,000 条，当前双重循环耗时超过 4500ms
function aggregateEventsSlow(events) {
  const result = [];
  for (let i = 0; i < events.length; i++) {
    let found = false;
    for (let j = 0; j < result.length; j++) {
      if (result[j].userId === events[i].userId && result[j].eventType === events[i].eventType) {
        result[j].count += events[i].count;
        found = true;
        break;
      }
    }
    if (!found) {
      result.push({ ...events[i] });
    }
  }
  return result;
}

// 任务要求：
// 1. 重构为 O(N) 算法（使用 Map/Hash 复合键）。
// 2. 避免冗余浅拷贝以减少垃圾回收（GC）压力。
// 3. 给出 TypeScript 严格类型签名。`,
      simulatedOutput: `interface UserEvent {
  userId: string | number;
  eventType: string;
  count: number;
  [key: string]: any;
}

function aggregateEventsOptimized(events: readonly UserEvent[]): UserEvent[] {
  // 使用 Map 维护复合键映射，查找效率为 O(1)
  const map = new Map<string, UserEvent>();

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    // 快速复合键 (用不可见字符作为分隔符避免字符碰撞)
    const key = \`\${ev.userId}\\x1f\${ev.eventType}\`;

    const existing = map.get(key);
    if (existing !== undefined) {
      existing.count += ev.count;
    } else {
      // 仅在首次遇到时复制对象
      map.set(key, { ...ev });
    }
  }

  return Array.from(map.values());
}`
    },
    {
      id: "tpl-3",
      zh: {
        name: "FIM (Fill-in-the-Middle) 光标补全模拟",
        category: "进阶特性",
        description: "模拟 Prefix + Suffix 上下文环境，精确补齐中间缺失逻辑",
      },
      en: {
        name: "FIM (Fill-in-the-Middle) Completion",
        category: "Advanced",
        description: "Simulate dual Prefix + Suffix context to synthesize the exact middle logic",
      },
      systemRole: "You are an ultra-low latency code completion engine using FIM tokens.",
      temperature: 0.0,
      topP: 0.1,
      stopSequences: ["<|fim_suffix|>", "<|endoftext|>"],
      userPrompt: `<|fim_prefix|>
class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        # 双向链表维护最近使用顺序
<|fim_suffix|>
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]
<|fim_middle|>`,
      simulatedOutput: `        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: 'Node') -> None:
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _add(self, node: 'Node') -> None:
        prev_tail = self.tail.prev
        prev_tail.next = node
        node.prev = prev_tail
        node.next = self.tail
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add(node)
        return node.val`
    },
    {
      id: "tpl-4",
      zh: {
        name: "SQL 注入与漏洞加固（安全审计）",
        category: "安全与质量",
        description: "将充满隐患的拼接 SQL 重构为安全防御型 Prepared Statement",
      },
      en: {
        name: "SQL Injection Remediation (AppSec)",
        category: "Security",
        description: "Refactor dangerous concatenated queries into hardened parameterized statements",
      },
      systemRole: "You are a senior Application Security (AppSec) architect.",
      temperature: 0.1,
      topP: 0.1,
      stopSequences: ["\n\n\n"],
      userPrompt: `// 待审计的安全隐患代码：
app.get('/search-orders', async (req, res) => {
  const { customerId, status, minAmount } = req.query;

  // 漏洞点：直接字符串拼接外部未过滤参数
  let query = "SELECT * FROM orders WHERE customer_id = '" + customerId + "'";
  if (status) {
    query += " AND status = '" + status + "'";
  }
  if (minAmount) {
    query += " AND amount >= " + minAmount;
  }

  const results = await db.raw(query);
  res.json(results);
});

// 请指出存在的安全隐患，并使用 node-postgres (pg) 参数化查询重写该路由，支持动态筛选。`,
      simulatedOutput: `/**
 * 安全审计报告 / Security Audit:
 * 1. SQL Injection Vulnerability: direct concatenation of query strings.
 * 2. Missing numeric type sanitization on minAmount.
 */

app.get('/search-orders', async (req, res) => {
  try {
    const { customerId, status, minAmount } = req.query;

    if (!customerId || typeof customerId !== 'string') {
      return res.status(400).json({ error: 'customerId is required' });
    }

    const conditions = ['customer_id = $1'];
    const values = [customerId];
    let paramIndex = 2;

    if (typeof status === 'string' && status.trim() !== '') {
      conditions.push(\`status = $\${paramIndex++}\`);
      values.push(status.trim());
    }

    if (minAmount !== undefined) {
      const parsedAmount = parseFloat(minAmount);
      if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ error: 'Invalid minAmount value' });
      }
      conditions.push(\`amount >= $\${paramIndex++}\`);
      values.push(parsedAmount);
    }

    const sql = \`SELECT id, customer_id, status, amount, created_at
                 FROM orders
                 WHERE \${conditions.join(' AND ')}
                 ORDER BY created_at DESC
                 LIMIT 100\`;

    const { rows } = await db.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});`
    }
  ],

  // 终极 Cheat Sheet 速查表
  cheatSheet: {
    zh: [
      {
        category: "超参数调优秘籍",
        items: [
          { key: "Temperature = 0.0 ~ 0.1", desc: "生产代码生成、修复 Bug、单测用例。绝对确定性与最高准确率。" },
          { key: "Temperature = 0.6 ~ 0.8", desc: "架构选型头脑风暴、多种算法方案探讨、寻找替代方案。" },
          { key: "Top_p = 0.1", desc: "极致收缩采样核，彻底消除罕见无效语法 Token。" },
          { key: "Stop: [\"\\n\\n\", \"def \", \"class \"]", desc: "精准阻断模型多余发挥与自作聪明生成后续内容。" }
        ]
      },
      {
        category: "Prompt 必杀结构",
        items: [
          { key: "角色赋予 (Persona)", desc: "明确指定语言专家、安全审计师或算法竞赛选手角色。" },
          { key: "类型契约 (Type Hint)", desc: "必须给出输入/输出参数的具体类型与数据结构 Schema。" },
          { key: "边界规范 (Edge Cases)", desc: "显式列出：空值/空数组/越界/负数/并发冲突的处理约定。" },
          { key: "负向约束 (Negative Prompts)", desc: "明确声明：严禁使用废弃 API、严禁引入第三方未经许可库。" }
        ]
      },
      {
        category: "调试与纠错循环 (Self-Healing)",
        items: [
          { key: "回传完整 Traceback", desc: "包含执行命令、操作系统环境、完整异常栈及上一版有问题的片段。" },
          { key: "最小差异更新 (Diff-only)", desc: "要求模型仅返回 Patch 补丁或被修改函数，节省上下文并减少引入新 Bug 概率。" },
          { key: "Step-by-Step 慢思考", desc: "在复杂场景中要求模型先写出 1-2-3 逻辑推理步骤，再输出正式代码。" }
        ]
      }
    ],
    en: [
      {
        category: "Hyperparameter Recipes",
        items: [
          { key: "Temperature = 0.0 ~ 0.1", desc: "Production code, bug fixing, test cases. Maximum determinism and compliance." },
          { key: "Temperature = 0.6 ~ 0.8", desc: "Architectural brainstorming, multiple algorithmic proposals." },
          { key: "Top_p = 0.1", desc: "Aggressive nucleus truncation, eliminating rare hallucinated tokens." },
          { key: "Stop: [\"\\n\\n\", \"def \", \"class \"]", desc: "Surgically cuts off hallucinated subsequent scopes." }
        ]
      },
      {
        category: "Essential Prompt Anatomy",
        items: [
          { key: "Persona Definition", desc: "Assign specialized role: staff engineer, security auditor, or algorithmic researcher." },
          { key: "Type Contracts", desc: "Always supply explicit input/output type annotations and schemas." },
          { key: "Edge Case Guardrails", desc: "Specify handling for empty collections, boundary overflows, and null values." },
          { key: "Negative Constraints", desc: "Forbid unverified third-party libraries and deprecated runtime methods." }
        ]
      },
      {
        category: "Debugging & Self-Healing",
        items: [
          { key: "Full Traceback Injection", desc: "Provide operating environment, command, stdout, and full exception traceback." },
          { key: "Surgical Diff Updates", desc: "Instruct the model to return git-diffs or patched functions only." },
          { key: "Chain-of-Thought First", desc: "Demand step-by-step reasoning plan prior to generating code." }
        ]
      }
    ]
  }
};

// 如果在 Node 环境，导出数据
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CODEX_DATA;
}
