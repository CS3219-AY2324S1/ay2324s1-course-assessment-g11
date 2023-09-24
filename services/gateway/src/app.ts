// https://medium.com/geekculture/create-an-api-gateway-using-nodejs-and-express-933d1ca23322

import express, {Express} from 'express';
import cors from 'cors';
import { setupLogging } from "./logging/logging";
import { setupAdmin, setupUserIdMatch, setupIsLoggedIn } from "./auth/auth";
import { setupProxies } from "./proxy/proxy";
import { ROUTES } from "./routes/routes";
import eventRouter from "./api/events/index";


const app : Express = express()
const port = 4000;
//const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())
app.use('/events', eventRouter);

setupLogging(app);
setupIsLoggedIn(app, ROUTES);
setupUserIdMatch(app, ROUTES);
setupAdmin(app, ROUTES);
setupProxies(app, ROUTES);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
