import { action, observable } from "mobx";
import { toast } from 'react-toastify';
import { getUser } from "../../../common/components/LocalStorage";
import moment from "moment";
const { REACT_APP_SUPER_ADMIN_PASSWORD } = process.env;

class NotificationViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.notificationModuleStore.notificationDataStore;
        this.scheduleDataStore = rootStore.scheduleModuleStore.scheduleDataStore;
        this.routerStore = rootStore.routerStore;

        this.onFind = this.onFind.bind(this);
        this.onChangePageSize = this.onChangePageSize.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPageClick = this.onPageClick.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.onNotificationSettingClicked = this.onNotificationSettingClicked.bind(this);
        this.onDayOfWeekChange = this.onDayOfWeekChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.onNotificationTypeChange = this.onNotificationTypeChange.bind(this);
        this.checkFields = this.checkFields.bind(this);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onNotificationTypeFilterChange = this.onNotificationTypeFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);
        this.findNotificationTypes = this.findNotificationTypes.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.refreshSchedule = this.refreshSchedule.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findNotificationTypes();
        this.setPagination();
        this.checkFields();
    }

    title = "Popis postavki notifikacija";
    columns = ['Tip notifikacije', 'Dan U Tjednu', 'Vrijeme', 'Primatelj', '', ''];

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable clickedNotificationSetting = {
        id: "",
        day_of_week_id: "",
        day_of_week_name: "",
        time: "",
        email: "",
        notification_name: "",
        notification_type_id: "",
        notification_type_name: "",
        date_created: ""
    };

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];
    @observable types = [];

    @observable response = [];
    @observable allData = [];

    days = [
        { id: 1, name: "Ponedjeljak" },
        { id: 2, name: "Utorak" },
        { id: 3, name: "Srijeda" },
        { id: 4, name: "Četvrtak" },
        { id: 5, name: "Petak" }
    ];

    @observable notification_types = [];

    @observable notifcationTypeFilter = {
        id: "",
        name: ""
    }

    @action
    onNotificationTypeFilterChange(value) {
        this.notifcationTypeFilter.id = value.notification_type_id;
        this.notifcationTypeFilter.name = value.notification_type_name;
        if (value.notification_type_id) {
            this.allData = this.response.filter(data => data.notification_type_id === value.notification_type_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length == 0) {
            this.allData = [{ id: "", notification_type_id: "", notification_type_name: "Nema podataka", time: "", day_of_week: "", email: "" }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.notifcationTypeFilter.id = "";
        this.notifcationTypeFilter.name = "";
        this.allData = this.response;
        this.onChangePageSize(5);
        if (this.allData.length == 0) {
            this.allData = [{ id: "", notification_type_id: "", notification_type_name: "Nema podataka", time: "", day_of_week: "", email: "" }];
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
            this.refreshSchedule();
            this.onFind();
        }
    }

    @action
    async onFind() {
        this.showLoader();
        let response = await (this.dataStore.getNotificationSetting())
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
            this.allData = [{ id: "", notification_type_id: "", notification_type_name: "Nema podataka", time: "", day_of_week: "", email: "" }];
        }
        else {
            if (response.notificationSettings.length > 0) {
                response.notificationSettings.forEach(item => {
                    let day = this.days.find(day => day.id == item.day_of_week);
                    item.day_of_week_id = day.id;
                    item.day_of_week_name = day.name;
                    item.time = moment(item.time).format("HH:mm")
                }
                );
                this.allData = response.notificationSettings;
                this.response = response.notificationSettings;
            }
            else {
                this.allData = [{ id: "", notification_type_id: "", notification_type_name: "Nema podataka", time: "", day_of_week: "", email: "" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    async refreshSchedule() {
        this.showLoader();
        let response = await (this.scheduleDataStore.refreshSchedule(REACT_APP_SUPER_ADMIN_PASSWORD));
        if (response.error) {
            toast.error(response.error, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
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
        await this.hideLoader();
    }


    @action
    async onDeleteClick() {
        this.showLoader();
        let response = await (this.dataStore.deleteNotificationSetting(this.clickedNotificationSetting.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.updateNotificationSetting(this.clickedNotificationSetting));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.createNotificationSetting(this.clickedNotificationSetting));
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
                this.notification_types = response.types.map((type) => {
                    return { notification_type_id: type.id, notification_type_name: type.name }
                });
                this.notification_types = this.notification_types.filter(type => type.notification_type_name != "Zaboravljena lozinka");
                this.onFind();
            }
        }
    }

    @action
    onNotificationSettingClicked(data, isCreate) {
        if (isCreate) {
            const user = getUser();
            this.clickedNotificationSetting = {
                id: "",
                day_of_week_id: "",
                day_of_week_name: "Odaberi dan u tjednu",
                time: "",
                email: user.email,
                notification_name: "",
                notification_type_id: "",
                notification_type_name: "Odaberi tip notifikacije",
                date_created: ""
            };
        }
        else {
            this.clickedNotificationSetting = {
                id: data.id,
                day_of_week_id: data.day_of_week,
                day_of_week_name: this.days.find(day => day.id == data.day_of_week).name,
                time: data.time,
                email: data.email,
                notification_name: data.notification_name,
                notification_type_id: data.notification_type_id,
                notification_type_name: data.notification_type_name,
                date_created: data.date_created
            };
        }
        this.checkFields();
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
        this.setPagination();
    }

    @action
    onDayOfWeekChange(value) {
        this.clickedNotificationSetting.day_of_week_id = value.id;
        this.clickedNotificationSetting.day_of_week_name = value.name;
        this.checkFields();
    }

    @action
    onTimeChange(value) {
        this.clickedNotificationSetting.time = value;
        this.checkFields();
    }

    @action
    onNotificationTypeChange(value) {
        this.clickedNotificationSetting.notification_type_id = value.notification_type_id;
        this.clickedNotificationSetting.notification_type_name = value.notification_type_name;
        if (value.notification_type_name != "Tjedna obavijest") {
            this.clickedNotificationSetting.day_of_week_id = 1;
            this.clickedNotificationSetting.day_of_week_name = "Ponedjeljak";
        }
        this.checkFields();
    }

    @action
    onEmailChange(value) {
        this.clickedNotificationSetting.email = value;
        this.checkFields();
    }

    @action
    checkFields() {
        if (this.clickedNotificationSetting.notification_type_id
            && this.clickedNotificationSetting.notification_type_id != -1
            && this.clickedNotificationSetting.day_of_week_id
            && this.clickedNotificationSetting.day_of_week_id != -1
            && this.clickedNotificationSetting.time) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }
}

export default NotificationViewStore;