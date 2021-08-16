import SubcategoryDataStore from './SubcategoryDataStore';


export default class SubcategoryModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.subcategoryDataStore = new SubcategoryDataStore();
    }
}