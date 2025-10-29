# BrainCo 网站多语言 SEO 系统

## 📖 系统说明

本系统为 BrainCo 官网提供完整的多语言动态 SEO 解决方案，支持通过 Strapi CMS 统一管理所有页面的 SEO 配置，并在 Next.js 网站中动态应用。

## ✨ 核心功能

### 1. 完整的 TDK 支持
- ✅ **Title** (标题): 10-60字符，支持字数限制
- ✅ **Description** (描述): 50-160字符，SEO 优化长度
- ✅ **Keywords** (关键词): 逗号分隔，支持多关键词

### 2. 多语言支持
- ✅ **简体中文** (zh-CN): 中国大陆用户
- ✅ **英文** (en-US): 国际用户
- ✅ **繁体中文** (zh-TW): 港澳台用户

### 3. 社交媒体优化
- ✅ **Open Graph**: Facebook, LinkedIn 等社交平台
- ✅ **Twitter Card**: Twitter 专用卡片
- ✅ **自定义图片**: 支持为每个页面上传专属分享图

### 4. 结构化数据 (Schema.org)
- ✅ **Organization**: 组织信息
- ✅ **Website**: 网站信息
- ✅ **Product**: 产品页面
- ✅ **Article**: 文章/博客
- ✅ **BreadcrumbList**: 面包屑导航
- ✅ **FAQPage**: 常见问题

### 5. SEO 最佳实践
- ✅ **Canonical URL**: 规范链接，避免重复内容
- ✅ **Meta Robots**: 精确控制搜索引擎索引
- ✅ **Hreflang**: 自动生成多语言替换标签
- ✅ **缓存优化**: 智能缓存，提升性能

## 🗂️ 项目结构

```
brainco_website_cms/
├── src/                              # Strapi 后端
│   ├── api/
│   │   └── page-seo/                 # 页面 SEO API
│   │       ├── content-types/
│   │       │   └── page-seo/
│   │       │       └── schema.json   # SEO 数据模型
│   │       ├── controllers/
│   │       │   └── page-seo.js       # 自定义控制器
│   │       ├── routes/
│   │       │   └── page-seo.js       # 自定义路由
│   │       └── services/
│   │           └── page-seo.js       # 服务层
│   └── components/
│       └── shared/
│           └── seo.json              # SEO 组件定义
│
├── website/brainco_website_seo/      # Next.js 前端
│   └── src/
│       ├── types/
│       │   └── seo.ts                # TypeScript 类型定义
│       ├── libs/
│       │   └── seo.ts                # SEO 工具函数库
│       └── components/
│           └── seo/
│               └── StructuredData.tsx # 结构化数据组件
│
└── docs/                             # 文档
    ├── SEO_QUICKSTART.md             # 快速入门
    ├── SEO_GUIDE.md                  # 完整使用指南
    ├── STRAPI_SEO_SETUP.md           # Strapi 配置指南
    └── ENV_CONFIG.md                 # 环境变量配置
```

## 📚 文档导航

### 快速开始
- **[SEO_QUICKSTART.md](./SEO_QUICKSTART.md)** - 5分钟快速上手指南

### 完整指南
- **[SEO_GUIDE.md](./website/brainco_website_seo/SEO_GUIDE.md)** - Next.js 完整使用指南
- **[STRAPI_SEO_SETUP.md](./STRAPI_SEO_SETUP.md)** - Strapi CMS 配置指南
- **[ENV_CONFIG.md](./website/brainco_website_seo/ENV_CONFIG.md)** - 环境变量配置说明

## 🚀 快速开始

### 前提条件

- Node.js 18+
- pnpm
- Strapi 已安装并配置

### 1. 启动 Strapi

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm install
pnpm run develop
```

Strapi 管理面板：http://localhost:1337/admin

### 2. 配置第一个 SEO

1. 登录 Strapi 管理面板
2. 进入 **Content Manager** → **页面SEO配置**
3. 创建首页 SEO：
   - 页面名称: `home`
   - 页面路径: `/`
   - 语言: `zh-CN`
   - Meta Title: `BrainCo - 脑机接口技术领导者`
   - Meta Description: `BrainCo 致力于研发先进的脑机接口技术...`
4. 保存并发布

### 3. 配置 Next.js

在 Next.js 项目根目录创建 `.env.local`：

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL_CN=https://www.brainco.cn
NEXT_PUBLIC_SITE_URL_US=https://www.brainco.tech
NEXT_PUBLIC_SITE_NAME=BrainCo
```

### 4. 在页面中使用

```typescript
// app/[locale]/(home)/page.tsx
import type { Metadata } from 'next';
import { fetchPageSEOByName, transformSEOToMetadata } from '@/libs/seo';

export async function generateMetadata(props): Promise<Metadata> {
  const { locale } = await props.params;
  const seoData = await fetchPageSEOByName('home', locale);
  
  if (seoData) {
    return transformSEOToMetadata(seoData, 'https://www.brainco.cn', 'BrainCo');
  }
  
  return { title: 'BrainCo', description: '脑机接口技术领导者' };
}
```

### 5. 启动并验证

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms/website/brainco_website_seo
pnpm dev
```

访问 http://localhost:3000/zh-CN 并查看页面源代码验证 SEO 标签。

## 📦 安装的文件清单

### Strapi 后端

#### 新增文件
```
src/api/page-seo/
├── content-types/page-seo/schema.json
├── controllers/page-seo.js
├── routes/page-seo.js
└── services/page-seo.js
```

#### 修改文件
```
src/components/shared/seo.json  # 升级的 SEO 组件
```

### Next.js 前端

#### 新增文件
```
src/types/seo.ts                          # SEO 类型定义
src/libs/seo.ts                           # SEO 工具函数
src/components/seo/StructuredData.tsx     # 结构化数据组件
```

### 文档
```
SEO_README.md              # 本文档
SEO_QUICKSTART.md          # 快速入门
STRAPI_SEO_SETUP.md        # Strapi 配置
website/brainco_website_seo/
├── SEO_GUIDE.md           # Next.js 使用指南
└── ENV_CONFIG.md          # 环境变量配置
```

## 🔌 API 端点

### 1. 根据路径获取 SEO

```
GET /api/page-seos/by-path?path={pagePath}&locale={locale}
```

**参数：**
- `path`: 页面路径，如 `/products`
- `locale`: 语言代码，如 `zh-CN`, `en-US`, `zh-TW`

**示例：**
```bash
curl "http://localhost:1337/api/page-seos/by-path?path=/products&locale=zh-CN"
```

### 2. 根据名称获取 SEO

```
GET /api/page-seos/by-name?name={pageName}&locale={locale}
```

**参数：**
- `name`: 页面名称，如 `home`, `products`
- `locale`: 语言代码

**示例：**
```bash
curl "http://localhost:1337/api/page-seos/by-name?name=home&locale=zh-CN"
```

### 3. 标准 REST API

```
GET    /api/page-seos          # 列表查询
GET    /api/page-seos/:id      # 单个查询
POST   /api/page-seos          # 创建
PUT    /api/page-seos/:id      # 更新
DELETE /api/page-seos/:id      # 删除
```

## 🛠️ 工具函数

### 获取 SEO 数据

```typescript
import { fetchPageSEO, fetchPageSEOByName } from '@/libs/seo';

// 根据路径获取
const seoData = await fetchPageSEO('/products', 'zh-CN');

// 根据名称获取
const seoData = await fetchPageSEOByName('home', 'zh-CN');
```

### 转换为 Next.js Metadata

```typescript
import { transformSEOToMetadata } from '@/libs/seo';

const metadata = transformSEOToMetadata(
  seoData,
  'https://www.brainco.cn',
  'BrainCo'
);
```

### 生成默认 Metadata

```typescript
import { getDefaultMetadata } from '@/libs/seo';

const metadata = getDefaultMetadata(
  '页面标题',
  '页面描述',
  '/page-path',
  'zh-CN',
  'https://www.brainco.cn'
);
```

### 生成结构化数据

```typescript
import { structuredDataTemplates } from '@/libs/seo';

// 网站
const websiteData = structuredDataTemplates.website(
  'BrainCo',
  'https://www.brainco.cn',
  '脑机接口技术领导者'
);

// 产品
const productData = structuredDataTemplates.product(
  'Focus Zen',
  '智能专注力训练头环',
  ['https://www.brainco.cn/images/product.jpg'],
  'BrainCo',
  {
    price: '1299',
    priceCurrency: 'CNY',
    availability: 'https://schema.org/InStock',
    url: 'https://www.brainco.cn/products/focuszen',
  }
);

// 文章
const articleData = structuredDataTemplates.article(
  '文章标题',
  '文章摘要',
  ['https://www.brainco.cn/images/article.jpg'],
  '2025-10-29T08:00:00Z',
  '2025-10-29T10:00:00Z',
  { name: '作者姓名', url: 'https://www.brainco.cn/authors/author' }
);
```

### 渲染结构化数据

```tsx
import { StructuredData } from '@/components/seo/StructuredData';

export default function MyPage() {
  return (
    <>
      <StructuredData data={structuredData} />
      <main>{/* 页面内容 */}</main>
    </>
  );
}
```

## 🔍 使用示例

### 示例 1: 静态页面

```typescript
// app/[locale]/(marketing)/about/page.tsx
import type { Metadata } from 'next';
import { fetchPageSEO, transformSEOToMetadata } from '@/libs/seo';

export async function generateMetadata(props): Promise<Metadata> {
  const { locale } = await props.params;
  const seoData = await fetchPageSEO('/about', locale);
  
  if (seoData) {
    return transformSEOToMetadata(seoData, 'https://www.brainco.cn', 'BrainCo');
  }
  
  return {
    title: '关于我们 - BrainCo',
    description: 'BrainCo 公司介绍',
  };
}

export default function AboutPage() {
  return <main>{/* 内容 */}</main>;
}
```

### 示例 2: 动态路由

```typescript
// app/[locale]/(marketing)/products/[slug]/page.tsx
import { fetchPageSEO, transformSEOToMetadata } from '@/libs/seo';
import { structuredDataTemplates } from '@/libs/seo';
import { StructuredData } from '@/components/seo/StructuredData';

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  
  // 优先从 Strapi 获取专门配置的 SEO
  let seoData = await fetchPageSEO(`/products/${slug}`, locale);
  
  if (seoData) {
    return transformSEOToMetadata(seoData, 'https://www.brainco.cn', 'BrainCo');
  }
  
  // 否则从产品数据生成
  const product = await fetchProduct(slug, locale);
  return {
    title: `${product.name} - BrainCo`,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug, locale } = await params;
  const product = await fetchProduct(slug, locale);
  
  // 生成产品结构化数据
  const productSchema = structuredDataTemplates.product(
    product.name,
    product.description,
    [product.image],
    'BrainCo',
    {
      price: product.price.toString(),
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
      url: `https://www.brainco.cn/products/${slug}`,
    }
  );
  
  return (
    <>
      <StructuredData data={productSchema} />
      <main>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </main>
    </>
  );
}
```

### 示例 3: 带面包屑的页面

```typescript
import { structuredDataTemplates } from '@/libs/seo';
import { StructuredData } from '@/components/seo/StructuredData';

export default function ProductDetailPage() {
  const breadcrumbData = structuredDataTemplates.breadcrumb([
    { name: '首页', url: 'https://www.brainco.cn' },
    { name: '产品', url: 'https://www.brainco.cn/products' },
    { name: 'Focus Zen', url: 'https://www.brainco.cn/products/focuszen' },
  ]);
  
  const productData = structuredDataTemplates.product(/* ... */);
  
  return (
    <>
      <StructuredData data={[breadcrumbData, productData]} />
      <main>{/* 内容 */}</main>
    </>
  );
}
```

## 🧪 测试和验证

### 1. 测试 API

```bash
# 测试 Strapi API
curl "http://localhost:1337/api/page-seos/by-path?path=/&locale=zh-CN"
```

### 2. 验证页面 SEO

1. 启动开发服务器
2. 访问页面
3. 右键 → 查看页面源代码
4. 检查 `<head>` 中的标签：
   - `<title>`
   - `<meta name="description">`
   - `<meta property="og:*">`
   - `<meta name="twitter:*">`
   - `<script type="application/ld+json">`

### 3. 使用在线工具

- **Google 富媒体测试**: https://search.google.com/test/rich-results
- **Meta Tags**: https://metatags.io
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema Validator**: https://validator.schema.org

## 📊 数据模型

### PageSEO 接口

```typescript
interface PageSEO {
  id: number;
  pageName: string;                    // 页面名称
  pagePath: string;                    // 页面路径
  locale: 'zh-CN' | 'en-US' | 'zh-TW'; // 语言
  metaTitle: string;                   // 标题 (10-60字符)
  metaDescription: string;             // 描述 (50-160字符)
  keywords?: string;                   // 关键词
  metaRobots?: string;                 // robots 指令
  canonicalURL?: string;               // 规范链接
  ogTitle?: string;                    // OG 标题
  ogDescription?: string;              // OG 描述
  ogImage?: StrapiMedia;               // OG 图片
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;               // Twitter 标题
  twitterDescription?: string;         // Twitter 描述
  twitterImage?: StrapiMedia;          // Twitter 图片
  structuredData?: Record<string, any>; // 结构化数据
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
```

## 🎯 最佳实践

### Title 优化
- 长度: 10-60字符
- 包含核心关键词
- 品牌名放末尾：`页面标题 | BrainCo`
- 每个页面唯一

### Description 优化
- 长度: 50-160字符
- 描述页面核心内容
- 吸引用户点击
- 包含行动号召

### Keywords 优化
- 3-5个核心关键词
- 逗号分隔
- 避免堆砌

### 图片优化
- OG 图片: 1200x630px
- Twitter 图片: 1200x600px
- 文件大小: < 5MB
- 格式: JPG 或 PNG
- 添加 alt 文本

### 结构化数据
- 使用合适的 Schema 类型
- 保持与页面内容一致
- 使用验证工具检查
- 定期更新

## 🚧 故障排查

### 问题：SEO 数据不显示

**检查：**
1. Strapi 数据是否已发布
2. API 端点是否正常
3. 页面路径/名称是否匹配
4. 语言代码是否正确
5. 环境变量是否配置

### 问题：图片不显示

**检查：**
1. 图片是否已上传到 Strapi
2. `NEXT_PUBLIC_STRAPI_URL` 是否正确
3. 图片 URL 是否完整
4. 网络是否可访问图片

### 问题：结构化数据错误

**检查：**
1. JSON 格式是否正确
2. 必需字段是否填写
3. 使用验证工具检查
4. 查看浏览器控制台错误

## 📈 性能优化

### 缓存策略

```typescript
// 1小时缓存
fetch(url, {
  next: { revalidate: 3600 }
});

// 按需重新验证
fetch(url, {
  next: { tags: ['seo'] }
});
```

### 预加载数据

```typescript
// 在 layout 中预加载
export async function generateStaticParams() {
  const pages = ['home', 'products', 'about'];
  const locales = ['zh-CN', 'en-US', 'zh-TW'];
  
  return pages.flatMap(page =>
    locales.map(locale => ({ page, locale }))
  );
}
```

## 📝 待办事项

- [ ] 完成所有主要页面的 SEO 配置
- [ ] 为每个页面创建三种语言版本
- [ ] 测试所有 API 端点
- [ ] 验证所有页面的 SEO 标签
- [ ] 使用 Google 工具验证结构化数据
- [ ] 配置 Google Search Console
- [ ] 监控搜索引擎表现
- [ ] 定期更新和优化

## 🤝 贡献

如需改进此系统，请：
1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request
4. 联系技术团队审核

## 📧 技术支持

- 技术团队：tech@brainco.cn
- 文档问题：请提交 Issue
- 紧急问题：联系项目负责人

## 📄 许可证

Copyright © 2025 BrainCo  
保留所有权利

---

**最后更新**: 2025年10月29日  
**版本**: v2.0.0  
**维护者**: BrainCo 技术团队  
**文档作者**: AI Assistant



