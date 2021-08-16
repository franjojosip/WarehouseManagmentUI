import PackagingDataStore from './PackagingDataStore';


export default class PackagingModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.packagingDataStore = new PackagingDataStore();
    }
}