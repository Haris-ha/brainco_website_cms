// @ts-nocheck
import logo from './assets/logo.webp';
import './styles/login.css';
import favicon from './assets/favicon.png';
import loginBg from './assets/login-bg.webp';
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
    // 确保在浏览器环境中执行
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    console.log('BrainCo CMS 初始化成功 | BrainCo CMS initialized');
    console.log('支持语言: 简体中文, English | Supported languages: zh-Hans, en');
    
    // 强制设置默认语言为简体中文
    try {
      if (typeof localStorage !== 'undefined') {
        const currentLocale = localStorage.getItem('strapi-admin-language');
        if (!currentLocale || currentLocale !== 'zh-Hans') {
          localStorage.setItem('strapi-admin-language', 'zh-Hans');
          console.log('已设置默认语言为简体中文 | Default language set to zh-Hans');
        }
      }
    } catch (e) {
      console.error('设置语言失败 | Failed to set language:', e);
    }
    
    // 设置 favicon
    try {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/png';
      link.rel = 'icon';
      link.href = favicon;
      if (!document.querySelector("link[rel*='icon']")) {
        document.head.appendChild(link);
      }
      console.log('Favicon 设置成功 | Favicon set successfully');
    } catch (e) {
      console.error('设置 Favicon 失败 | Failed to set favicon:', e);
    }
    
    // 检查当前路径是否为登录页面并设置背景图
    try {
      if (window.location && window.location.pathname && window.location.pathname.includes('/auth')) {
        if (document.body) {
          document.body.classList.add('login-page');
          // 动态设置背景图
          document.body.style.backgroundImage = `url(${loginBg})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center center';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.backgroundRepeat = 'no-repeat';
          console.log('添加登录页 class 和背景图 | Added login-page class and background image');
        }
      }
    } catch (e) {
      console.error('路径检查失败 | Path check failed:', e);
    }
    
    // 添加全局路径检查脚本（延迟执行，确保 DOM 已加载）
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          addPathCheckScript();
        });
      } else {
        addPathCheckScript();
      }
    } catch (e) {
      console.error('添加路径检查脚本失败 | Failed to add path check script:', e);
    }

    function addPathCheckScript() {
      // 将背景图 URL 存储为全局变量，供内联脚本使用
      if (typeof window !== 'undefined') {
        window.__LOGIN_BG_URL__ = loginBg;
      }

      const script = document.createElement('script');
      script.textContent = `
        (function() {
          if (typeof window === 'undefined' || typeof document === 'undefined') return;
          
          function checkPath() {
            try {
              if (window.location && window.location.pathname) {
                if (window.location.pathname.includes('/auth')) {
                  if (document.body) {
                    document.body.classList.add('login-page');
                    document.body.setAttribute('data-path', '/auth');
                    // 设置背景图
                    const bgUrl = window.__LOGIN_BG_URL__ || '';
                    if (bgUrl) {
                      document.body.style.backgroundImage = 'url(' + bgUrl + ')';
                      document.body.style.backgroundSize = 'cover';
                      document.body.style.backgroundPosition = 'center center';
                      document.body.style.backgroundAttachment = 'fixed';
                      document.body.style.backgroundRepeat = 'no-repeat';
                    }
                  }
                } else {
                  if (document.body) {
                    document.body.classList.remove('login-page');
                    document.body.removeAttribute('data-path');
                    // 清除背景图
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundSize = '';
                    document.body.style.backgroundPosition = '';
                    document.body.style.backgroundAttachment = '';
                    document.body.style.backgroundRepeat = '';
                  }
                }
              }
            } catch (e) {
              console.error('路径检查错误 | Path check error:', e);
            }
          }
          
          // 初始检查
          checkPath();
          
          // 监听路由变化
          if (typeof history !== 'undefined' && history.pushState) {
            const pushState = history.pushState;
            history.pushState = function() {
              pushState.apply(history, arguments);
              checkPath();
            };
          }
          
          if (typeof window !== 'undefined') {
            window.addEventListener('popstate', checkPath);
          }
        })();
      `;
      if (document.head) {
        document.head.appendChild(script);
      }
    }
  },
};

