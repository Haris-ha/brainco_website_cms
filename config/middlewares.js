module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https:',
            'http:',
            // 允许所有 HTTPS 和 HTTP 图片（包括外部地址）
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https:',
            'http:',
            // 允许所有 HTTPS 和 HTTP 媒体（包括外部地址）
          ],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          'style-src': ["'self'", "'unsafe-inline'"],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
