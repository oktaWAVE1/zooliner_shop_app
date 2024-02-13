import {$authHost, $host} from './index'
import jwtDecode from "jwt-decode";


export const login = async({email}) => {
    const response = await $host.post('api/user/login', {email}, {withCredentials: true})
    return response
}

export const checkPassword = async({email, pass}) => {
    const {data} = await $host.post('api/user/check_password', {email, pass}, {withCredentials: true})
    localStorage.setItem('token', data.accessToken)
    return jwtDecode(data.accessToken)
}

export const check = async () => {
    const {data} = await $host.get('api/user/auth', {withCredentials: true})
    localStorage.setItem('token', data.accessToken)
    return jwtDecode(data.accessToken)
}

export const userLogout = async() => {
    const {data} = await $authHost.post('api/user/logout')
    return data
}

