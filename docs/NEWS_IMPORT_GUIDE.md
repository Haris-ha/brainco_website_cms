# 新闻数据导入指南

## 📋 快速开始

### 前提条件

1. Strapi 已启动并运行：`npm run develop`
2. 已在 Strapi 后台启用英文 locale（Settings → INTERNATIONALIZATION → English）

### 导入步骤

```bash
# 1. 转换数据为多语言结构
node scripts/transform-news-data.js

# 2. 导入到 CMS
node scripts/import-news-multilang.js
```

## 📊 数据结构

采用与 `seo-schema-data.json` 相同的多语言结构：

```json
{
  "news": [
    {
      "sourceId": 133,
      "locales": {
        "zh-Hans": {
          "title": "BrainCo智能仿生手亮相..."
        },
        "en": {
          "title": "BrainCo Intelligent Bionic Hand..."
        }
      },
      "newsDate": "2023-10-22T09:24:19.913Z",
      "coverImage": "https://...",
      "externalUrl": "https://...",
      "isHot": false,
      "sortIndex": 1
    }
  ]
}
```

## 🔧 工作原理

1. **转换脚本** (`transform-news-data.js`)：
   - 读取 `data/new.json`（原始数据）
   - 读取 `data/news-titles-en.json`（英文标题映射）
   - 生成 `data/news-multilang.json`（多语言结构）

2. **导入脚本** (`import-news-multilang.js`)：
   - 为每种语言（zh-Hans, en）创建独立记录
   - 使用 `?locale=` 参数指定语言
   - Strapi 自动通过 `sourceId` 关联不同语言版本
   - 自动检查已存在记录，避免重复导入
   - 自动发布新闻

## 🎯 字段说明

### 国际化字段（在 `locales` 中）
- `title`: 新闻标题（每种语言不同）

### 共享字段（根级别）
- `sourceId`: 原始ID（localized: false，用于关联多语言版本）
- `newsDate`: 发布日期
- `coverImage`: 封面图片URL
- `externalUrl`: 外部链接（微信文章）
- `isHot`: 是否热门
- `sortIndex`: 排序索引

## ✅ 验证导入结果

1. **CMS 后台验证**：
   - Content Manager → News
   - 选择任意新闻
   - 右上角切换语言：🇨🇳 zh-Hans ↔️ 🇬🇧 en
   - 确认标题已正确翻译

2. **前端验证**：
   - 中文页面：`/zh-CN/news`
   - 英文页面：`/en/news`

## 🔄 更新数据

如需更新英文标题：

```bash
# 1. 编辑 data/news-titles-en.json
# 2. 重新转换
node scripts/transform-news-data.js
# 3. 重新导入（会自动更新已存在的记录）
node scripts/import-news-multilang.js
```

## 💡 最佳实践

1. **使用 API Token**：
   ```bash
   export STRAPI_API_TOKEN=你的token
   ```

2. **定期备份**：导入前备份 CMS 数据库

3. **版本控制**：
   - ✅ `news-titles-en.json` 纳入 Git
   - ❌ `news-multilang.json` 可以忽略（自动生成）

## ❓ 常见问题

**Q: 导入失败，提示 "fetch failed"？**  
A: 确认 Strapi 正在运行（`http://localhost:1337`）

**Q: 导入成功但只有中文没有英文？**  
A: 确认已在 Strapi 后台启用英文 locale（Settings → INTERNATIONALIZATION）

**Q: 部分新闻导入失败，提示 "Internal Server Error"？**  
A: 可能是 URL 太长，已修复 schema（`externalUrl` 改为 `text` 类型）

---

**更新日期**：2025-11-01

