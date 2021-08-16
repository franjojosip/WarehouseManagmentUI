import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class HomeViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.homeModuleStore.homeDataStore;
        this.routerStore = rootStore.routerStore;

        this.onFind = this.onFind.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);

        this.onFind();
    }

    @observable isLoaderVisible = false;

    @observable data = {
        total_reciepts: 0,
        total_stocktakings: 0,
        total_entries: 0,
        total_users: 0,
    };

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
    async onFind() {
        this.showLoader();
        let response = await (this.dataStore.get())
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
            this.data = {
                total_reciepts: response.data.total_reciepts,
                total_stocktakings: response.data.total_stocktakings,
                total_entries: response.data.total_entries,
                total_users: response.data.total_users,
            };
        }
        await this.hideLoader();
    };
}

export default HomeViewStore;