const Router = require('express')
const router = new Router()
const productInvoicingController = require('../controllers/productInvoicingController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/list', checkRole(['ADMIN']), productInvoicingController.getInvoiceList)
router.get('/', checkRole(['ADMIN']), productInvoicingController.getInvoice)
router.post('/items/barcodeList', checkRole(['ADMIN']), productInvoicingController.addInvoiceItemsByBarcodeList)
router.post('/items/SKUList', checkRole(['ADMIN']), productInvoicingController.addInvoiceItemsBySKUList)
router.post('/items/id', checkRole(['ADMIN']), productInvoicingController.addInvoiceItemById)
router.post('/process', checkRole(['ADMIN']), productInvoicingController.processInvoice)
router.delete('/items', checkRole(['ADMIN']), productInvoicingController.delInvoiceItems)
router.patch('/items', checkRole(['ADMIN']), productInvoicingController.updateInvoiceItemPriceQTY)



module.exports = router