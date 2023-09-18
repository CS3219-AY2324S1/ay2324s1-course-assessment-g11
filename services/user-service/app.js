
const {initialize} = require("express-openapi");

const databaseFunctions = require("./db/functions");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const apiDoc = require("./routes/api-doc");

const port = 5000;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

initialize({
  app,
  paths: './routes',
  apiDoc: apiDoc,
  dependencies: {
    userDatabaseFunctions: databaseFunctions
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
