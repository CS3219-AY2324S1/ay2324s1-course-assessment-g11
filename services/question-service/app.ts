import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import {router as indexRouter} from './routes/index';

const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
