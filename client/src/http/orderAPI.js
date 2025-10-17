import {$authHost} from './index'

export const fetchOrders = async() => {
    const {data} = await $authHost.get('api/order')
    return data
}

export const addNewOrder = async({Описание}) => {
    const {data} = await $authHost.post('api/order', {Описание})
    return data
}


export const editOrder = async({Описание, Выполнено, Счетчик}) => {
    const {data} = await $authHost.patch(`api/order/item/${Счетчик}`, {Описание, Выполнено})
    return data
}

export const fetchOrderList = async() => {
    const {data} = await $authHost.get('api/order/orderList')
    return data
}

export const fetchSuppliers = async() => {
    const {data} = await $authHost.get('api/order/suppliers')
    return data
}