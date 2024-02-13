const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.get('/', checkRole(['ADMIN, MANAGER']),brandController.getBrands)



module.exports = router