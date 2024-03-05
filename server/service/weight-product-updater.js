const {ProductRemote} = require("../models/models");
const {Op} = require("sequelize");

const update = async (timeOffset) => {
    const start = Date.now()
    const msSinceEpoch = (new Date()).getTime();
    const updatedStartTime = (new Date(msSinceEpoch + (1000 * 60 * 60 * 3) - (1000 * 60 * 60 * timeOffset))).toUTCString()

    await ProductRemote.findAll({
        where: {updatedAt: {[Op.gt]: updatedStartTime}}
    }).then(async (remoteProducts) => {
        for (const product of remoteProducts) {
            if (product.Наименование.toLowerCase()==='развес г.' || product['Развесной пакет']===true){
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
                            await ProductRemote.update({product_in_stock: ((wpc.product_in_stock-weightProduct.parent.Вес))}, {where: {Код: wpc.Код}})
                        }
                        if (wpc.Наименование.toLowerCase()=== 'развес 100 г.'){
                            await ProductRemote.update({product_in_stock: ((wpc.product_in_stock-(weightProduct.parent.Вес/100)))}, {where: {Код: wpc.Код}})
                        }

                    }
                }
            }
        }
    }).then(() => {
        console.log(`result: Done in ${Math.floor((Date.now() - start) / 1000)} sec. StartSearch: ${updatedStartTime}`)
    })
}


module.exports = {
    update
}




