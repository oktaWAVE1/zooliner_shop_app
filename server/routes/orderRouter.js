const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.get('/', checkRole(['ADMIN, MANAGER']),orderController.getAll)
router.post('/', checkRole(['ADMIN, MANAGER']),orderController.addOrder)
router.patch('/item/:id', checkRole(['ADMIN, MANAGER']),orderController.patchOrder)


module.exports = router