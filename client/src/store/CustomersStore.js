import {makeAutoObservable} from "mobx";

export default class CustomersStore {
    constructor() {
        this._customers = []
        this._filteredCustomers = []
        this._currentCustomers = []

        makeAutoObservable(this)
    }

    setCustomers(customers) {
        this._customers = customers
    }


    setFilteredCustomers(filteredCustomers) {
        this._filteredCustomers = filteredCustomers
    }

    setCurrentCustomers(currentCustomers) {
        this._currentCustomers= currentCustomers
    }


    get customers() {
        return this._customers
    }

    get filteredCustomers() {
        return this._filteredCustomers
    }

    get currentCustomers() {
        return this._currentCustomers
    }



}