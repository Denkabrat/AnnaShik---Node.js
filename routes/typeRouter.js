const Router = require('express');
const router = new Router();
const TypeController = require('../controllers/typeController');
const authMiddleWare = require('../middleware/authMiddleWare');

router.post('/createType', authMiddleWare, TypeController.create);

router.get('/getAllTypes',TypeController.getAll);

router.get('/:name',TypeController.getOneType);



module.exports = router;