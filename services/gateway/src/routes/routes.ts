export const ROUTES = [
  {
    url: '/free',
    admin_required: false,
    user_match_required: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5
    },
    proxy: {
      target: "https://www.google.com",
      changeOrigin: true,
      pathRewrite: {
        [`^/free`]: '',
      },
    }
  },
  {
    url: '/premium',
    admin_required: true,
    user_match_required: false,
    proxy: {
      target: "https://www.google.com",
      changeOrigin: true,
      pathRewrite: {
        [`^/premium`]: '',
      },
    }
  }
]
