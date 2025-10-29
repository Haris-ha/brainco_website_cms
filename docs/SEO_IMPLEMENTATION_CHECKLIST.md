# BrainCo SEO 系统实施清单

本文档列出了完整的 SEO 系统实施清单，帮助你逐步完成配置。

## ✅ 已完成的工作

### 1. Strapi 后端配置

#### 创建的文件
- ✅ `src/api/page-seo/content-types/page-seo/schema.json` - SEO 内容类型定义
- ✅ `src/api/page-seo/controllers/page-seo.js` - API 控制器（包含自定义查询方法）
- ✅ `src/api/page-seo/routes/page-seo.js` - API 路由配置
- ✅ `src/api/page-seo/services/page-seo.js` - 服务层

#### 修改的文件
- ✅ `src/components/shared/seo.json` - 升级 SEO 组件，增加完整的 TDK 和社交媒体字段

### 2. Next.js 前端配置

#### 创建的文件
- ✅ `src/types/seo.ts` - TypeScript 类型定义
- ✅ `src/libs/seo.ts` - SEO 工具函数库
- ✅ `src/components/seo/StructuredData.tsx` - 结构化数据渲染组件

### 3. 文档

#### 创建的文档
- ✅ `SEO_README.md` - 系统总览和快速参考
- ✅ `SEO_QUICKSTART.md` - 5分钟快速入门指南
- ✅ `SEO_ARCHITECTURE.md` - 系统架构说明
- ✅ `SEO_IMPLEMENTATION_CHECKLIST.md` - 本清单
- ✅ `STRAPI_SEO_SETUP.md` - Strapi 详细配置指南
- ✅ `website/brainco_website_seo/SEO_GUIDE.md` - Next.js 完整使用指南
- ✅ `website/brainco_website_seo/ENV_CONFIG.md` - 环境变量配置说明

## 📋 实施清单

### 第一阶段：基础配置（1-2小时）

#### ☐ 1. 启动 Strapi
```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm install  # 如果需要
pnpm run develop
```

- ☐ 确认 Strapi 在 http://localhost:1337 正常运行
- ☐ 登录管理面板 http://localhost:1337/admin

#### ☐ 2. 配置国际化

- ☐ 进入 **Settings** → **Internationalization**
- ☐ 确认已添加以下语言：
  - ☐ zh-CN (简体中文)
  - ☐ en-US (英文)
  - ☐ zh-TW (繁体中文)
- ☐ 设置默认语言为 zh-CN

#### ☐ 3. 配置 API 权限

- ☐ 进入 **Settings** → **Users & Permissions Plugin** → **Roles**
- ☐ 选择 **Public** 角色
- ☐ 找到 **Page-seo** 权限
- ☐ 勾选以下权限：
  - ☐ find
  - ☐ findOne
  - ☐ findByPath
  - ☐ findByName
- ☐ 保存更改

#### ☐ 4. 测试 API

```bash
# 测试 API 端点（应该返回空数组或404，这是正常的）
curl "http://localhost:1337/api/page-seos"
```

### 第二阶段：创建 SEO 配置（2-3小时）

#### ☐ 5. 创建首页 SEO（中文版）

- ☐ 进入 **Content Manager** → **页面SEO配置**
- ☐ 点击 **Create new entry**
- ☐ 填写以下信息：
  ```
  页面名称: home
  页面路径: /
  语言: zh-CN
  Meta Title: BrainCo - 脑机接口技术领导者
  Meta Description: BrainCo 致力于研发先进的脑机接口技术，为教育、健康等领域提供创新解决方案。我们的产品包括智能头环、专注力训练系统等。
  Keywords: BrainCo, 脑机接口, 脑电波, 专注力, 教育科技, 健康科技
  Meta Robots: index,follow
  OG Type: website
  Twitter Card: summary_large_image
  ```
- ☐ 上传 OG 图片（推荐 1200x630px）
- ☐ 点击 **Save** 然后 **Publish**

#### ☐ 6. 创建首页 SEO（英文版）

- ☐ 在刚创建的中文版页面
- ☐ 点击右上角语言选择器
- ☐ 选择 **en-US**
- ☐ 点击 **Create new locale**
- ☐ 填写英文内容：
  ```
  Meta Title: BrainCo - Brain-Computer Interface Technology Leader
  Meta Description: BrainCo develops advanced brain-computer interface technology, providing innovative solutions for education and health sectors.
  Keywords: BrainCo, brain-computer interface, EEG, focus, education technology
  ```
- ☐ 点击 **Save** 然后 **Publish**

#### ☐ 7. 创建首页 SEO（繁体版）

- ☐ 继续在同一页面
- ☐ 点击右上角语言选择器
- ☐ 选择 **zh-TW**
- ☐ 点击 **Create new locale**
- ☐ 填写繁体内容
- ☐ 点击 **Save** 然后 **Publish**

#### ☐ 8. 创建其他页面的 SEO

为以下页面重复步骤 5-7：

- ☐ 产品页 (products, /products)
- ☐ 关于我们 (about, /about)
- ☐ 联系我们 (contact, /contact)
- ☐ 新闻资讯 (news, /news)
- ☐ 技术介绍 (technology, /technology)

**提示**: 可以使用批量导入脚本（见 STRAPI_SEO_SETUP.md）

#### ☐ 9. 验证 Strapi API

```bash
# 测试中文首页
curl "http://localhost:1337/api/page-seos/by-name?name=home&locale=zh-CN"

# 测试英文首页
curl "http://localhost:1337/api/page-seos/by-name?name=home&locale=en-US"

# 测试繁体首页
curl "http://localhost:1337/api/page-seos/by-name?name=home&locale=zh-TW"
```

- ☐ 确认返回正确的 JSON 数据

### 第三阶段：Next.js 集成（1-2小时）

#### ☐ 10. 配置环境变量

- ☐ 在 Next.js 项目根目录创建 `.env.local`：
  ```bash
  cd /Users/harris/Desktop/BrainCo/brainco_website_cms/website/brainco_website_seo
  touch .env.local
  ```

- ☐ 添加以下内容：
  ```env
  NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
  NEXT_PUBLIC_SITE_URL_CN=https://www.brainco.cn
  NEXT_PUBLIC_SITE_URL_US=https://www.brainco.tech
  NEXT_PUBLIC_SITE_NAME=BrainCo
  ```

#### ☐ 11. 更新首页组件

- ☐ 打开 `src/app/[locale]/(home)/page.tsx`
- ☐ 更新 `generateMetadata` 函数：

  ```typescript
  import { fetchPageSEOByName, transformSEOToMetadata, getDefaultMetadata } from '@/libs/seo';

  export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
    const { locale } = await props.params;
    const seoData = await fetchPageSEOByName('home', locale as 'zh-CN' | 'en-US' | 'zh-TW');
    
    if (seoData) {
      return transformSEOToMetadata(seoData, 'https://www.brainco.cn', 'BrainCo');
    }
    
    return getDefaultMetadata(
      'BrainCo - 脑机接口技术领导者',
      'BrainCo 致力于研发脑机接口技术',
      '/',
      locale,
      'https://www.brainco.cn'
    );
  }
  ```

- ☐ （可选）添加结构化数据：

  ```typescript
  import { StructuredData } from '@/components/seo/StructuredData';
  import { structuredDataTemplates } from '@/libs/seo';

  export default async function Index(props: IIndexProps) {
    const { locale } = await props.params;
    const seoData = await fetchPageSEOByName('home', locale);
    
    const structuredData = seoData?.structuredData || 
      structuredDataTemplates.website('BrainCo', 'https://www.brainco.cn', '脑机接口技术领导者');
    
    return (
      <>
        <StructuredData data={structuredData} />
        <HomePageClient locale={locale} />
      </>
    );
  }
  ```

#### ☐ 12. 更新其他页面

为以下页面重复步骤 11：

- ☐ 产品页 (`app/[locale]/(marketing)/products/page.tsx`)
- ☐ 关于我们 (`app/[locale]/(marketing)/about/page.tsx`)
- ☐ 联系我们 (`app/[locale]/(marketing)/contact/page.tsx`)
- ☐ 更多页面...

#### ☐ 13. 启动并测试 Next.js

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms/website/brainco_website_seo
pnpm dev
```

- ☐ 访问 http://localhost:3000/zh-CN
- ☐ 右键 → 查看页面源代码
- ☐ 检查 `<head>` 标签中是否包含：
  - ☐ `<title>`
  - ☐ `<meta name="description">`
  - ☐ `<meta name="keywords">`
  - ☐ `<link rel="canonical">`
  - ☐ `<meta property="og:*">`
  - ☐ `<meta name="twitter:*">`
  - ☐ `<link rel="alternate" hreflang="*">`
  - ☐ `<script type="application/ld+json">` (如果添加了结构化数据)

- ☐ 测试其他语言版本：
  - ☐ http://localhost:3000/en-US
  - ☐ http://localhost:3000/zh-TW

### 第四阶段：验证和优化（1-2小时）

#### ☐ 14. 使用工具验证

##### Google 富媒体测试
- ☐ 访问 https://search.google.com/test/rich-results
- ☐ 输入页面 URL 或粘贴 HTML
- ☐ 检查结构化数据是否正确
- ☐ 修复任何错误

##### Meta Tags 调试器
- ☐ 访问 https://metatags.io
- ☐ 输入页面 URL
- ☐ 查看 OG 标签预览
- ☐ 确认图片和文本显示正确

##### Twitter Card 验证
- ☐ 访问 https://cards-dev.twitter.com/validator
- ☐ 输入页面 URL
- ☐ 查看 Twitter Card 预览
- ☐ 确认显示效果

#### ☐ 15. 性能优化

- ☐ 检查 API 响应时间（< 200ms）
- ☐ 验证缓存是否生效
- ☐ 检查图片大小（< 5MB）
- ☐ 优化图片格式（WebP）

#### ☐ 16. SEO 检查清单

对每个页面检查：

- ☐ Title 长度: 10-60 字符
- ☐ Description 长度: 50-160 字符
- ☐ Keywords: 3-5 个关键词
- ☐ 每个页面的 Title 是唯一的
- ☐ OG 图片尺寸正确 (1200x630px)
- ☐ Canonical URL 设置正确
- ☐ Hreflang 标签完整
- ☐ 结构化数据验证通过

### 第五阶段：部署（2-3小时）

#### ☐ 17. 准备生产环境配置

##### Strapi 生产配置
- ☐ 配置生产数据库
- ☐ 设置环境变量
- ☐ 构建 Strapi: `pnpm run build`
- ☐ 测试生产模式: `pnpm start`

##### Next.js 生产配置
- ☐ 创建 `.env.production` 文件
  ```env
  NEXT_PUBLIC_STRAPI_URL=https://cms.brainco.cn
  NEXT_PUBLIC_SITE_URL_CN=https://www.brainco.cn
  NEXT_PUBLIC_SITE_URL_US=https://www.brainco.tech
  ```
- ☐ 构建 Next.js: `pnpm run build`
- ☐ 测试生产构建: `pnpm start`

#### ☐ 18. 部署 Strapi

选择部署方式：

**选项 A: Strapi Cloud**
- ☐ 注册 Strapi Cloud
- ☐ 连接 Git 仓库
- ☐ 配置环境变量
- ☐ 部署

**选项 B: 自建服务器**
- ☐ 准备服务器（Ubuntu/CentOS）
- ☐ 安装 Node.js, PostgreSQL
- ☐ 上传代码
- ☐ 配置 PM2 或 Docker
- ☐ 配置 Nginx
- ☐ 配置 SSL 证书

#### ☐ 19. 部署 Next.js

**推荐: Vercel**
- ☐ 连接 Git 仓库到 Vercel
- ☐ 配置环境变量
- ☐ 部署
- ☐ 配置自定义域名
- ☐ 配置 CDN

**备选: AWS/自建**
- ☐ 准备服务器
- ☐ 配置 Docker 或 PM2
- ☐ 配置负载均衡
- ☐ 配置 CDN (Cloudflare)

#### ☐ 20. 验证生产环境

- ☐ 访问生产网站
- ☐ 检查所有页面的 SEO 标签
- ☐ 使用工具验证（Google Rich Results Test）
- ☐ 测试所有语言版本
- ☐ 检查 API 性能

### 第六阶段：监控和维护（持续）

#### ☐ 21. 配置监控工具

- ☐ Google Search Console
  - ☐ 添加网站属性
  - ☐ 验证域名所有权
  - ☐ 提交站点地图

- ☐ Google Analytics
  - ☐ 创建 GA4 属性
  - ☐ 安装跟踪代码
  - ☐ 配置事件跟踪

- ☐ Sentry 或其他错误追踪
  - ☐ 配置错误监控
  - ☐ 设置告警

#### ☐ 22. 定期维护任务

**每周**
- ☐ 检查 Google Search Console 错误
- ☐ 查看流量变化
- ☐ 检查 API 性能

**每月**
- ☐ 审查 SEO 表现
- ☐ 更新过时内容
- ☐ 优化表现不佳的页面
- ☐ 添加新页面的 SEO 配置

**每季度**
- ☐ 全面 SEO 审计
- ☐ 更新关键词策略
- ☐ 优化结构化数据
- ☐ 检查竞争对手

## 📊 验收标准

在完成所有步骤后，系统应该满足：

### 功能要求
- ✅ 所有主要页面都有 SEO 配置
- ✅ 支持三种语言（zh-CN, en-US, zh-TW）
- ✅ API 响应时间 < 200ms
- ✅ 页面加载时间 < 3秒
- ✅ 所有 SEO 标签正确生成
- ✅ 结构化数据验证通过

### SEO 要求
- ✅ 所有页面的 Title 唯一且符合长度要求
- ✅ 所有页面的 Description 唯一且符合长度要求
- ✅ OG 标签完整且图片正确
- ✅ Twitter Card 正确显示
- ✅ Hreflang 标签完整
- ✅ Canonical URL 正确
- ✅ 结构化数据无错误

### 技术要求
- ✅ API 正常运行
- ✅ 缓存机制生效
- ✅ 无 TypeScript 错误
- ✅ 无 Linter 警告
- ✅ 构建成功
- ✅ 测试通过

## 🎯 成功指标

在上线后 1-3 个月，应该看到：

- 📈 Google 索引页面数量增加
- 📈 自然搜索流量增加
- 📈 点击率 (CTR) 提升
- 📈 平均页面排名提升
- 📈 富媒体结果出现在搜索中

## 🆘 需要帮助？

如遇到问题：

1. **查看文档**
   - SEO_README.md - 总览
   - SEO_QUICKSTART.md - 快速开始
   - SEO_GUIDE.md - 详细指南
   - STRAPI_SEO_SETUP.md - Strapi 配置

2. **检查常见问题**
   - 每个文档都有"常见问题"部分

3. **联系技术支持**
   - 邮箱: tech@brainco.cn
   - 提交 Issue

## 🎉 完成！

当所有清单项都被勾选后，恭喜你完成了 BrainCo 网站的 SEO 系统配置！

现在你可以：
- ✅ 轻松管理所有页面的 SEO
- ✅ 支持多语言 SEO 配置
- ✅ 优化搜索引擎表现
- ✅ 提升网站流量

---

**创建日期**: 2025年10月29日  
**最后更新**: 2025年10月29日  
**版本**: v2.0.0  
**维护者**: BrainCo 技术团队



