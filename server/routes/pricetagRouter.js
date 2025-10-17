const Router = require('express')
const router = new Router()
const priceTagController = require('../controllers/pricetagController')
const checkRole = require('../middleware/CheckRoleMiddleware')


router.get('/', checkRole(['ADMIN', 'MANAGER']),priceTagController.getPriceTags)
router.post('/', checkRole(['ADMIN', 'MANAGER']),priceTagController.addPriceTag)
router.delete('/del/:id', checkRole(['ADMIN', 'MANAGER']),priceTagController.delPriceTag)
router.delete('/all', checkRole(['ADMIN', 'MANAGER']),priceTagController.delAllPriceTags)



module.exports = router