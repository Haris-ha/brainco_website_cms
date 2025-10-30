/**
 * 合并 SEO 数据和 Schema 数据脚本
 * 将 seo-data.json 和 schema-data-config.json 合并为一个完整的文件
 * 同时自动补充缺失的繁体中文数据
 */

const fs = require('fs');
const path = require('path');

// 简体转繁体的简单映射（常用字）
const s2tMap = {
  '强脑科技': '強腦科技',
  '脑机接口': '腦機接口',
  '技术': '技術',
  '公司': '公司',
  '全球领先': '全球領先',
  '智能仿生手': '智能仿生手',
  '脑控轮椅': '腦控輪椅',
  '专注力训练': '專注力訓練',
  '领导者': '領導者',
  '专利': '專利',
  '提供': '提供',
  '康复机器人': '康復機器人',
  '创新产品': '創新產品',
  '服务': '服務',
  '教育': '教育',
  '医疗': '醫療',
  '康复': '康復',
  '健康管理': '健康管理',
  '领域': '領域',
  '改变世界': '改變世界',
  '创新实验室': '創新實驗室',
  '孵化': '孵化',
  '国家': '國家',
  '解决方案': '解決方案',
  '关于我们': '關於我們',
  '非侵入式': '非侵入式',
  '致力于': '致力於',
  '赋能': '賦能',
  '人机交互': '人機交互',
  '了解': '了解',
  '愿景': '願景',
  '团队': '團隊',
  '发展历程': '發展歷程',
  '探索': '探索',
  '如何': '如何',
  '通过': '通過',
  '革命性': '革命性',
  '变革': '變革',
  '介绍': '介紹',
  '行业': '行業',
  '成立于': '成立於',
  '大学': '大學',
  '拥有': '擁有',
  '核心': '核心',
  '里程碑': '里程碑',
  '荣誉': '榮譽',
  '资质': '資質',
  '布局': '佈局',
  '见证': '見證',
  '之路': '之路',
  '源自': '源自',
  '企业': '企業',
  '从': '從',
  '走出': '走出',
  '地区': '地區',
  '联系': '聯繫',
  '咨询': '諮詢',
  '合作': '合作',
  '联络': '聯絡',
  '办公室': '辦公室',
  '随时': '隨時',
  '专业': '專業',
  '支持': '支持',
  '开启': '開啟',
  '无论': '無論',
  '洽谈': '洽談',
  '还是': '還是',
  '科学家': '科學家',
  '余项': '餘項',
  '发明': '發明',
  '深入': '深入',
  '脑电信号': '腦電信號',
  '采集': '採集',
  '神经': '神經',
  '反馈': '反饋',
  '算法': '算法',
  '前沿': '前沿',
  '驱动': '驅動',
  '突破': '突破',
  '引领': '引領',
  '采用': '採用',
  '先进': '先進',
  '肌电': '肌電',
  '识别': '識別',
  '让': '讓',
  '上肢': '上肢',
  '截肢者': '截肢者',
  '重获': '重獲',
  '灵巧': '靈巧',
  '双手': '雙手',
  '认证': '認證',
  '超过': '超過',
  '动作': '動作',
  '准确率': '準確率',
  '残障': '殘障',
  '人士': '人士',
  '生活': '生活',
  '用': '用',
  '重塑': '重塑',
  '力量': '力量',
  '识别准确率': '識別準確率',
  '掌控': '掌控',
  '全球首款': '全球首款',
  '消费级': '消費級',
  '严重': '嚴重',
  '运动': '運動',
  '障碍': '障礙',
  '患者': '患者',
  '脑电波': '腦電波',
  '控制': '控制',
  '轮椅': '輪椅',
  '移动': '移動',
  '解放': '解放',
  '行动': '行動',
  '自由': '自由',
  '意念': '意念',
  '重度': '重度',
  '单手': '單手',
  '结合': '結合',
  '个性化': '個性化',
  '中风': '中風',
  '偏瘫': '偏癱',
  '加速': '加速',
  '显著': '顯著',
  '提升': '提升',
  '效果': '效果',
  '功能': '功能',
  '恢复': '恢復',
  '双手': '雙手',
  '同步': '同步',
  '双上肢': '雙上肢',
  '系统': '系統',
  '智能': '智能',
  '适用于': '適用於',
  '创伤': '創傷',
  '导致': '導致',
  '双侧': '雙側',
  '全面': '全面',
  '进程': '進程',
  '协同': '協同',
  '睡眠': '睡眠',
  '头环': '頭環',
  '经颅': '經顱',
  '微电流': '微電流',
  '刺激': '刺激',
  '科学': '科學',
  '入睡': '入睡',
  '困难': '困難',
  '质量': '質量',
  '无需': '無需',
  '药物': '藥物',
  '安全': '安全',
  '有效': '有效',
  '每晚': '每晚',
  '享受': '享受',
  '深度': '深度',
  '助力': '助力',
  '好眠': '好眠',
  '依赖': '依賴',
  '实时': '實時',
  '监测': '監測',
  '学习': '學習',
  '效率': '效率',
  '学生': '學生',
  '职场': '職場',
  '帮助': '幫助',
  '工作': '工作',
  '保持': '保持',
  '高度': '高度',
  '生产力': '生產力',
  '飞跃': '飛躍',
  '更高效': '更高效',
  '放松': '放鬆',
  '冥想': '冥想',
  '脑波': '腦波',
  '压力': '壓力',
  '心流': '心流',
  '状态': '狀態',
  '缓解': '緩解',
  '实现': '實現',
  '身心': '身心',
  '平衡': '平衡',
  '完美': '完美',
  '记忆力': '記憶力',
  '注意力': '注意力',
  '反应': '反應',
  '速度': '速度',
  '认知': '認知',
  '能力': '能力',
  '老年人': '老年人',
  '预防': '預防',
  '衰退': '衰退',
  '优化': '優化',
  '大脑': '大腦',
  '守护': '守護',
  '延缓': '延緩',
  '儿童': '兒童',
  '专为': '專為',
  '岁': '歲',
  '青少年': '青少年',
  '设计': '設計',
  '游戏化': '遊戲化',
  '自控力': '自控力',
  '已服务': '已服務',
  '学校': '學校',
  '数十万': '數十萬',
  '成绩': '成績',
  '每个': '每個',
  '孩子': '孩子',
  '都能': '都能',
  '已': '已',
  '智慧': '智慧',
  '大数据': '大數據',
  '课堂': '課堂',
  '教师': '教師',
  '建议': '建議',
  '覆盖': '覆蓋',
  '教室': '教室',
  '实现': '實現',
  '数据驱动': '數據驅動',
  '精准': '精準',
  '教学': '教學',
  '分析': '分析',
  '选择': '選擇',
  '更科学': '更科學',
  '新闻': '新聞',
  '资讯': '資訊',
  '获取': '獲取',
  '产品': '產品',
  '发布': '發布',
  '关注': '關注',
  '招聘': '招聘',
  '加入': '加入',
  '寻找': '尋找',
  '充满': '充滿',
  '激情': '激情',
  '人才': '人才',
  '硬件': '硬件',
  '工程': '工程',
  '市场': '市場',
  '营销': '營銷',
  '领域': '領域',
  '职位': '職位',
  '顶尖': '頂尖',
  '未来': '未來',
  '广阔': '廣闊',
  '平台': '平台',
  '期待': '期待',
  '职位列表': '職位列表',
  '查看': '查看',
  '浏览': '瀏覽',
  '开放': '開放',
  '包括': '包括',
  '经理': '經理',
  '专员': '專員',
  '找到': '找到',
  '岗位': '崗位',
  '提交': '提交',
  '简历': '簡歷',
  '职业': '職業',
  '所有': '所有',
  '申请': '申請',
};

/**
 * 简单的简体转繁体
 */
function s2t(text) {
  if (!text) return text;
  let result = text;
  for (const [s, t] of Object.entries(s2tMap)) {
    result = result.replace(new RegExp(s, 'g'), t);
  }
  return result;
}

/**
 * 生成繁体中文数据（基于简体中文）
 */
function generateZhHant(zhHansData) {
  if (!zhHansData) return null;
  
  const zhHant = {};
  for (const [key, value] of Object.entries(zhHansData)) {
    if (typeof value === 'string') {
      zhHant[key] = s2t(value);
    } else if (Array.isArray(value)) {
      zhHant[key] = value.map(item => {
        if (typeof item === 'object') {
          return generateZhHant(item);
        }
        return typeof item === 'string' ? s2t(item) : item;
      });
    } else if (typeof value === 'object' && value !== null) {
      zhHant[key] = generateZhHant(value);
    } else {
      zhHant[key] = value;
    }
  }
  return zhHant;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始合并 SEO 数据和 Schema 数据...\n');

  // 读取两个文件
  const seoDataPath = path.join(__dirname, 'seo-data.json');
  const schemaDataPath = path.join(__dirname, 'schema-data-config.json');
  
  const seoData = JSON.parse(fs.readFileSync(seoDataPath, 'utf-8'));
  const schemaData = JSON.parse(fs.readFileSync(schemaDataPath, 'utf-8'));

  // 创建合并后的数据结构
  const mergedData = {
    pages: []
  };

  // 以 SEO 数据为基础，合并 Schema 数据
  for (const seoPage of seoData.pages) {
    const { pageName, pagePath, locales } = seoPage;
    
    // 查找对应的 Schema 数据
    const schemaPage = schemaData.pages.find(p => p.pagePath === pagePath);
    
    console.log(`📄 处理页面: ${pagePath} (${pageName})`);
    
    const mergedPage = {
      pageName,
      pagePath,
      locales: {}
    };

    // 处理每种语言
    for (const locale of ['zh-Hans', 'en', 'zh-Hant']) {
      const seoLocaleData = locales[locale];
      const schemaLocaleData = schemaPage?.schemas?.[locale];

      if (!seoLocaleData && !schemaLocaleData) {
        continue;
      }

      // 如果缺少繁体中文 SEO 数据，从简体中文生成
      let localeData = seoLocaleData;
      if (locale === 'zh-Hant' && !seoLocaleData && locales['zh-Hans']) {
        console.log(`   ⚠️  ${locale}: 缺少 SEO 数据，从简体中文自动生成`);
        localeData = generateZhHant(locales['zh-Hans']);
      }

      // 如果缺少繁体中文 Schema 数据，从简体中文生成
      let schemaData = schemaLocaleData;
      if (locale === 'zh-Hant' && !schemaLocaleData && schemaPage?.schemas?.['zh-Hans']) {
        console.log(`   ⚠️  ${locale}: 缺少 Schema 数据，从简体中文自动生成`);
        schemaData = generateZhHant(schemaPage.schemas['zh-Hans']);
      }

      if (localeData || schemaData) {
        mergedPage.locales[locale] = {
          ...(localeData || {}),
          ...(schemaData && { structuredData: schemaData })
        };
        console.log(`   ✅ ${locale}: 数据已合并`);
      }
    }

    mergedData.pages.push(mergedPage);
  }

  // 处理只在 Schema 数据中存在的页面
  for (const schemaPage of schemaData.pages) {
    if (!seoData.pages.find(p => p.pagePath === schemaPage.pagePath)) {
      console.log(`⚠️  页面 ${schemaPage.pagePath} 只有 Schema 数据，没有 SEO 数据`);
      // 可以选择是否包含这些页面
    }
  }

  // 写入合并后的文件
  const outputPath = path.join(__dirname, 'seo-schema-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf-8');

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ 合并完成！`);
  console.log(`   输出文件: ${outputPath}`);
  console.log(`   页面数量: ${mergedData.pages.length}`);
  console.log('═══════════════════════════════════════\n');
  
  console.log('📝 下一步:');
  console.log('1. 检查生成的 seo-schema-data.json 文件');
  console.log('2. 运行导入脚本: node scripts/import-seo-schema-data.js');
}

main();

