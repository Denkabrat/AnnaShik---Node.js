const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleWare');



// Registration route
router.post('/register', userController.registration);
// Login route
router.post('/login', userController.login);
//checkAuth
router.get('/auth', AuthMiddleware, userController.checkAuthorization);

router.get('/findByEmail', userController.findByEmail);

router.post('/updateUI',AuthMiddleware, userController.update);



module.exports = router;