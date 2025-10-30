/**
 * 完整 SEO + Schema 数据导入脚本
 * 从 seo-schema-data.json 导入所有 SEO 数据和 Schema 结构化数据
 * 
 * 使用方法:
 * 1. 设置环境变量: export CMS_API_TOKEN=your-token-here
 * 2. 运行脚本: node scripts/import-seo-schema-data.js
 */

const fs = require('fs');
const path = require('path');

// CMS API 配置
const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:1337';
const CMS_API_TOKEN = process.env.CMS_API_TOKEN || process.env.STRAPI_API_TOKEN;

// 语言映射
const localeMap = {
  'zh-Hans': 'zh-Hans',
  'en': 'en',
  'zh-Hant': 'zh-Hant',
};

/**
 * 检查指定页面和语言的 SEO 数据是否存在
 */
async function checkExisting(pageName, pagePath, locale) {
  const params = new URLSearchParams({
    'filters[pageName][$eq]': pageName,
    'filters[pagePath][$eq]': pagePath,
    'filters[locale][$eq]': locale,
    'locale': locale,
  });

  const url = `${CMS_API_URL}/api/page-seos?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CMS_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data && data.data.length > 0 ? data.data[0] : null;
}

/**
 * 创建新的 SEO 记录
 */
async function createSEO(pageName, pagePath, locale, seoData) {
  const url = `${CMS_API_URL}/api/page-seos?locale=${locale}`;
  
  const createData = {
    pageName,
    pagePath,
    locale,
    metaTitle: seoData.metaTitle || pageName,
    metaDescription: seoData.metaDescription || '',
    keywords: seoData.keywords || '',
    metaRobots: 'index,follow',
    xRobotsTag: 'index, follow',
    canonicalURL: seoData.canonicalURL || '',
    ogTitle: seoData.ogTitle || seoData.metaTitle || pageName,
    ogDescription: seoData.ogDescription || seoData.metaDescription || '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: seoData.twitterTitle || seoData.ogTitle || seoData.metaTitle || pageName,
    twitterDescription: seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription || '',
    structuredData: seoData.structuredData || null,
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CMS_API_TOKEN}`,
    },
    body: JSON.stringify({ data: createData }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  const result = await response.json();
  
  // 自动发布
  if (result.data && result.data.id) {
    await fetch(`${CMS_API_URL}/api/page-seos/${result.data.id}?locale=${locale}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CMS_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          publishedAt: new Date().toISOString(),
        },
      }),
    });
  }

  return result;
}

/**
 * 更新现有的 SEO 记录
 */
async function updateSEO(existingRecord, locale, seoData) {
  const url = `${CMS_API_URL}/api/page-seos/${existingRecord.id}?locale=${locale}`;
  
  const updateData = {
    pageName: existingRecord.pageName,
    pagePath: existingRecord.pagePath,
    locale,
    metaTitle: seoData.metaTitle || existingRecord.metaTitle,
    metaDescription: seoData.metaDescription || existingRecord.metaDescription,
    keywords: seoData.keywords || existingRecord.keywords,
    metaRobots: existingRecord.metaRobots || 'index,follow',
    xRobotsTag: existingRecord.xRobotsTag || 'index, follow',
    canonicalURL: seoData.canonicalURL || existingRecord.canonicalURL,
    ogTitle: seoData.ogTitle || existingRecord.ogTitle,
    ogDescription: seoData.ogDescription || existingRecord.ogDescription,
    ogType: existingRecord.ogType || 'website',
    twitterCard: existingRecord.twitterCard || 'summary_large_image',
    twitterTitle: seoData.twitterTitle || existingRecord.twitterTitle,
    twitterDescription: seoData.twitterDescription || existingRecord.twitterDescription,
    structuredData: seoData.structuredData !== undefined ? seoData.structuredData : existingRecord.structuredData,
  };
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CMS_API_TOKEN}`,
    },
    body: JSON.stringify({ data: updateData }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始导入完整 SEO + Schema 数据...\n');

  // 检查 API Token
  if (!CMS_API_TOKEN) {
    console.error('❌ 错误: 未设置 CMS_API_TOKEN 或 STRAPI_API_TOKEN 环境变量');
    console.error('   请运行: export CMS_API_TOKEN=your-token-here');
    process.exit(1);
  }

  // 读取合并后的数据文件
  const dataPath = path.join(__dirname, 'seo-schema-data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('❌ 错误: 未找到 seo-schema-data.json 文件');
    console.error('   请先运行: node scripts/merge-seo-schema.js');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📍 CMS URL: ${CMS_API_URL}`);
  console.log(`📦 总页面数: ${data.pages.length}`);
  console.log(`📊 预计导入: ${data.pages.length * 3} 条记录 (每页3种语言)\n`);
  console.log('─'.repeat(60));

  let createCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  // 遍历所有页面
  for (const page of data.pages) {
    const { pageName, pagePath, locales } = page;
    
    console.log(`\n📄 处理页面: ${pagePath} (${pageName})`);

    // 遍历所有语言
    for (const [locale, seoData] of Object.entries(locales)) {
      const strapiLocale = localeMap[locale];
      
      if (!strapiLocale) {
        console.log(`   ⚠️  ${locale}: 未知的语言代码，跳过`);
        skipCount++;
        continue;
      }

      if (!seoData || Object.keys(seoData).length === 0) {
        console.log(`   ⚠️  ${locale}: 无数据，跳过`);
        skipCount++;
        continue;
      }

      try {
        // 检查是否已存在
        const existing = await checkExisting(pageName, pagePath, strapiLocale);
        
        if (existing) {
          // 更新现有记录
          await updateSEO(existing, strapiLocale, seoData);
          console.log(`   ✅ ${locale}: 已更新 (ID: ${existing.id})`);
          updateCount++;
        } else {
          // 创建新记录
          const result = await createSEO(pageName, pagePath, strapiLocale, seoData);
          console.log(`   ✅ ${locale}: 已创建 (ID: ${result.data.id})`);
          createCount++;
        }
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`   ❌ ${locale}: 失败 - ${error.message}`);
        errors.push({
          pagePath,
          pageName,
          locale,
          error: error.message,
        });
        errorCount++;
      }
    }
  }

  // 输出统计信息
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 导入统计:\n');
  console.log(`   总处理数: ${createCount + updateCount + skipCount + errorCount}`);
  console.log(`   ✅ 创建: ${createCount}`);
  console.log(`   ✅ 更新: ${updateCount}`);
  console.log(`   ⚠️  跳过: ${skipCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);

  // 输出错误详情
  if (errors.length > 0) {
    console.log('\n❌ 错误详情:\n');
    errors.slice(0, 10).forEach(({ pagePath, pageName, locale, error }, index) => {
      console.log(`   ${index + 1}. ${pagePath} (${pageName}) [${locale}]: ${error}`);
    });
    if (errors.length > 10) {
      console.log(`   ... 还有 ${errors.length - 10} 个错误`);
    }
  }

  // 输出下一步提示
  console.log('\n✨ 导入完成！\n');
  
  if (createCount > 0 || updateCount > 0) {
    console.log('📝 下一步:');
    console.log('1. 在 Strapi 后台验证数据');
    console.log('   - Content Manager → Page SEO');
    console.log('   - 使用右上角的语言切换器查看不同语言版本');
    console.log('2. 检查网站页面的 SEO 元标签');
    console.log('3. 验证 Schema 结构化数据');
    console.log('   使用: https://search.google.com/test/rich-results\n');
  }

  // 如果有错误，退出码为 1
  if (errorCount > 0) {
    process.exit(1);
  }
}

// 执行主函数
main().catch((error) => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
