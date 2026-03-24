# 🐼🐻‍❄️ storyboard-ai

> AI 故事 + 分镜工作站 | 熊猫 × 北极熊 搞笑反讽 IP

一个半自动化创作平台，帮助你运营熊猫 × 北极熊 IP 账号。每天自动抓取热点新闻 → AI 生成搞笑故事思路 → 你选中美剧后自动生成分镜图 + 视频提示词 → 你拿去出视频。

**完全开源，可部署到 GitHub Codespaces 一键预览。**

---

## 🎯 功能

- 📰 **每日热点新闻抓取** — 自动获取当天热点，筛选适合做反讽的题材
- 🤖 **AI 故事生成** — 每天生成 3-5 个故事思路（熊猫话痨 + 北极熊高冷吐槽）
- 🎬 **分镜图生成** — 每个场景生成首尾帧 + 分镜图，角色形象保持一致
- 📝 **视频提示词** — 输出图片转视频的提示词，复制即用
- 🎨 **角色形象管理** — 固定两个角色的视觉形象，保持 IP 一致性

---

## 🏗 技术架构

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router, TypeScript, Tailwind) |
| 后端 | Spring Boot 3.x (Java 17+) |
| 数据库 | MySQL 8.0 |
| AI | MiniMax (hailuo image-01) |
| 部署 | GitHub Codespaces / Docker |

---

## 🚀 快速开始

### 方式一：GitHub Codespaces（推荐，一键启动）

1. Fork 本仓库
2. 点击 **Code** → **Create codespace on main**
3. 等待环境启动，访问 `http://localhost:3000`

### 方式二：本地开发

**前置依赖**：
- Node.js 18+
- Java 17+
- MySQL 8.0

**后端启动**：
```bash
cd backend
# 配置 application.yml 中的数据库连接
mvn spring-boot:run
```

**前端启动**：
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 项目结构

```
storyboard-ai/
├── frontend/          # Next.js 前端
├── backend/           # Spring Boot 后端
├── docs/             # 文档
├── .devcontainer/    # Codespaces 配置
├── SPEC.md           # 详细功能规格说明
└── README.md
```

---

## 🔧 配置

### MiniMax API Key

在后端 `application.yml` 中配置：

```yaml
minimax:
  api-key: YOUR_API_KEY
```

或设置环境变量 `MINIMAX_API_KEY`。

### 数据库

默认使用 MySQL，配置如下：

| 配置项 | 默认值 |
|--------|--------|
| Host | localhost |
| Port | 3306 |
| Database | storyboard_ai |
| Username | root |
| Password | root |

---

## 📖 工作流

```
每天定时抓取热点新闻
        ↓
AI 生成 3-5 个故事概念
        ↓
你选择一个故事
        ↓
系统生成分镜描述 + 首尾帧图 + 每张分镜图
        ↓
复制图片转视频提示词 → 你的视频软件出视频
```

---

## 🛠 开发指南

### 添加新的 AI 模型

在 `MiniMaxService.java` 中添加新的模型调用方法。

### 添加新的 API 端点

1. 在 `entity/` 中创建 Entity
2. 在 `repository/` 中创建 Repository
3. 在 `service/` 中创建 Service
4. 在 `controller/` 中创建 Controller

---

## 📄 License

MIT License

---

## 👤 作者

GitHub: [@1256128692](https://github.com/1256128692)
