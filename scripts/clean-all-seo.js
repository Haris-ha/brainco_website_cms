/**
 * 彻底清理所有 Page SEO 数据
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is not set!');
  process.exit(1);
}

async function deleteAllEntries() {
  console.log('🧹 Cleaning all Page SEO entries (all locales)...\n');
  
  let totalDeleted = 0;
  const locales = ['zh-Hans', 'en', 'zh-Hant'];
  
  // 先收集所有要删除的ID
  let allEntriesToDelete = [];
  
  for (const locale of locales) {
    console.log(`\n🔍 Collecting entries for locale: ${locale}`);
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/page-seos?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=100`,
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
        
        if (entries.length === 0) {
          hasMore = false;
          break;
        }
        
        console.log(`   Found ${entries.length} entries on page ${page}`);
        allEntriesToDelete = allEntriesToDelete.concat(
          entries.map(e => ({ id: e.id, pageName: e.pageName, locale }))
        );
        
        // 检查是否还有更多页
        const pagination = result.meta?.pagination;
        if (pagination && page < pagination.pageCount) {
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error('❌ Error fetching:', error.message);
        hasMore = false;
      }
    }
  }
  
  console.log(`\n📊 Total entries to delete: ${allEntriesToDelete.length}\n`);
  
  // 现在删除所有收集到的条目
  for (const entry of allEntriesToDelete) {
    try {
      const deleteResponse = await fetch(`${STRAPI_URL}/api/page-seos/${entry.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (deleteResponse.ok) {
        totalDeleted++;
        console.log(`✅ Deleted ID: ${entry.id} (${entry.pageName} - ${entry.locale})`);
      } else {
        const errorText = await deleteResponse.text();
        console.log(`⚠️  Failed to delete ID: ${entry.id} - ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting ID: ${entry.id}`, error.message);
    }
  }
  
  console.log(`\n✅ Total deleted: ${totalDeleted} / ${allEntriesToDelete.length} entries`);
  console.log('\n🎉 Cleanup completed!\n');
}

deleteAllEntries().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});


