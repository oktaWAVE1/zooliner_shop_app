const {ManufacturersRemote} = require("../models/models");

class BrandController {

    async getBrands(req, res) {
        const brands = await ManufacturersRemote.findAll()
        return res.json(brands)
    }



}

module.exports = new BrandController()