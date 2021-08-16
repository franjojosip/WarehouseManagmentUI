import EntryDataStore from './EntryDataStore';


export default class EntryModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.entryDataStore = new EntryDataStore();
    }
}