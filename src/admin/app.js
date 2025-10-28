// @ts-nocheck
import logo from './assets/logo.webp';
import './styles/login.css';
import favicon from './assets/favicon.png';

export default {
  config: {
    auth: {
      logo,
    },
    menu: {
      logo,
    },
    head: {
      favicon,
    },
    // 国际化配置：支持简体中文和英文
    locales: ['zh-Hans', 'en'],
    translations: {
      // ========== 简体中文翻译 ==========
      'zh-Hans': {
        // 品牌定制
        'app.components.LeftMenu.navbrand.title': 'BrainCo 内容管理系统',
        'app.components.LeftMenu.navbrand.workplace': 'BrainCo 官网',
        'Auth.form.welcome.title': '欢迎使用 BrainCo CMS',
        'Auth.form.welcome.subtitle': 'BrainCo官网内容管理系统',
        
        // 语言切换
        'global.localeToggle.label': '选择界面语言',
        'Settings.profile.form.section.experience.interfaceLanguage': '界面语言',
        'Settings.profile.form.section.experience.interfaceLanguageHelp': '更改系统显示语言',
        
        // 常用操作
        'app.components.LeftMenu.navbrand.title.short': 'BrainCo',
        'Auth.form.button.login': '登录',
        'Auth.form.button.register': '注册',
        'global.back': '返回',
        'global.save': '保存',
        'global.cancel': '取消',
        'global.delete': '删除',
        'global.edit': '编辑',
        'global.submit': '提交',
        'global.create': '创建',
        'global.update': '更新',
        'global.search': '搜索',
        'global.confirm': '确认',
        'global.close': '关闭',
        'global.reset': '重置',
        
        // 内容管理
        'app.components.HomePage.welcome': '欢迎访问',
        'app.components.HomePage.welcome.again': '欢迎回来',
        'Content Manager': '内容管理器',
        'Media Library': '媒体库',
        'Settings': '设置',
      },
      
      // ========== 英文翻译 ==========
      'en': {
        // 品牌定制
        'app.components.LeftMenu.navbrand.title': 'BrainCo CMS',
        'app.components.LeftMenu.navbrand.workplace': 'BrainCo Website',
        'Auth.form.welcome.title': 'Welcome to BrainCo CMS',
        'Auth.form.welcome.subtitle': 'BrainCo Website Content Management System',
        
        // 语言切换
        'global.localeToggle.label': 'Select interface language',
        'Settings.profile.form.section.experience.interfaceLanguage': 'Interface Language',
        'Settings.profile.form.section.experience.interfaceLanguageHelp': 'Change the language of the interface',
        
        // 其他翻译使用 Strapi 默认英文
        'app.components.LeftMenu.navbrand.title.short': 'BrainCo',
      },
    },
    theme: {
      light: {
        colors: {
          primary100: '#E6F2FF',
          primary200: '#B3D9FF',
          primary500: '#0066FF',
          primary600: '#0052CC',
          primary700: '#003D99',
          danger700: '#D32F2F',
        },
      },
      dark: {
        colors: {
          primary100: '#1A2744',
          primary200: '#2E4A7C',
          primary500: '#5A8DFF',
          primary600: '#4A7AE8',
          primary700: '#3A67D0',
          danger700: '#EF5350',
        },
      },
    },
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app) {
    console.log('BrainCo CMS 初始化成功 | BrainCo CMS initialized');
    console.log('支持语言: 简体中文, English | Supported languages: zh-Hans, en');
    
    // 设置 favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = favicon;
    document.head.appendChild(link);
    console.log('Favicon 设置成功 | Favicon set successfully');
    
    // 检查当前路径是否为登录页面
    if (window.location.pathname.includes('/auth')) {
      document.body.classList.add('login-page');
      console.log('添加登录页 class | Added login-page class via bootstrap');
    }
    
    // 添加全局路径检查脚本
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        function checkPath() {
          if (window.location.pathname.includes('/auth')) {
            document.body.classList.add('login-page');
            document.body.setAttribute('data-path', '/auth');
            console.log('登录页面检测 | Login page detected');
          } else {
            document.body.classList.remove('login-page');
            document.body.removeAttribute('data-path');
          }
        }
        
        // 初始检查
        checkPath();
        
        // 监听路由变化
        const pushState = history.pushState;
        history.pushState = function() {
          pushState.apply(history, arguments);
          checkPath();
        };
        
        window.addEventListener('popstate', checkPath);
      })();
    `;
    document.head.appendChild(script);
  },
};

