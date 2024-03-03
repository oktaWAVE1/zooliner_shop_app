const {ProductRemote, BarcodeRemote, ManufacturersRemote} = require("../models/models");
const {fuseSearch} = require("../service/fuseSearch");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const {ProductSite, CategorySite} = require("../models/modelSite");

class ProductController {

    async getAll (req, res) {
        const products = await ProductRemote.findAll({
            // where: {productId: {[Op.eq]: 0}},
            include: [
                {model: ProductRemote, as: 'parent'},
            ]})

        return res.json(products)
    }

    async getPopularProducts (req, res) {
        const weight = await ProductRemote.findAll({
            where: {product_in_stock: {[Op.gt]: 0}, Наименование: 'развес г.'},
            include: [
                {model: ProductRemote, as: 'parent'},
            ]})
        const piece = await ProductRemote.findAll({
            where: {product_in_stock: {[Op.gt]: 0}, Наименование: {[Op.substring]: '1 шт'}},
            include: [
                {model: ProductRemote, as: 'parent'},
            ]})
        const cat_step = await ProductRemote.findAll({
            where: {Наименование: 'CAT STEP'},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const noname = await ProductRemote.findAll({
            where: {'Наименование (крат опис)': {[Op.substring]: 'Noname'}},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const ecopremium = await ProductRemote.findAll({
            where: {Наименование: 'Ecopremium'},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const silicagel = await ProductRemote.findAll({
            where: {'Наименование (крат опис)': 'кусковой'},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const barsik = await ProductRemote.findAll({
            where: {'Наименование (крат опис)': {[Op.substring]: 'наполнитель'}, Наименование: 'БАРСИК'},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const pipi_bent = await ProductRemote.findAll({
            where: {Наименование: 'Pi-Pi Bent'},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const n1 = await ProductRemote.findAll({
            where: {'Наименование (крат опис)': {[Op.substring]: 'наполнитель'}, Наименование: {[Op.substring]: 'N1'}},
            include: [
                {model: ProductRemote, as: 'children'},
            ]})
        const products = [
            {key: 'Развес', items: weight},
            {key: 'Поштучно', items: piece},
            {key: 'Noname', items: noname},
            {key: 'Ecopremium', items: ecopremium},
            {key: 'Силикагель', items: silicagel},
            {key: 'Cat step', items: cat_step},
            {key: 'Барск', items: barsik},
            {key: 'PiPi Bent', items: pipi_bent},
            {key: 'N1', items: n1},
        ]


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

    async getStockProducts (req, res, next) {
        const {brand, category} = req.query
        console.log(category)
        try {
            if (brand){
                const products = await ProductRemote.findAll({
                    include: [
                        {model: ProductRemote, as: 'children'},
                        {model: ManufacturersRemote, where: {id_производителя: brand}},
                    ]})

                const productList = []
                products.forEach(p => {
                    if(!p?.children || p.children.length===0){
                        if(p.product_in_stock!==0){
                            const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}`
                            productList.push({title, id: p.Код, stock: p.product_in_stock})
                        }
                    } else {
                        p.children.forEach(pc => {
                            if(pc.product_in_stock!==0 && pc.Наименование!=='развес 100 г.' && pc["Развесной пакет"]===false){
                                const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}, ${pc.Наименование}`
                                productList.push({title, id: pc.Код, stock: pc.product_in_stock})
                            }
                        })
                    }
                })
                return res.json(productList)
            }

            if (category){
                const productsSite = await ProductSite.findAll({where: {productId: 0}, include: [
                        {model: CategorySite, as: "category", where: {id: category}}
                    ]})

                const productList = []
                for (const ps of productsSite){
                    const p = await ProductRemote.findOne({where: {Код: ps.id}, include: [
                            {model: ProductRemote, as: "children"}
                        ]})
                    if(!p?.children || p.children.length===0){
                        if(p.product_in_stock!==0 && p.product_in_stock<100000){
                            const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}`
                            productList.push({title, id: p.Код, stock: p.product_in_stock})
                        }
                    } else {
                        p.children.forEach(pc => {
                            if(pc.product_in_stock!==0 && pc.product_in_stock<100000 && pc.Наименование!=='развес 100 г.' && pc["Развесной пакет"]===false){
                                const title = `${p.Наименование}, ${p["Наименование (крат опис)"]}, ${pc.Наименование}`
                                productList.push({title, id: pc.Код, stock: pc.product_in_stock})
                            }
                        })
                    }
                }

                return res.json(productList)
            }

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