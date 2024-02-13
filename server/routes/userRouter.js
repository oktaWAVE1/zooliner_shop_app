const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/login', userController.login)
router.post('/check_password', userController.checkPassword)

router.get('/auth', userController.check)

router.post('/logout', authMiddleware, userController.logout)




module.exports = router