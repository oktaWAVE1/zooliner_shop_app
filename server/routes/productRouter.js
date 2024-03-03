const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.get('/item/:id', checkRole(['ADMIN, MANAGER']), productController.getProduct)
router.get('/barcode', checkRole(['ADMIN, MANAGER']), productController.getProductByBarcode)
router.get('/popular', checkRole(['ADMIN, MANAGER']), productController.getPopularProducts)
router.get('/code', checkRole(['ADMIN, MANAGER']), productController.getProductByCode)
router.get('/', checkRole(['ADMIN, MANAGER']),productController.getAll)
router.get('/search', checkRole(['ADMIN, MANAGER']),productController.getSearchedProducts)
router.get('/stocks', checkRole(['ADMIN, MANAGER']),productController.getStockProducts)


module.exports = router