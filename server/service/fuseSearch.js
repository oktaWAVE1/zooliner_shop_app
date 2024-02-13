const Fuse = require ("fuse.js");
const config = require("../config");

async function fuseSearch(products, query, limit=20) {
    for (let p of products){
        const vendorCodes = []
        const childNames = []

        p.children.forEach(sr => {
            vendorCodes.push(sr['Артикул поставщика'])
            childNames.push(sr.Наименование)
        })
        p.search = `${p.Наименование} ${p['Наименование (крат опис)']} ${p.Код} ${vendorCodes.join(' ')} ${childNames.join(' ')}`
    }
    const fuse = new Fuse(products, config.fuseOptions)
    const result = fuse.search(query, {limit: limit || config.fuseLimit})

    return result
}

module.exports = {
    fuseSearch
}