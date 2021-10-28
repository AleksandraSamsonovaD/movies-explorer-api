const IncorrectDataError = require('./incorrect-data-err');

function errorHandler(err, req, res, next) {
  let error;
  if (err.name === 'Bad Request' || err.error === 'Bad Request') {
    error = new IncorrectDataError(err.validation.message);
  } else {
    error = err;
  }
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
}

module.exports = {
  errorHandler,
};
