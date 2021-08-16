import StockDataStore from './StockDataStore';

export default class StockModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.stockDataStore = new StockDataStore();
    }
}