const {SellsCounterRemote, SellsRemote, ProductRemote, BarcodeRemote, DeliveryRemote, CustomersRemote,
    ExtraProductsLogsRemote
} = require("../models/models");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const bonusService = require('../service/bonus-service')
const {OrderSite} = require("../models/modelSite");

class RealizationContoller {

    async getAll (req, res) {
        const realizations = await SellsCounterRemote.findAll({
            include: [
                {model: SellsRemote},
            ]})

        return res.json(realizations)
    }


    async getRealizationsDeliveriesToday (req, res, next) {
        const date = new Date()
        date.setHours(0)

        const realizations = await SellsCounterRemote.findAll(
            {order: [['deliveryId', "ASC"]],
                    where: {deliveryId: {[Op.gt]: 0}},
                    include: [
                    {model: SellsRemote, where: {
                            Дата: {[Op.gte]: date},
                        }},
                    {model: DeliveryRemote},
                    {model: CustomersRemote},
                ]}
        )

        return res.json(realizations)
    }


    async getRealizationsDateRange (req, res, next) {
        let {dateStart, dateEnd} = req.query
        if (!dateEnd || !dateEnd) {
            return next(ApiError.badRequest("Неправильно задан диапазон дат"))
        }
        dateEnd = `${dateEnd} 23:59:59`


        const realizations = await SellsCounterRemote.findAll(
            {include: [
                        {model: DeliveryRemote},
                        {model: SellsRemote, where: {
                            Дата: {[Op.lte]: dateEnd, [Op.gte]: dateStart},
                            }},
                    ]}
        )

        return res.json(realizations)
    }

    async getDeliveryMethods(req, res) {
        const methods = await DeliveryRemote.findAll()
        return res.json(methods)
    }

    async getRealization (req, res) {
        const {id} = req.params
        const realization = await SellsCounterRemote.findOne({where: {Счетчик: id},
            include: [
                {model: DeliveryRemote},
                {model: CustomersRemote},
                {model: SellsRemote, order: [[
                    "Счетчик", "ASC"
                    ]], include: [
                        {model: ProductRemote}
                    ]}
            ]})
        return res.json(realization)
    }

    async newRealization (req, res) {
        const realizations = await SellsCounterRemote.findAll({
            limit: 1, order: [['Счетчик', 'DESC']], include: [
                {model: SellsRemote},
            ]
        })
        const realization = realizations[0]
        if (realization?.sellsRemotes?.length > 0 || realization.Проведение===true) {
            let context = {
                Счетчик: parseInt(realization.Счетчик) + 1, refund: false
            }
            context['Код магазина'] = 'PA60'
            await SellsCounterRemote.create(context).then((real) => {
                return res.json({id: parseInt(real.Счетчик)})
            })

        } else {
            return res.json({id: parseInt(realization.Счетчик)})
        }

    }

    async confirmRealization (req, res, next) {
        try {
            const {id} = req.body
            let {date} = req.body
            if (!date || date?.length<0){
                date = (new Date)
                date = date.setHours(date.getHours() + 3)

            }
            console.log(date)
            const realization = await SellsCounterRemote.findOne({where: {Счетчик: id}, include: [
                    {model: SellsRemote}
                ]})
            if (!realization) {
                return next(ApiError.badRequest('Реализация не найдена'))
            }
            if(realization.Проведение){
                return next(ApiError.badRequest('Реализация уже проведена'))
            }
            if(realization.sellsRemotes?.length===0){
                return next(ApiError.badRequest('Нет позиций в реализации'))
            }
            const extraProducts = []
            let totalSum = 0
            for (let item of realization.sellsRemotes){
                totalSum += item.Цена * item.Количество
                const product = await ProductRemote.findOne({where: {Код: item['Код товара']}})
                if(product){
                    const cost = product['Средний закуп'] > 0 ? product['Средний закуп'] : product['Закуп последний']
                    const profit = (item.Цена-cost)*item.Количество
                    if(realization.Безнал){
                        await SellsRemote.update({Прибыль: profit*0.982, Дата: date}, {where: {Счетчик: item.Счетчик}})
                    } else {
                        await SellsRemote.update({Прибыль: profit, Дата: date}, {where: {Счетчик: item.Счетчик}})
                    }
                    if (product.product_in_stock<item.Количество){
                        extraProducts.push({
                            extraQTY: item.Количество - product.product_in_stock,
                            name: item.Наименование,
                            id: item['Код товара'],
                            price: item.Цена
                        })
                    }
                    await product.update({product_in_stock: product.product_in_stock-item.Количество}, {where: {Код: product.Код}}).then(async() => {

                        if (product.Наименование.toLowerCase()==='развес г.' || product['Развесной пакет']!=0){
                            const weightProduct = await ProductRemote.findOne({where: {Код: product.Код}, include: [
                                    {model: ProductRemote, as: 'parent', include: [
                                            {model: ProductRemote, as: 'children'},
                                        ]},

                                ]})
                            if(product.Наименование.toLowerCase()==='развес г.') {
                                for (let wpc of weightProduct.parent.children){
                                    if (wpc.Наименование.toLowerCase()=== 'развес 100 г.'){
                                        await ProductRemote.update({product_in_stock: Math.floor((product.product_in_stock)/100)}, {where: {Код: wpc.Код}})
                                    }
                                    if (wpc['Развесной пакет']!=0){
                                        await ProductRemote.update({product_in_stock: Math.floor((product.product_in_stock)/weightProduct.parent.Вес)}, {where: {Код: wpc.Код}})
                                    }
                                }
                            }
                            if (product['Развесной пакет']!=0){
                                for (let wpc of weightProduct.parent.children){
                                    if(wpc.Наименование.toLowerCase()==='развес г.'){
                                        await ProductRemote.update({product_in_stock: ((wpc.product_in_stock-(weightProduct.parent.Вес * item.Количество)))}, {where: {Код: wpc.Код}})
                                    }
                                    if (wpc.Наименование.toLowerCase()=== 'развес 100 г.'){
                                        await ProductRemote.update({product_in_stock: ((wpc.product_in_stock-((weightProduct.parent.Вес * item.Количество)/100)))}, {where: {Код: wpc.Код}})
                                    }

                                }
                            }
                        }
                    })
                }
            }
            const discountedTotal = totalSum - realization.bonusPointsUsed - realization.discount

            if (realization?.siteUserId){

                let title = 'Начислены бонусы за покупку'
                if (realization.bonusPointsUsed){
                    title = `Начислено ${(discountedTotal*0.015).toFixed(2)} бонусов за покупку. Использовано ${realization.bonusPointsUsed} бонусов.`
                }
                if(realization.siteUserId){
                    await OrderSite.update({status: "Выполнен"}, {where: {id: realization.siteUserId}})
                }
                await bonusService.addPoints(realization.siteUserId, discountedTotal*0.015, title, realization.siteOrderId, realization.bonusPointsUsed )
            }
            for (let extraProduct of extraProducts) {
                await ExtraProductsLogsRemote.create({productId: extraProduct.id, name: extraProduct.name, qty: extraProduct.extraQTY, price: extraProduct.price})
            }

            await SellsCounterRemote.update({Проведение: true},{where: {Счетчик: id}}).then(() => {
                return res.json(extraProducts.length===0 ? {status: 'ok'} : {status: 'extra products', extraProducts})
            })


        } catch (e) {
            console.log(e.message)
            return next(ApiError.badRequest(e.message))
        }
    }


    async addRealizationItem (req, res, next) {
        try{
            let date = new Date()
            const today = `${date.getFullYear()}-${String(date.getMonth()+1).length>1 ? date.getMonth()+1 : `0${date.getMonth()+1}`}-${String(date.getDate()).length>1 ? date.getDate() : `0${date.getDate()}`}`

            let {realizationId, itemId, barcode, qty, refund} = req.body
            if(!qty) qty=1
            if(barcode) {
                const productId = await BarcodeRemote.findOne({where: {Штрихкод: barcode}})
                itemId = productId.Код
            }

            const lastRealizationSell = await SellsRemote.findAll({limit:1, order: [['Счетчик', 'DESC']]})
            const realization = await SellsCounterRemote.findOne({where: {Счетчик: realizationId},
                include: [
                    {model: SellsRemote, where: {"Код товара": itemId}},
                ]})
            console.log(realization)
            if(realization?.Проведение){
                return next(ApiError.badRequest("Реализация уже проведена!"))
            }

            if(realization){
                await SellsRemote.update({Количество: refund ? realization.sellsRemotes[0].Количество-1 : realization.sellsRemotes[0].Количество+1},
                    {where: {"№ реализации": realizationId, "Код товара": itemId}}).then(() => {return res.json("Товар добавлен")})
            } else {
                let product = await ProductRemote.findOne({where: {Код: itemId}, include: [
                        {model: ProductRemote, as: 'parent', include: [
                                {model: ProductRemote, as: 'children'}
                            ]},
                        {model: ProductRemote, as: 'children'},
                    ]})

                if (product?.children?.length>0){
                    return next(ApiError.badRequest("У товара есть дочерние, нельзя добавить"))
                }
                let productPrice = Number(product.Цена)
                let productSum = productPrice*qty
                let title = product?.parent?.Код ? `${product.parent.Наименование} ${product.parent['Наименование (крат опис)']} ${product.Наименование}`:
                    `${product.Наименование} ${product['Наименование (крат опис)']}`

                if(product.Наименование === 'развес 100 г.'){
                    product.parent.children.forEach((pr) => {
                        if(pr.Наименование === 'развес г.'){
                            qty = qty ? qty * 100 : 100
                            itemId = pr.Код
                            productPrice = Number(pr.Цена)
                            productSum = productPrice*qty
                            title =  `${product.parent.Наименование} ${product.parent['Наименование (крат опис)']} ${pr.Наименование}`
                        }
                    })
                }
                console.log(qty)
                console.log(productPrice)
                console.log(productSum)

                await SellsRemote.create({
                    "Счетчик": lastRealizationSell[0].Счетчик+1,
                    "№ реализации": realizationId,
                    "Код товара": itemId,
                    "Наименование": title,
                    "Код магазина": 'PA60',
                    Количество: refund ? -qty || -1 : qty || 1,
                    Дата: today,
                    Цена: productPrice,
                    Сумма: productSum
                }).then(() => {
                    return res.json("Товар добавлен")
                })

            }

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async delRealizationItem (req, res, next) {
        try{
            const {id} = req.params
            await SellsRemote.destroy({where: {"Счетчик": id}}).then(() => {
                return res.json("Позиция удалена")
            })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateDeliveryMethod (req, res) {
        try {
            const {deliveryId, realizationId} = req.body
            await SellsCounterRemote.update({deliveryId}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Метод доставки изменен")
            })

        } catch (e) {
            console.log(e.message)
        }
    }

    async updateOrderSiteCustomer (req, res) {
        try {
            const {siteUserId, siteOrderId ,realizationId, bonusPointsUsed} = req.body
            const temp = await SellsCounterRemote.findOne({where: {Счетчик: realizationId}})
            console.log({siteUserId, siteOrderId ,realizationId, bonusPointsUsed})
            await SellsCounterRemote.update({siteUserId, siteOrderId, bonusPointsUsed}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Установлен пользователь сайта")
            })

        } catch (e) {
            console.log(e.message)
        }
    }

    async updatePaymentMethod (req, res) {
        try {
            const {payment, realizationId} = req.body
            await SellsCounterRemote.update({Безнал: payment}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Метод оплаты изменен")
            })

        } catch (e) {
            console.log(e.message)
        }
    }

    async updateDiscount (req, res) {
        try {
            const {discount, discountDescription, realizationId} = req.body
            await SellsCounterRemote.update({discount, discountDescription}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Скидка обновлена")
            })

        } catch (e) {
            console.log(e.message)
        }
    }

    async updateUser (req, res) {
        try {
            const {userId, realizationId} = req.body
            await SellsCounterRemote.update({userId}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Клиент изменен")
            })

        } catch (e) {
            console.log(e.message)
        }
    }

    async updateRefund (req, res) {
        try {
            const {refund, realizationId} = req.body
            console.log(refund)
            const items = await SellsRemote.findAll({where: {"№ реализации": realizationId}})
            if (refund===false){
                await SellsRemote.destroy({where: {"№ реализации": realizationId}})
            } else {
                for (let item of items){
                    await SellsRemote.update({Количество: -item.Количество}, {where: {Счетчик: item.Счетчик}})
                }
            }

            await SellsCounterRemote.update({refund}, {where: {Счетчик: realizationId}}).then(() => {
                return res.json("Тип реализации изменен")
            })

        } catch (e) {
            console.log(e.message)
        }
    }


    async updateSellsItemPriceQty (req, res) {
        try {
            const {itemId, qty, price} = req.body
            if(price){
                await SellsRemote.update({Количество: qty, Цена: price}, {where: {Счетчик: itemId}}).then(() => {
                    return res.json("Количество изменено")
                })
            } else {
                await SellsRemote.update({Количество: qty}, {where: {Счетчик: itemId}}).then(() => {
                    return res.json("Количество изменено")
                })
            }

        } catch (e) {
            console.log(e.message)
        }
    }



}

module.exports = new RealizationContoller()