import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class WarehouseViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.warehouseModuleStore.warehouseDataStore;
        this.cityDataStore = rootStore.cityModuleStore.cityDataStore;
        this.locationDataStore = rootStore.locationModuleStore.locationDataStore;
        this.authDataStore = rootStore.authenticationModuleStore.authenticationDataStore;
        this.routerStore = rootStore.routerStore;

        this.onFind = this.onFind.bind(this);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onChangePageSize = this.onChangePageSize.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPageClick = this.onPageClick.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.onWarehouseClicked = this.onWarehouseClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onUserSelect = this.onUserSelect.bind(this);
        this.onUserRemove = this.onUserRemove.bind(this);
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.onMultiSelect = this.onMultiSelect.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCities = this.findCities.bind(this);
        this.findLocations = this.findLocations.bind(this);
        this.findUsers = this.findUsers.bind(this);
        this.warehouseNameExist = this.warehouseNameExist.bind(this);

        this.setPagination();
        this.findCities();
        this.findLocations();
        this.findUsers();
        this.onFind();
    }

    onMultiSelect(event) {
        this.clickedWarehouse.users = event.value;
    }

    title = "Skladišta";
    columns = ['Naziv skladišta', 'Naziv lokacije', 'Naziv grada', 'Radnici', 'Izmjena', 'Brisanje'];

    @observable clickedWarehouse = {
        id: "",
        name: "",
        city_id: "",
        city_name: "Odaberi grad",
        location_id: "",
        location_name: "Odaberi lokaciju",
        users: []
    };

    @observable clickedUsers = [];

    @observable errorMessage = {
        name: null,
        city: null,
        location: null
    };

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;

    @observable rows = [];

    @observable allData = [];
    @observable cities = [];
    @observable locations = []
    @observable users = [];
    @observable dropdownUserList = [];

    @observable filteredLocations = [];

    @observable response = [];
    @observable cityFilter = {
        id: "",
        name: ""
    };

    @action
    onCityFilterChange(value) {
        this.cityFilter.id = value.city_id;
        this.cityFilter.name = value.city_name;
        if (value.city_id !== "") {
            this.allData = this.response.filter(data => data.city_id === value.city_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length === 0) {
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", users: [] }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.cityFilter.id = "";
        this.cityFilter.name = "";
        this.allData = this.response;
        if (this.allData.length === 0) {
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", users: [] }];
        }
        this.onChangePageSize(5);
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
        let response = await (this.dataStore.delete(this.clickedWarehouse.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedWarehouse));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedWarehouse));
        this.processData(response);
        await this.hideLoader();
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
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", users: [] }];
        }
        else {
            if (response.warehouses.length > 0) {
                this.allData = response.warehouses;
                this.response = response.warehouses;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", users: [] }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    async findCities() {
        let response = await (this.cityDataStore.get())
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
            if (response.cities.length > 0) {
                this.cities = response.cities.map((city) => {
                    return { city_id: city.id, city_name: city.name }
                });
            }
        }
    }

    @action
    async findLocations() {
        let response = await (this.locationDataStore.get())
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
            if (response.locations.length > 0) {
                this.locations = response.locations.map((location) => {
                    return {
                        location_id: location.id,
                        location_name: location.name,
                        city_id: location.city_id,
                        city_name: location.city_name
                    }
                });
            }
        }
    }

    @action
    async findUsers() {
        let response = await (this.authDataStore.get())
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
            if (response.users.length > 0) {
                this.users = response.users.map((user) => {
                    return { id: user.id, name: user.fname + " " + user.lname }
                });
            }
        }
    }

    @action
    onWarehouseClicked(data, isCreate) {
        this.clickedUsers = [];
        this.errorMessage = {
            name: null,
            city: null,
            location: null
        };
        if (isCreate) {
            this.clickedWarehouse = {
                id: "",
                name: "",
                location_id: "",
                location_name: "Odaberi lokaciju",
                city_id: "",
                city_name: "Odaberi grad",
                users: []
            };
            this.filteredLocations = [];
            this.clickedUsers = [];
            this.isSubmitDisabled = true;
        }
        else {
            this.clickedWarehouse = {
                id: data.id,
                name: data.name,
                location_id: data.location_id,
                location_name: data.location_name,
                city_id: data.city_id,
                city_name: data.city_name,
                users: data.users ? data.users : []
            };
            this.clickedUsers = data.users ? data.users : [];
            this.filteredLocations = this.locations.filter(location => location.city_id === data.city_id);
            this.checkFields();
        }
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
        this.rows = this.allData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
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
        if (this.pageSize != pageSize) {
            this.pageSize = pageSize;
            this.setPagination(1);
        }
    }

    @action
    onNameChange(value) {
        this.clickedWarehouse.name = value;
        this.checkFields();
    }

    @action
    onCityChange(value) {
        this.clickedWarehouse.city_id = value.city_id;
        this.clickedWarehouse.city_name = value.city_name;
        this.filteredLocations = this.locations.filter(element => element.city_id === this.clickedWarehouse.city_id);

        let location = this.locations.find(location => location.location_id === this.clickedWarehouse.location_id);
        if (this.filteredLocations.length === 0 || location && location.city_id != this.clickedWarehouse.city_id) {
            this.clickedWarehouse.location_id = "";
            this.clickedWarehouse.location_name = "";
        }
        this.checkFields();
    }


    @action
    onLocationChange(value) {
        this.clickedWarehouse.location_id = value.location_id;
        this.clickedWarehouse.location_name = value.location_name;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            name: null,
            city: null,
            location: null
        };

        if (this.warehouseNameExist()) {
            this.errorMessage.name = "Skladište s istim nazivom već postoji!";
        }
        if (this.clickedWarehouse.name.length < 5) {
            this.errorMessage.name = "Neispravna duljina naziva skladišta!";
        }
        if (this.clickedWarehouse.city_id.toString() === "") {
            this.errorMessage.city = "Odaberite grad!";
        }
        if (this.clickedWarehouse.location_id.toString() === "") {
            this.errorMessage.location = "Odaberite lokaciju!";
        }
        if (this.errorMessage.name === null && this.errorMessage.city === null && this.errorMessage.location === null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    warehouseNameExist() {
        if (this.clickedWarehouse.name.length > 0) {
            let filteredWarehouses = this.allData.filter(product => product.id !== this.clickedWarehouse.id);
            return filteredWarehouses.findIndex(warehouse => warehouse.name.toLowerCase() === this.clickedWarehouse.name.toLowerCase()) !== -1;
        }
        return false;
    }

    @action
    onUserSelect(selectedList, selectedItem) {
        this.clickedUsers = selectedList;
        this.clickedWarehouse.users = selectedList;
    }

    @action
    onUserRemove(selectedList, removedItem) {
        this.clickedUsers = selectedList;
        this.clickedWarehouse.users = selectedList;
    }

}

export default WarehouseViewStore;