import WarehouseDataStore from './WarehouseDataStore';


export default class WarehouseModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.warehouseDataStore = new WarehouseDataStore();
    }
}