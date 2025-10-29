# BrainCo 多语言 SEO 快速入门指南

本指南将帮助你快速配置和使用 BrainCo 网站的多语言动态 SEO 系统。

## 📋 目录

1. [系统概述](#系统概述)
2. [5分钟快速开始](#5分钟快速开始)
3. [完整配置流程](#完整配置流程)
4. [相关文档](#相关文档)

## 系统概述

### 功能特性

✅ **完整的 TDK 支持**
- Title (标题)
- Description (描述)
- Keywords (关键词)

✅ **多语言支持**
- 简体中文 (zh-CN)
- 英文 (en-US)
- 繁体中文 (zh-TW)

✅ **社交媒体优化**
- Open Graph (Facebook, LinkedIn)
- Twitter Card

✅ **结构化数据**
- Schema.org JSON-LD
- 多种内容类型支持

✅ **SEO 最佳实践**
- 规范链接 (Canonical URL)
- Meta Robots
- Hreflang 标签

## 5分钟快速开始

### 第一步: 启动 Strapi

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run develop
```

Strapi 将在 http://localhost:1337 启动。

### 第二步: 登录管理面板

访问 http://localhost:1337/admin 并登录。

### 第三步: 创建第一个 SEO 配置

1. 进入 **Content Manager** → **页面SEO配置**
2. 点击 **Create new entry**
3. 填写以下信息：

```
页面名称: home
页面路径: /
语言: zh-CN
Meta Title: BrainCo - 脑机接口技术领导者
Meta Description: BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。
Keywords: BrainCo, 脑机接口, 脑电波, 专注力
Meta Robots: index,follow
OG Type: website
Twitter Card: summary_large_image
```

4. 点击 **Save** 然后 **Publish**

### 第四步: 在 Next.js 中使用

在你的 Next.js 页面中（如 `app/[locale]/(home)/page.tsx`）：

```typescript
import type { Metadata } from 'next';
import { fetchPageSEOByName, transformSEOToMetadata } from '@/libs/seo';

export async function generateMetadata(props): Promise<Metadata> {
  const { locale } = await props.params;
  
  // 从 Strapi 获取 SEO 配置
  const seoData = await fetchPageSEOByName(
    'home', 
    locale as 'zh-CN' | 'en-US' | 'zh-TW'
  );
  
  // 转换为 Next.js Metadata
  if (seoData) {
    return transformSEOToMetadata(
      seoData, 
      'https://www.brainco.cn', 
      'BrainCo'
    );
  }
  
  // 默认配置
  return {
    title: 'BrainCo',
    description: '脑机接口技术领导者',
  };
}
```

### 第五步: 验证

启动 Next.js 开发服务器：

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms/website/brainco_website_seo
pnpm dev
```

访问 http://localhost:3000/zh-CN，查看页面源代码，验证 SEO 标签是否正确。

## 完整配置流程

### 1. Strapi 配置

#### 1.1 配置国际化

1. 进入 **Settings** → **Internationalization**
2. 确保已添加以下语言：
   - zh-CN (简体中文)
   - en-US (英文)
   - zh-TW (繁体中文)
3. 设置默认语言为 zh-CN

#### 1.2 创建所有页面的 SEO 配置

为以下页面创建 SEO 配置：

| 页面名称 | 页面路径 | 说明 |
|---------|---------|------|
| `home` | `/` | 首页 |
| `products` | `/products` | 产品列表 |
| `about` | `/about` | 关于我们 |
| `contact` | `/contact` | 联系我们 |
| `news` | `/news` | 新闻列表 |
| `technology` | `/technology` | 技术介绍 |

每个页面需要创建 **三个语言版本**：zh-CN, en-US, zh-TW

### 2. Next.js 配置

#### 2.1 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL_CN=https://www.brainco.cn
NEXT_PUBLIC_SITE_URL_US=https://www.brainco.tech
NEXT_PUBLIC_SITE_NAME=BrainCo
```

详细配置见 [ENV_CONFIG.md](./website/brainco_website_seo/ENV_CONFIG.md)

#### 2.2 更新页面组件

为每个页面添加 `generateMetadata` 函数：

**示例：产品列表页**

```typescript
// app/[locale]/(marketing)/products/page.tsx
import type { Metadata } from 'next';
import { fetchPageSEO, transformSEOToMetadata, getDefaultMetadata } from '@/libs/seo';
import { StructuredData } from '@/components/seo/StructuredData';
import { structuredDataTemplates } from '@/libs/seo';

export async function generateMetadata(props): Promise<Metadata> {
  const { locale } = await props.params;
  const seoData = await fetchPageSEO('/products', locale as 'zh-CN' | 'en-US' | 'zh-TW');
  
  if (seoData) {
    return transformSEOToMetadata(seoData, 'https://www.brainco.cn', 'BrainCo');
  }
  
  return getDefaultMetadata(
    '产品中心 - BrainCo',
    'BrainCo 产品介绍',
    '/products',
    locale,
    'https://www.brainco.cn'
  );
}

export default async function ProductsPage(props) {
  const { locale } = await props.params;
  const seoData = await fetchPageSEO('/products', locale);
  
  // 生成结构化数据
  const structuredData = seoData?.structuredData || 
    structuredDataTemplates.website('BrainCo', 'https://www.brainco.cn', '脑机接口技术');
  
  return (
    <>
      <StructuredData data={structuredData} />
      <main>
        {/* 页面内容 */}
      </main>
    </>
  );
}
```

### 3. 测试和验证

#### 3.1 测试 API 端点

```bash
# 测试中文
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=zh-CN"

# 测试英文
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=en-US"

# 测试繁体
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=zh-TW"
```

#### 3.2 验证页面 SEO

1. 启动 Next.js: `pnpm dev`
2. 访问页面：
   - http://localhost:3000/zh-CN
   - http://localhost:3000/en-US
   - http://localhost:3000/zh-TW
3. 右键查看页面源代码
4. 检查 `<head>` 标签中的 SEO 元素

#### 3.3 使用工具验证

**Google 富媒体测试**
- 访问: https://search.google.com/test/rich-results
- 输入页面 URL 或粘贴 HTML
- 检查结构化数据是否正确

**Meta Tags 调试器**
- 访问: https://metatags.io
- 输入页面 URL
- 查看 OG 和 Twitter Card 预览

**Twitter Card 验证**
- 访问: https://cards-dev.twitter.com/validator
- 输入页面 URL
- 查看 Twitter Card 预览

### 4. 部署

#### 4.1 部署 Strapi

```bash
# 构建 Strapi
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run build
pnpm start
```

#### 4.2 部署 Next.js

```bash
# 构建 Next.js
cd /Users/harris/Desktop/BrainCo/brainco_website_cms/website/brainco_website_seo
pnpm run build
pnpm start
```

或使用 Vercel 一键部署。

## 常用命令速查

### Strapi

```bash
# 开发模式
pnpm run develop

# 构建
pnpm run build

# 生产模式
pnpm start
```

### Next.js

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 生产预览
pnpm start

# 检查环境变量
pnpm run check-env
```

## 批量创建 SEO 配置

使用脚本批量创建页面的 SEO 配置：

```javascript
// scripts/create-seo-configs.js
const pages = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'news', path: '/news' },
  { name: 'technology', path: '/technology' },
];

const locales = ['zh-CN', 'en-US', 'zh-TW'];

const seoContent = {
  'zh-CN': {
    home: {
      title: 'BrainCo - 脑机接口技术领导者',
      description: 'BrainCo 致力于研发先进的脑机接口技术...',
      keywords: 'BrainCo, 脑机接口, 脑电波',
    },
    products: {
      title: '产品中心 - BrainCo',
      description: '探索 BrainCo 的创新产品...',
      keywords: '产品, 智能头环, 专注力',
    },
    // ... 其他页面
  },
  'en-US': {
    home: {
      title: 'BrainCo - Brain-Computer Interface Leader',
      description: 'BrainCo develops advanced brain-computer interface technology...',
      keywords: 'BrainCo, brain-computer interface, EEG',
    },
    products: {
      title: 'Products - BrainCo',
      description: 'Explore BrainCo innovative products...',
      keywords: 'products, smart headband, focus',
    },
    // ... 其他页面
  },
  'zh-TW': {
    home: {
      title: 'BrainCo - 腦機接口技術領導者',
      description: 'BrainCo 致力於研發先進的腦機接口技術...',
      keywords: 'BrainCo, 腦機接口, 腦電波',
    },
    products: {
      title: '產品中心 - BrainCo',
      description: '探索 BrainCo 的創新產品...',
      keywords: '產品, 智能頭環, 專注力',
    },
    // ... 其他页面
  },
};

// 实现批量创建逻辑...
```

详细实现见 [STRAPI_SEO_SETUP.md](./STRAPI_SEO_SETUP.md#批量导入示例数据)

## 页面 SEO 配置模板

### 首页 SEO

```json
{
  "pageName": "home",
  "pagePath": "/",
  "locale": "zh-CN",
  "metaTitle": "BrainCo - 脑机接口技术领导者，智能教育与健康科技创新者",
  "metaDescription": "BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。我们的产品包括智能头环、专注力训练系统等。",
  "keywords": "BrainCo, 脑机接口, 脑电波, 专注力, 教育科技, 健康科技",
  "metaRobots": "index,follow",
  "canonicalURL": "https://www.brainco.cn/",
  "ogType": "website",
  "twitterCard": "summary_large_image",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn",
    "logo": "https://www.brainco.cn/logo.png",
    "description": "脑机接口技术领导者"
  }
}
```

### 产品页 SEO

```json
{
  "pageName": "products",
  "pagePath": "/products",
  "locale": "zh-CN",
  "metaTitle": "产品中心 - BrainCo 智能脑机接口产品",
  "metaDescription": "探索 BrainCo 的创新产品，包括 Focus Zen 专注力训练头环、EaS专注力训练系统等，帮助提升学习和工作效率。",
  "keywords": "智能头环, 专注力训练, 脑电波产品, Focus Zen",
  "metaRobots": "index,follow",
  "canonicalURL": "https://www.brainco.cn/products",
  "ogType": "website",
  "twitterCard": "summary_large_image"
}
```

### 文章页 SEO

```json
{
  "pageName": "news",
  "pagePath": "/news",
  "locale": "zh-CN",
  "metaTitle": "新闻资讯 - BrainCo 最新动态",
  "metaDescription": "了解 BrainCo 的最新新闻、产品发布、研究成果和行业动态。",
  "keywords": "BrainCo 新闻, 脑机接口资讯, 产品发布",
  "metaRobots": "index,follow",
  "canonicalURL": "https://www.brainco.cn/news",
  "ogType": "website",
  "twitterCard": "summary_large_image"
}
```

## 相关文档

- **[SEO_GUIDE.md](./website/brainco_website_seo/SEO_GUIDE.md)** - 完整的 SEO 使用指南
- **[STRAPI_SEO_SETUP.md](./STRAPI_SEO_SETUP.md)** - Strapi 配置详细说明
- **[ENV_CONFIG.md](./website/brainco_website_seo/ENV_CONFIG.md)** - 环境变量配置说明

## 常见问题

### Q: 如何快速为所有页面添加 SEO？

**A:** 
1. 列出网站的所有主要页面
2. 为每个页面创建一个 SEO 配置（先创建中文版）
3. 使用 Strapi 的语言切换功能，为每个页面创建英文和繁体版本
4. 在 Next.js 页面中添加 `generateMetadata` 函数

### Q: SEO 数据多久更新一次？

**A:** 
默认缓存时间是 1 小时（3600秒）。可以在环境变量中修改：

```env
NEXT_PUBLIC_SEO_CACHE_TIME=1800  # 30分钟
```

### Q: 如何为动态路由页面配置 SEO？

**A:** 
对于动态路由（如 `/products/[slug]`），可以在 Strapi 中创建对应的 SEO 配置：

```typescript
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const seoData = await fetchPageSEO(`/products/${slug}`, locale);
  
  if (seoData) {
    return transformSEOToMetadata(seoData, siteUrl, siteName);
  }
  
  // 或者从产品数据中生成
  const product = await fetchProduct(slug, locale);
  return {
    title: `${product.name} - BrainCo`,
    description: product.description,
  };
}
```

### Q: 结构化数据如何验证？

**A:** 使用以下工具：
1. **Google 富媒体测试**: https://search.google.com/test/rich-results
2. **Schema.org 验证器**: https://validator.schema.org
3. **浏览器开发者工具**: 查看页面源代码中的 `<script type="application/ld+json">`

## 技术支持

如有问题，请：
1. 查看详细文档
2. 检查控制台错误信息
3. 联系技术团队：tech@brainco.cn

## 下一步

✅ 完成 Strapi SEO 配置  
✅ 为所有主要页面添加 SEO  
✅ 创建三种语言版本  
✅ 在 Next.js 中集成  
✅ 测试和验证  
✅ 部署到生产环境  
⬜ 使用 Google Search Console 监控  
⬜ 定期优化和更新  

---

**最后更新**: 2025年10月29日  
**版本**: v2.0.0  
**维护者**: BrainCo 技术团队



