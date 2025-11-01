# 数据文件说明

本目录包含用于导入 Strapi CMS 的数据文件。

## 📂 文件列表

### 新闻相关数据

| 文件 | 说明 | 来源 | 更新频率 |
|------|------|------|----------|
| `new.json` | 原始新闻数据 | 旧版API备份 | 一次性 |
| `news-titles-en.json` | 英文标题映射 | 手动翻译 | 按需更新 |
| `news-multilang.json` | 多语言结构数据 | 脚本生成 | 自动生成 |

### 其他数据

| 文件 | 说明 |
|------|------|
| `data.json` | 原始全局数据 |
| `uploads/` | 媒体文件目录 |

## 🔄 数据转换流程

### 新闻数据多语言化

```
new.json (原始数据)
    +
news-titles-en.json (英文翻译)
    ↓
[transform-news-data.js]
    ↓
news-multilang.json (多语言结构)
    ↓
[import-news-multilang.js]
    ↓
Strapi CMS (zh-Hans + en)
```

### 执行命令

```bash
# 1. 转换数据
node scripts/transform-news-data.js

# 2. 导入CMS
node scripts/import-news-multilang.js
```

## 📊 数据结构

### new.json 结构

```json
{
  "code": 200,
  "success": true,
  "data": {
    "list": [
      {
        "id": 133,
        "title": "BrainCo智能仿生手亮相...",
        "icon": "https://...",
        "newsDate": 1697966659913,
        "url": "https://mp.weixin.qq.com/s/...",
        "hot": false,
        "sortIndex": 1,
        "deleted": false
      }
    ]
  }
}
```

### news-titles-en.json 结构

```json
{
  "titles": {
    "133": "BrainCo Intelligent Bionic Hand Shines...",
    "69": "BrainCo Intelligent Bionic Hand...",
    ...
  }
}
```

**说明**：
- Key: 原始新闻ID（字符串）
- Value: 英文标题

### news-multilang.json 结构（参考 seo-schema-data.json）

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

**说明**：
- 采用与 `seo-schema-data.json` 相同的多语言结构
- `locales` 对象包含不同语言版本
- 其他字段为共享数据

## 🎯 字段映射说明

### 原始数据 → 多语言数据

| 原始字段 | 多语言字段 | 说明 |
|---------|-----------|------|
| `id` | `sourceId` | 保留原始ID作为sourceId |
| `title` | `locales.zh-Hans.title` | 中文标题 |
| - | `locales.en.title` | 英文标题（从 news-titles-en.json） |
| `newsDate` | `newsDate` | 转换为ISO格式 |
| `icon` | `coverImage` | 封面图片URL |
| `url` | `externalUrl` | 外部链接 |
| `hot` | `isHot` | 是否热门 |
| `sortIndex` | `sortIndex` | 排序索引 |
| `deleted` | - | 过滤条件（deleted=false的才导入） |

### 不导入的字段

以下字段不会导入到CMS（Strapi会自动生成）：
- `created` / `updated`: Strapi 自动生成 `createdAt` / `updatedAt`
- `createdBy` / `updatedBy`: Strapi 自动关联当前用户

## 📝 维护指南

### 添加新的英文翻译

1. 编辑 `news-titles-en.json`
2. 添加映射：`"新闻ID": "English Title"`
3. 重新运行转换和导入脚本

### 更新新闻数据

**方式1：手动更新（推荐）**
- 直接在 Strapi CMS 后台编辑

**方式2：批量重新导入**
```bash
# 1. 更新源文件
# 2. 清理旧数据
node scripts/clean-news-data.js
# 3. 转换数据
node scripts/transform-news-data.js
# 4. 重新导入
node scripts/import-news-multilang.js
```

### 添加更多语言

1. 在 Strapi 后台添加新的 locale（如 zh-Hant）
2. 创建对应的标题映射文件（如 `news-titles-zh-Hant.json`）
3. 修改转换脚本支持新语言
4. 修改导入脚本创建新语言版本

## 🔗 相关文档

- [../scripts/README.md](../scripts/README.md) - 脚本使用说明
- [../docs/NEWS_MULTILANG_IMPORT_GUIDE.md](../docs/NEWS_MULTILANG_IMPORT_GUIDE.md) - 多语言导入详细指南

## ⚠️ 注意事项

1. **news-multilang.json 为自动生成文件**
   - 不要手动编辑
   - 可以安全删除（随时重新生成）
   - 建议添加到 `.gitignore`

2. **news-titles-en.json 需要版本控制**
   - 手动维护的翻译数据
   - 应该纳入 Git 管理
   - 定期备份

3. **数据一致性**
   - 导入前确保 Strapi 服务正在运行
   - 导入后在 CMS 后台验证数据
   - 批量发布前先检查几条样本数据

---

**更新日期**：2025-11-01
**维护者**：BrainCo CMS Team
