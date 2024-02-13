import {makeAutoObservable} from "mobx";

export default class PageStore {
    constructor() {

        this._page = 1
        makeAutoObservable(this)
    }

    setPage(page) {
        this._page = page
    }


    get page() {
        return this._page
    }



}