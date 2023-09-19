import express, {Express, Request, Response, Router} from 'express';

const app: Express = express();
const port = 4000;

import router from './routes/index';

app.use('/', router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
