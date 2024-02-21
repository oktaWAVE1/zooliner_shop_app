const {BonusPointSite, BonusPointsLogSite} = require("../models/modelSite");


class BonusService {
    async addPoints(userId, qty, comment, orderId, usedFrozenPoints) {
        try {
            const currentBonus = await BonusPointSite.findOne({where: {userId}})
            const updatedQty = (parseInt(qty) + parseInt(currentBonus.currentQty)) > 0 ?
                parseInt(qty) + parseInt(currentBonus.currentQty) :
                0
            const updateFrozenQty = (-parseInt(usedFrozenPoints) + parseInt(currentBonus.frozenPoints)) > 0 ?
                -parseInt(usedFrozenPoints) + parseInt(currentBonus.frozenPoints) :
                0

            await BonusPointSite.update({currentQty: updatedQty, frozenPoints: updateFrozenQty}, {where: {userId}})
            const userBonusLog = await BonusPointsLogSite.create({qtyChanges: qty, description: comment, bonusPointId: currentBonus.id, orderId})
            return userBonusLog
        } catch {
            return null
        }
    }
}

module.exports = new BonusService()