import {$authHost} from './index'

export const fetchBrands= async() => {
    const {data} = await $authHost.get('api/brand')
    return data
}

