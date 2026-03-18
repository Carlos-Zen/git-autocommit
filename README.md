# GitAutoCommit

<p align="center">
  <strong>智能Git提交工具 | AI-Powered Git Commit Generator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue" alt="TypeScript 5.4">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#中文">中文</a>
</p>

---

<a name="english"></a>
## English

AI-powered Git commit message generator. Automatically analyzes your code changes and generates semantic commit messages.

### ✨ Features

- 🤖 **AI-Powered** - Intelligent message generation using GPT/Claude/DeepSeek
- 📝 **Conventional Commits** - Follows best practices automatically
- 🌐 **Multi-Language** - Support for Chinese and English
- ⚡ **Fast & Lightweight** - Minimal dependencies
- 🔧 **Configurable** - Customizable styles and behavior

### 📦 Installation

```bash
npm install -g git-autocommit
```

### 🚀 Usage

```bash
# Basic usage
git-autocommit
# or use the alias
gac

# Auto stage all changes before commit
gac --stage

# Skip confirmation prompt
gac -y

# Edit the generated message before commit
gac --edit

# Configure AI settings
gac config
```

### ⚙️ Configuration

Run `gac config` to set up:

| Setting | Description | Options |
|---------|-------------|---------|
| Provider | AI provider | openai, claude, deepseek |
| API Key | Your API key | - |
| Language | Message language | zh, en |
| Style | Commit style | conventional, simple, detailed |
| Auto Stage | Stage changes automatically | true, false |

### 📋 Commit Message Styles

#### Conventional (Default)
```
feat(auth): add OAuth2 login support
fix(api): resolve timeout issue in user service
docs(readme): update installation instructions
```

#### Simple
```
Add OAuth2 login support
Fix timeout issue in user service
Update installation instructions
```

#### Detailed
```
Add OAuth2 login support for better user authentication

- Implement Google OAuth2 provider
- Add login callback handling
- Update user model for OAuth data
```

### 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime & Language |
| Commander | CLI Framework |
| Inquirer | Interactive Prompts |
| Chalk | Terminal Styling |
| Conf | Configuration Storage |

### 📁 Project Structure

```
src/
├── index.ts      # CLI entry point
├── git.ts        # Git operations
├── ai.ts         # AI API integration
└── config.ts     # Configuration management
```

### 🔒 Security

- API keys are stored locally using encrypted storage
- No data is sent to any server except the configured AI provider
- Works offline for git operations (AI generation requires internet)

### 📄 License

[MIT](LICENSE)

---

<a name="中文"></a>
## 中文

AI驱动的Git提交信息生成器。自动分析代码变更并生成语义化提交信息。

### ✨ 特性

- 🤖 **AI驱动** - 使用 GPT/Claude/DeepSeek 智能生成
- 📝 **规范提交** - 自动遵循 Conventional Commits 规范
- 🌐 **多语言** - 支持中英文
- ⚡ **轻量快速** - 极简依赖
- 🔧 **可配置** - 自定义风格和行为

### 📦 安装

```bash
npm install -g git-autocommit
```

### 🚀 使用

```bash
# 基本使用
git-autocommit
# 或使用简写
gac

# 自动暂存所有变更后提交
gac --stage

# 跳过确认直接提交
gac -y

# 提交前编辑生成的信息
gac --edit

# 配置AI设置
gac config
```

### ⚙️ 配置

运行 `gac config` 进行配置：

| 设置项 | 描述 | 选项 |
|--------|------|------|
| Provider | AI服务商 | openai, claude, deepseek |
| API Key | API密钥 | - |
| Language | 消息语言 | zh, en |
| Style | 提交风格 | conventional, simple, detailed |
| Auto Stage | 自动暂存 | true, false |

### 📋 提交信息风格

#### 规范模式（默认）
```
feat(auth): 添加OAuth2登录支持
fix(api): 修复用户服务超时问题
docs(readme): 更新安装说明
```

#### 简洁模式
```
添加OAuth2登录支持
修复用户服务超时问题
更新安装说明
```

#### 详细模式
```
添加OAuth2登录支持以改善用户认证体验

- 实现Google OAuth2登录
- 添加登录回调处理
- 更新用户模型存储OAuth数据
```

### 🛠 技术栈

| 技术 | 用途 |
|------|------|
| Node.js + TypeScript | 运行时与语言 |
| Commander | CLI框架 |
| Inquirer | 交互式提示 |
| Chalk | 终端样式 |
| Conf | 配置存储 |

### 📁 项目结构

```
src/
├── index.ts      # CLI入口
├── git.ts        # Git操作
├── ai.ts         # AI API集成
└── config.ts     # 配置管理
```

### 🔒 安全

- API密钥使用加密存储在本地
- 除配置的AI服务商外不发送任何数据
- Git操作可离线使用（AI生成需要网络）

### 📄 许可证

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Carlos-Zen">Carlos-Zen</a>
</p>