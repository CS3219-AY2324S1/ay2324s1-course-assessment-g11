import morgan from "morgan";
import {Express} from "express";

export const setupLogging = (app : Express) => {
  app.use(morgan('combined'));
}
