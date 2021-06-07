const NotFoundError = require('../errors/not-found-err');

module.exports.notFound = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
};
