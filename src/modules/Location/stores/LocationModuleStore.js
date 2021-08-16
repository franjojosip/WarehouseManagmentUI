import LocationDataStore from './LocationDataStore';


export default class LocationModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.locationDataStore = new LocationDataStore();
    }
}