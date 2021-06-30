const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { MONGO_URL, PORT } = require('./config');
const routes = require('./routes/main');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'Access-Control-Allow-Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
