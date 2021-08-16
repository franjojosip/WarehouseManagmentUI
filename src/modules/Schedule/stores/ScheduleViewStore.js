import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class ScheduleViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.scheduleModuleStore.scheduleDataStore;
        this.routerStore = rootStore.routerStore;

        this.onRefreshClick = this.onRefreshClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);
    }

    @observable isSubmitDisabled = true;
    @observable password = "";
    @observable errorMessage = null;

    @action
    showLoader() {
        this.isLoaderVisible = true;
    }

    @action
    async hideLoader() {
        await this.delay(500);
        this.isLoaderVisible = false;
    }

    @action
    delay(delayInMs) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(2);
            }, delayInMs);
        });
    }

    @action
    async processData(response) {
        if (response.error) {
            toast.error(response.error, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
            console.clear();
        }
        else {
            toast.success(response.status, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
        }
    }

    @action
    async onRefreshClick() {
        this.showLoader();
        let response = await (this.dataStore.refreshSchedule(this.password));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    onPasswordChange(value) {
        this.password = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage =  null;
        if (this.password.length < 4) {
            this.errorMessage = "Neispravna duljina lozinke!";
        }
        if (this.errorMessage) {
            this.isSubmitDisabled = true;
        }
        else {
            this.isSubmitDisabled = false;
        }
    }
}

export default ScheduleViewStore;