const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const auth = require('../middlewares/auth');

const IncorrectDataError = require('../errors/incorrect-data-err');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new IncorrectDataError('Неправильный формат ссылки');
  }
  return value;
};

router.get('/api/movies/', auth, getMovies);

router.post('/api/movies/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.number().required(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string(),
    thumbnail: Joi.string().custom(validateURL),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/api/movies/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
  }),
}), deleteMovie);

module.exports = router;
