import { createProxyMiddleware } from 'http-proxy-middleware';
import {Express} from "express";

export const setupProxies = (app : Express, routes : any[]) => {
  var proxyMiddlewareArray : any[] = []
  for (let i = 0; i < routes.length; i++) {
    const proxyMiddleware = createProxyMiddleware(routes[i].proxy);
    app.use(routes[i].url, proxyMiddleware);
    if (routes[i].proxy.ws) {
      proxyMiddlewareArray.push(proxyMiddleware);
    }
  }
  return proxyMiddlewareArray;
}
