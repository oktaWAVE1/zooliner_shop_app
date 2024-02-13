import {$authHost} from './index'


export const fetchPriceTags = async() => {
    const {data} = await $authHost.get(`api/tag`)
    return data
}

export const delPriceTag = async ({Код}) => {
    const {data} = await $authHost.delete(`api/tag/del/${Код}`)
    return data
}

export const delAllPriceTags = async () => {
    if(window.confirm('Уверены, что желаете удалить все ценники?')) {
        const {data} = await $authHost.delete(`api/tag/all`)
        return data
    }
}

export const addPriceTag = async ({Код}) => {
    console.log(Код)
    const {data} = await $authHost.post(`api/tag`, {Код})
    return data
}




