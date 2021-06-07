const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-error');
const Unauthorized = require('../errors/unauthorized-error');
const Conflict = require('../errors/conflict-error');

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .select('-__v')
    .orFail(new Error('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .select('-__v')
    .orFail(new Error('Запрашиваемый пользователь не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Запрашиваемый пользователь не найден' || err.name === 'Невалидный id') {
        throw new NotFoundError(err.message);
      } else {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, name,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => {
      res.status(200).send({ email, password: undefined });
    })
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new Conflict(err.message);
      }
      throw new BadRequestError(err.message);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET_PHRASE } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET_PHRASE : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};
