import { ProxiedRoute } from "./proxied_route_type";
import {
  adminServiceAddress,
  collaborationServiceAddress,
  matchingServiceAddress,
  questionServiceAddress,
  userServiceAddress,
} from "./service_names";

export const proxied_routes: ProxiedRoute[] = [
  {
    url: "/api/user-service",
    admin_required_methods: [], // Empty, so no admin verification is done for all methods to the user-service
    user_match_required_methods: ["PUT", "DELETE"],
    // PUT and DELETE require checking that the user is only updating/deleting their own data
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: userServiceAddress,
      changeOrigin: true,
    },
  },
  {
    url: "/api/admin-service",
    admin_required_methods: ["GET, POST, PUT, DELETE"], // All routes in admin service can only be accessed by admins
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: adminServiceAddress,
      changeOrigin: true,
      pathRewrite: {
        "^/api/admin-service": "",
      },
    },
  },
  {
    url: "/api/question-service",
    admin_required_methods: ["POST, PUT, DELETE"], // Only admins can create, update or delete questions
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: questionServiceAddress,
      changeOrigin: true,
    },
  },
  {
    url: "/api/matching-service",
    admin_required_methods: [],
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: matchingServiceAddress,
      changeOrigin: true,
    },
  },
  {
    url: "/api/collaboration-service",
    admin_required_methods: [],
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: collaborationServiceAddress,
      changeOrigin: true,
    },
  },
  {
    url: "/api/question-service",
    admin_required_methods: ["POST, PUT, DELETE"], // All routes in admin service can only be accessed by admins
    user_match_required_methods: [], // No need for exact user match here
    proxy: {
      target: questionServiceAddress,
      changeOrigin: true,
    },
  },
];
