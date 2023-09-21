
import express from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./routes";

const port = 5001;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
