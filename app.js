require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { errorHandler } = require('./errors/error-handler');

const { PORT = 3000, BDNAME = 'bitfilmsdb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb://localhost:27017/${BDNAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(limiter);

app.use(cookieParser());
app.use(requestLogger);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
