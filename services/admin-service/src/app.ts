import express, {Express} from 'express';

const app: Express = express();

const port = 5005;
//const port = process.env.PORT;

import router from './api/index';

app.use('/', router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
