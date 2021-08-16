import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class NotificationViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.notificationModuleStore.notificationDataStore;
        this.routerStore = rootStore.routerStore;

        this.onFind = this.onFind.bind(this);
        this.onChangePageSize = this.onChangePageSize.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPageClick = this.onPageClick.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.onNotificationClicked = this.onNotificationClicked.bind(this);
        this.onNotificationTypeFilterChange = this.onNotificationTypeFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);


        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);
        this.findNotificationTypes = this.findNotificationTypes.bind(this);

        this.findNotificationTypes();
    }

    title = "Popis notifikacija";
    columns = ['Naziv', 'Tip notifikacije', 'Primatelj', 'Datum slanja', 'Detalji', '', ''];

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable clickedNotificationLog = {
        id: "",
        notification_type_id: "",
        notification_type_name: "",
        email: "",
        date_created: "",
        data: ""
    };

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];

    @observable allData = [];
    @observable types = [];
    @observable response = [];
    @observable notificationTypeFilter = {
        id: "",
        name: ""
    };

    @action
    onNotificationTypeFilterChange(value) {
        this.notificationTypeFilter.id = value.notification_type_id;
        this.notificationTypeFilter.name = value.notification_type_name;
        if (value.notification_type_id) {
            this.allData = this.response.filter(data => data.notification_type_id === value.notification_type_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length == 0) {
            this.allData = [{ id: "", notification_type_id: "", subject: "Nema podataka", notification_type_name: "", email: "", date_created: "", data: "" }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.notificationTypeFilter.id = "";
        this.notificationTypeFilter.name = "";
        this.allData = this.response;
        this.onChangePageSize(5);
        if (this.allData.length == 0) {
            this.allData = [{ id: "", notification_type_id: "", subject: "Nema podataka", notification_type_name: "", email: "", date_created: "", data: "" }];
        }
        this.setPagination(1);
    }


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
            this.onFind();
        }
    }

    @action
    async onDeleteClick() {
        this.showLoader();
        let response = await (this.dataStore.delete(this.clickedNotificationLog.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async findNotificationTypes() {
        let response = await (this.dataStore.getNotificationTypes())
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
            if (response.types && response.types.length > 0) {
                this.types = response.types.map((type) => {
                    return { notification_type_id: type.id, notification_type_name: type.name }
                });
                this.onFind();
            }
        }
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
            this.allData = [{ id: "", notification_type_id: "", subject: "Nema podataka", notification_type_name: "", email: "", date_created: "", data: "" }];
        }
        else {
            if (response.notificationLogs.length > 0) {
                this.allData = response.notificationLogs;
                this.response = response.notificationLogs;
            }
            else {
                this.allData = [{ id: "", notification_type_id: "", subject: "Nema podataka", notification_type_name: "", email: "", date_created: "", data: "" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    onNotificationClicked(data) {
        this.clickedNotificationLog = {
            id: data.id,
            email: data.email,
            notification_type_name: data.notification_type_name,
            date_created: data.date_created,
            data: data.data
        };
    }

    @action
    setPagination(page) {
        if (page != null) {
            this.page = page;
        }
        this.totalPages = Math.floor(this.allData.length / this.pageSize);
        if (this.allData.length % this.pageSize > 0) {
            this.totalPages = this.totalPages + 1;
        }
        this.previousEnabled = this.page > 1;
        this.nextEnabled = this.page < this.totalPages;

        this.loadPageData();
    }

    @action
    loadPageData() {
        this.rows = this.allData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
    }

    @action
    onPreviousPageClick(currentPage) {
        this.setPagination(currentPage - 1);
    }

    @action
    onNextPageClick(currentPage) {
        this.setPagination(currentPage + 1);
    }

    @action
    onPageClick(currentPage) {
        this.setPagination(currentPage);
    }

    @action
    onChangePageSize(pageSize) {
        this.pageSize = pageSize;
        this.setPagination(1);
    }

}

export default NotificationViewStore;