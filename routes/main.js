const express = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFound = require('./notFound');

const routes = express.Router();

routes.post('/signup', createUser);
routes.post('/signin', login);

routes.use(auth);
routes.use('/users', usersRouter);
routes.use('/movies', moviesRouter);
routes.use('*', notFound);

module.exports = routes;
