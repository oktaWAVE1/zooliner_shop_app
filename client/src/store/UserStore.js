import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._bonus = 0
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setBonus(bonus) {
        this._bonus = bonus
    }

    setUser(user) {
        this._user = user
    }
    get isAuth() {
        return this._isAuth
    }

    get bonus() {
        return this._bonus
    }

    get user() {
        return this._user
    }


}