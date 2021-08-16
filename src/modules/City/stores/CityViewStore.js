import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class CityViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.cityModuleStore.cityDataStore;
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
        this.onCityClicked = this.onCityClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onZipCodeChange = this.onZipCodeChange.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.cityNameExist = this.cityNameExist.bind(this);
        this.cityZipCodeExist = this.cityZipCodeExist.bind(this);

        this.setPagination();
        this.onFind();
    }
    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable clickedCity = {
        id: "",
        name: "",
        zip_code: ""
    };

    @observable errorMessage = {
        name: null,
        zip_code: null
    };

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];

    title = "Gradovi";
    columns = ['Naziv', 'Poštanski broj', '', ''];

    @observable allData = [];

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
        let response = await (this.dataStore.delete(this.clickedCity.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedCity));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedCity));
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
            this.allData = [{ id: "", name: "Nema podataka", zip_code: "" }];
        }
        else {
            if (response.cities.length > 0) {
                this.allData = response.cities;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", zip_code: "" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    onCityClicked(data, isCreate) {
        this.errorMessage = {
            name: null,
            zip_code: null
        };
        if (isCreate) {
            this.clickedCity = {
                id: "",
                name: "",
                zip_code: ""
            };
        }
        else {
            this.clickedCity = {
                id: data.id,
                name: data.name,
                zip_code: data.zip_code
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
        this.clickedCity.name = value;
        this.checkFields();
    }

    @action
    onZipCodeChange(value) {
        this.clickedCity.zip_code = value;
        this.checkFields();
    }

    @action
    checkFields() {
        let isValidNumber = /^\d+$/.test(this.clickedCity.zip_code);
        this.errorMessage = {
            name: null,
            zip_code: null
        };
        if (this.clickedCity.name.length < 3) {
            this.errorMessage.name = "Neispravna duljina naziva grada!";
        }
        if (this.clickedCity.zip_code.toString().length != 5
            || this.clickedCity.zip_code < 10000
            || this.clickedCity.zip_code > 54000
            || !isValidNumber) {
            this.errorMessage.zip_code = "Neispravan poštanski broj!";
        }
        if (this.cityNameExist()) {
            this.errorMessage.name = "Grad s istim nazivom već postoji!";
        }
        if (this.cityZipCodeExist()) {
            this.errorMessage.zip_code = "Poštanski broj se već koristi!";
        }
        if (this.errorMessage.name == null && this.errorMessage.zip_code == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    cityNameExist() {
        if (this.clickedCity.name.length > 0) {
            let filteredCities = this.allData.filter(city => city.id !== this.clickedCity.id);
            return filteredCities.findIndex(city => city.name.toLowerCase() == this.clickedCity.name.toLowerCase()) !== -1;
        }
        return false;
    }

    @action
    cityZipCodeExist() {
        if (this.clickedCity.zip_code) {
            let filteredCities = this.allData.filter(city => city.id !== this.clickedCity.id);
            return filteredCities.findIndex(city => city.zip_code == this.clickedCity.zip_code) !== -1;
        }
        return false;
    }

}

export default CityViewStore;