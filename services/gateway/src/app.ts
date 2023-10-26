import express, {Express} from 'express';
import cors from 'cors';
import { setupLogging } from "./logging/logging";
import { setupAdmin, setupUserIdMatch, setupIsLoggedIn } from "./auth/auth";
import { setupProxies } from "./proxy/proxy";
import {http_proxied_routes, wsCollaborationProxiedRoutes, wsMatchProxiedRoutes} from "./proxied_routes/proxied_routes";
import {frontendAddress} from "./proxied_routes/service_names";
import {createProxyMiddleware} from "http-proxy-middleware";


const httpApp : Express = express();
const wsMatchApp : Express = express();
const wsCollaborationApp : Express = express();

const corsOptions = {
  origin: frontendAddress,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}

const httpProxyPort : number = parseInt(process.env.HTTP_PROXY_PORT || "4000");
const wsMatchProxyPort : number = parseInt(process.env.WS_MATCH_PROXY_PORT || "4002");
const wsCollaborationProxyPort : number = parseInt(process.env.WS_COLLABORATION_PROXY_PORT || "4003");

httpApp.use(cors(corsOptions));
wsMatchApp.use(cors(corsOptions));
wsCollaborationApp.use(cors(corsOptions));

/**
 * WARNING: Do not add body parsing middleware to the Gateway.
 * Otherwise, proxying POST requests with request body would not work.
 */
setupLogging(httpApp);
setupLogging(wsMatchApp);
setupLogging(wsCollaborationApp);

setupIsLoggedIn(httpApp, http_proxied_routes);
setupIsLoggedIn(wsMatchApp, wsMatchProxiedRoutes);
setupIsLoggedIn(wsCollaborationApp, wsCollaborationProxiedRoutes);


setupUserIdMatch(httpApp, http_proxied_routes);
setupAdmin(httpApp, http_proxied_routes);
setupProxies(httpApp, http_proxied_routes);

const wsMatchProxyMiddleware = createProxyMiddleware(wsMatchProxiedRoutes[0].proxy);
wsMatchApp.use(wsMatchProxiedRoutes[0].url, wsMatchProxyMiddleware);
const wsCollaborationProxyMiddleware = createProxyMiddleware(wsCollaborationProxiedRoutes[0].proxy);
wsCollaborationApp.use(wsCollaborationProxiedRoutes[0].url, wsCollaborationProxyMiddleware);

httpApp.listen(httpProxyPort, () => {
  console.log(`Gateway HTTP proxy listening on port ${httpProxyPort}`);
})

wsMatchApp.listen(wsMatchProxyPort, () => {
  console.log(`Gateway WebSockets Match Proxy listening on port ${wsMatchProxyPort}`);
})

wsCollaborationApp.listen(wsCollaborationProxyPort, () => {
  console.log(`Gateway WebSockets Collaboration Proxy listening on port ${wsCollaborationProxyPort}`);
})
