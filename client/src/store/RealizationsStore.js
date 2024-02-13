import {makeAutoObservable} from "mobx";

export default class RealizationsStore {
    constructor() {
        this._realizations = []
        this._currentRealization = {}
        this._realizationItems = []

        makeAutoObservable(this)
    }

    setCurrentRealization(currentRealization) {
        this._currentRealization = currentRealization
    }

    setRealizations(realizations) {
        this._realizations = realizations
    }
    setRealizationItems(realizationItems) {
        this._realizationItems = realizationItems
    }


    get currentRealization() {
        return this._currentRealization
    }

    get realizations() {
        return this._realizations
    }

    get realizationItems() {
        return this._realizationItems
    }


}