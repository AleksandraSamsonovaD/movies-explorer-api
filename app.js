/* eslint-disable no-param-reassign */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');

const IncorrectDataError = require('./errors/incorrect-data-err');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cookieParser());
app.use(requestLogger);

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
app.post('/api/signout', (req, res) => {
  res.clearCookie('jwt')
    .end();
});
app.use('/api/users', auth, require('./routes/users'));
app.use('/api/movies', auth, require('./routes/movies'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'Bad Request' || err.error === 'Bad Request') {
    err = new IncorrectDataError(err.validation.message);
  }
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
});
