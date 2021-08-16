import CategoryDataStore from './CategoryDataStore';


export default class CategoryModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.categoryDataStore = new CategoryDataStore();
    }
}