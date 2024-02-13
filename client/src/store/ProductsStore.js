import {makeAutoObservable} from "mobx";

export default class ProductsStore {
    constructor() {
        this._products = []
        this._currentProducts = []
        this._filteredProducts = []
        makeAutoObservable(this)
    }

    setProducts(products) {
        this._products = products
    }
    setCurrentProducts(currentProducts) {
        this._currentProducts = currentProducts
    }

    setFilteredProducts(filteredProducts) {
        this._filteredProducts = filteredProducts
    }


    get products() {
        return this._products
    }

    get currentProducts() {
        return this._currentProducts
    }

    get filteredProducts() {
        return this._filteredProducts
    }




}