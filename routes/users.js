const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isEmail = require('validator/lib/isEmail');
const IncorrectDataError = require('../errors/incorrect-data-err');
const {
  getUserMe, updateUser,
} = require('../controllers/users');

const validateEmail = (value) => {
  if (!isEmail(value, { require_protocol: true })) {
    throw new IncorrectDataError('Неправильный формат почты');
  }
  return value;
};

router.get('/me', getUserMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
}), updateUser);

module.exports = router;
