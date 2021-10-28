const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.use(require('./sing'));
router.use(require('./users'));
router.use(require('./movies'));

router.use('*', auth, () => { throw new NotFoundError('Страница не найдена'); });
module.exports = router;
