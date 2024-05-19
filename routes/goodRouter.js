const Router = require('express');
const router = new Router();
const GoodController = require('../controllers/goodController');



router.post('/create',GoodController.create);
router.get('/:id',GoodController.getOneGood);
router.get('/', GoodController.getAll);


module.exports = router;