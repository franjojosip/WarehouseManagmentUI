import ProductDataStore from './ProductDataStore';


export default class ProductModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.productDataStore = new ProductDataStore();
    }
}