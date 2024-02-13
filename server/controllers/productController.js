const {ProductRemote, BarcodeRemote, ProductTagRemote, ManufacturersRemote} = require("../models/models");
const {fuseSearch} = require("../service/fuseSearch");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");

class ProductController {

    async getAll (req, res) {
        const products = await ProductRemote.findAll({
            // where: {productId: {[Op.eq]: 0}},
            include: [
                {model: ProductRemote, as: 'parent'},
            ]})

        return res.json(products)
    }



    async getProduct (req, res) {
        const {id} = req.params
        const product = await ProductRemote.findOne({where: {Код: id},
            include: [
                {model: ProductRemote, as: 'children'},
                {model: ProductRemote, as: 'parent'},

            ]})
        return res.json(product)
    }

    async getProductByBarcode (req, res, next) {
        const {Штрихкод} = req.query
        const product = await ProductRemote.findOne({
            include: [
                {model: ProductRemote, as: 'parent'},
                {model: BarcodeRemote, where: {Штрихкод}},
            ]})
        if(!product) {
            return next(ApiError.forbidden(`Товар с штрихкодом ${Штрихкод} не найден`))
        } else {
            return res.json(product)
        }
    }

    async getStockProductsByManufacturer (req, res, next) {
        const {id} = req.query
        try {
            const products = await ProductRemote.findAll({
                include: [
                    {model: ProductRemote, as: 'children'},
                    {model: ManufacturersRemote, where: {id_производителя: id}},
                ]})

            const productList = []
            products.forEach(p => {
                if(!p?.children || p.children.length===0){
                    if(p.product_in_stock>0){
                        const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}`
                        productList.push({title, id: p.Код, stock: p.product_in_stock})
                    }
                } else {
                    p.children.forEach(pc => {
                        if(pc.product_in_stock>0 && pc.Наименование!=='развес 100 г.' && pc["Развесной пакет"]===false){
                            const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}, ${pc.Наименование}`
                            productList.push({title, id: pc.Код, stock: pc.product_in_stock})
                        }
                    })
                }
            })
        return res.json(productList)

        } catch (e) {
            console.log(e)
        }


    }

    async getProductByCode (req, res, next) {
        const {Код} = req.query
        const product = await ProductRemote.findOne({
            where: {Код},
            include: [
                {model: ProductRemote, as: 'parent'},
            ]})
        if(!product) {
            return next(ApiError.badRequest(`Товар с кодом ${Код} не найден`))
        } else {
            return res.json(product)
        }
    }

    async getSearchedProducts (req, res) {
        const {query} = req.query
        const searchedProducts = []

        await ProductRemote.findAll({where: {id_родительского: {[Op.eq]: 0}}, order: [['Наименование', 'ASC']], include: [
                {model: ProductRemote, as: 'children'},
            ]}).then(async (products) => {
            const search = await fuseSearch(products, query)
            search.forEach(item => searchedProducts.push(item.item))
            return res.json(searchedProducts)
        })

    }


}

module.exports = new ProductController()