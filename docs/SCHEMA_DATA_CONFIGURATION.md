# Schema 结构化数据配置指南

## 概述

所有页面的 Schema.org 结构化数据都应该在 Strapi CMS 中配置，而不是在前端代码中硬编码。这样可以：
- ✅ 动态修改 Schema 数据，无需重新部署
- ✅ 统一管理所有 SEO 相关配置
- ✅ 支持多语言的不同 Schema 配置
- ✅ 便于 SEO 团队直接维护

## CMS 配置说明

### 字段位置
在 Strapi 后台，进入 **Content Manager → Page SEO**，每条记录都有一个 `structuredData` 字段（JSON类型，支持多语言）。

### Schema 数据格式

`structuredData` 字段可以存储一个或多个 Schema.org 结构化数据对象。

#### 单个 Schema 示例
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "BrainRobotics智能仿生手",
  "description": "采用先进的肌电信号识别技术，让上肢截肢者重获灵巧的双手",
  "brand": {
    "@type": "Brand",
    "name": "BrainCo"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn"
  },
  "category": "医疗康复设备",
  "image": "https://www.brainco.cn/images/brain-robotics-hero.webp"
}
```

#### 多个 Schema 示例（使用数组）
```json
[
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Focus Zen专注力训练头环",
    "description": "通过实时脑电监测和神经反馈训练，科学提升专注力",
    "brand": {
      "@type": "Brand",
      "name": "BrainCo"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首页",
        "item": "https://www.brainco.cn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "健康产品",
        "item": "https://www.brainco.cn/health"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Focus Zen",
        "item": "https://www.brainco.cn/health/focus-zen"
      }
    ]
  }
]
```

## 常用 Schema 类型参考

### 1. Product（产品）
适用于：所有产品页面

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "产品名称",
  "description": "产品描述",
  "brand": {
    "@type": "Brand",
    "name": "BrainCo"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn"
  },
  "category": "产品分类",
  "image": "产品图片URL",
  "offers": {
    "@type": "Offer",
    "price": "1299.00",
    "priceCurrency": "CNY",
    "availability": "https://schema.org/InStock"
  }
}
```

### 2. MedicalDevice（医疗设备）
适用于：BrainRobotics、Mobius、Revo1、Revo2

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalDevice",
  "name": "设备名称",
  "description": "设备描述",
  "deviceCategory": "康复医疗设备",
  "purpose": "用于上肢康复训练",
  "manufacturer": {
    "@type": "Organization",
    "name": "BrainCo",
    "url": "https://www.brainco.cn"
  }
}
```

### 3. AboutPage（关于页面）
适用于：/about, /company

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "关于BrainCo",
  "description": "页面描述",
  "url": "https://www.brainco.cn/about",
  "mainEntity": {
    "@type": "Organization",
    "name": "BrainCo",
    "alternateName": "强脑科技",
    "url": "https://www.brainco.cn",
    "foundingDate": "2015"
  }
}
```

### 4. ContactPage（联系页面）
适用于：/contact

```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "联系我们",
  "description": "联系BrainCo获取产品咨询和商务合作",
  "url": "https://www.brainco.cn/contact"
}
```

### 5. NewsArticle（新闻文章）
适用于：/news

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "新闻资讯",
  "description": "BrainCo最新新闻和动态",
  "url": "https://www.brainco.cn/news"
}
```

### 6. BreadcrumbList（面包屑导航）
适用于：所有子页面

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://www.brainco.cn"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "产品中心",
      "item": "https://www.brainco.cn/products"
    }
  ]
}
```

### 7. Organization（组织信息）
全局使用，通常自动添加

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BrainCo",
  "alternateName": "强脑科技",
  "url": "https://www.brainco.cn",
  "logo": "https://www.brainco.cn/logo.webp",
  "description": "全球领先的脑机接口技术公司",
  "foundingDate": "2015"
}
```

## 页面 Schema 配置建议

### 产品页面
| 页面 | Schema 类型 | 说明 |
|------|------------|------|
| /products/brain-robotics | MedicalDevice + Product + BreadcrumbList | 医疗设备 + 产品信息 + 面包屑 |
| /products/mobius | MedicalDevice + Product + BreadcrumbList | 脑控轮椅 |
| /products/revo1 | MedicalDevice + Product + BreadcrumbList | 康复机器人 |
| /products/revo2 | MedicalDevice + Product + BreadcrumbList | 康复机器人 |

### 健康产品页面
| 页面 | Schema 类型 | 说明 |
|------|------------|------|
| /health/easleep | Product + BreadcrumbList | 睡眠改善产品 |
| /health/focus-zen | Product + BreadcrumbList | 专注力训练产品 |
| /health/focus-xin | Product + BreadcrumbList | 专注力产品 |
| /health/oxyzen | Product + BreadcrumbList | 脑健康训练 |
| /health/starkids | Product + BreadcrumbList | 儿童教育产品 |

### 教育产品页面
| 页面 | Schema 类型 | 说明 |
|------|------------|------|
| /education/brain-ai | Product + BreadcrumbList | 智慧教育系统 |

### 公司页面
| 页面 | Schema 类型 | 说明 |
|------|------------|------|
| /about | AboutPage + Organization | 关于我们 |
| /company | AboutPage + Organization | 公司介绍 |
| /contact | ContactPage | 联系我们 |
| /technology | WebPage + Organization | 技术介绍 |

### 其他页面
| 页面 | Schema 类型 | 说明 |
|------|------------|------|
| /news | CollectionPage | 新闻列表 |
| /recruit | WebPage | 招聘页面 |
| /recruit/jobs | JobPosting（可选） | 职位列表 |

## 多语言配置

`structuredData` 字段支持多语言，为不同语言配置不同的 Schema 数据：

### 中文（zh-Hans）
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "BrainRobotics智能仿生手",
  "description": "采用先进的肌电信号识别技术..."
}
```

### 英文（en）
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "BrainRobotics Prosthetic Hand",
  "description": "Advanced EMG recognition technology..."
}
```

### 繁体中文（zh-Hant）
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "BrainRobotics智能仿生手",
  "description": "採用先進的肌電信號識別技術..."
}
```

## 验证工具

配置完成后，使用以下工具验证 Schema 数据：

1. **Google Rich Results Test**  
   https://search.google.com/test/rich-results

2. **Schema.org Validator**  
   https://validator.schema.org/

3. **JSON-LD Playground**  
   https://json-ld.org/playground/

## 注意事项

1. ✅ 所有 URL 必须使用完整路径（包含域名）
2. ✅ 价格信息需要包含货币类型
3. ✅ 图片 URL 必须可访问
4. ✅ 日期格式使用 ISO 8601（例如：2024-01-01）
5. ✅ 多个 Schema 使用数组格式
6. ⚠️ 确保 JSON 格式正确，没有语法错误
7. ⚠️ 避免重复的 Schema 类型

## 导入工具

我们提供了批量导入脚本，可以将 Schema 数据批量导入到 CMS 中。

使用方法：
```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
node scripts/import-schema-data.js
```

脚本会读取 `scripts/schema-data.json` 文件，并更新所有页面的 `structuredData` 字段。

