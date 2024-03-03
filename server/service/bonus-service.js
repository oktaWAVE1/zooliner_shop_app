const {BonusPointSite, BonusPointsLogSite, OrderSite} = require("../models/modelSite");


class BonusService {
    async addPoints(userId, qty, comment, orderId, usedFrozenPoints) {
        try {

            const currentBonus = await BonusPointSite.findOne({where: {userId}})
            const updatedQty = (parseInt(qty) + parseInt(currentBonus.currentQty)) > 0 ?
                parseInt(qty) + parseInt(currentBonus.currentQty) :
                0
            const updateFrozenQty = ((-parseInt(usedFrozenPoints) || 0 )+ parseInt(currentBonus.frozenPoints))

            if (updateFrozenQty>=0){
                await BonusPointSite.update({currentQty: updatedQty, frozenPoints: updateFrozenQty}, {where: {userId}})
            } else {
                await BonusPointSite.update({currentQty: updatedQty-usedFrozenPoints}, {where: {userId}})
            }

            const userBonusLog = await BonusPointsLogSite.create({qtyChanges: qty-usedFrozenPoints, description: comment, bonusPointId: currentBonus.id, orderId})

            return userBonusLog
        } catch (e) {
            console.log(e)
            return null
        }
    }
}

module.exports = new BonusService()