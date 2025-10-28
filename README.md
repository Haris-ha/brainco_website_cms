# BrainCo 官网内容管理系统

> BrainCo Website Content Management System - 基于 Strapi 5 的企业级内容管理系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-18--22-green.svg)
![Strapi](https://img.shields.io/badge/strapi-5.29.0-purple.svg)

</div>

## ✨ 特性

- 🎨 **品牌定制化** - 完全定制的 BrainCo 品牌界面
- 🌐 **多语言支持** - 中文、英文界面
- 🎯 **内容管理** - 文章、作者、分类、全局配置等
- 🔒 **权限管理** - 基于角色的访问控制
- 📱 **响应式设计** - 支持各种设备访问
- 🌙 **明暗主题** - 自动适应系统主题
- 🚀 **高性能** - SQLite 数据库，快速响应

## 📦 快速开始

### 环境要求

- **Node.js**: 18.x - 22.x
- **pnpm**: 8.x 或更高版本（推荐）
- **操作系统**: macOS, Linux, Windows

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动开发服务器（带热重载）
pnpm run develop
```

访问 http://localhost:1337/admin

首次访问会要求创建管理员账号。

### 生产构建

```bash
# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start
```

## 🎨 定制化配置

本 CMS 系统已针对 BrainCo 品牌进行了深度定制：

### 品牌元素
- ✅ BrainCo Logo
- ✅ 品牌配色方案
- ✅ 登录页面背景图
- ✅ 自定义欢迎文案

### 配置文件
```
src/admin/
├── app.js              # 主配置（Logo、主题、多语言）
├── extensions.css      # 自定义样式
├── logo.webp          # BrainCo Logo
└── login-bg.webp      # 登录背景图
```

详细的定制说明请查看 [CMS_定制说明.md](./CMS_定制说明.md)

## 📖 内容类型

### 核心内容
- **Article** - 文章/新闻
- **Author** - 作者信息
- **Category** - 分类管理
- **Global** - 全局配置
- **About** - 关于页面

### API 端点
```
GET /api/articles       # 获取文章列表
GET /api/articles/:id   # 获取单篇文章
GET /api/categories     # 获取分类
GET /api/authors        # 获取作者
GET /api/global         # 获取全局配置
GET /api/about          # 获取关于页面
```

## 🔧 常用命令

```bash
# 开发
pnpm run develop        # 开发模式
pnpm run build          # 构建 admin 面板
pnpm run start          # 生产模式

# 管理
pnpm run strapi         # Strapi CLI
pnpm run console        # 打开 Strapi 控制台

# 升级
pnpm run upgrade        # 升级 Strapi 版本
pnpm run upgrade:dry    # 查看可升级内容
```

## 🗄️ 数据库

默认使用 **SQLite** 数据库，数据文件位于：
```
.tmp/data.db           # 开发环境数据库
```

生产环境建议使用 PostgreSQL 或 MySQL。

## 🔐 环境变量

创建 `.env` 文件（已在 .gitignore 中）：

```env
# Server
HOST=0.0.0.0
PORT=1337

# Admin
ADMIN_JWT_SECRET=your-secret-key
API_TOKEN_SALT=your-token-salt
TRANSFER_TOKEN_SALT=your-transfer-salt
ENCRYPTION_KEY=your-encryption-key

# Admin URL（可选）
ADMIN_URL=/admin

# Database（生产环境）
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=brainco_cms
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password
```

## 📁 项目结构

```
brainco_website_cms/
├── config/              # Strapi 配置
│   ├── admin.js        # Admin 面板配置
│   ├── api.js          # API 配置
│   ├── database.js     # 数据库配置
│   └── server.js       # 服务器配置
├── src/
│   ├── admin/          # Admin 面板定制
│   ├── api/            # API 内容类型
│   ├── components/     # 共享组件
│   └── extensions/     # 扩展
├── database/           # 数据库迁移
├── public/             # 公共资源
├── data/               # 初始数据
└── website/            # BrainCo 官网项目
```

## 🚀 部署

### 使用 PM2 部署（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 构建
pnpm run build

# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs
```

### 使用 Docker 部署

```bash
# 构建镜像
docker build -t brainco-cms .

# 运行容器
docker run -d -p 1337:1337 brainco-cms
```

## 🔍 故障排除

### Node.js 版本问题

如果遇到原生模块编译错误：

```bash
# 重新编译原生模块
pnpm rebuild better-sqlite3
```

### Admin 面板更改未生效

```bash
# 重新构建 admin 面板
pnpm run build

# 清除浏览器缓存
# Chrome/Edge: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)
```

### 数据库问题

```bash
# 删除数据库重新开始
rm -rf .tmp/data.db

# 重启开发服务器
pnpm run develop
```

## 📚 相关资源

- 🌐 [BrainCo 官网](https://www.brainco.tech)
- 📖 [Strapi 文档](https://docs.strapi.io)
- 🎨 [定制说明](./CMS_定制说明.md)
- 🗂️ [官网项目](./website/brainco_website_seo/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

Copyright © 2025 BrainCo. All rights reserved.

---

<div align="center">

**开发团队**: BrainCo 技术团队  
**最后更新**: 2025年10月28日

</div>
