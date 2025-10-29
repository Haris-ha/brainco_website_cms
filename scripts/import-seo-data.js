/**
 * BrainCo SEO Data Import Script
 * 批量导入 SEO 配置到 Strapi
 * 
 * 使用方法:
 * 1. 确保 Strapi 正在运行 (pnpm run develop)
 * 2. 在 Strapi 中创建 API Token: Settings > API Tokens > Create new API Token
 * 3. 设置环境变量: export STRAPI_API_TOKEN=your-token-here
 * 4. 运行脚本: node scripts/import-seo-data.js
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is not set!');
  console.log('\n📝 To create an API token:');
  console.log('1. Login to Strapi admin panel');
  console.log('2. Go to Settings > API Tokens');
  console.log('3. Click "Create new API Token"');
  console.log('4. Set Token type to "Full access"');
  console.log('5. Copy the token and run:');
  console.log('   export STRAPI_API_TOKEN=your-token-here\n');
  process.exit(1);
}

// 读取 SEO 数据
const seoDataPath = path.join(__dirname, 'seo-data.json');
const seoData = JSON.parse(fs.readFileSync(seoDataPath, 'utf8'));

// 统计信息
const stats = {
  total: 0,
  created: 0,
  updated: 0,
  failed: 0,
  errors: [],
};

/**
 * 创建或更新 SEO 配置
 */
async function createOrUpdateSEO(page) {
  const { pageName, pagePath, locales } = page;
  
  for (const [locale, seoContent] of Object.entries(locales)) {
    stats.total++;
    
    try {
      console.log(`\n📝 Processing: ${pageName} (${locale})`);
      
      // 检查是否已存在
      const existingUrl = `${STRAPI_URL}/api/page-seos?filters[pageName][$eq]=${pageName}&filters[locale][$eq]=${locale}&locale=${locale}`;
      const existingResponse = await fetch(existingUrl, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });
      
      if (!existingResponse.ok) {
        throw new Error(`Failed to check existing entry: ${existingResponse.statusText}`);
      }
      
      const existingData = await existingResponse.json();
      const exists = existingData.data && existingData.data.length > 0;
      
      // 准备数据
      const data = {
        pageName,
        pagePath,
        locale,
        metaTitle: seoContent.metaTitle,
        metaDescription: seoContent.metaDescription,
        keywords: seoContent.keywords,
        metaRobots: 'index,follow',
        canonicalURL: seoContent.canonicalURL || null,
        ogTitle: seoContent.ogTitle || seoContent.metaTitle,
        ogDescription: seoContent.ogDescription || seoContent.metaDescription,
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: seoContent.ogTitle || seoContent.metaTitle,
        twitterDescription: seoContent.ogDescription || seoContent.metaDescription,
        publishedAt: new Date().toISOString(),
      };
      
      let response;
      
      if (exists) {
        // 更新现有条目
        const existingId = existingData.data[0].id;
        console.log(`   ↻ Updating existing entry (ID: ${existingId})`);
        
        response = await fetch(`${STRAPI_URL}/api/page-seos/${existingId}?locale=${locale}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ data }),
        });
        
        if (response.ok) {
          stats.updated++;
          console.log(`   ✅ Updated successfully`);
        }
      } else {
        // 创建新条目
        console.log(`   + Creating new entry`);
        
        response = await fetch(`${STRAPI_URL}/api/page-seos?locale=${locale}`, {
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
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      stats.failed++;
      const errorMsg = `Failed to process ${pageName} (${locale}): ${error.message}`;
      stats.errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 BrainCo SEO Data Import Script\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`📦 Total pages to import: ${seoData.pages.length}`);
  console.log(`📊 Total SEO entries: ${seoData.pages.length * 3} (3 locales per page)\n`);
  console.log('─'.repeat(60));
  
  // 处理所有页面
  for (const page of seoData.pages) {
    await createOrUpdateSEO(page);
  }
  
  // 显示统计信息
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 Import Summary:\n');
  console.log(`   Total entries processed: ${stats.total}`);
  console.log(`   ✅ Created: ${stats.created}`);
  console.log(`   ↻ Updated: ${stats.updated}`);
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

