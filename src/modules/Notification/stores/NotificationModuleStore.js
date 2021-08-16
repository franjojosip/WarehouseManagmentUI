import NotificationDataStore from './NotificationDataStore';


export default class NotificationModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.notificationDataStore = new NotificationDataStore();
    }
}