const {ProductRemote, CategoryProductRemote} = require("../models/models");
const {Op} = require("sequelize");
const fs = require("fs");
const date = new Date()
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
const currentDate = `${day}.${month}.${year}`
const ignoreSet = new Set([14026, 9768, 9769, 9770, 10146, 10573, 10591, 10806, 10807, 10988, 11005, 11498, 13109, 10026])


async function inventProducts() {
    const products = await ProductRemote.findAll({where: {product_in_stock: {
        [Op.ne]: 0
            }},
        order: [
            [{model: ProductRemote, as: 'parent'}, 'Наименование', 'ASC'],
            [{model: ProductRemote, as: 'parent'}, 'Наименование (крат опис)', 'ASC'],
            ['Наименование', 'ASC'],
            ['Наименование (крат опис)', 'ASC']

        ],
        include: [
            {model: CategoryProductRemote, limit: 1},
            {model: ProductRemote, as: "parent", include: {
            model: CategoryProductRemote, limit: 1
                }}
        ]
            })
    const productsToBeSorted = []
    products.forEach(row => {
        productsToBeSorted.push(row.id_родительского>0 ?  {... row.dataValues, category: row.parent.categoriesOfProductsRemotes[0]?.dataValues?.название_категории}
            : {...row.dataValues, category: row.categoriesOfProductsRemotes[0]?.dataValues?.название_категории})
    })

    const sortedProducts = [...productsToBeSorted].sort((a, b) => a?.category?.toLowerCase().localeCompare(b?.category?.toLowerCase()))
    const header = 'Название~Код~Кол\n'
    // fs.unlinkSync(`./static/inventarization ${currentDate}.csv`    )
    fs.appendFileSync(`./static/inventarization ${currentDate}.csv`, header)
    sortedProducts.forEach(product => {
        const title = product.parent?.Наименование ? `${product.parent?.Наименование}, ${product.parent['Наименование (крат опис)']}, ${product.Наименование}`
        : `${product.Наименование}, ${product['Наименование (крат опис)']}`
        const data = `${title}~${product.Код}~${product.product_in_stock}\n`
        if(!(ignoreSet.has(product.Код)) && !product['Развесной пакет']===true && (product.Наименование!=='развес 100 г.')){
            fs.appendFileSync(`./static/inventarization ${currentDate}.csv`, data)
        }
    })
    console.log('done')
}

module.exports = {
    inventProducts
}