import {$authHost} from './index'

export const fetchCustomers = async() => {
    const {data} = await $authHost.get('api/customer')
    return data
}

export const addNewCustomer = async({Имя, Телефон, Адрес, Комментарий}) => {
    const {data} = await $authHost.post('api/customer', {Имя, Телефон, Адрес, Комментарий})
    return data
}


export const editCustomer = async({Имя, Телефон, Адрес, Комментарий, Код}) => {
    const {data} = await $authHost.patch(`api/customer/item/${Код}`, {Имя, Телефон, Адрес, Комментарий})
    return data
}