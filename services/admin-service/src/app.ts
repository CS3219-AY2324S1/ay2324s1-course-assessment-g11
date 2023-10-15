import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../openapiDoc.json";

const app: Express = express();

const port: number = parseInt(process.env.PORT || "5005");

import router from "./routes/index";

app.use("/api/admin-service", router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
