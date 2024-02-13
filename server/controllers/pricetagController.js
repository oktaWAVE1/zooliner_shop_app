const {ProductRemote, PriceTagRemote} = require("../models/models");
const {Op} = require("sequelize");

class PriceTagController {


    async getPriceTags (req, res) {
        const tags = []
        const priceTags = await PriceTagRemote.findAll({
            include: [
                {model: ProductRemote, include: [
                        {model: ProductRemote, as: "parent", include: [
                                {model: ProductRemote, as: "children"}
                            ]}
                    ]}
            ]
        })
        priceTags.forEach(pt => {
            if (pt.Код && pt?.productsRemote){
                if(pt?.productsRemote?.Наименование.toLowerCase()!=='развес г.'){
                    const title = pt.title = pt.productsRemote?.parent?.Код ? `${pt.productsRemote.parent.Наименование} ${pt.productsRemote.parent['Наименование (крат опис)']} ${pt.productsRemote.Наименование}`
                        : `${pt.productsRemote.Наименование} ${pt.productsRemote['Наименование (крат опис)']}`
                    tags.push({title, id: pt?.productsRemote?.Код, price: pt?.productsRemote?.Цена})
                } else {
                    pt.productsRemote.parent.children.forEach(child => {
                        const title = `${pt.productsRemote.parent.Наименование} ${pt.productsRemote.parent['Наименование (крат опис)']} ${child.Наименование}`
                        if (child['Развесной пакет']!==false || child.Наименование.toLowerCase()==="развес 100 г."){
                            tags.push({title, id: child.Код, price: child.Цена})
                        }
                    })
                }

            }
        })

        return res.json(tags)

    }

    async delPriceTag (req, res) {
        try{
            const {id} = req.params
            await PriceTagRemote.destroy({limit: 1, where: {Код: id}})
            return res.json("Ценник удален")
        } catch (e) {
            console.log(e)
        }
    }

    async delAllPriceTags (req, res) {
        try{
            await PriceTagRemote.destroy({where: {}, truncate: true})
            return res.json("Ценники удалены")
        } catch (e) {
            console.log(e)
        }
    }

    async addPriceTag (req, res, next) {
        const {Код} = req.body

        if(Код){
            await PriceTagRemote.create({Код})
            return res.json("Ценник добавлен")
        } else {
            return res.json('Пустой код')
        }


    }



}

module.exports = new PriceTagController()