import express, {Express} from 'express';
import cors from 'cors';
import { setupLogging } from "./logging/logging";
import { setupAdmin, setupUserIdMatch, setupIsLoggedIn } from "./auth/auth";
import { setupProxies } from "./proxy/proxy";
import { proxied_routes } from "./proxied_routes/proxied_routes";
import {frontendAddress} from "./proxied_routes/service_names";


const app : Express = express();
const corsOptions = {
  origin: frontendAddress,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}

const port : number = parseInt(process.env.PORT || "4000");

app.use(cors(corsOptions))

/**
 * WARNING: Do not add body parsing middleware to the Gateway.
 * Otherwise, proxying POST requests with request body would not work.
 */
setupLogging(app);
setupIsLoggedIn(app, proxied_routes);
setupUserIdMatch(app, proxied_routes);
setupAdmin(app, proxied_routes);
const proxyMiddlewareArray = setupProxies(app, proxied_routes);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

for (let i = 0; i < proxyMiddlewareArray.length; i++) {
  server.on('upgrade', proxyMiddlewareArray[i].upgrade);
}
