const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');
const EmailExistsError = require('../errors/email-exists-err');
const IncorrectAuthError = require('../errors/incorrect-auth-err');

const getUserMe = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найдены');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователm не найдены');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else if (err.name === 'NotFoundError') { next(err); } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  // User.findOne({ email })
  // .then((user) => {
  // if (user) {
  //  throw new EmailExistsError('Пользователь с данной почтой уже существует');
  // } else {
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((userNew) => res.send({
      data: {
        name: userNew.name,
        email: userNew.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        throw new EmailExistsError('Пользователь с данной почтой уже существует');
      }
      next(err);
    })
    .catch(next);
  // }
  // })
  /* .catch((err) => {
      if (err.name === 'ValidationError') {
        const errValid = new IncorrectDataError(err.message);
        next(errValid);
      } else if (err.name === 'EmailExistsError') { next(err); } else {
        const errDef = new DefaultError(err.message);
        next(errDef);
      }
    }); */
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) { throw new IncorrectAuthError('Нет пароля или почты'); }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res
        .cookie('jwt', jwt.sign(
          { id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : '2f36f2bd49588e8c96b026da2c8bb2d736742ad4ec5811aeebe640005d3404e3',
          { expiresIn: '7d' },
        ), {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({
          data: {
            name: user.name,
            email: user.email,
          },
        })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUserMe, updateUser, createUser, login,
};
