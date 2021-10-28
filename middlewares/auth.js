const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const IncorrectAuthError = require('../errors/incorrect-auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, (NODE_ENV === 'production' ? JWT_SECRET : '2f36f2bd49588e8c96b026da2c8bb2d736742ad4ec5811aeebe640005d3404e3'));
  } catch (err) {
    const errAuth = new IncorrectAuthError('Необходима авторизация');
    next(errAuth);
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
