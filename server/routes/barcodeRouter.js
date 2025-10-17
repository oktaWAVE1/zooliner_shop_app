const Router = require('express')
const router = new Router()
const barcodeController = require('../controllers/barcodeController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.get('/product', checkRole(['ADMIN', 'MANAGER']),barcodeController.getNoBarcodeProducts)
router.post('/', checkRole(['ADMIN', 'MANAGER']),barcodeController.addBarcode)
router.patch('/', checkRole(['ADMIN', 'MANAGER']),barcodeController.patchBarcode)
router.patch('/product', checkRole(['ADMIN', 'MANAGER']),barcodeController.patchProduct)


module.exports = router