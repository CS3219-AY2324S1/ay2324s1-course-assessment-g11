export const proxied_routes = [
  {
    url: '/users',
    admin_required_methods: [], // Empty, so no admin verification is done for all methods to the user-service
    user_match_required_methods: ["PUT", "DELETE"],
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5
    },
    proxy: {
      target: "http://localhost:5001/",
      changeOrigin: true,
      pathRewrite: {
        [`^/users`]: '',
      },
    }
  }
]
