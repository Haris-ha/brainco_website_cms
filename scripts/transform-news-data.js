/**
 * 新闻数据转换脚本
 * 将原始的 new.json 和 news-titles-en.json 转换为多语言结构数据
 * 
 * 使用方法：
 * node scripts/transform-news-data.js
 * 
 * 输出：data/news-multilang.json
 */

const fs = require('fs');
const path = require('path');

// 读取原始新闻数据
const newsDataPath = path.join(__dirname, '../data/new.json');
const newsData = JSON.parse(fs.readFileSync(newsDataPath, 'utf8'));

// 读取英文标题映射
const englishTitlesPath = path.join(__dirname, '../data/news-titles-en.json');
let englishTitles = {};
try {
  const englishTitlesData = JSON.parse(fs.readFileSync(englishTitlesPath, 'utf8'));
  englishTitles = englishTitlesData.titles || {};
  console.log(`✅ 成功加载 ${Object.keys(englishTitles).length} 条英文标题映射\n`);
} catch (error) {
  console.warn('⚠️  未找到英文标题映射文件\n');
}

// 转换为多语言结构
function transformToMultilangStructure() {
  console.log('🔄 开始转换新闻数据为多语言结构...\n');
  
  if (!newsData.data || !newsData.data.list) {
    console.error('❌ 数据格式错误: 缺少 data.list');
    return;
  }
  
  const newsList = newsData.data.list;
  
  // 过滤掉已删除的新闻
  const activeNews = newsList.filter(item => !item.deleted);
  console.log(`📰 共找到 ${newsList.length} 条新闻，其中 ${activeNews.length} 条有效（deleted=false）\n`);
  
  const transformedData = {
    news: activeNews.map(item => {
      const sourceId = String(item.id);
      const englishTitle = englishTitles[sourceId] || item.title;
      
      return {
        sourceId: item.id,
        locales: {
          "zh-Hans": {
            title: item.title
          },
          "en": {
            title: englishTitle
          }
        },
        newsDate: new Date(item.newsDate).toISOString(),
        coverImage: item.icon,
        externalUrl: item.url,
        isHot: item.hot || false,
        sortIndex: item.sortIndex || 0
      };
    })
  };
  
  return transformedData;
}

// 执行转换
const multilangData = transformToMultilangStructure();

if (multilangData) {
  // 保存为新文件
  const outputPath = path.join(__dirname, '../data/news-multilang.json');
  fs.writeFileSync(outputPath, JSON.stringify(multilangData, null, 2), 'utf8');
  
  console.log('✅ 转换完成！');
  console.log(`📁 输出文件: ${outputPath}`);
  console.log(`📊 统计信息:`);
  console.log(`   - 总条目: ${multilangData.news.length}`);
  console.log(`   - 有英文翻译: ${multilangData.news.filter(n => englishTitles[n.sourceId]).length}`);
  console.log(`   - 使用中文fallback: ${multilangData.news.filter(n => !englishTitles[n.sourceId]).length}`);
  console.log('\n💡 下一步: 运行导入脚本');
  console.log('   node scripts/import-news-multilang.js');
}

