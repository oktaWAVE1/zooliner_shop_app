const {ProductRemote, CategoryProductRemote} = require("../models/models");
const {Op} = require("sequelize");
const fs = require("fs");

function createEAN8(ean7Digits) {

    let sum = 0;
    for (let i = 0; i < ean7Digits.length; i++) {
        const digit = parseInt(ean7Digits[i]);
        sum += (i % 2 === 0) ? digit * 3 : digit * 1;
    }
    const remainder = sum % 10;
    return (remainder === 0) ? `${ean7Digits}0` : `${ean7Digits}${10 - remainder}`;
}

async function barcodeGenerator() {
    const products = await ProductRemote.findAll()

    const header = 'Barcode~Код\n'
    fs.appendFileSync(`./static/barcodesGenerated.csv`, header)
    products.forEach(product => {
        const barcode = createEAN8(String(product.Код).padStart(7, "5"))
        const data = `${barcode}~${product.Код}\n`
            fs.appendFileSync(`./static/barcodesGenerated.csv`, data)
    })
    console.log('done')
}

module.exports = {
    barcodeGenerator
}