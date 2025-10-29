# 在 Strapi 管理面板中找不到 Page SEO？故障排查指南

如果你在 Strapi 管理面板中看不到 **Page SEO** 内容类型，请按照以下步骤操作。

## ✅ 快速解决方案

### 步骤 1：完全重启 Strapi

新创建的 content type 必须重启 Strapi 才能在管理面板显示。

```bash
# 1. 在运行 Strapi 的终端按 Ctrl+C 完全停止
# 2. 等待进程完全退出
# 3. 重新启动

cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run develop
```

**重要**：确保看到启动成功的消息：
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   Welcome back!                                            │
│   To manage your project 🚀, go to the administration      │
│   panel at: http://localhost:1337/admin                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 步骤 2：强制刷新浏览器

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

或者：
1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

### 步骤 3：检查 Content Manager

1. 访问：http://localhost:1337/admin
2. 点击左侧菜单的 **Content Manager**
3. 在 "COLLECTION TYPES" 部分查找 **Page SEO**

应该看到：
```
COLLECTION TYPES
├── Article
├── Author  
├── Category
├── Global
└── Page SEO  ← 新的内容类型
```

## 🔍 详细故障排查

### 问题 1：重启后仍然看不到

#### 解决方案 A：检查文件完整性

```bash
# 检查目录结构
ls -R /Users/harris/Desktop/BrainCo/brainco_website_cms/src/api/page-seo/

# 应该显示：
# content-types/page-seo/schema.json
# controllers/page-seo.js
# routes/page-seo.js
# services/page-seo.js
```

#### 解决方案 B：验证 schema.json 格式

```bash
# 检查 JSON 格式是否正确
cat /Users/harris/Desktop/BrainCo/brainco_website_cms/src/api/page-seo/content-types/page-seo/schema.json | jq .
```

如果报错，说明 JSON 格式有问题。

#### 解决方案 C：清除 Strapi 缓存

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms

# 删除构建缓存
rm -rf .cache
rm -rf build

# 重新构建
pnpm run build
pnpm run develop
```

### 问题 2：看到 Page SEO 但是空的

这是正常的！因为还没有导入数据。

**下一步：导入 SEO 数据**

1. 创建 API Token（见下方）
2. 运行导入脚本
3. 刷新管理面板即可看到数据

### 问题 3：启动 Strapi 时报错

#### 常见错误 1：端口被占用

```
Error: listen EADDRINUSE: address already in use :::1337
```

**解决方案**：
```bash
# 查找占用 1337 端口的进程
lsof -ti:1337

# 杀死该进程
kill -9 $(lsof -ti:1337)

# 重新启动
pnpm run develop
```

#### 常见错误 2：数据库连接失败

```
Error: Connection to database failed
```

**解决方案**：
1. 检查 `.env` 文件中的数据库配置
2. 确保数据库服务正在运行
3. 检查数据库连接凭据

#### 常见错误 3：Schema 验证失败

```
Error: Invalid schema for page-seo
```

**解决方案**：
```bash
# 重新创建 schema.json
# 从备份恢复或重新创建文件
```

## 📝 创建 API Token 步骤

一旦在管理面板中看到 Page SEO，就可以导入数据了。

### 1. 进入 API Tokens 页面

1. 登录 Strapi：http://localhost:1337/admin
2. 点击左侧菜单 **Settings** (⚙️)
3. 在 GLOBAL SETTINGS 部分，找到 **API Tokens**
4. 点击进入

### 2. 创建新 Token

1. 点击右上角 **Create new API Token** 按钮
2. 填写信息：
   ```
   Name: SEO Import Token
   Description: Token for importing SEO data via script
   Token duration: Unlimited (无限期) 或选择合适时长
   Token type: Full access (完全访问) ← 必须选择这个！
   ```
3. 点击 **Save** 保存

### 3. 复制 Token

⚠️ **重要**：Token 只会显示一次！立即复制保存。

```
Your API Token: abcd1234efgh5678ijkl9012mnop3456qrst7890
                ↑ 复制这个完整的字符串
```

### 4. 设置环境变量

```bash
# 在终端中设置
export STRAPI_API_TOKEN=abcd1234efgh5678ijkl9012mnop3456qrst7890

# 验证是否设置成功
echo $STRAPI_API_TOKEN
```

### 5. 运行导入脚本

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
node scripts/import-seo-data.js
```

应该看到：
```
🚀 BrainCo SEO Data Import Script

📍 Strapi URL: http://localhost:1337
📦 Total pages to import: 18
📊 Total SEO entries: 54 (3 locales per page)

────────────────────────────────────────────────────────────

📝 Processing: about (zh-CN)
   + Creating new entry
   ✅ Created successfully

...

📊 Import Summary:
   Total entries processed: 54
   ✅ Created: 54
   ↻ Updated: 0
   ❌ Failed: 0

✨ Import completed!
```

## 🎯 验证导入成功

### 方法 1：在管理面板查看

1. 进入 **Content Manager** → **Page SEO**
2. 应该看到 54 条记录
3. 点击任意一条查看详情
4. 使用语言切换器（右上角）查看不同语言版本

### 方法 2：通过 API 测试

```bash
# 测试中文版本
curl "http://localhost:1337/api/page-seos/by-name?name=about&locale=zh-CN"

# 测试英文版本  
curl "http://localhost:1337/api/page-seos/by-name?name=about&locale=en-US"

# 测试繁体版本
curl "http://localhost:1337/api/page-seos/by-name?name=about&locale=zh-TW"
```

应该返回完整的 JSON 数据。

## 📸 截图示例

### 正确的显示效果

#### Content Manager 中的 Page SEO
```
Content Manager
├── COLLECTION TYPES
│   ├── Article (10)
│   ├── Author (3)
│   ├── Category (5)
│   ├── Global
│   └── Page SEO (54) ← 应该显示 54 条记录
```

#### Page SEO 列表视图
```
Page SEO (54 entries)

┌────────────────┬─────────────┬────────┬────────────┐
│ Page Name      │ Page Path   │ Locale │ Status     │
├────────────────┼─────────────┼────────┼────────────┤
│ about          │ /about      │ zh-CN  │ Published  │
│ about          │ /about      │ en-US  │ Published  │
│ about          │ /about      │ zh-TW  │ Published  │
│ products       │ /products   │ zh-CN  │ Published  │
│ ...            │ ...         │ ...    │ ...        │
└────────────────┴─────────────┴────────┴────────────┘
```

#### 单条记录详情视图
```
Page SEO Details

Basic Information:
  Page Name: about
  Page Path: /about
  Locale: zh-CN (简体中文)

SEO Content:
  Meta Title: 关于我们 - BrainCo强脑科技 | 全球领先的脑机接口技术公司
  Meta Description: BrainCo强脑科技是全球领先的非侵入式脑机接口技术公司...
  Keywords: BrainCo, 强脑科技, 脑机接口, 关于我们...

Open Graph:
  OG Title: 关于BrainCo - 用脑科学改变世界
  OG Description: 探索BrainCo如何通过创新的脑机接口技术...
  OG Type: website

[Save] [Publish]
```

## 🔧 高级故障排查

### 使用 Strapi 日志调试

```bash
# 启动 Strapi 并显示详细日志
DEBUG=strapi:* pnpm run develop

# 或者只看 API 相关日志
DEBUG=strapi:api:* pnpm run develop
```

### 检查数据库

```bash
# 如果使用 SQLite（开发环境默认）
cd /Users/harris/Desktop/BrainCo/brainco_website_cms

# 查看数据库文件
ls -la .tmp/data.db

# 使用 sqlite3 查询
sqlite3 .tmp/data.db "SELECT name FROM sqlite_master WHERE type='table';"
```

应该看到 `page_seos` 表。

### 重置整个 Strapi

⚠️ **警告**：这会删除所有数据！

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms

# 备份数据库
cp -r .tmp .tmp.backup

# 删除缓存和数据库
rm -rf .cache
rm -rf build  
rm -rf .tmp

# 重新启动（会创建新数据库）
pnpm run develop
```

## 📞 仍然无法解决？

### 收集诊断信息

```bash
# 1. Strapi 版本
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
cat package.json | grep "@strapi/strapi"

# 2. Node 版本
node --version

# 3. pnpm 版本
pnpm --version

# 4. 检查文件权限
ls -la src/api/page-seo/content-types/page-seo/schema.json

# 5. 查看最近的错误日志
tail -100 ~/.strapi/logs/strapi.log
```

### 联系支持

提供以上信息，并说明：
1. 具体的错误信息（截图）
2. 操作步骤
3. Strapi 启动日志
4. 浏览器控制台错误（F12 查看）

## ✅ 成功检查清单

导入完成后，确认以下各项：

- [ ] Strapi 管理面板中能看到 "Page SEO" 内容类型
- [ ] 列表中显示 54 条记录
- [ ] 可以查看和编辑任意一条记录
- [ ] 语言切换器正常工作（zh-CN, en-US, zh-TW）
- [ ] API 端点正常工作
  - [ ] `/api/page-seos/by-name` 返回数据
  - [ ] `/api/page-seos/by-path` 返回数据
- [ ] 所有记录状态为 "Published"

## 🎉 成功后的下一步

1. ✅ 为重要页面上传 OG 图片（1200x630px）
2. ✅ 在 Next.js 中集成 SEO 数据
3. ✅ 测试三种语言版本
4. ✅ 使用 Google 工具验证

---

**最后更新**: 2025年10月29日  
**版本**: v1.0.0  
**维护者**: BrainCo 技术团队

如有问题，请查看其他文档：
- [SEO_DATA_GENERATED.md](./SEO_DATA_GENERATED.md) - 数据生成报告
- [scripts/README_SEO_IMPORT.md](./scripts/README_SEO_IMPORT.md) - 导入指南
- [SEO_QUICKSTART.md](./SEO_QUICKSTART.md) - 快速开始

