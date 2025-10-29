# 导入 SEO 数据到 PostgreSQL 指南

## ✅ 已完成
- ✅ 切换到 PostgreSQL 数据库
- ✅ Strapi 正在运行

## 🚀 导入方法（选择其一）

### 方法一：直接导入（推荐，无需 API Token）

这种方法直接使用 Strapi 内部 API，无需创建 Token。

1. **停止 Strapi**（如果正在运行）
   ```bash
   # 找到 Strapi 进程
   ps aux | grep strapi
   # 或者如果在终端运行，按 Ctrl+C 停止
   ```

2. **运行直接导入脚本**
   ```bash
   cd /Users/harris/Desktop/BrainCo/brainco_website_cms
   node scripts/import-seo-direct.js
   ```

3. **重新启动 Strapi**
   ```bash
   pnpm dev
   ```

### 方法二：API 导入（需要 API Token）

如果 Strapi 正在运行，不想停止，可以使用这种方法。

## 📋 方法二的步骤

### 步骤 1: 创建 API Token

1. 访问 Strapi 管理面板：http://localhost:1337/admin
2. 登录（如果是第一次，需要先创建管理员账户）
3. 导航到：**Settings** → **API Tokens** → **Create new API Token**
4. 填写以下信息：
   - **Name**: SEO Import
   - **Token duration**: 无限期
   - **Token type**: **Full access**（重要！）
5. 点击 **Save**
6. **立即复制生成的 Token**（只显示一次！）

### 步骤 2: 运行导入脚本

在终端中执行以下命令（将 `YOUR_TOKEN_HERE` 替换为刚才复制的 Token）：

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms

# 设置 API Token
export STRAPI_API_TOKEN=YOUR_TOKEN_HERE

# 运行导入脚本
node scripts/import-seo-data.js
```

### 步骤 3: 验证导入结果

导入成功后，您应该看到：

```
📊 Import Summary:
   Total entries processed: 54
   ✅ Created: 54
   ✅ Updated: 0
   ❌ Failed: 0
✨ Import completed!
```

然后在 Strapi 管理面板中：
- 进入 **Content Manager** → **Page SEO**
- 应该看到 54 条 SEO 配置（18个页面 × 3种语言）

## 📊 将要导入的数据

- **页面总数**: 18 个
- **语言版本**: 3 种（简体中文、英文、繁体中文）
- **SEO 条目**: 54 条

包括的页面：
- 公司页面：关于我们、公司介绍、联系我们、技术介绍
- 产品页面：BrainRobotics、Mobius、Revo1、Revo2
- 健康产品：EaSleep、Focus Zen、Focus Xin、Oxyzen、StarKids
- 教育产品：Brain AI
- 其他：新闻、招聘等

## 🔧 故障排除

### 问题：找不到 API Tokens 选项
**解决**：确保您是管理员账户登录

### 问题：权限被拒绝
**解决**：确保 Token 类型选择了 "Full access"

### 问题：部分数据导入失败
**解决**：查看错误信息，可能需要调整 JSON 数据格式

## 📝 快速命令参考

```bash
# 一行命令完成导入（替换 TOKEN）
cd /Users/harris/Desktop/BrainCo/brainco_website_cms && STRAPI_API_TOKEN=YOUR_TOKEN_HERE node scripts/import-seo-data.js
```

