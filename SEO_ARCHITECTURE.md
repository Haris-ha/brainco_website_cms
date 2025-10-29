# BrainCo SEO 系统架构

本文档说明整个 SEO 系统的架构设计和数据流向。

## 🏗️ 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Strapi CMS                              │
│                     (http://localhost:1337)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Content Type: 页面SEO配置 (Page SEO)                  │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  Fields:                                             │     │
│  │  - pageName: string                                  │     │
│  │  - pagePath: string (i18n)                           │     │
│  │  - locale: enum (zh-CN, en-US, zh-TW)                │     │
│  │  - metaTitle: string (i18n, 10-60 chars)             │     │
│  │  - metaDescription: text (i18n, 50-160 chars)        │     │
│  │  - keywords: text (i18n)                             │     │
│  │  - metaRobots: string                                │     │
│  │  - canonicalURL: string (i18n)                       │     │
│  │  - ogTitle: string (i18n)                            │     │
│  │  - ogDescription: text (i18n)                        │     │
│  │  - ogImage: media                                    │     │
│  │  - ogType: enum (website, article, product)          │     │
│  │  - twitterCard: enum                                 │     │
│  │  - twitterTitle: string (i18n)                       │     │
│  │  - twitterDescription: text (i18n)                   │     │
│  │  - twitterImage: media                               │     │
│  │  - structuredData: JSON (i18n)                       │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  API Endpoints                                        │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  GET /api/page-seos                                   │     │
│  │  GET /api/page-seos/:id                               │     │
│  │  GET /api/page-seos/by-path?path=...&locale=...      │     │
│  │  GET /api/page-seos/by-name?name=...&locale=...      │     │
│  │  POST /api/page-seos                                  │     │
│  │  PUT /api/page-seos/:id                               │     │
│  │  DELETE /api/page-seos/:id                            │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            │ (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Next.js Website                            │
│                    (http://localhost:3000)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  SEO Library (src/libs/seo.ts)                        │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  Functions:                                           │     │
│  │  - fetchPageSEO(path, locale)                         │     │
│  │  - fetchPageSEOByName(name, locale)                   │     │
│  │  - transformSEOToMetadata(seoData, url, name)         │     │
│  │  - getDefaultMetadata(...)                            │     │
│  │  - generateStructuredData(type, data)                 │     │
│  │  - structuredDataTemplates.*                          │     │
│  └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Page Components                                      │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  app/[locale]/(home)/page.tsx                         │     │
│  │  app/[locale]/(marketing)/products/page.tsx           │     │
│  │  app/[locale]/(marketing)/about/page.tsx              │     │
│  │  ...                                                  │     │
│  │                                                       │     │
│  │  Each page:                                           │     │
│  │  1. Calls generateMetadata()                          │     │
│  │  2. Fetches SEO data from Strapi                      │     │
│  │  3. Transforms to Next.js Metadata                    │     │
│  │  4. Renders StructuredData component                  │     │
│  └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  HTML Output                                          │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │  <head>                                               │     │
│  │    <title>页面标题 | BrainCo</title>                    │     │
│  │    <meta name="description" content="..." />          │     │
│  │    <meta name="keywords" content="..." />             │     │
│  │    <link rel="canonical" href="..." />                │     │
│  │    <meta property="og:title" content="..." />         │     │
│  │    <meta property="og:description" content="..." />   │     │
│  │    <meta property="og:image" content="..." />         │     │
│  │    <meta name="twitter:card" content="..." />         │     │
│  │    <link rel="alternate" hreflang="zh-CN" ... />      │     │
│  │    <link rel="alternate" hreflang="en-US" ... />      │     │
│  │    <link rel="alternate" hreflang="zh-TW" ... />      │     │
│  │    <script type="application/ld+json">                │     │
│  │      { "@context": "https://schema.org", ... }        │     │
│  │    </script>                                          │     │
│  │  </head>                                              │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Search Engines                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Google     │  │     Bing     │  │    Baidu     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  索引页面内容、Meta 标签、结构化数据                               │
│  在搜索结果中显示优化的标题、描述和富媒体结果                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 数据流向

### 1. 内容创建流程

```
内容编辑 → Strapi 管理面板 → 创建 SEO 配置
                           ↓
              选择语言 (zh-CN, en-US, zh-TW)
                           ↓
                    填写 TDK 和其他字段
                           ↓
                      保存并发布
                           ↓
                   数据存储在数据库
```

### 2. 多语言内容创建

```
创建中文版本 (zh-CN)
       ↓
   保存并发布
       ↓
点击语言切换器 → 选择 en-US → Create new locale
       ↓
填写英文内容
       ↓
   保存并发布
       ↓
点击语言切换器 → 选择 zh-TW → Create new locale
       ↓
填写繁体内容
       ↓
   保存并发布
```

### 3. 页面渲染流程

```
用户访问页面 (例如: /zh-CN/products)
              ↓
    Next.js 调用 generateMetadata()
              ↓
    调用 fetchPageSEO('/products', 'zh-CN')
              ↓
    Strapi API 返回 SEO 数据
              ↓
    transformSEOToMetadata() 转换数据
              ↓
    Next.js 生成 HTML <head> 标签
              ↓
    StructuredData 组件渲染 JSON-LD
              ↓
    完整的 HTML 发送给用户
              ↓
    搜索引擎爬虫索引页面
```

## 🗂️ 数据库结构

### page_seos 表

```sql
CREATE TABLE page_seos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_name VARCHAR(255) NOT NULL,           -- 页面名称
  page_path VARCHAR(255) NOT NULL,           -- 页面路径
  locale VARCHAR(10) NOT NULL,               -- 语言代码
  meta_title VARCHAR(60) NOT NULL,           -- 页面标题
  meta_description TEXT NOT NULL,            -- 页面描述
  keywords TEXT,                             -- 关键词
  meta_robots VARCHAR(50) DEFAULT 'index,follow',
  canonical_url VARCHAR(255),                -- 规范链接
  og_title VARCHAR(60),                      -- OG 标题
  og_description TEXT,                       -- OG 描述
  og_type VARCHAR(20) DEFAULT 'website',     -- OG 类型
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title VARCHAR(60),                 -- Twitter 标题
  twitter_description TEXT,                  -- Twitter 描述
  structured_data JSON,                      -- 结构化数据
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  
  -- 国际化关系
  locale_parent_id INT,                      -- 父语言版本 ID
  
  INDEX idx_page_path_locale (page_path, locale),
  INDEX idx_page_name_locale (page_name, locale),
  INDEX idx_locale (locale),
  INDEX idx_published (published_at)
);

-- 媒体关联表 (og_image, twitter_image)
CREATE TABLE page_seos_og_image_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_seo_id INT NOT NULL,
  file_id INT NOT NULL,
  FOREIGN KEY (page_seo_id) REFERENCES page_seos(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE page_seos_twitter_image_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_seo_id INT NOT NULL,
  file_id INT NOT NULL,
  FOREIGN KEY (page_seo_id) REFERENCES page_seos(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
```

## 🔐 权限配置

### Strapi 权限

```
角色: Public (公开访问)
权限:
  ✅ page-seo.find          - 列表查询
  ✅ page-seo.findOne       - 单个查询
  ✅ page-seo.findByPath    - 根据路径查询
  ✅ page-seo.findByName    - 根据名称查询
  ❌ page-seo.create        - 创建 (仅管理员)
  ❌ page-seo.update        - 更新 (仅管理员)
  ❌ page-seo.delete        - 删除 (仅管理员)

角色: Authenticated (已认证用户)
  ✅ 所有公开权限
  ✅ page-seo.create        - 可创建 (如需要)
  ✅ page-seo.update        - 可更新 (如需要)

角色: Admin (管理员)
  ✅ 所有权限
```

## 🚀 部署架构

### 开发环境

```
┌─────────────┐         ┌─────────────┐
│   Strapi    │         │   Next.js   │
│ localhost:  │ ←─────→ │ localhost:  │
│    1337     │  REST   │    3000     │
└─────────────┘  API    └─────────────┘
```

### 生产环境

```
┌──────────────────┐
│  CDN (Cloudflare)│
│  www.brainco.cn  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│   Vercel / AWS   │         │   Strapi Cloud   │
│   Next.js App    │ ←─────→ │   或自建服务器    │
│   (SSR/SSG)      │  HTTPS  │   cms.brainco.cn │
└──────────────────┘  REST   └──────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│  Edge Functions  │         │    Database      │
│  (API Routes)    │         │  PostgreSQL/MySQL│
└──────────────────┘         └──────────────────┘
```

## 🔍 SEO 元素生成示例

### 输入 (Strapi)

```json
{
  "pageName": "home",
  "pagePath": "/",
  "locale": "zh-CN",
  "metaTitle": "BrainCo - 脑机接口技术领导者",
  "metaDescription": "BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。",
  "keywords": "BrainCo, 脑机接口, 脑电波",
  "ogType": "website",
  "ogImage": {
    "url": "/uploads/home-og.jpg",
    "width": 1200,
    "height": 630
  }
}
```

### 输出 (HTML)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- 基础 Meta -->
  <title>BrainCo - 脑机接口技术领导者</title>
  <meta name="description" content="BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。" />
  <meta name="keywords" content="BrainCo, 脑机接口, 脑电波" />
  <meta name="robots" content="index,follow" />
  
  <!-- Canonical -->
  <link rel="canonical" href="https://www.brainco.cn/" />
  
  <!-- Hreflang -->
  <link rel="alternate" hreflang="zh-CN" href="https://www.brainco.cn/zh-CN" />
  <link rel="alternate" hreflang="en-US" href="https://www.brainco.tech/en-US" />
  <link rel="alternate" hreflang="zh-TW" href="https://www.brainco.cn/zh-TW" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="BrainCo - 脑机接口技术领导者" />
  <meta property="og:description" content="BrainCo 致力于研发先进的脑机接口技术..." />
  <meta property="og:url" content="https://www.brainco.cn/" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.brainco.cn/uploads/home-og.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="zh_CN" />
  <meta property="og:site_name" content="BrainCo" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="BrainCo - 脑机接口技术领导者" />
  <meta name="twitter:description" content="BrainCo 致力于研发先进的脑机接口技术..." />
  <meta name="twitter:image" content="https://www.brainco.cn/uploads/home-og.jpg" />
  <meta name="twitter:site" content="@brainco" />
  
  <!-- 结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn",
    "logo": "https://www.brainco.cn/logo.png",
    "description": "脑机接口技术领导者"
  }
  </script>
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

## 📊 性能指标

### 缓存策略

```
SEO 数据缓存:
- Strapi: 使用 Redis 缓存 API 响应
- Next.js: 使用 Next.js 内置缓存 (revalidate: 3600s)
- CDN: Cloudflare 边缘缓存

缓存层级:
1. CDN 边缘缓存 (最快)
2. Next.js 应用缓存
3. Strapi API 缓存
4. 数据库查询
```

### 预期性能

```
首次加载 (TTFB):
- 开发环境: 100-200ms
- 生产环境 (CDN): 50-100ms

SEO 数据获取:
- 缓存命中: < 10ms
- 缓存未命中: 50-200ms

页面生成:
- SSG (静态生成): 0ms (构建时生成)
- SSR (服务端渲染): 50-100ms
- ISR (增量静态再生): 50-100ms (首次)
```

## 🔄 更新流程

### SEO 内容更新

```
1. 编辑在 Strapi 中更新 SEO 内容
         ↓
2. 点击 "Save" 保存
         ↓
3. 点击 "Publish" 发布
         ↓
4. Next.js 缓存过期 (1小时后)
         ↓
5. 或手动触发重新验证:
   - 调用 revalidatePath('/products')
   - 或重新部署 Next.js
         ↓
6. 新内容生效
```

### 紧急更新

```bash
# 清除 Next.js 缓存
# 方法 1: 重新部署
vercel --prod

# 方法 2: 调用 revalidate API (如果配置了)
curl -X POST https://www.brainco.cn/api/revalidate?path=/products&secret=your-secret

# 方法 3: 清除 CDN 缓存
# Cloudflare: Caching → Purge Cache
```

## 🌐 多语言路由

### URL 结构

```
中国站 (brainco.cn):
  /zh-CN/            → 简体中文首页
  /zh-CN/products    → 简体中文产品页
  /zh-TW/            → 繁体中文首页
  /zh-TW/products    → 繁体中文产品页

美国站 (brainco.tech):
  /en-US/            → 英文首页
  /en-US/products    → 英文产品页
```

### 语言检测流程

```
用户访问 www.brainco.cn
         ↓
检测用户 IP 地址
         ↓
根据 IP 确定地区:
  - CN → zh-CN
  - TW/HK/MO → zh-TW
  - 其他 → en-US
         ↓
重定向到对应语言版本
         ↓
加载对应语言的 SEO 配置
```

## 📈 监控和分析

### 关键指标

```
SEO 性能指标:
- 页面索引数量
- 平均排名
- 点击率 (CTR)
- 展示次数
- 富媒体结果数量

技术指标:
- API 响应时间
- 缓存命中率
- 错误率
- 页面加载时间
```

### 监控工具

```
- Google Search Console: 搜索表现
- Google Analytics: 流量分析
- Vercel Analytics: 性能监控
- Sentry: 错误追踪
- Strapi 日志: API 请求日志
```

## 🔮 未来扩展

### 计划功能

1. **A/B 测试**
   - 测试不同的标题和描述
   - 数据驱动优化

2. **自动化建议**
   - AI 生成 SEO 建议
   - 关键词优化建议

3. **实时预览**
   - 在 Strapi 中预览 SEO 效果
   - Google 搜索结果预览

4. **批量操作**
   - 批量导入/导出
   - 批量更新

5. **版本控制**
   - SEO 配置版本历史
   - 回滚功能

6. **更多结构化数据类型**
   - Event
   - Recipe
   - Review
   - Video

## 📚 参考资源

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Strapi i18n Plugin](https://docs.strapi.io/dev-docs/plugins/i18n)
- [Schema.org](https://schema.org)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

**最后更新**: 2025年10月29日  
**版本**: v2.0.0  
**维护者**: BrainCo 技术团队

