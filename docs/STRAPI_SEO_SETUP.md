# Strapi SEO 配置指南

本文档详细说明如何在 Strapi 中配置多语言 SEO 系统。

## 📋 目录

1. [安装和启用国际化](#安装和启用国际化)
2. [配置语言](#配置语言)
3. [SEO 数据结构](#seo-数据结构)
4. [创建页面 SEO 配置](#创建页面-seo-配置)
5. [API 端点说明](#api-端点说明)
6. [测试 API](#测试-api)

## 安装和启用国际化

### 1. 安装 i18n 插件

如果还没有安装，运行：

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm install @strapi/plugin-i18n
```

### 2. 启用插件

在 `config/plugins.js` 中启用（如果还没有启用）：

```javascript
module.exports = {
  i18n: {
    enabled: true,
  },
};
```

### 3. 重启 Strapi

```bash
pnpm run develop
```

## 配置语言

### 1. 进入国际化设置

1. 登录 Strapi 管理面板：http://localhost:1337/admin
2. 进入 **Settings** (设置) → **Internationalization** (国际化)

### 2. 添加语言

默认语言通常是英文 (en)，我们需要添加：

#### 添加简体中文
- **Display name**: 简体中文
- **Locale code**: zh-Hans (或 zh-CN)
- 点击 **Add locale**

#### 添加繁体中文
- **Display name**: 繁體中文
- **Locale code**: zh-Hant (或 zh-TW)
- 点击 **Add locale**

#### 添加英文（如果没有）
- **Display name**: English
- **Locale code**: en (或 en-US)
- 点击 **Add locale**

### 3. 设置默认语言

在语言列表中，找到您想要的默认语言，点击设为默认。

**建议配置**：
- 中国站点：默认使用 zh-CN
- 国际站点：默认使用 en-US

## SEO 数据结构

### 已创建的内容类型

系统已经创建了以下内容类型：

#### 1. SEO 组件 (components/shared/seo.json)

这是一个可重用的 SEO 组件，包含以下字段：

```json
{
  "metaTitle": "页面标题 (10-60字符)",
  "metaDescription": "页面描述 (50-160字符)",
  "keywords": "关键词，逗号分隔",
  "metaRobots": "index,follow",
  "canonicalURL": "规范链接",
  "ogTitle": "Open Graph 标题",
  "ogDescription": "Open Graph 描述",
  "ogImage": "Open Graph 图片",
  "ogType": "website/article/product",
  "twitterCard": "summary_large_image",
  "twitterTitle": "Twitter 标题",
  "twitterDescription": "Twitter 描述",
  "twitterImage": "Twitter 图片",
  "structuredData": "JSON 格式的结构化数据"
}
```

#### 2. 页面 SEO 配置 (api/page-seo)

这是一个集合类型，用于管理所有页面的 SEO 配置。

**特点**：
- ✅ 支持国际化（i18n）
- ✅ 支持草稿和发布状态
- ✅ 包含完整的 TDK 和社交媒体字段
- ✅ 支持结构化数据（JSON-LD）

## 创建页面 SEO 配置

### 步骤 1: 进入内容管理

1. 进入 **Content Manager**
2. 在左侧菜单找到 **页面SEO配置** (Page SEO)
3. 点击 **Create new entry**

### 步骤 2: 填写基本信息

#### 页面名称 (Page Name)
- 用于识别页面的内部名称
- 例如：`home`, `products`, `about`, `contact`
- **注意**：这个字段不会国际化（所有语言版本共享）

#### 页面路径 (Page Path)
- 页面的 URL 路径
- 例如：`/`, `/products`, `/about`, `/contact`
- **注意**：根据语言不同，可能需要不同的路径

#### 语言 (Locale)
- 选择当前配置的语言：zh-CN, en-US 或 zh-TW

### 步骤 3: 配置 TDK（Title, Description, Keywords）

#### Meta Title（标题）
- **字符限制**：10-60字符
- **最佳实践**：
  - 包含核心关键词
  - 简洁明了
  - 包含品牌名
- **示例**：
  - 中文：`BrainCo - 脑机接口技术领导者`
  - 英文：`BrainCo - Brain-Computer Interface Technology Leader`
  - 繁体：`BrainCo - 腦機接口技術領導者`

#### Meta Description（描述）
- **字符限制**：50-160字符
- **最佳实践**：
  - 准确描述页面内容
  - 吸引用户点击
  - 包含关键词但不堆砌
- **示例**：
  - 中文：`BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。探索我们的智能头环、专注力训练系统等产品。`
  - 英文：`BrainCo develops advanced brain-computer interface technology, providing innovative solutions for education and health. Explore our smart headbands and focus training systems.`

#### Keywords（关键词）
- **格式**：用逗号分隔
- **建议**：3-5个核心关键词
- **示例**：
  - 中文：`BrainCo, 脑机接口, 脑电波, 专注力, 教育科技, 健康科技`
  - 英文：`BrainCo, brain-computer interface, EEG, focus, education technology, health tech`

### 步骤 4: 配置高级 SEO

#### Meta Robots
- **默认值**：`index,follow`
- **其他选项**：
  - `noindex,follow` - 不索引但跟踪链接
  - `index,nofollow` - 索引但不跟踪链接
  - `noindex,nofollow` - 不索引也不跟踪

#### Canonical URL（规范链接）
- **用途**：指定页面的首选版本，避免重复内容
- **示例**：
  - 中文：`https://www.brainco.cn/zh-CN/products`
  - 英文：`https://www.brainco.tech/en-US/products`
  - 繁体：`https://www.brainco.cn/zh-TW/products`

### 步骤 5: 配置 Open Graph（社交媒体分享）

#### OG Title
- **建议**：可以与 Meta Title 相同，或更吸引人
- **示例**：`BrainCo - 用科技改变教育的未来`

#### OG Description
- **建议**：可以与 Meta Description 相同
- **字符限制**：最多 160 字符

#### OG Image（分享图片）
- **推荐尺寸**：1200x630px
- **格式**：JPG 或 PNG
- **大小**：< 5MB
- **上传方式**：
  1. 点击 **Add a file**
  2. 选择或上传图片
  3. 添加 Alternative Text（替代文本）

#### OG Type（类型）
- **website** - 普通网站页面（默认）
- **article** - 文章/博客
- **product** - 产品页面

### 步骤 6: 配置 Twitter Card

#### Twitter Card Type
- **summary_large_image** - 大图卡片（推荐）
- **summary** - 小图卡片
- **app** - 应用卡片
- **player** - 播放器卡片

#### Twitter Title / Description / Image
- 可以留空，会自动使用 OG 数据
- 如果需要 Twitter 特定的内容，可以单独设置

### 步骤 7: 配置结构化数据（Schema.org）

结构化数据使用 JSON-LD 格式，帮助搜索引擎更好地理解页面内容。

#### 网站首页示例

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BrainCo",
  "url": "https://www.brainco.cn",
  "logo": "https://www.brainco.cn/logo.png",
  "description": "脑机接口技术领导者",
  "sameAs": [
    "https://www.facebook.com/brainco",
    "https://twitter.com/brainco",
    "https://www.linkedin.com/company/brainco"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": "+86-400-xxx-xxxx",
    "email": "support@brainco.cn"
  }
}
```

#### 产品页面示例

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Focus Zen",
  "description": "智能专注力训练头环，提升学习和工作效率",
  "brand": {
    "@type": "Brand",
    "name": "BrainCo"
  },
  "image": [
    "https://www.brainco.cn/images/focuszen-1.jpg",
    "https://www.brainco.cn/images/focuszen-2.jpg"
  ],
  "offers": {
    "@type": "Offer",
    "price": "1299",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock",
    "url": "https://www.brainco.cn/products/focuszen",
    "seller": {
      "@type": "Organization",
      "name": "BrainCo"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "256"
  }
}
```

#### 文章页面示例

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "文章标题",
  "description": "文章摘要",
  "image": "https://www.brainco.cn/images/article.jpg",
  "datePublished": "2025-10-29T08:00:00Z",
  "dateModified": "2025-10-29T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "作者姓名"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BrainCo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.brainco.cn/logo.png"
    }
  }
}
```

### 步骤 8: 保存并发布

1. 点击右上角 **Save** 保存草稿
2. 检查所有内容无误后，点击 **Publish** 发布

### 步骤 9: 创建其他语言版本

1. 保存第一个语言版本后（如 zh-CN）
2. 点击右上角的语言选择器
3. 选择目标语言（如 en-US）
4. 点击 **Create new locale**
5. 填写该语言的所有内容
6. 保存并发布

**重要提示**：
- 每种语言都需要独立创建和发布
- 不要使用机器翻译，确保内容质量
- 所有语言版本的 `pageName` 应该相同
- `pagePath` 根据需要可以相同或不同

## API 端点说明

系统提供了以下 API 端点：

### 1. 标准 REST API

```
GET /api/page-seos
GET /api/page-seos/:id
POST /api/page-seos
PUT /api/page-seos/:id
DELETE /api/page-seos/:id
```

**权限**：需要认证（默认）

### 2. 自定义端点：根据路径获取

```
GET /api/page-seos/by-path?path=/products&locale=zh-CN
```

**参数**：
- `path` (必需): 页面路径，如 `/products`
- `locale` (可选): 语言代码，默认 `zh-CN`

**返回**：单个 SEO 配置对象

**权限**：公开访问（无需认证）

### 3. 自定义端点：根据名称获取

```
GET /api/page-seos/by-name?name=home&locale=zh-CN
```

**参数**：
- `name` (必需): 页面名称，如 `home`
- `locale` (可选): 语言代码，默认 `zh-CN`

**返回**：单个 SEO 配置对象

**权限**：公开访问（无需认证）

## 测试 API

### 1. 启动 Strapi

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run develop
```

### 2. 创建测试数据

在 Strapi 管理面板中创建一个测试页面：

- **Page Name**: `home`
- **Page Path**: `/`
- **Locale**: `zh-CN`
- **Meta Title**: `测试首页`
- **Meta Description**: `这是一个测试首页的描述，用于验证 SEO 配置是否正常工作。`
- 其他字段根据需要填写
- **保存并发布**

### 3. 测试 API 端点

#### 使用 curl 测试

```bash
# 根据路径获取
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=zh-CN"

# 根据名称获取
curl "http://localhost:1337/api/page-seos/by-name?name=home&locale=zh-CN"
```

#### 使用浏览器测试

直接在浏览器中访问：
```
http://localhost:1337/api/page-seos/by-path?path=/&locale=zh-CN
```

#### 预期返回结果

```json
{
  "id": 1,
  "pageName": "home",
  "pagePath": "/",
  "locale": "zh-CN",
  "metaTitle": "测试首页",
  "metaDescription": "这是一个测试首页的描述，用于验证 SEO 配置是否正常工作。",
  "keywords": "测试, 首页, SEO",
  "metaRobots": "index,follow",
  "canonicalURL": "https://www.brainco.cn/",
  "ogTitle": "测试首页",
  "ogDescription": "这是一个测试首页的描述",
  "ogImage": {
    "id": 1,
    "name": "home-og.jpg",
    "url": "/uploads/home-og.jpg",
    "width": 1200,
    "height": 630
  },
  "ogType": "website",
  "twitterCard": "summary_large_image",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BrainCo"
  },
  "createdAt": "2025-10-29T08:00:00.000Z",
  "updatedAt": "2025-10-29T08:00:00.000Z",
  "publishedAt": "2025-10-29T08:00:00.000Z"
}
```

### 4. 测试多语言

创建英文版本：

1. 在刚才创建的 zh-CN 版本页面
2. 点击右上角语言选择器，选择 en-US
3. 点击 "Create new locale"
4. 填写英文内容并发布

测试英文版本：
```bash
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=en-US"
```

## 配置 API 权限

默认情况下，自定义端点是公开访问的。如果需要修改权限：

1. 进入 **Settings** → **Users & Permissions Plugin** → **Roles**
2. 选择 **Public** 角色
3. 找到 **Page-seo** 权限
4. 勾选需要公开的操作：
   - `find` - 列表查询
   - `findOne` - 单个查询
   - `findByPath` - 根据路径查询
   - `findByName` - 根据名称查询
5. 保存更改

## 批量导入示例数据

如果需要批量导入 SEO 配置，可以创建一个脚本：

```javascript
// scripts/import-seo.js
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'your-api-token'; // 在 Settings > API Tokens 中创建

const pages = [
  {
    pageName: 'home',
    pagePath: '/',
    locale: 'zh-CN',
    metaTitle: 'BrainCo - 脑机接口技术领导者',
    metaDescription: 'BrainCo 致力于研发脑机接口技术...',
    keywords: 'BrainCo, 脑机接口, 脑电波',
    metaRobots: 'index,follow',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  {
    pageName: 'products',
    pagePath: '/products',
    locale: 'zh-CN',
    metaTitle: '产品中心 - BrainCo',
    metaDescription: '探索 BrainCo 的创新产品...',
    keywords: '产品, 智能头环, 专注力',
    metaRobots: 'index,follow',
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },
  // 更多页面...
];

async function importSEO() {
  for (const page of pages) {
    try {
      const response = await axios.post(
        `${STRAPI_URL}/api/page-seos`,
        { data: page },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`✅ 已导入: ${page.pageName} (${page.locale})`);
    } catch (error) {
      console.error(`❌ 导入失败: ${page.pageName}`, error.response?.data);
    }
  }
}

importSEO();
```

运行脚本：
```bash
node scripts/import-seo.js
```

## 常见页面的 SEO 配置建议

### 1. 首页 (/)
- **Focus**: 品牌介绍、核心产品
- **OG Type**: website
- **Structured Data**: Organization + WebSite

### 2. 产品列表页 (/products)
- **Focus**: 产品概览
- **OG Type**: website
- **Structured Data**: ItemList

### 3. 产品详情页 (/products/:slug)
- **Focus**: 单个产品介绍
- **OG Type**: product
- **Structured Data**: Product

### 4. 关于我们 (/about)
- **Focus**: 公司信息
- **OG Type**: website
- **Structured Data**: Organization

### 5. 联系我们 (/contact)
- **Focus**: 联系方式
- **OG Type**: website
- **Structured Data**: ContactPage

### 6. 新闻/博客列表 (/news)
- **Focus**: 文章列表
- **OG Type**: website
- **Structured Data**: ItemList

### 7. 新闻/博客详情 (/news/:slug)
- **Focus**: 单篇文章
- **OG Type**: article
- **Structured Data**: Article

## 监控和维护

### 定期检查

1. **每月检查**：
   - 所有页面的 SEO 数据是否完整
   - Meta Description 是否在 160 字符以内
   - 图片链接是否有效

2. **每季度检查**：
   - 关键词是否需要更新
   - 结构化数据是否符合最新标准
   - 使用 Google Search Console 查看表现

### 使用工具验证

- **Google Search Console**: 监控搜索表现
- **Google Rich Results Test**: 验证结构化数据
- **Meta Tags Debugger**: 验证 OG 标签
- **Twitter Card Validator**: 验证 Twitter Card

## 故障排查

### 问题：API 返回 404

**解决方案**：
1. 检查 Strapi 是否正常运行
2. 确认路由文件已正确创建
3. 重启 Strapi: `pnpm run develop`

### 问题：找不到 SEO 数据

**解决方案**：
1. 确认数据已发布（不是草稿状态）
2. 检查 `pagePath` 或 `pageName` 是否匹配
3. 检查 `locale` 参数是否正确

### 问题：图片 URL 不正确

**解决方案**：
1. 确保图片已上传到 Strapi
2. 检查环境变量 `NEXT_PUBLIC_STRAPI_URL`
3. 使用完整的图片 URL

### 问题：结构化数据验证失败

**解决方案**：
1. 使用 Google Rich Results Test 验证
2. 检查 JSON 格式是否正确
3. 确保所有必需字段都已填写
4. 参考 Schema.org 文档

## 下一步

1. ✅ 配置所有主要页面的 SEO
2. ✅ 为每个页面创建三种语言版本
3. ✅ 在 Next.js 中集成 SEO 数据
4. ✅ 使用 Google 工具验证配置
5. ✅ 监控搜索引擎表现

---

**最后更新**: 2025年10月29日  
**版本**: v2.0.0  
**维护者**: BrainCo 技术团队



