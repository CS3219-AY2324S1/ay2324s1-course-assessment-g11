import morgan from "morgan";

export const setupLogging = (app) => {
  app.use(morgan('combined'));
}
