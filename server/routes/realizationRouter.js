const Router = require('express')
const router = new Router()
const realizationController = require('../controllers/realizationContoller')
const checkRole = require('../middleware/CheckRoleMiddleware')
const siteController = require("../controllers/siteController");

router.get('/item/:id', checkRole(['ADMIN, MANAGER']), realizationController.getRealization)
router.get('/delivery_methods', checkRole(['ADMIN, MANAGER']), realizationController.getDeliveryMethods)
router.get('/', checkRole(['ADMIN, MANAGER']),realizationController.getAll)
router.get('/today_deliveries', checkRole(['ADMIN, MANAGER']),realizationController.getRealizationsDeliveriesToday)
router.get('/new', checkRole(['ADMIN, MANAGER']),realizationController.newRealization)
router.get('/current', checkRole(['ADMIN, MANAGER']),realizationController.getRealizationsDateRange)
router.post('/add', checkRole(['ADMIN, MANAGER']),realizationController.addRealizationItem)
router.post('/confirm', checkRole(['ADMIN, MANAGER']),realizationController.confirmRealization)
router.delete('/delete/:id', checkRole(['ADMIN, MANAGER']),realizationController.delRealizationItem)
router.patch('/delivery', checkRole(['ADMIN, MANAGER']),realizationController.updateDeliveryMethod)
router.patch('/payment', checkRole(['ADMIN, MANAGER']),realizationController.updatePaymentMethod)
router.patch('/discount', checkRole(['ADMIN, MANAGER']),realizationController.updateDiscount)
router.patch('/user', checkRole(['ADMIN, MANAGER']),realizationController.updateUser)
router.patch('/refund', checkRole(['ADMIN, MANAGER']),realizationController.updateRefund)
router.patch('/item/price_qty', checkRole(['ADMIN, MANAGER']),realizationController.updateSellsItemPriceQty)
router.patch('/site/user', checkRole(['ADMIN, MANAGER']), realizationController.updateOrderSiteCustomer)


module.exports = router