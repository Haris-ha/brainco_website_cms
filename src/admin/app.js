// @ts-nocheck
import logo from './assets/logo.webp';
import './styles/login.css';
import favicon from './assets/favicon.png';
import zhHansTranslations from './translations/zh-Hans.json';

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
    // 国际化配置：支持简体中文和英文，默认为中文
    locales: ['zh-Hans', 'en'],
    defaultLocale: 'zh-Hans',
    translations: {
      // 简体中文翻译（从 JSON 文件导入）
      'zh-Hans': zhHansTranslations,
      
      // 英文翻译（品牌定制）
      'en': {
        'app.components.LeftMenu.navbrand.title': 'BrainCo CMS',
        'app.components.LeftMenu.navbrand.workplace': 'BrainCo Website',
        'Auth.form.welcome.title': 'Welcome to BrainCo CMS',
        'Auth.form.welcome.subtitle': 'BrainCo Website Content Management System',
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
    
    // 强制设置默认语言为简体中文
    try {
      const currentLocale = localStorage.getItem('strapi-admin-language');
      if (!currentLocale || currentLocale !== 'zh-Hans') {
        localStorage.setItem('strapi-admin-language', 'zh-Hans');
        console.log('已设置默认语言为简体中文 | Default language set to zh-Hans');
      }
    } catch (e) {
      console.error('设置语言失败 | Failed to set language:', e);
    }
    
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

