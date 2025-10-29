# BrainCo SEO 数据批量导入指南

本指南说明如何使用批量导入脚本将专业的 SEO 数据导入到 Strapi CMS。

## 📋 文件说明

### 1. `seo-data.json`
包含所有页面的 SEO 配置数据，已生成以下18个页面的三语版本（简体中文、英文、繁体中文）：

#### 公司页面
- `/about` - 关于我们
- `/company` - 公司介绍
- `/contact` - 联系我们
- `/technology` - 技术介绍

#### 产品页面
- `/products` - 产品中心
- `/products/brain-robotics` - BrainRobotics 智能仿生手
- `/products/mobius` - Mobius 脑控轮椅
- `/products/revo1` - Revo1 单手康复机器人
- `/products/revo2` - Revo2 双手康复机器人

#### 健康产品页面
- `/health/easleep` - EaSleep 睡眠改善头环
- `/health/focus-zen` - Focus Zen 专注力训练头环
- `/health/focus-xin` - Focus Xin 智能专注力头环
- `/health/oxyzen` - Oxyzen 脑健康训练系统
- `/health/starkids` - StarKids 儿童专注力训练系统

#### 教育产品页面
- `/education/brain-ai` - Brain AI 智慧教育系统

#### 其他页面
- `/news` - 新闻资讯
- `/recruit` - 招聘
- `/recruit/jobs` - 职位列表

**总计**: 18个页面 × 3种语言 = 54条 SEO 配置

### 2. `import-seo-data.js`
批量导入脚本，自动将 `seo-data.json` 中的数据导入到 Strapi。

## 🚀 使用步骤

### 第一步：确保 Strapi 运行中

```bash
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
pnpm run develop
```

确认 Strapi 在 http://localhost:1337 正常运行。

### 第二步：创建 API Token

1. 登录 Strapi 管理面板：http://localhost:1337/admin
2. 进入 **Settings** → **API Tokens**
3. 点击 **Create new API Token**
4. 填写信息：
   - **Name**: SEO Import Token
   - **Description**: Token for importing SEO data
   - **Token duration**: 无限期或选择合适的时长
   - **Token type**: **Full access** (完全访问权限)
5. 点击 **Save**
6. **立即复制生成的 Token**（只显示一次！）

### 第三步：设置环境变量

```bash
# 在终端中设置 API Token
export STRAPI_API_TOKEN=your-token-here

# 可选：自定义 Strapi URL（默认为 localhost:1337）
export STRAPI_URL=http://localhost:1337
```

**提示**：将 `your-token-here` 替换为刚才复制的实际 Token。

### 第四步：运行导入脚本

```bash
# 在项目根目录运行
cd /Users/harris/Desktop/BrainCo/brainco_website_cms
node scripts/import-seo-data.js
```

### 第五步：查看结果

脚本将显示导入进度和结果：

```
🚀 BrainCo SEO Data Import Script

📍 Strapi URL: http://localhost:1337
📦 Total pages to import: 18
📊 Total SEO entries: 54 (3 locales per page)

────────────────────────────────────────────────────────────

📝 Processing: about (zh-CN)
   + Creating new entry
   ✅ Created successfully

📝 Processing: about (en-US)
   + Creating new entry
   ✅ Created successfully

...

────────────────────────────────────────────────────────────

📊 Import Summary:

   Total entries processed: 54
   ✅ Created: 54
   ↻ Updated: 0
   ❌ Failed: 0

✨ Import completed!
```

## 📊 SEO 数据特点

所有 SEO 数据均由 SEO 专家精心编写，符合最佳实践：

### ✅ Title 优化
- 长度控制在 10-60 字符
- 包含核心关键词
- 清晰传达页面价值
- 包含品牌名称

### ✅ Description 优化
- 长度控制在 50-160 字符
- 准确描述页面内容
- 包含行动号召
- 针对用户搜索意图优化

### ✅ Keywords 优化
- 3-7 个精准关键词
- 避免关键词堆砌
- 结合品牌词和行业词
- 考虑用户搜索习惯

### ✅ Open Graph 优化
- 优化社交媒体分享标题
- 吸引人的 OG 描述
- 设置正确的 OG 类型

### ✅ 多语言支持
- 简体中文 (zh-CN)：针对中国大陆用户
- 英文 (en-US)：针对国际用户
- 繁体中文 (zh-TW)：针对港澳台用户

## 🔍 验证导入结果

### 方法 1：在 Strapi 管理面板中查看

1. 进入 **Content Manager** → **Page SEO**
2. 查看创建的条目数量（应该有 54 条）
3. 点击任意条目查看详情
4. 使用语言切换器查看不同语言版本

### 方法 2：通过 API 验证

```bash
# 测试获取首页 SEO（中文）
curl "http://localhost:1337/api/page-seos/by-name?name=about&locale=zh-CN"

# 测试获取产品页 SEO（英文）
curl "http://localhost:1337/api/page-seos/by-path?path=/products&locale=en-US"

# 测试获取新闻页 SEO（繁体）
curl "http://localhost:1337/api/page-seos/by-name?name=news&locale=zh-TW"
```

## 🛠️ 更新 SEO 数据

如果需要更新 SEO 配置：

### 方法 1：修改 JSON 后重新导入

1. 编辑 `scripts/seo-data.json`
2. 修改需要更新的内容
3. 重新运行导入脚本：
   ```bash
   node scripts/import-seo-data.js
   ```
4. 脚本会自动检测已存在的条目并更新

### 方法 2：在 Strapi 管理面板中手动修改

1. 进入 **Content Manager** → **Page SEO**
2. 找到要修改的条目
3. 点击编辑
4. 修改内容后保存并发布

## 📝 添加新页面的 SEO

### 方法 1：添加到 JSON 并导入

1. 编辑 `scripts/seo-data.json`
2. 在 `pages` 数组中添加新页面：

```json
{
  "pageName": "new-page",
  "pagePath": "/new-page",
  "locales": {
    "zh-CN": {
      "metaTitle": "新页面标题 - BrainCo",
      "metaDescription": "新页面描述...",
      "keywords": "关键词1, 关键词2",
      "ogTitle": "社交媒体标题",
      "ogDescription": "社交媒体描述"
    },
    "en-US": {
      "metaTitle": "New Page Title - BrainCo",
      "metaDescription": "New page description...",
      "keywords": "keyword1, keyword2",
      "ogTitle": "Social Media Title",
      "ogDescription": "Social media description"
    },
    "zh-TW": {
      "metaTitle": "新頁面標題 - BrainCo",
      "metaDescription": "新頁面描述...",
      "keywords": "關鍵詞1, 關鍵詞2",
      "ogTitle": "社交媒體標題",
      "ogDescription": "社交媒體描述"
    }
  }
}
```

3. 运行导入脚本

### 方法 2：直接在 Strapi 中创建

参考 [STRAPI_SEO_SETUP.md](../STRAPI_SEO_SETUP.md) 中的详细步骤。

## ⚠️ 常见问题

### Q1: 导入时提示 "STRAPI_API_TOKEN is not set"

**A**: 需要先创建并设置 API Token：
```bash
export STRAPI_API_TOKEN=your-token-here
```

### Q2: 导入失败，提示权限错误

**A**: 确保：
1. API Token 的类型是 "Full access"
2. Page-seo 的权限已正确配置
3. Token 没有过期

### Q3: 部分条目导入失败

**A**: 查看错误信息：
- 检查 JSON 格式是否正确
- 确认必填字段都已填写
- 查看 Strapi 日志获取详细错误

### Q4: 如何删除所有导入的数据重新开始？

**A**: 
1. 在 Strapi 管理面板中：Content Manager → Page SEO
2. 全选所有条目
3. 点击删除按钮
4. 确认删除
5. 重新运行导入脚本

### Q5: 导入后在网站上看不到效果

**A**: 
1. 确认 SEO 数据已发布（不是草稿状态）
2. 检查 Next.js 页面是否正确调用 SEO 函数
3. 清除 Next.js 缓存：`rm -rf .next`
4. 重启 Next.js：`pnpm dev`

## 🎯 SEO 最佳实践提醒

### 定期优化

- **每月**: 审查 SEO 数据的准确性
- **每季度**: 根据搜索趋势更新关键词
- **每半年**: 全面审计所有页面的 SEO

### 监控指标

使用 Google Search Console 监控：
- 页面索引状态
- 搜索展现量
- 点击率 (CTR)
- 平均排名
- 富媒体结果

### 持续改进

- A/B 测试不同的标题和描述
- 分析表现最好的页面
- 学习竞争对手的 SEO 策略
- 关注搜索引擎算法更新

## 📚 相关文档

- [SEO_README.md](../SEO_README.md) - 系统总览
- [SEO_QUICKSTART.md](../SEO_QUICKSTART.md) - 快速入门
- [STRAPI_SEO_SETUP.md](../STRAPI_SEO_SETUP.md) - Strapi 详细配置
- [SEO_GUIDE.md](../website/brainco_website_seo/SEO_GUIDE.md) - Next.js 使用指南

## 🤝 需要帮助？

- 技术支持：tech@brainco.cn
- 文档问题：提交 Issue
- SEO 咨询：联系市场团队

---

**创建日期**: 2025年10月29日  
**最后更新**: 2025年10月29日  
**版本**: v1.0.0  
**维护者**: BrainCo 技术团队



