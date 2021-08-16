import ScheduleDataStore from './ScheduleDataStore';


export default class ScheduleModuleStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.scheduleDataStore = new ScheduleDataStore();
    }
}