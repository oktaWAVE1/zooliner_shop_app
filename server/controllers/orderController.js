const {OrderRemote} = require("../models/models");

class OrderController {

    async getAll (req, res) {
        const orders = await OrderRemote.findAll({order: [['Счетчик', 'DESC']]})
        return res.json(orders)
    }



    async addOrder (req, res) {
        const {Описание} = req.body
        const order = await OrderRemote.create({Описание})
        return res.json(order)
    }

    async patchOrder (req, res) {
        const {id} = req.params
        const {Описание, Выполнено} = req.body
        const order = await OrderRemote.update({Описание, Выполнено}, {where: {Счетчик: id}})
        return res.json(order)
    }


}

module.exports = new OrderController()