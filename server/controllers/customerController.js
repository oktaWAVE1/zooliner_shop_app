const {CustomersRemote} = require("../models/models");
const {DataTypes} = require("sequelize");

class CustomerController {

    async getAll (req, res) {
        const customers = await CustomersRemote.findAll({order: [['Имя', 'ASC']]})
        return res.json(customers)
    }


    async addCustomer (req, res) {
        const {Имя, Телефон, Адрес, Комментарий} = req.body
        const order = await CustomersRemote.create({Имя, Телефон, Адрес, Комментарий})
        return res.json(order)
    }

    async patchCustomer (req, res) {
        const {id} = req.params
        const {Имя, Телефон, Адрес, Комментарий} = req.body
        const order = await CustomersRemote.update({Имя, Телефон, Адрес, Комментарий}, {where: {Код: id}})
        return res.json(order)
    }


}

module.exports = new CustomerController()