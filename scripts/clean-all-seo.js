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
  console.log('🧹 Cleaning all Page SEO entries...\n');
  
  let totalDeleted = 0;
  let hasMore = true;
  
  // 持续删除直到没有更多数据
  while (hasMore) {
    try {
      // 每次获取100条
      const response = await fetch(`${STRAPI_URL}/api/page-seos?pagination[limit]=100&pagination[start]=0`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch entries: ${response.statusText}`);
      }
      
      const result = await response.json();
      const entries = result.data || [];
      
      if (entries.length === 0) {
        hasMore = false;
        break;
      }
      
      console.log(`Found ${entries.length} entries, deleting...\n`);
      
      // 删除每个条目
      for (const entry of entries) {
        try {
          const deleteResponse = await fetch(`${STRAPI_URL}/api/page-seos/${entry.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
            },
          });
          
          if (deleteResponse.ok) {
            totalDeleted++;
            console.log(`   ✅ Deleted entry ID: ${entry.id} (${entry.attributes?.pageName || 'unknown'})`);
          } else {
            console.log(`   ⚠️  Failed to delete entry ID: ${entry.id}`);
          }
        } catch (error) {
          console.error(`   ❌ Error deleting entry ID: ${entry.id}`, error.message);
        }
      }
      
      // 等待一下让数据库更新
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      hasMore = false;
    }
  }
  
  console.log(`\n✅ Total deleted: ${totalDeleted} entries`);
  console.log('\n🎉 All Page SEO data has been cleaned!\n');
}

deleteAllEntries().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

