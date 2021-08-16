import StocktakingDataStore from './StocktakingDataStore';


export default class StocktakingModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.stocktakingDataStore = new StocktakingDataStore();
    }
}