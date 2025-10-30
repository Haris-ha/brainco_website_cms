/**
 * BrainCo SEO Data Clean and Re-import Script
 * 清理现有数据并重新导入所有SEO配置
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const SITE_URL = process.env.SITE_URL || 'https://www.brainco.cn';

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is not set!');
  process.exit(1);
}

// 读取 SEO 数据
const seoDataPath = path.join(__dirname, 'seo-data.json');
const seoData = JSON.parse(fs.readFileSync(seoDataPath, 'utf8'));

// 统计信息
const stats = {
  deleted: 0,
  created: 0,
  failed: 0,
  errors: [],
};

/**
 * 映射 Strapi locale 到 URL locale
 */
function mapLocaleToURL(strapiLocale) {
  const urlLocaleMap = {
    'zh-Hans': 'zh-CN',
    'en': 'en-US',
    'zh-Hant': 'zh-TW'
  };
  return urlLocaleMap[strapiLocale] || 'zh-CN';
}

/**
 * 生成 canonical URL
 */
function generateCanonicalURL(pagePath, strapiLocale) {
  const urlLocale = mapLocaleToURL(strapiLocale);
  const localePrefix = urlLocale === 'zh-CN' ? '' : `/${urlLocale}`;
  return `${SITE_URL}${localePrefix}${pagePath}`;
}

/**
 * 生成 Publisher 的 Structured Data (Schema.org)
 */
function generatePublisherSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'BrainCo',
    'url': SITE_URL,
    'logo': `${SITE_URL}/logo.webp`,
    'sameAs': [
      // 可以添加社交媒体链接
    ]
  };
}

/**
 * 删除所有现有的 SEO 条目（包括所有语言版本）
 */
async function deleteAllEntries() {
  console.log('\n🗑️  Step 1: Deleting existing entries...\n');
  
  try {
    let allEntries = [];
    let page = 1;
    let hasMore = true;
    const pageSize = 100;
    
    // 获取所有语言版本的条目
    const locales = ['zh-Hans', 'en', 'zh-Hant'];
    
    for (const locale of locales) {
      page = 1;
      hasMore = true;
      
      while (hasMore) {
        const response = await fetch(
          `${STRAPI_URL}/api/page-seos?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch entries: ${response.statusText}`);
        }
        
        const result = await response.json();
        const entries = result.data || [];
        allEntries = allEntries.concat(entries);
        
        // 检查是否还有更多页
        const pagination = result.meta?.pagination;
        hasMore = pagination && pagination.page < pagination.pageCount;
        page++;
      }
    }
    
    console.log(`Found ${allEntries.length} entries to delete (across all locales)\n`);
    
    // 删除每个条目
    for (const entry of allEntries) {
      try {
        const deleteResponse = await fetch(`${STRAPI_URL}/api/page-seos/${entry.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (deleteResponse.ok) {
          stats.deleted++;
          console.log(`   ✅ Deleted entry ID: ${entry.id} (${entry.pageName} - ${entry.locale || 'unknown'})`);
        } else {
          console.log(`   ⚠️  Failed to delete entry ID: ${entry.id}`);
        }
      } catch (error) {
        console.error(`   ❌ Error deleting entry ID: ${entry.id}`, error.message);
      }
    }
    
    console.log(`\n✅ Deleted ${stats.deleted} entries in total\n`);
    
  } catch (error) {
    console.error('❌ Error fetching entries:', error.message);
    throw error;
  }
}

/**
 * 创建 SEO 配置（不使用 i18n 的复杂关系）
 */
async function createSEO(page) {
  const { pageName, pagePath, locales } = page;
  
  for (const [locale, seoContent] of Object.entries(locales)) {
    try {
      // 映射语言代码
      const localeMap = {
        'zh-Hans': 'zh-Hans',
        'en': 'en',
        'zh-Hant': 'zh-Hant'
      };
      const strapiLocale = localeMap[locale] || locale;
      
      console.log(`📝 Creating: ${pageName} (${locale} -> ${strapiLocale})`);
      
      // 准备数据
      const data = {
        pageName,
        pagePath,
        locale: strapiLocale,
        metaTitle: seoContent.metaTitle,
        metaDescription: seoContent.metaDescription,
        keywords: seoContent.keywords || '',
        metaRobots: 'index,follow',
        canonicalURL: seoContent.canonicalURL || generateCanonicalURL(pagePath, strapiLocale),
        ogTitle: seoContent.ogTitle || seoContent.metaTitle,
        ogDescription: seoContent.ogDescription || seoContent.metaDescription,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: seoContent.ogTitle || seoContent.metaTitle,
        twitterDescription: seoContent.ogDescription || seoContent.metaDescription,
        structuredData: generatePublisherSchema(),
        publisher: 'BrainCo',
        xRobotsTag: 'index, follow',
      };
      
      // 创建新条目
      const response = await fetch(`${STRAPI_URL}/api/page-seos?locale=${strapiLocale}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ data }),
      });
      
      if (response.ok) {
        stats.created++;
        console.log(`   ✅ Created successfully`);
        
        // 立即发布
        const result = await response.json();
        if (result.data && result.data.id) {
          await fetch(`${STRAPI_URL}/api/page-seos/${result.data.id}?locale=${strapiLocale}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({
              data: {
                publishedAt: new Date().toISOString(),
              },
            }),
          });
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      stats.failed++;
      const errorMsg = `Failed to create ${pageName} (${locale}): ${error.message}`;
      stats.errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 BrainCo SEO Data Clean and Re-import Script\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`📦 Total pages to import: ${seoData.pages.length}`);
  console.log(`📊 Total SEO entries: ${seoData.pages.length * 3} (3 locales per page)\n`);
  console.log('─'.repeat(60));
  
  // Step 1: 删除现有条目
  await deleteAllEntries();
  
  // 等待一秒让数据库更新
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 2: 创建所有新条目
  console.log('📝 Step 2: Creating new entries...\n');
  
  for (const page of seoData.pages) {
    await createSEO(page);
  }
  
  // 显示统计信息
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 Import Summary:\n');
  console.log(`   🗑️  Deleted: ${stats.deleted}`);
  console.log(`   ✅ Created: ${stats.created}`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:\n');
    stats.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n✨ Import completed!\n');
  
  if (stats.failed > 0) {
    process.exit(1);
  }
}

// 运行脚本
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});


