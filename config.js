require('dotenv').config();

const {
  JWT_SECRET_PHRASE = 'dev-secret',
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/diplom',
} = process.env;

module.exports = { JWT_SECRET_PHRASE, PORT, MONGO_URL };
