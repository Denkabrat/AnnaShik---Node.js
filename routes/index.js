const Router = require('express');
const userRouter = require('./userRouter');
const goodRouter = require('./goodRouter');
const typeRouter = require('./typeRouter');
const router = new Router();


router.use('/user',userRouter);
router.use('/goods',goodRouter);
router.use('/type',typeRouter);




module.exports = router;