module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      maxSessionLifespan: '1d',          // 管理员一次登录 Session 最大有效时间
      maxRefreshTokenLifespan: '7d',     // 刷新 token 的最长生命周期
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  // 自定义 URL 和标题
  url: env('ADMIN_URL', '/admin'),
});
