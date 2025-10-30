# Schema 数据批量导入指南

## 📝 概述

本指南说明如何将结构化数据（Schema.org）批量导入到 Strapi CMS 中。

**新方案优势：**
- ✅ 所有 Schema 数据在 CMS 中配置，可动态修改
- ✅ 无需修改代码即可更新 SEO 数据
- ✅ 支持多语言独立配置
- ✅ SEO 团队可直接在后台管理

## 🚀 快速开始

### 1. 配置环境变量

在项目根目录创建或编辑 `.env` 文件：

```bash
# CMS API 配置
CMS_API_URL=http://localhost:1337
CMS_API_TOKEN=your_api_token_here
```

**获取 API Token：**
1. 登录 Strapi 后台
2. 进入 Settings → API Tokens
3. 创建新 Token，设置权限为 `Full access`
4. 复制 Token 并保存到 `.env` 文件

### 2. 运行导入脚本

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
node scripts/import-schema-data.js
```

脚本会自动：
1. 读取 `scripts/schema-data-config.json` 中的配置
2. 为每个页面的每种语言更新 `structuredData` 字段
3. 输出详细的导入结果和统计信息

### 3. 验证导入结果

**在 CMS 中验证：**
1. 登录 Strapi 后台
2. 进入 Content Manager → Page SEO
3. 查看任意页面记录
4. 切换语言（zh-Hans, en, zh-Hant）
5. 检查 `structuredData` 字段是否已填充

**在网站中验证：**
1. 启动前端开发服务器
2. 访问任意页面（如 https://www.brainco.cn/products/brain-robotics）
3. 右键查看源代码
4. 搜索 `application/ld+json`
5. 应该能看到对应的 Schema 数据

**使用验证工具：**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

## 📄 配置文件说明

### schema-data-config.json 结构

```json
{
  "pages": [
    {
      "pagePath": "/products/brain-robotics",
      "schemas": {
        "zh-Hans": [
          {
            "@context": "https://schema.org",
            "@type": "MedicalDevice",
            "name": "产品名称",
            "description": "产品描述"
          }
        ],
        "en": [
          {
            "@context": "https://schema.org",
            "@type": "MedicalDevice",
            "name": "Product Name",
            "description": "Product description"
          }
        ],
        "zh-Hant": [...]
      }
    }
  ]
}
```

**字段说明：**
- `pagePath`: 页面路径，必须与 CMS 中的 pagePath 完全匹配
- `schemas`: 包含三种语言的 Schema 数据
  - `zh-Hans`: 简体中文
  - `en`: 英文
  - `zh-Hant`: 繁体中文
- Schema 数据可以是单个对象或数组（用于多个 Schema）

## 🎨 常见 Schema 类型

### 产品页面
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
  "image": "产品图片URL"
}
```

### 医疗设备
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalDevice",
  "name": "设备名称",
  "description": "设备描述",
  "deviceCategory": "医疗设备分类",
  "purpose": "用途说明",
  "manufacturer": {
    "@type": "Organization",
    "name": "BrainCo"
  }
}
```

### 面包屑导航
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

## ✏️ 如何修改 Schema 数据

### 方式一：通过 CMS 后台（推荐）

1. 登录 Strapi 后台
2. 进入 Content Manager → Page SEO
3. 选择要修改的页面
4. 切换到对应语言
5. 编辑 `structuredData` 字段
6. 点击保存

**优势：** 
- 即时生效，无需重新部署
- 适合 SEO 团队日常维护
- 可以随时回滚

### 方式二：修改配置文件

1. 编辑 `scripts/schema-data-config.json`
2. 修改对应页面的 Schema 数据
3. 运行导入脚本：`node scripts/import-schema-data.js`

**适用场景：**
- 批量更新多个页面
- 初始化或重置数据
- 版本控制和备份

## 📋 已配置的页面列表

### 产品页面
- ✅ /products/brain-robotics - BrainRobotics智能仿生手
- ✅ /products/mobius - Mobius脑控轮椅
- ✅ /products/revo1 - Revo1康复机器人
- ✅ /products/revo2 - Revo2康复机器人

### 健康产品
- ✅ /health/easleep - EaSleep睡眠改善头环
- ✅ /health/focus-zen - Focus Zen专注力训练
- ✅ /health/focus-xin - Focus Xin智能头环
- ✅ /health/oxyzen - Oxyzen脑健康训练
- ✅ /health/starkids - StarKids儿童训练

### 教育产品
- ✅ /education/brain-ai - Brain AI智慧教育

### 公司页面
- ✅ / - 首页
- ✅ /about - 关于我们
- ✅ /company - 公司介绍
- ✅ /contact - 联系我们
- ✅ /technology - 技术介绍

### 其他页面
- ✅ /news - 新闻资讯
- ✅ /recruit - 招聘
- ✅ /recruit/jobs - 职位列表

## ⚠️ 注意事项

1. **pagePath 必须匹配**
   - 配置文件中的 `pagePath` 必须与 CMS 中完全一致
   - 路径区分大小写

2. **JSON 格式正确**
   - 确保 JSON 格式正确，没有语法错误
   - 使用在线工具验证：https://jsonlint.com/

3. **URL 使用完整路径**
   - 所有 URL 必须包含域名（如 https://www.brainco.cn）
   - 不要使用相对路径

4. **图片 URL 可访问**
   - 确保所有图片 URL 都可以正常访问
   - 建议使用 CDN 地址

5. **避免重复导入**
   - 导入脚本会覆盖现有数据
   - 导入前最好备份当前数据

## 🔧 故障排除

### 问题：403 Forbidden 错误

**原因：** API Token 权限不足或未配置

**解决：**
1. 检查 `.env` 中的 `CMS_API_TOKEN` 是否正确
2. 在 Strapi 后台确认 Token 权限为 `Full access`
3. 确保 Page SEO 的 `update` 权限已开启

### 问题：未找到对应的 SEO 记录

**原因：** CMS 中该页面的 SEO 数据不存在

**解决：**
1. 先在 CMS 中创建对应页面的 SEO 记录
2. 确保 `pagePath` 和语言设置正确
3. 重新运行导入脚本

### 问题：Schema 数据未显示在网页中

**原因：** 前端缓存或 CMS 缓存

**解决：**
1. 清除浏览器缓存
2. 重启前端开发服务器
3. 在 CMS 中确认数据已保存
4. 等待 revalidate 时间（默认1小时）

## 📚 相关文档

- [Schema 配置指南](./SCHEMA_DATA_CONFIGURATION.md) - 详细的 Schema 类型说明
- [SEO 架构设计](./SEO_ARCHITECTURE.md) - 整体 SEO 架构
- [Schema.org 官方文档](https://schema.org/) - Schema 类型参考

## 💡 最佳实践

1. **定期验证**
   - 每次修改后使用 Google Rich Results Test 验证
   - 确保 Schema 数据符合规范

2. **版本控制**
   - 将 `schema-data-config.json` 纳入版本控制
   - 重大修改前做好备份

3. **文档同步**
   - 新增页面时及时更新配置文件
   - 保持文档和实际数据一致

4. **性能监控**
   - 关注 Search Console 中的增强型结果
   - 监控搜索结果展现效果

## 🎯 下一步

1. ✅ 运行导入脚本，完成初始数据导入
2. ✅ 在 CMS 中验证数据正确性
3. ✅ 使用验证工具测试 Schema 数据
4. ✅ 培训 SEO 团队使用 CMS 修改数据
5. ✅ 监控搜索引擎收录效果

