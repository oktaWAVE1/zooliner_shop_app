const Router = require('express')
const router = new Router()
const siteController = require('../controllers/siteController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/', checkRole(['ADMIN, MANAGER']),siteController.getUnreadOrders)
router.get('/userbonus/:userId', checkRole(['ADMIN, MANAGER']),siteController.getUserBonus)
router.get('/current/:id', checkRole(['ADMIN, MANAGER']),siteController.getOrder)
router.post('/read', checkRole(['ADMIN, MANAGER']),siteController.setOrderRead)



module.exports = router