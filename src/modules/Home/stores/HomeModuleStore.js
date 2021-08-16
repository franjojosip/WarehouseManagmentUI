import HomeDataStore from './HomeDataStore';


export default class EntryModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.homeDataStore = new HomeDataStore();
    }
}