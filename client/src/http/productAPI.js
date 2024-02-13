import {$authHost} from './index'

export const fetchAllProducts = async() => {
    const {data} = await $authHost.get('api/product')
    return data
}

export const fetchSearchedProducts = async({query}) => {
    const {data} = await $authHost.get('api/product/search', {
        params: {
            query
        }
    })
    return data
}

export const fetchProduct = async({id}) => {
    const {data} = await $authHost.get(`api/product/item/${id}`)
    return data
}

export const fetchStockProductsByBrand = async({id}) => {
    const {data} = await $authHost.get(`api/product/brand`, {
        params: {
            id
        }
    })
    return data
}

export const fetchProductByBarcode = async({Штрихкод}) => {
    const {data} = await $authHost.get(`api/product/barcode`, {
        params: {
            Штрихкод
        }
    })
    return data
}

export const fetchProductByCode = async({Код}) => {
    const {data} = await $authHost.get(`api/product/code`, {
        params: {
            Код
        }
    })
    return data
}

