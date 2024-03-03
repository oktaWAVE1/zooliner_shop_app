import {$authHost} from './index'


export const fetchUnreadSiteOrders = async() => {
    const {data} = await $authHost.get(`api/site`)
    return data
}

export const fetchSiteOrder = async({id}) => {
    const {data} = await $authHost.get(`api/site/current/${id}`)
    return data
}


export const setSiteOrderRead = async ({id}) => {
    const {data} = await $authHost.post(`api/site/read`, {id})
    return data
}

export const fetchUserBonus = async({userId}) => {
    const data = await $authHost.get(`api/site/userbonus/${userId}`)
    return data
}

export const fetchSiteCategories = async() => {
    const {data} = await $authHost.get(`api/site/category`)
    return data
}




