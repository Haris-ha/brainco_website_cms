# 新闻模块SEO配置指南

本指南将帮助您完成新闻模块的设置，包括数据导入、SEO配置和国际化支持。

## 📋 前置条件

1. Strapi CMS 已启动并运行
2. 已配置国际化插件（支持简体中文和英文）
3. Node.js 环境已安装

## 🚀 快速开始

### 步骤 1: 启动 CMS

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run develop
```

CMS 将在 `http://localhost:1337` 启动。

### 步骤 2: 导入新闻数据

运行导入脚本将 `data/new.json` 中的新闻数据导入到 CMS：

```bash
node scripts/import-news-data.js
```

**注意事项：**
- 脚本会自动创建简体中文版本的新闻
- 英文版本会使用 `data/news-titles-en.json` 中的英文标题翻译
- 已包含122条英文标题翻译
- 未翻译的新闻会使用中文标题作为 fallback
- 导入后需要在 CMS 后台手动发布（Publish）新闻
- 原始数据中的 `deleted=true` 的新闻不会被导入

**关于原始数据字段：**
- `created`/`updated`: 不会导入，Strapi 会自动生成 `createdAt`/`updatedAt`
- `createdBy`/`updatedBy`: 不会导入，Strapi 会关联当前导入用户
- `deleted`: 标记为已删除的数据会被跳过

### 步骤 3: 发布新闻

1. 登录 CMS 后台：`http://localhost:1337/admin`
2. 进入 **Content Manager** → **News**
3. 选择要发布的新闻条目
4. 点击右上角的 **Publish** 按钮
5. 可以批量选择多条新闻进行发布

### 步骤 4: 配置新闻列表页 SEO

#### 4.1 创建简体中文版 SEO 配置

1. 进入 **Content Manager** → **Page SEO**
2. 点击 **Create new entry**
3. 填写以下信息：

**基础信息：**
- **Page Name**: `News`
- **Page Path**: `/news`
- **Locale**: `简体中文 (zh-Hans)`

**元数据：**
- **Meta Title**: `企业新闻 - BrainCo强脑科技 | 脑机接口行业资讯`（60字符以内）
- **Meta Description**: `BrainCo强脑科技企业新闻中心，了解最新脑机接口技术动态、智能仿生手产品发布、公司活动报道及行业资讯。探索科技如何改善生活，助力残障人士重获新生。`（160字符以内）
- **Keywords**: `BrainCo新闻,强脑科技,脑机接口新闻,智能仿生手,企业动态,科技资讯`

**Open Graph（社交分享）：**
- **OG Title**: `BrainCo企业新闻 | 脑机接口技术资讯`
- **OG Description**: `BrainCo最新新闻动态、产品发布和活动报道`
- **OG Type**: `website`
- **OG Image**: 上传新闻页面的分享图片

**Twitter Card：**
- **Twitter Card**: `summary_large_image`
- **Twitter Title**: 同 OG Title
- **Twitter Description**: 同 OG Description
- **Twitter Image**: 同 OG Image

**SEO 设置：**
- **Meta Robots**: `index,follow`
- **X-Robots-Tag**: `index, follow`
- **Canonical URL**: `https://www.brainco.cn/news`

**结构化数据（Structured Data）：**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "BrainCo企业新闻",
  "description": "BrainCo最新新闻动态、产品发布和活动报道",
  "url": "https://www.brainco.cn/news",
  "inLanguage": "zh-CN",
  "publisher": {
    "@type": "Organization",
    "name": "BrainCo强脑科技",
    "url": "https://www.brainco.cn",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.brainco.cn/logo.webp"
    }
  },
  "about": {
    "@type": "Thing",
    "name": "脑机接口技术",
    "description": "脑机接口技术在医疗健康、教育和人机交互领域的应用"
  }
}
```

4. 点击 **Save** 保存
5. 点击 **Publish** 发布

#### 4.2 创建英文版 SEO 配置

1. 在已创建的简体中文 SEO 配置页面
2. 点击右上角的 **Create new locale** 按钮
3. 选择 **English (en)**
4. 填写英文版信息：

**基础信息：**
- **Page Path**: `/news`

**元数据：**
- **Meta Title**: `News - BrainCo | Brain-Computer Interface Technology Updates`
- **Meta Description**: `BrainCo news center: Stay updated with the latest brain-computer interface technology, intelligent bionic hand product launches, company activities, and industry insights.`
- **Keywords**: `BrainCo news,brain-computer interface,BCI technology,intelligent prosthetics,company updates`

**Open Graph：**
- **OG Title**: `BrainCo News | BCI Technology Updates`
- **OG Description**: `Latest news, product launches, and activities from BrainCo`

**Twitter Card：**
- **Twitter Title**: 同 OG Title
- **Twitter Description**: 同 OG Description

**Canonical URL**: `https://www.brainco.cn/en/news`

**结构化数据：**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "BrainCo News",
  "description": "Latest news, product launches, and activities from BrainCo",
  "url": "https://www.brainco.cn/en/news",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.brainco.cn/logo.webp"
    }
  },
  "about": {
    "@type": "Thing",
    "name": "Brain-Computer Interface Technology",
    "description": "BCI technology applications in healthcare, education, and human-computer interaction"
  }
}
```

5. 点击 **Save** 保存
6. 点击 **Publish** 发布

### 步骤 5: 检查和更新新闻英文标题（可选）

导入脚本已自动导入了122条英文标题翻译（来自 `data/news-titles-en.json`），您可以：

**检查英文标题：**
1. 进入 **Content Manager** → **News**
2. 选择一条新闻，点击进入编辑
3. 在右上角切换语言到 **English (en)**
4. 查看 **Title** 是否为英文标题

**手动更新（如需要）：**
1. 在英文版本页面更新 **Title**
2. 点击 **Save** 保存
3. 点击 **Publish** 发布

**英文标题翻译情况：**
- ✅ 已包含122条英文标题翻译
- 📋 翻译文件位置：`data/news-titles-en.json`
- 🔄 如需添加或修改翻译，可编辑此文件后重新导入

**提示：** 如果某些新闻没有英文标题，前端会自动使用中文版本作为 fallback。

## 🔍 验证 SEO 配置

### 1. 检查结构化数据

使用 Google Rich Results Test 工具验证：
```
https://search.google.com/test/rich-results
```

输入网站新闻页面 URL：`https://www.brainco.cn/news`

### 2. 检查页面元数据

在浏览器中访问新闻页面，右键查看源代码，确认：
- `<title>` 标签内容正确
- `<meta name="description">` 内容正确
- Open Graph 标签存在（`og:title`, `og:description`, `og:image`）
- Twitter Card 标签存在
- 结构化数据 JSON-LD 存在

### 3. 检查多语言支持

访问不同语言版本：
- 简体中文：`https://www.brainco.cn/news`
- 英文：`https://www.brainco.cn/en/news`

确认标题和新闻内容正确显示。

## 📊 数据字段说明

### News 内容类型字段

| 字段名 | 类型 | 国际化 | 必填 | 说明 |
|--------|------|--------|------|------|
| title | String | ✅ | ✅ | 新闻标题 |
| newsDate | DateTime | ❌ | ✅ | 新闻发布日期 |
| coverImage | String | ❌ | ✅ | 封面图片 URL |
| externalUrl | String | ❌ | ✅ | 外部链接（通常指向微信文章）|
| isHot | Boolean | ❌ | ❌ | 是否为热门新闻 |
| sortIndex | Integer | ❌ | ✅ | 排序索引（越小越靠前）|
| sourceId | Integer | ❌ | ❌ | 原始数据 ID（用于追溯）|

### 国际化策略

- ✅ **国际化字段**: `title` - 支持多语言版本
- ❌ **共用字段**: 其他字段在所有语言版本中共用

## 🎯 SEO 优化要点

### 1. 新闻列表页优化

- ✅ 完整的 TDK 配置
- ✅ CollectionPage 类型的结构化数据
- ✅ 每条新闻配置 NewsArticle 结构化数据
- ✅ 多语言 hreflang 标签
- ✅ Canonical URL 设置

### 2. 外部链接优化

- ✅ 使用 `rel="noopener noreferrer"` 属性
- ✅ 在微信文章中添加返回官网链接
- ✅ 定期更新 sitemap.xml

### 3. 内容聚合建议（后续扩展）

- 按分类聚合新闻（脑机研究、产品发布、活动报道）
- 为每个聚合页配置独立 SEO
- 构建主题相关的 Pillar 页面

## 🛠️ 常见问题

### Q1: 导入数据后在前端看不到新闻？

**A**: 请确认以下几点：
1. 新闻已在 CMS 后台发布（Publish）
2. Strapi CMS 正在运行
3. 环境变量 `NEXT_PUBLIC_CMS_API_URL` 配置正确
4. 清除浏览器缓存并刷新页面

### Q2: 英文页面显示中文标题？

**A**: 这是正常的 fallback 行为。如果没有配置英文标题，系统会使用中文标题。建议在 CMS 后台手动更新英文标题。

### Q3: 热门新闻不显示？

**A**: 请确认：
1. 新闻的 `isHot` 字段设置为 `true`
2. 新闻已发布
3. `sortIndex` 设置正确（数值越小越靠前）

### Q4: 如何修改新闻排序？

**A**: 在 CMS 后台编辑新闻条目，修改 `sortIndex` 字段的值。数值越小，排序越靠前。

### Q5: 结构化数据验证失败？

**A**: 
1. 使用 Google Rich Results Test 工具检查具体错误
2. 确认 JSON 格式正确（可使用 JSON validator）
3. 确认必填字段都已填写
4. 图片 URL 必须是完整的 HTTPS 地址

## 📚 相关文档

- [SEO 实施清单](./SEO_IMPLEMENTATION_CHECKLIST.md)
- [国际化配置说明](./国际化配置说明.md)
- [SEO 架构设计](./SEO_ARCHITECTURE.md)
- [Page SEO 实施总结](./SCHEMA_SEO_IMPLEMENTATION_SUMMARY.md)

## 📝 更新日志

- **2025-11-01**: 初始版本，完成新闻模块 SEO 配置指南

---

**维护者**: BrainCo 技术团队  
**最后更新**: 2025年11月1日

