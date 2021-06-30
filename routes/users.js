const router = require('express').Router();
const { userInfoValid } = require('../middlewares/validation');
const { getCurrentUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);
router.patch('/me', userInfoValid, updateUserInfo);

module.exports = router;
