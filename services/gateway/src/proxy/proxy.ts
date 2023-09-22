import { createProxyMiddleware } from 'http-proxy-middleware';
import {Express} from "express";

export const setupProxies = (app : Express, routes : any[]) => {
  routes.forEach(r => {
    app.use(r.url, createProxyMiddleware(r.proxy));
  })
}
