const {OrderRemote, SellsRemote, ProductRemote, SuppliersRemote} = require("../models/models");
const {Sequelize, literal, Op} = require("sequelize");

class OrderController {

    async getAll(req, res) {
        const orders = await OrderRemote.findAll({order: [['Счетчик', 'DESC']]})
        return res.json(orders)
    }


    async addOrder(req, res) {
        const {Описание} = req.body
        const order = await OrderRemote.create({Описание, Выполнено: false})
        return res.json(order)
    }

    async patchOrder(req, res) {
        const {id} = req.params
        const {Описание, Выполнено} = req.body
        const order = await OrderRemote.update({Описание, Выполнено}, {where: {Счетчик: id}})
        return res.json(order)
    }

    async getOrderList(req, res) {

        const sells = await SellsRemote.findAll(
            {
                group: ['Код товара'],
                include: [
                    {
                        model: ProductRemote,
                        where: {
                            [Op.or]: [
                                {published: true},
                                {Наименование: {[Op.like]: '%развес г.%'}}
                            ]
                        },
                        attributes: ['Цена',
                            'product_in_stock',
                            'published',
                            "ABC",
                            ['Артикул поставщика', 'SKU'],

                            [Sequelize.fn('CONCAT_WS',
                                ' ',
                                Sequelize.col('productsRemote->suppliersRemote.Поставщик'),
                                Sequelize.col('productsRemote->parent->suppliersRemote.Поставщик'),
                            ), 'supplier'],

                            [Sequelize.fn('CONCAT_WS',
                                ', ',
                                Sequelize.col('productsRemote->parent.Наименование'),
                                Sequelize.col('productsRemote->parent.Наименование (крат опис)'),
                                Sequelize.col('productsRemote.Наименование'),
                                Sequelize.col('productsRemote.Наименование (крат опис)')
                            ), 'full_name'],

                        ],
                        include: [
                            {model: SuppliersRemote, attributes: []},
                            {
                                model: ProductRemote,
                                as: "parent",
                                attributes: [],
                                include: [
                                    {model: SuppliersRemote, attributes: []}]
                            }]
                    },
                ],
                attributes:
                    [
                        "Код товара",
                        [literal(`SUM(CASE WHEN Дата >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN Количество ELSE 0 END) + 0`), 'monthly_sum'],
                        [literal(`SUM(CASE WHEN Дата >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN Количество ELSE 0 END) + 0`), 'yearly_sum'],
                        [Sequelize.fn('sum', Sequelize.col('Количество')), 'total_sum'],
                        [literal(`CASE WHEN (productsRemote.product_in_stock = 0 OR ROUND(productsRemote.product_in_stock/(SUM(CASE WHEN Дата >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN Количество ELSE 0 END) + 0), 2) <= 0.5) THEN TRUE ELSE FALSE END`), 'need_to_order']

                    ],
                raw: true
            })
        return res.json({products: [...sells].sort((a,b) => a["productsRemote.full_name"].localeCompare(b["productsRemote.full_name"]))})
    }

    async getSuppliers(req, res){
        const suppliers = await SuppliersRemote.findAll({
            attributes: ['Поставщик'],
            order:[['Поставщик', "ASC"]],
            group: 'Поставщик',
            raw: true
        })

        const supplierList = []

        for (let supplier of suppliers) {
            supplierList.push(supplier.Поставщик)
        }
        return res.json(supplierList)
}


}

module.exports = new OrderController()