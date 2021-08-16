import RoleDataStore from './RoleDataStore';


export default class RoleModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.roleDataStore = new RoleDataStore();
    }
}