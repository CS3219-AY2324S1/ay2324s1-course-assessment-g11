const { initialize } =  require('express-openapi');
const apiDoc = require("./routes/api-doc");
const client = require("./db/client");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const port = 5000;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);

initialize({
  app,
  apiDoc: apiDoc,
  dependencies: {
    userDatabaseClient: client
  },
  paths: './routes'
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
