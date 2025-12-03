const {Sequelize, literal, Op} = require("sequelize");
const {InvoicesRemote, ProductRemote, BarcodeRemote, PriceTagRemote} = require("../models/models");
const ApiError = require("../error/ApiError");
const {logger} = require("sequelize/lib/utils/logger");
const {update} = require('./service/weight-product-updater')

class ProductInvoicingController {
    async getInvoice(req, res) {
        let {invoiceName} = req.query
        if (!invoiceName) {
            return res.status(400).send({error: "Invoice Name is required"})
        }
        const invoice = await InvoicesRemote.findAll({
            where: {['Номер счета']: invoiceName}, order: [['Счетчик', 'ASC']], include: [
                {
                    model: ProductRemote,
                    attributes: ['product_in_stock', 'Средний закуп', "Закуп последний", "Цена"
                    ]

                }
            ], raw: true
        })
        return res.json(invoice)
    }

    async getInvoiceList(req, res) {
        let {limit} = req.query
        if (!limit) {
            limit = 100
        }
        const invoiceList = await InvoicesRemote.findAll({
            attributes: ['Номер счета', 'Дата'],
            group: ['Номер счета', 'Дата'],
            order: [['Дата', 'DESC']],
            raw: true,
            limit
        })

        return res.json(invoiceList)
    }


    async addInvoiceItemsByBarcodeList(req, res, next) {
        let {barcodeList, invoiceName, supplier} = req.body
        if (barcodeList?.length > 5) {
            barcodeList = barcodeList.trim().replaceAll("\n"," ").split(" ")
        } else return res.status(400).send({error: "BarcodeList is required"})
        if (!supplier) return res.status(400).send({error: "Supplier name is required"})
        if (!invoiceName) return res.status(400).send({error: "Invoice name is required"})
        let failedCounter = 0

        for (let barcode of barcodeList) {
            console.log(barcode)

            const product = await BarcodeRemote.findOne({
                where: {
                    Штрихкод: {
                        [Op.like]: `%${barcode.trim().replace(/^0+/, '')}%`
                    },

                },
                attributes: [],
                include: [
                    {
                        model: ProductRemote,
                        include: [{model: ProductRemote, as: 'parent', attributes: []}],
                        attributes: ['Код', ['Артикул поставщика', 'SKU'],
                            [Sequelize.fn('CONCAT_WS',
                                ', ',
                                Sequelize.col('productsRemote->parent.Наименование'),
                                Sequelize.col('productsRemote->parent.Наименование (крат опис)'),
                                Sequelize.col('productsRemote.Наименование'),
                                Sequelize.col('productsRemote.Наименование (крат опис)')
                            ), 'full_name'],


                        ]
                    }
                ]
                , raw: true
            })

            if (!product) {
                failedCounter += 1
            } else {

                const context = {
                    Дата: new Date(),
                    Поставщик: supplier,
                    'Номер счета': invoiceName,
                    Количество: 0,
                    Цена: 0,
                    Проведен: false,
                    Сумма: 0,
                    Наименование: product["productsRemote.full_name"],
                    'Артикул поставщика': product["productsRemote.SKU"],
                    Код: product["productsRemote.Код"]
                }
                await InvoicesRemote.create(context)
            }


        }

        return res.json({Status: "Success", failedCounter})
    }

    async addInvoiceItemsBySKUList(req, res, next) {
        let {SKUList, invoiceName, supplier} = req.body
        console.log(SKUList)
        if (SKUList?.length > 1) {
            SKUList = SKUList.trim().split("\n")
        } else return res.status(400).send({error: "SKUList is required"})
        if (!supplier) return res.status(400).send({error: "Supplier name is required"})
        if (!invoiceName) return res.status(400).send({error: "Invoice name is required"})
        let failedCounter = 0
        for (let SKU of SKUList) {
            console.log(SKU)
            console.log(SKU.trim())
            const product = await ProductRemote.findOne({
                where: {
                    'Артикул поставщика': String(SKU).trim(),
                },
                include: [{model: ProductRemote, as: 'parent', attributes: []}],
                attributes: ['Код', ['Артикул поставщика', 'SKU'],
                    [Sequelize.fn('CONCAT_WS',
                        ', ',
                        Sequelize.col('parent.Наименование'),
                        Sequelize.col('parent.Наименование (крат опис)'),
                        Sequelize.col('productsRemote.Наименование'),
                        Sequelize.col('productsRemote.Наименование (крат опис)')
                    ), 'full_name'],


                ]
                , raw: true
            })


            if (!product) {
                failedCounter += 1
            } else {
                console.log(product)
                const context = {
                    Дата: new Date(),
                    Поставщик: supplier,
                    'Номер счета': invoiceName,
                    Количество: 0,
                    Цена: 0,
                    Проведен: false,
                    Сумма: 0,
                    Наименование: product["full_name"],
                    'Артикул поставщика': product["SKU"],
                    Код: product["Код"]
                }
                await InvoicesRemote.create(context)
            }


        }

        return res.json({Status: "Success", failedCounter})
    }
    async addInvoiceItemById(req, res, next) {
        let {Код, invoiceName, supplier} = req.body
        if (!Код || !Number(Код))  return res.status(400).send({error: "Product id is required"})
        if (!supplier) return res.status(400).send({error: "Supplier name is required"})
        if (!invoiceName) return res.status(400).send({error: "Invoice name is required"})


        const product = await ProductRemote.findOne({
            where: {
                Код
            },
            include: [{model: ProductRemote, as: 'parent', attributes: []}],
            attributes: ['Код', ['Артикул поставщика', 'SKU'],
                [Sequelize.fn('CONCAT_WS',
                    ', ',
                    Sequelize.col('parent.Наименование'),
                    Sequelize.col('parent.Наименование (крат опис)'),
                    Sequelize.col('productsRemote.Наименование'),
                    Sequelize.col('productsRemote.Наименование (крат опис)')
                ), 'full_name'],


            ]
            , raw: true
        })

        if (product)  {
            const context = {
                Дата: new Date(),
                Поставщик: supplier,
                'Номер счета': invoiceName,
                Количество: 0,
                Цена: 0,
                Проведен: false,
                Сумма: 0,
                Наименование: product["full_name"],
                'Артикул поставщика': product["SKU"],
                Код: product["Код"]
            }
            await InvoicesRemote.create(context)
        }




        return res.json({Status: "Success"})
    }

    async processInvoice (req,res, next) {
        let {invoiceName, supplier} = req.body
        try{
            const invoiceItems = await InvoicesRemote.findAll({where: {Поставщик: supplier, 'Номер счета': invoiceName}})
            for (const invoiceItem of invoiceItems) {
                if(!invoiceItem.Проведен){
                    const product = await ProductRemote.findOne({where: {Код: invoiceItem.Код}})
                    let product_in_stock = product.product_in_stock+product?.product_in_stock_OM
                    if (product_in_stock<0) product_in_stock = 0
                    let prevAvgCost = product['Средний закуп']
                    if (!prevAvgCost) prevAvgCost = 0
                    const avgCost = ((invoiceItem.Цена*invoiceItem.Количество)+(prevAvgCost*(product_in_stock)))/(invoiceItem.Количество+product_in_stock)
                    const totalQTY = invoiceItem.Количество + product?.product_in_stock
                    await product.update({product_in_stock: totalQTY, 'Средний закуп': avgCost, 'Закуп последний': invoiceItem.Цена})
                    await invoiceItem.update({Проведен: true})
                    await PriceTagRemote.create({Код: product.Код})
                } else {
                    console.log(`Позиция номер ${invoiceItem?.Счетчик} уже проведена` )
                }

        }
            await update(1)
            return res.json('Успешно обновлено')
        } catch (e) {
            console.warn(e)
        }


    }
    async delInvoiceItems(req, res, next) {
        const {Счетчик} = req.query
        await InvoicesRemote.destroy({where: {Счетчик, Проведен: false}})
        return res.json("Удалено")
    }

    async updateInvoiceItemPriceQTY(req, res, next) {
        let {Счетчик, Количество, Цена} = req.body
        if(!Цена) Цена = 0
        if(!Количество) Количество = 0
        Цена = Цена ? Number(String(Цена).replace(',', ".")) : 0
        await InvoicesRemote.update({Количество, Цена, Сумма: Цена*Количество},{where: {Счетчик}})

        return res.json("Обновлено")
    }

}

module.exports = new ProductInvoicingController();