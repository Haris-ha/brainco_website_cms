/**
 * 多语言新闻数据导入脚本
 * 参考 import-seo-schema-data.js 的成功模式
 * 为每种语言创建独立记录，Strapi 自动处理关联
 * 
 * 使用方法：
 * export STRAPI_API_TOKEN=你的token
 * node scripts/import-news-multilang.js
 */

const fs = require('fs');
const path = require('path');

// Strapi API配置
const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:1337';
const CMS_API_TOKEN = process.env.CMS_API_TOKEN || process.env.STRAPI_API_TOKEN;

// 读取多语言新闻数据
const multilangDataPath = path.join(__dirname, '../data/news-multilang.json');
let multilangData;

try {
  multilangData = JSON.parse(fs.readFileSync(multilangDataPath, 'utf8'));
  console.log(`✅ 成功加载多语言新闻数据\n`);
} catch (error) {
  console.error('❌ 未找到 news-multilang.json 文件');
  console.error('   请先运行: node scripts/transform-news-data.js');
  process.exit(1);
}

/**
 * 检查指定 sourceId 和 locale 的新闻是否存在
 */
async function checkExisting(sourceId, locale) {
  const params = new URLSearchParams({
    'filters[sourceId][$eq]': sourceId,
    'locale': locale,
  });

  const url = `${CMS_API_URL}/api/newses?${params.toString()}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (CMS_API_TOKEN) {
    headers['Authorization'] = `Bearer ${CMS_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error(`Error checking existing news:`, error.message);
    return null;
  }
}

/**
 * 创建新闻记录（指定语言）
 */
async function createNews(newsItem, locale) {
  const url = `${CMS_API_URL}/api/newses?locale=${locale}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (CMS_API_TOKEN) {
    headers['Authorization'] = `Bearer ${CMS_API_TOKEN}`;
  }

  const data = {
    sourceId: newsItem.sourceId,
    title: newsItem.locales[locale].title,
    newsDate: newsItem.newsDate,
    coverImage: newsItem.coverImage,
    externalUrl: newsItem.externalUrl,
    isHot: newsItem.isHot,
    sortIndex: newsItem.sortIndex,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    // 自动发布
    if (result.data && result.data.id) {
      await fetch(`${CMS_API_URL}/api/newses/${result.data.id}?locale=${locale}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          data: {
            publishedAt: new Date().toISOString(),
          },
        }),
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 更新现有新闻记录
 */
async function updateNews(existingRecord, newsItem, locale) {
  const url = `${CMS_API_URL}/api/newses/${existingRecord.id}?locale=${locale}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (CMS_API_TOKEN) {
    headers['Authorization'] = `Bearer ${CMS_API_TOKEN}`;
  }

  const data = {
    sourceId: newsItem.sourceId,
    title: newsItem.locales[locale].title,
    newsDate: newsItem.newsDate,
    coverImage: newsItem.coverImage,
    externalUrl: newsItem.externalUrl,
    isHot: newsItem.isHot,
    sortIndex: newsItem.sortIndex,
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * 主导入函数
 */
async function importMultilangNews() {
  console.log('🚀 开始导入多语言新闻数据...\n');
  
  // 检查 API Token
  if (!CMS_API_TOKEN) {
    console.warn('⚠️  警告: 未设置 STRAPI_API_TOKEN，将使用 Public 权限');
    console.warn('   建议设置 Token: export STRAPI_API_TOKEN=your-token\n');
  }
  
  if (!multilangData.news || !Array.isArray(multilangData.news)) {
    console.error('❌ 数据格式错误: 缺少 news 数组');
    return;
  }
  
  const newsList = multilangData.news;
  console.log(`📰 共 ${newsList.length} 条新闻待导入`);
  console.log(`📊 预计导入: ${newsList.length * 2} 条记录 (每条2种语言)\n`);
  console.log('─'.repeat(60));
  
  let zhCreateCount = 0;
  let zhUpdateCount = 0;
  let enCreateCount = 0;
  let enUpdateCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const [index, item] of newsList.entries()) {
    try {
      const chineseTitle = item.locales['zh-Hans'].title;
      const englishTitle = item.locales['en'].title;
      const hasTranslation = chineseTitle !== englishTitle;
      
      console.log(`\n[${index + 1}/${newsList.length}] 处理: ${chineseTitle.substring(0, 40)}...`);
      
      // 处理简体中文版本
      try {
        const existingZh = await checkExisting(item.sourceId, 'zh-Hans');
        
        if (existingZh) {
          await updateNews(existingZh, item, 'zh-Hans');
          console.log(`   ✅ zh-Hans: 已更新 (ID: ${existingZh.id})`);
          zhUpdateCount++;
        } else {
          const result = await createNews(item, 'zh-Hans');
          console.log(`   ✅ zh-Hans: 已创建 (ID: ${result.data.id})`);
          zhCreateCount++;
        }
        
        // 添加延迟
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.log(`   ❌ zh-Hans: 失败 - ${error.message}`);
        errors.push({
          sourceId: item.sourceId,
          locale: 'zh-Hans',
          title: chineseTitle,
          error: error.message,
        });
        errorCount++;
      }
      
      // 处理英文版本
      try {
        const existingEn = await checkExisting(item.sourceId, 'en');
        
        if (existingEn) {
          await updateNews(existingEn, item, 'en');
          console.log(`   ✅ en: 已更新 (ID: ${existingEn.id})${hasTranslation ? ' (已翻译)' : ' (中文fallback)'}`);
          enUpdateCount++;
        } else {
          const result = await createNews(item, 'en');
          console.log(`   ✅ en: 已创建 (ID: ${result.data.id})${hasTranslation ? ' (已翻译)' : ' (中文fallback)'}`);
          enCreateCount++;
        }
        
        // 添加延迟
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.log(`   ❌ en: 失败 - ${error.message}`);
        errors.push({
          sourceId: item.sourceId,
          locale: 'en',
          title: englishTitle,
          error: error.message,
        });
        errorCount++;
      }
      
    } catch (error) {
      console.error(`   ❌ 处理失败: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 导入统计:\n');
  console.log(`   总处理数: ${(zhCreateCount + zhUpdateCount + enCreateCount + enUpdateCount + errorCount)}`);
  console.log(`   简体中文:`);
  console.log(`     - 创建: ${zhCreateCount}`);
  console.log(`     - 更新: ${zhUpdateCount}`);
  console.log(`   英文:`);
  console.log(`     - 创建: ${enCreateCount}`);
  console.log(`     - 更新: ${enUpdateCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);
  
  // 输出错误详情
  if (errors.length > 0) {
    console.log('\n❌ 错误详情:\n');
    errors.slice(0, 10).forEach(({ sourceId, locale, title, error }, index) => {
      console.log(`   ${index + 1}. [${locale}] ${title.substring(0, 40)}... (sourceId: ${sourceId})`);
      console.log(`      错误: ${error}`);
    });
    if (errors.length > 10) {
      console.log(`   ... 还有 ${errors.length - 10} 个错误`);
    }
  }
  
  console.log('\n✨ 导入完成！\n');
  
  if (zhCreateCount > 0 || enCreateCount > 0 || zhUpdateCount > 0 || enUpdateCount > 0) {
    console.log('📝 下一步:');
    console.log('1. 在 Strapi 后台验证数据');
    console.log('   - Content Manager → News');
    console.log('   - 使用右上角的语言切换器查看不同语言版本');
    console.log('2. 确认所有新闻已发布（Publish）');
    console.log('3. 访问前端验证显示效果\n');
  }
  
  if (errorCount > 0) {
    process.exit(1);
  }
}

// 执行导入
importMultilangNews().catch(error => {
  console.error('❌ 导入过程出错:', error);
  process.exit(1);
});

