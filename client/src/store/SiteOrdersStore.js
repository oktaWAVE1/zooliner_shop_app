import {makeAutoObservable} from "mobx";

export default class SiteOrdersStore {
    constructor() {
        this._siteOrders = []

        makeAutoObservable(this)
    }

    setSiteOrders(siteOrders) {
        this._siteOrders = siteOrders
    }

    get siteOrders() {
        return this._siteOrders
    }



}