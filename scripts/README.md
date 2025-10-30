# SEO 和 Schema 数据管理

## 📁 文件说明

### 脚本文件

- **`merge-seo-schema.js`** - 合并 SEO 和 Schema 数据（当需要更新数据时使用）
- **`import-seo-schema-data.js`** - 导入完整数据到 Strapi CMS

### 数据文件

- **`seo-schema-data.json`** - 完整的 SEO 和 Schema 数据（合并后的最终数据）

### 文档

- **`README_SEO_SCHEMA_IMPORT.md`** - 详细使用指南

## 🚀 快速开始

### 首次导入或重新导入全部数据

```bash
# 1. 设置 API Token
export CMS_API_TOKEN=your_token_here

# 2. 导入数据到 CMS
node scripts/import-seo-schema-data.js
```

### 更新数据后重新导入

如果你修改了 `seo-schema-data.json`：

```bash
# 直接运行导入脚本（会自动更新现有记录）
node scripts/import-seo-schema-data.js
```

## 📝 日常维护

### 方式一：CMS 后台修改（推荐）

1. 登录 Strapi 后台
2. Content Manager → Page SEO
3. 选择页面，使用右上角语言切换器切换语言
4. 直接编辑字段
5. 保存即可生效 ✨

**优势：** 即时生效，无需重新部署

### 方式二：修改数据文件

1. 编辑 `seo-schema-data.json`
2. 运行导入脚本更新 CMS
3. 前端会自动获取最新数据

## 📊 数据结构

`seo-schema-data.json` 包含：

```json
{
  "pages": [
    {
      "pageName": "页面名称",
      "pagePath": "页面路径",
      "locales": {
        "zh-Hans": {
          "metaTitle": "标题",
          "metaDescription": "描述",
          "keywords": "关键词",
          "structuredData": [/* Schema.org 数据 */]
        },
        "en": { /* 英文版本 */ },
        "zh-Hant": { /* 繁体中文版本 */ }
      }
    }
  ]
}
```

## 🌐 支持的语言

- **zh-Hans** - 简体中文（默认）
- **en** - 英文
- **zh-Hant** - 繁体中文

## 🔍 验证数据

### 1. CMS 验证
- Strapi 后台 → Page SEO
- 切换语言查看各版本

### 2. 网页验证
- 访问网站页面
- 查看源代码搜索 `application/ld+json`

### 3. 工具验证
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

## 💡 提示

1. **API Token 获取**
   - Strapi 后台 → Settings → API Tokens
   - Create new API Token，选择 Full access

2. **数据更新**
   - 优先使用 CMS 后台修改（即时生效）
   - 批量修改时编辑 JSON 文件后重新导入

3. **Schema 数据**
   - 所有 Schema.org 结构化数据都在 `structuredData` 字段
   - 支持单个对象或数组格式

## 📚 更多信息

查看 `README_SEO_SCHEMA_IMPORT.md` 获取详细文档。

## ⚠️ 注意事项

- 导入脚本会自动判断创建或更新
- 不会删除现有数据，只会添加或更新
- 每次导入会自动发布记录
- 建议在测试环境先验证后再导入生产环境

## 🎉 总结

这套方案实现了：
- ✅ SEO 数据和 Schema 数据统一管理
- ✅ 支持三种语言
- ✅ CMS 后台可视化编辑
- ✅ 即时生效，无需重新部署
- ✅ 简化的维护流程

