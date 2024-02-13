import {makeAutoObservable} from "mobx";

export default class OrdersStore {
    constructor() {
        this._orders = []
        this._filteredOrders = []

        makeAutoObservable(this)
    }

    setOrders(orders) {
        this._orders = orders
    }

    setFilteredOrders(filteredOrders) {
        this._filteredOrders = filteredOrders
    }


    get orders() {
        return this._orders
    }
    get filteredOrders() {
            return this._filteredOrders
        }



}