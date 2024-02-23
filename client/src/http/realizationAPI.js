import {$authHost} from './index'

export const fetchRealizationsDateRange = async({dateStart, dateEnd}) => {
    const {data} = await $authHost.get('api/realization/current', {
        params: {
            dateStart,
            dateEnd
        }
    })
    return data
}

export const fetchRealization = async({id}) => {
    const {data} = await $authHost.get(`api/realization/item/${id}`)
    return data
}

export const fetchDeliveryMethods = async() => {
    const {data} = await $authHost.get(`api/realization/delivery_methods`)
    return data
}

export const fetchRealizationsToday = async() => {
    const {data} = await $authHost.get(`api/realization/today_deliveries`)
    return data
}

export const addNewRealization = async () => {
    const {data} = await $authHost.get('api/realization/new')
    return data
}

export const addNewRealizationItem = async ({realizationId, itemId, qty, barcode, refund}) => {
    const {data} = await $authHost.post('api/realization/add', {realizationId, itemId, qty, barcode, refund})
    return data
}

export const confirmCurrentRealization = async ({id, date}) => {
    if(window.confirm('Провести?')) {
        const {data} = await $authHost.post('api/realization/confirm', {id, date})
        return data
    }
}

export const delSellItemFromRealization = async ({id}) => {
    const {data} = await $authHost.delete(`api/realization/delete/${id}`)
    return data
}

export const updateRealizationDeliveryMethod = async ({deliveryId, realizationId}) => {
    const {data} = await $authHost.patch(`api/realization/delivery`, {deliveryId, realizationId})
    return data
}

export const updateRealizationPaymentMethod = async ({payment, realizationId}) => {
    const {data} = await $authHost.patch(`api/realization/payment`, {payment, realizationId})
    return data
}

export const updateRealizationSiteCustomer = async ({siteUserId, siteOrderId ,realizationId, bonusPointsUsed}) => {
    const {data} = await $authHost.patch(`api/realization/site/user`, {siteUserId, siteOrderId ,realizationId, bonusPointsUsed})
    return data
}

export const updateRealizationDiscount = async ({discount, discountDescription, realizationId}) => {
    const {data} = await $authHost.patch(`api/realization/discount`, {discount, discountDescription, realizationId})
    return data
}

export const updateRealizationUser = async ({userId, realizationId}) => {
    const {data} = await $authHost.patch(`api/realization/user`, {userId, realizationId})
    return data
}

export const updateRealizationType = async ({refund, realizationId}) => {
    if(window.confirm('Пометить реализацию как возврат?')) {
        const {data} = await $authHost.patch(`api/realization/refund`, {refund, realizationId})
        return data
    }
}

export const updateRealizationItemPriceQty = async ({itemId, qty, price}) => {
    const {data} = await $authHost.patch(`api/realization/item/price_qty`, {itemId, qty, price})
    return data
}


