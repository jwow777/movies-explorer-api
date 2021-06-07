const router = require('express').Router();
const { movieValid, idValid } = require('../middlewares/validation');
const { getSavedMovies, saveMovie, deleteSavedMovie } = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', movieValid, saveMovie);
router.delete('/:id', idValid, deleteSavedMovie);

module.exports = router;
