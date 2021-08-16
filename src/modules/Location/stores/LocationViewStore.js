import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class LocationViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.locationModuleStore.locationDataStore;
        this.cityDataStore = rootStore.cityModuleStore.cityDataStore;
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
        this.onLocationClicked = this.onLocationClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCities = this.findCities.bind(this);
        this.locationNameExist = this.locationNameExist.bind(this);

        this.setPagination();
        this.findCities();
        this.onFind();
    }

    title = "Lokacije";
    columns = ['Ulica', 'Grad', 'Poštanski broj', '', ''];

    @observable clickedLocation = {
        id: "",
        name: "",
        city_id: "",
        city_name: "Odaberi grad"
    };

    @observable errorMessage = {
        name: null,
        city: null
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

    @observable response = [];
    @observable cityFilter = {
        id: "",
        name: ""
    };

    @action
    onCityFilterChange(value) {
        this.cityFilter.id = value.city_id;
        this.cityFilter.name = value.city_name;
        if (value.city_id) {
            this.allData = this.response.filter(data => data.city_id === value.city_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length == 0) {
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", zip_code: "" }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.cityFilter.id = "";
        this.cityFilter.name = "";
        this.allData = this.response;
        if (this.allData.length == 0) {
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", zip_code: "" }];
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
        let response = await (this.dataStore.delete(this.clickedLocation.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedLocation));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedLocation));
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
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", zip_code: "" }];
        }
        else {
            if (response.locations.length > 0) {
                this.allData = response.locations;
                this.response = response.locations;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", zip_code: "" }];
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
    onLocationClicked(data, isCreate) {
        this.errorMessage = {
            name: null,
            city: null
        };
        if (isCreate) {
            this.clickedLocation = {
                id: "",
                name: "",
                city_id: "",
                city_name: "Odaberi grad"
            };
        }
        else {
            this.clickedLocation = {
                id: data.id,
                name: data.name,
                city_id: data.city_id,
                city_name: data.city_name
            };
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
        if (this.pageSize != pageSize) {
            this.pageSize = pageSize;
            this.setPagination(1);
        }
    }


    @action
    onNameChange(value) {
        this.clickedLocation.name = value;
        this.checkFields();
    }

    @action
    onCityChange(value) {
        this.clickedLocation.city_id = value.city_id;
        this.clickedLocation.city_name = value.city_name;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            name: null,
            city: null
        };
        if (this.locationNameExist()) {
            this.errorMessage.name = "Lokacija s istim nazivom već postoji!";
        }
        if (this.clickedLocation.name.length < 2) {
            this.errorMessage.name = "Neispravna duljina naziva lokacije!";
        }
        if (this.clickedLocation.city_id.toString() == "") {
            this.errorMessage.city = "Odaberite grad!";
        }
        if (this.errorMessage.name == null && this.errorMessage.city == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    locationNameExist() {
        if (this.clickedLocation.name.length > 0) {
            let filteredLocations = this.allData.filter(location => location.id !== this.clickedLocation.id);
            return filteredLocations.findIndex(clickedLocation => clickedLocation.name.toLowerCase() == this.clickedLocation.name.toLowerCase()) !== -1;
        }
        return false;
    }

}

export default LocationViewStore;