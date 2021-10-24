/* eslint-disable no-shadow */
const Movie = require('../models/movie');

const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');
const DeleteError = require('../errors/delete-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movies) => {
      if (movies.length < 1) {
        throw new NotFoundError('Фильмы не найдены');
      } else {
        res.send({ data: movies });
      }
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie
    .find({
      owner: req.user.id,
      movieId,
    }).then((movie) => {
      if (movie.length < 1) {
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailer,
          nameRU,
          nameEN,
          thumbnail,
          movieId,
          owner: req.user.id,
        })
          .then((movie) => res.send({ data: movie }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              const errValid = new IncorrectDataError(err.message);
              next(errValid);
            } else {
              const errDef = new DefaultError(err.message);
              next(errDef);
            }
          });
      } else {
        throw new IncorrectDataError('Фильм уже создан');
      }
    }).catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.find({
    owner: req.user.id,
    movieId: req.params.movieId,
  })
    .then((movie) => {
      if (movie.length < 1) {
        throw new NotFoundError('Фильм не найден');
      } else if (req.user.id !== movie[0].owner.toString()) {
        throw new DeleteError('Фильм создана не вами');
      } else {
        Movie.findOneAndRemove(
          {
            owner: req.user.id,
            movieId: req.params.movieId,
          },

        )
          .then((movie) => {
            res.send({ data: movie });
          });
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
