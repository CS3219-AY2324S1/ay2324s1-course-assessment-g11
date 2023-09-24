
import express from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./api/index";
import cors from "cors";

const port = 5001;
//const port = process.env.PORT;

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;
