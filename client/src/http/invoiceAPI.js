import {$authHost} from "./index";

export const fetchInvoiceList = async({limit}) => {
    const {data} = await $authHost.get('api/invoice/list', {limit})
    return data
}

export const fetchInvoice = async({invoiceName}) => {
    const {data} = await $authHost.get('api/invoice', {params: {
            invoiceName
        }})
    return data
}

export const addInvoiceItemsByBarcodeList = async({barcodeList, invoiceName, supplier}  ) => {
    const {data} = await $authHost.post('api/invoice/items/barcodeList', {barcodeList, invoiceName, supplier} )
    return data
}


export const addInvoiceItemsBySKUList = async({SKUList, invoiceName, supplier}  ) => {
    const {data} = await $authHost.post('api/invoice/items/SKUList', {SKUList, invoiceName, supplier} )
    return data
}

export const addInvoiceItemsById = async({Код, invoiceName, supplier}  ) => {
    const {data} = await $authHost.post('api/invoice/items/id', {Код, invoiceName, supplier} )
    return data
}

export const deleteInvoiceItem = async({Счетчик}  ) => {
    const {data} = await $authHost.delete('api/invoice/items', {params: {Счетчик}} )
    return data
}

export const updateInvoiceItemPriceQTY = async({Счетчик, Цена, Количество}  ) => {
    const {data} = await $authHost.patch('api/invoice/items', {Счетчик, Цена, Количество} )
    return data
}

export const processInvoice = async({invoiceName, supplier}  ) => {
    if(window.confirm('Провести?')) {
        const {data} = await $authHost.post('api/invoice/process', {invoiceName, supplier})
        return data
    }
}