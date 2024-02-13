const {BarcodeRemote, ProductRemote} = require("../models/models");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");

class BarcodeController {

    async getNoBarcodeProducts (req, res) {
        const products = await ProductRemote.findAll({where: {
            product_in_stock: {[Op.gt]: 0},
            "Нет штрихкода": false,
            },
            include: [
                {model: ProductRemote, as: 'parent'},
                {model: BarcodeRemote}
            ]})
        const noBarcodeProducts = [...products.filter(p => p.barcodeRemotes?.length===0)
            .filter(p => !p.Наименование.includes('развес'))
            .sort((a,b) => a.parent?.Наименование - b.parent?.Наименование)]
        return res.json(noBarcodeProducts)
    }

    async addBarcode (req, res, next) {
        const {Штрихкод, Код} = req.body
        const isExist = await BarcodeRemote.findOne({where: {Штрихкод}})
        if (isExist){
            console.log(`Штрихкод ${Штрихкод} уже существует`)
            return next(ApiError.forbidden("Штрихкод уже используется"))
        } else {
            const barcode = await BarcodeRemote.create({Штрихкод, Код})
            return res.json(barcode)
        }
    }

    async patchBarcode (req, res) {
        const {Штрихкод, Код} = req.body
        let barcode
        const isExist = await BarcodeRemote.findOne({where: {Штрихкод}})
        if (isExist){
            await BarcodeRemote.update({Код}, {where: {Штрихкод}}).then(() => {
                barcode = {Штрихкод}
            })
        } else {
            barcode = await BarcodeRemote.create({Штрихкод, Код})
        }
        return res.json(barcode)
    }

    async patchProduct (req, res) {
        const {noBarcode, Код} = req.body
        await ProductRemote.update({'Нет штрихкода': noBarcode}, {where: {Код}}).then(product => {

            return res.json("Успешно обновлено")

        })
    }

}

module.exports = new BarcodeController()