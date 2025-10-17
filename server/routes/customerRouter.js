const Router = require('express')
const router = new Router()
const customerController = require('../controllers/customerController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.get('/', checkRole(['ADMIN', 'MANAGER']),customerController.getAll)
router.post('/', checkRole(['ADMIN', 'MANAGER']),customerController.addCustomer)
router.patch('/item/:id', checkRole(['ADMIN', 'MANAGER']),customerController.patchCustomer)

module.exports = router