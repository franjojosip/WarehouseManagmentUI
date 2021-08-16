import CityDataStore from './CityDataStore';


export default class CityModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.cityDataStore = new CityDataStore();
    }
}