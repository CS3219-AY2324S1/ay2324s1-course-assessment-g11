import {Options} from "http-proxy-middleware";

export type ProxiedRoute = {
  url: string;
  admin_required_methods: string[];
  user_match_required_methods: string[];
  rateLimit?: {
    windowMs: number;
    max: number;
  },
  proxy: Options
}
