# GitAutoCommit 产品需求文档

## 1. 产品概述

### 一句话描述
自动分析代码变更，生成语义化Git提交信息。

### 目标用户
- 开发者（个人/团队）
- 需要规范化提交历史的团队
- 追求效率的独立开发者

---

## 2. MVP功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| F01 变更分析 | 分析git diff | P0 |
| F02 消息生成 | AI生成提交信息 | P0 |
| F03 执行提交 | 执行git commit | P0 |
| F04 配置管理 | API Key/模板配置 | P0 |
| F05 历史记录 | 本地记录历史 | P1 |

---

## 3. 技术架构

```
CLI Tool (Node.js)
    ↓
Git Service (git diff分析)
    ↓
AI Service (消息生成)
    ↓
Git Commit (执行提交)
```

---

## 4. 使用方式

```bash
# 安装
npm install -g git-autocommit

# 使用
git-autocommit

# 或简写
gac
```

流程：
1. 检测当前git变更
2. 分析diff内容
3. 生成提交信息
4. 用户确认
5. 执行提交