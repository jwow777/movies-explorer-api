const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .select('-__v')
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(200).send(movie))
    .catch(() => {
      throw new BadRequestError('Невалидный Id');
    })
    .catch(next);
};

module.exports.deleteSavedMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .select('-__v')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый фильм не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Недостаточно прав на удаление карточки');
      }
      Movie.findByIdAndRemove(req.params.id)
        .then((data) => res.status(200).send(data))
        .catch(next);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new BadRequestError('Невалидный Id');
      } else {
        next(err);
      }
    })
    .catch(next);
};
