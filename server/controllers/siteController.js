const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const {OrderSite, DeliveryMethodSite, PaymentMethodSite, OrderItemSite, BonusPointSite, CategorySite} = require("../models/modelSite");

class siteController {


    async getUnreadOrders (req, res) {
        const orders = await OrderSite.findAll({where: {read: false, status: {[Op.ne]: "Создан"}},
            order: [['createdAt', 'DESC']],
            include: [
                {model: DeliveryMethodSite},
                {model: PaymentMethodSite}
            ]})

        return res.json(orders)

    }

    async getCategories (req, res) {
        const categories = await CategorySite.findAll({include: [
                {model: CategorySite, as: 'parent'},
                {model: CategorySite, as: 'children'}
            ]})

        return res.json(categories)

    }

    async getUserBonus (req, res, next) {
        const {userId} = req.params
        const userBonus = await BonusPointSite.findOne({where: {userId}})
        if(!userBonus?.id){
            return next(ApiError.badRequest("Пользователь не найден"))
        }

        return res.json(userBonus)

    }

    async getOrder (req, res, next) {
        const {id} = req.params
        if (!id){
            return next(ApiError.badRequest("Нет id заказа"))
        }

        const order = await OrderSite.findOne({where: {id},
            include: [
                {model: OrderItemSite},
                {model: DeliveryMethodSite},
                {model: PaymentMethodSite}
            ]})

        if (!order ){
            return next(ApiError.badRequest("Заказ не найден"))
        }
        return res.json(order)
    }

    async setOrderRead (req, res, next) {
        const {id} = req.body
        if (!id){
            return next(ApiError.badRequest("Нет id заказа"))
        }

        const order = await OrderSite.findOne({where: {id}})
        if (!order ){
            return next(ApiError.badRequest("Заказ не найден"))
        }
        await order.update({read: true}).then(() => {
            return res.json("Заказ прочитан")
        })




    }





}

module.exports = new siteController()