import RecieptDataStore from './RecieptDataStore';


export default class RecieptModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.recieptDataStore = new RecieptDataStore();
    }
}