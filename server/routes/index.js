const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const realizationRouter = require('./realizationRouter')
const orderRouter = require('./orderRouter')
const customerRouter = require('./customerRouter')
const barcodeRouter = require('./barcodeRouter')
const priceTagRouter = require('./pricetagRouter')
const brandRouter = require('./brandRouter')
const siteRouter = require('./siteRouter')


router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/realization', realizationRouter)
router.use('/order', orderRouter)
router.use('/customer', customerRouter)
router.use('/barcode', barcodeRouter)
router.use('/tag', priceTagRouter)
router.use('/brand', brandRouter)
router.use('/site', siteRouter)

module.exports = router