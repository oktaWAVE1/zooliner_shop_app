import {$authHost} from './index'

export const fetchNoBarcodeProducts = async() => {
    const {data} = await $authHost.get('api/barcode/product')
    return data
}

export const addNewBarcode = async({Штрихкод, Код}) => {
    const {data} = await $authHost.post('api/barcode', {Штрихкод, Код})
    return data
}

export const editBarcode = async({Штрихкод, Код}) => {
    const {data} = await $authHost.patch('api/barcode', {Штрихкод, Код})
    return data
}

export const editBarcodeExistProduct = async({noBarcode, Код}) => {
    const {data} = await $authHost.patch('api/barcode/product', {noBarcode, Код})
    return data
}

