import AuthenticationDataStore from './AuthenticationDataStore';


export default class AuthenticationModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.authenticationDataStore = new AuthenticationDataStore();
    }
}