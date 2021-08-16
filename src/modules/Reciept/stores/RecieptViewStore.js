import { action, observable } from "mobx";
import { toast } from 'react-toastify';
import moment from "moment";
import { getUser } from "../../../common/components/LocalStorage";
import generateRecieptPdf from "../../../common/components/PDFGenerator/RecieptReportGenerator";

class RecieptViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.recieptModuleStore.recieptDataStore;
        this.cityDataStore = rootStore.cityModuleStore.cityDataStore;
        this.locationDataStore = rootStore.locationModuleStore.locationDataStore;
        this.warehouseDataStore = rootStore.warehouseModuleStore.warehouseDataStore;
        this.productDataStore = rootStore.productModuleStore.productDataStore;
        this.packagingDataStore = rootStore.packagingModuleStore.packagingDataStore;
        this.routerStore = rootStore.routerStore;

        this.onFind = this.onFind.bind(this);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onChangePageSize = this.onChangePageSize.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);
        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPageClick = this.onPageClick.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
        this.onRecieptClicked = this.onRecieptClicked.bind(this);
        this.onWarehouseChange = this.onWarehouseChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.onPackagingChange = this.onPackagingChange.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.onClickedRow = this.onClickedRow.bind(this);
        this.groupData = this.groupData.bind(this);
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
        this.onStartDateFilterChange = this.onStartDateFilterChange.bind(this);
        this.onEndDateFilterChange = this.onEndDateFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);
        this.onGeneratePdfClick = this.onGeneratePdfClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCities = this.findCities.bind(this);
        this.findLocations = this.findLocations.bind(this);
        this.findWarehouses = this.findWarehouses.bind(this);
        this.findProducts = this.findProducts.bind(this);
        this.filterValuesForLoggedUser = this.filterValuesForLoggedUser.bind(this);

        this.findCities();
    }

    title = "Preuzimanja";
    parentColumns = ['Skladište', 'Lokacija', 'Grad', 'Datum kreiranja'];
    childColumns = ['Proizvod', 'Kategorija', 'Potkategorija', 'Ambalaža', 'Količina', 'Izmijeni', 'Obriši', 'Potvrdi'];

    @observable clickedReciept = {
        id: "",
        city_id: "",
        city_name: "Odaberi grad",
        location_id: "",
        location_name: "Odaberi lokaciju",
        warehouse_id: "",
        warehouse_name: "Odaberi skladište",
        product_id: "",
        product_name: "Odaberi proizvod",
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
        packaging_id: "",
        packaging_name: "",
        quantity: "",
        date_created: "",
        isSubmitted: false
    };

    @observable errorMessage = {
        city: null,
        location: null,
        warehouse: null,
        product: null,
        quantity: null
    };

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];
    @observable grouppedData = [];

    @observable clickedRows = [];
    @observable paginatedData = [];


    @observable allData = [];
    @observable warehouses = [];
    @observable cities = [];
    @observable locations = [];
    @observable products = [];

    @observable filteredLocations = [];
    @observable filteredWarehouses = [];

    @observable response = [];
    @observable cityFilter = {
        city_id: "",
        city_name: ""
    };
    @observable dateFilter = {
        startDate: "",
        endDate: ""
    }
    @action
    onCityFilterChange(value) {
        let filteredData = this.response;
        this.cityFilter.city_id = value.city_id;
        this.cityFilter.city_name = value.city_name;
        if (value.city_id != "") {
            filteredData = filteredData.filter(data => data.city_id === value.city_id);
            this.cityFilter.city_id = value.city_id;
            this.cityFilter.city_name = value.city_name;
        }
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "" && moment(this.dateFilter.startDate).diff(moment(this.dateFilter.endDate), 'days') <= 0) {
            filteredData = filteredData.filter(data =>
                (moment(data.date_created).isAfter(this.dateFilter.startDate) || moment(data.date_created).isSame(this.dateFilter.startDate))
                && (moment(data.date_created).isBefore(this.dateFilter.endDate) || moment(data.date_created).isSame(this.dateFilter.endDate))
            );
        }
        this.allData = filteredData;
        if (this.allData.length !== 0) {
            this.groupData();
        }
        this.setPagination(1);
    }

    @action
    onStartDateFilterChange(value) {
        let filteredData = this.response;
        this.dateFilter.startDate = value;
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).format("DD/MM/YYYY");
            let endDate = moment(new Date(value)).format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).diff(moment(this.dateFilter.endDate), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").isAfter(moment(startDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").isSame(moment(startDate, "DD/MM/YYYY")))
                    && (moment(data.date_created, "DD/MM/YYYY").isBefore(moment(endDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").isSame(moment(endDate, "DD/MM/YYYY")))
                );
                if (this.cityFilter.city_id != "") {
                    filteredData = filteredData.filter(data => data.city_id === this.cityFilter.city_id);
                }
            }
        }
        this.allData = filteredData;
        if (this.allData.length !== 0) {
            this.groupData();
        }
        this.setPagination(1);
    }

    @action
    onEndDateFilterChange(value) {
        let filteredData = this.response;
        this.dateFilter.endDate = value;
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).format("DD/MM/YYYY");
            let endDate = moment(new Date(value)).format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).diff(moment(this.dateFilter.endDate), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").isAfter(moment(startDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").isSame(moment(startDate, "DD/MM/YYYY")))
                    && (moment(data.date_created, "DD/MM/YYYY").isBefore(moment(endDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").isSame(moment(endDate, "DD/MM/YYYY")))
                );
                if (this.cityFilter.city_id != "") {
                    filteredData = filteredData.filter(data => data.city_id === this.cityFilter.city_id);
                }
            }
        }
        this.allData = filteredData;
        if (this.allData.length !== 0) {
            this.groupData();
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.cityFilter.city_id = "";
        this.cityFilter.city_name = "";
        this.dateFilter.startDate = "";
        this.dateFilter.endDate = "";
        this.allData = this.response;
        this.onChangePageSize(5);
        if (this.allData.length !== 0) {
            this.groupData();
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
        let response = await (this.dataStore.delete(this.clickedReciept.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedReciept));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedReciept));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onSubmitClick() {
        this.showLoader();
        let response = await (this.dataStore.submit(this.clickedReciept.id));
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
            this.allData = [
                {
                    id: "",
                    city_id: "",
                    city_name: "",
                    location_id: "",
                    location_name: "",
                    warehouse_id: "",
                    warehouse_name: "",
                    product_id: "",
                    product_name: "",
                    category_id: "",
                    category_name: "",
                    subcategory_id: "",
                    subcategory_name: "",
                    packaging_id: "",
                    packaging_name: "",
                    quantity: "",
                    date_created: "",
                    isSubmitted: false
                }];

        }
        else {
            this.filterValuesForLoggedUser();
            if (response.reciepts.length > 0) {
                response.reciepts.forEach(item => item.date_created = moment(new Date(item.date_created)).format('DD/MM/YYYY'));
                this.allData = response.reciepts;
                this.response = response.reciepts;
                this.groupData();
            }
            else {
                this.allData = [
                    {
                        id: "",
                        city_id: "",
                        city_name: "",
                        location_id: "",
                        location_name: "",
                        warehouse_id: "",
                        warehouse_name: "",
                        product_id: "",
                        product_name: "",
                        category_id: "",
                        category_name: "",
                        subcategory_id: "",
                        subcategory_name: "",
                        packaging_id: "",
                        packaging_name: "",
                        quantity: "",
                        date_created: "",
                        isSubmitted: false
                    }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    filterValuesForLoggedUser() {
        let loggedUser = getUser();
        if (loggedUser.role.toLowerCase() != "administrator") {
            let name = loggedUser.fname + " " + loggedUser.lname;
            this.warehouses = this.warehouses.filter(warehouse => warehouse.users.indexOf(name) != -1)
            let warehouseCityIds = this.warehouses.map(warehouse => warehouse.city_id);
            this.locations = this.locations.filter(location => warehouseCityIds.indexOf(location.city_id) != -1);
            this.cities = this.cities.filter(city => warehouseCityIds.indexOf(city.city_id) != -1);
        }
    }

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
                this.findLocations();
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
                this.findWarehouses();
            }
        }
    }

    @action
    async findWarehouses() {
        let response = await (this.warehouseDataStore.get())
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
            if (response.warehouses.length > 0) {
                this.warehouses = response.warehouses.map((warehouse) => {
                    return {
                        warehouse_id: warehouse.id,
                        warehouse_name: warehouse.name,
                        location_id: warehouse.location_id,
                        location_name: warehouse.location_name,
                        city_id: warehouse.city_id,
                        city_name: warehouse.city_name,
                        users: warehouse.users ? warehouse.users.map(user => user.name) : []
                    }
                });
                this.findProducts();
                this.onFind();
            }
        }
    }

    @action
    async findProducts() {
        let response = await (this.productDataStore.get())
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
            if (response.products.length > 0) {
                this.products = response.products.map((product) => {
                    return {
                        product_id: product.id,
                        product_name: product.name,
                        packaging_id: product.packaging_id,
                        packaging_name: product.packaging_name,
                        category_id: product.category_id,
                        category_name: product.category_name,
                        subcategory_id: product.subcategory_id,
                        subcategory_name: product.subcategory_name
                    }
                });
            }
        }
    }

    @action
    onRecieptClicked(data, isCreate) {
        this.errorMessage = {
            city: null,
            location: null,
            warehouse: null,
            product: null,
            quantity: null,
            min_quantity: null
        };
        if (isCreate) {
            this.clickedReciept = {
                id: "",
                city_id: "",
                city_name: "Odaberi grad",
                location_id: "",
                location_name: "Odaberi lokaciju",
                warehouse_id: "",
                warehouse_name: "Odaberi skladište",
                product_id: "",
                product_name: "Odaberi proizvod",
                category_id: "",
                category_name: "",
                subcategory_id: "",
                subcategory_name: "",
                packaging_id: "",
                packaging_name: "",
                quantity: 0,
                date_created: "",
                isSubmitted: false
            };
            this.filteredLocations = [];
            this.filteredWarehouses = [];
        }
        else {
            this.clickedReciept = {
                id: data.id,
                city_id: data.city_id,
                city_name: data.city_name,
                location_id: data.location_id,
                location_name: data.location_name,
                warehouse_id: data.warehouse_id,
                warehouse_name: data.warehouse_name,
                product_id: data.product_id,
                product_name: data.product_name,
                category_id: data.category_id,
                category_name: data.category_name,
                subcategory_id: data.subcategory_id,
                subcategory_name: data.subcategory_name,
                packaging_id: data.packaging_id,
                packaging_name: data.packaging_name,
                quantity: data.quantity,
                date_created: data.date_created,
                isSubmitted: false
            };
            this.filteredLocations = this.locations.filter(location => location.city_id === data.city_id);
            this.filteredWarehouses = this.warehouses.filter(warehouse => warehouse.city_id === data.city_id);
            this.checkFields();
        }
    }

    @action
    setPagination(page) {
        if (page) {
            this.page = page;
        }
        this.totalPages = Math.floor(this.grouppedData.length / this.pageSize);
        if (this.grouppedData.length % this.pageSize > 0) {
            this.totalPages = this.totalPages + 1;
        }
        this.previousEnabled = this.page > 1;
        this.nextEnabled = this.page < this.totalPages;

        this.loadPageData();
    }

    @action
    loadPageData() {
        this.paginatedData = this.grouppedData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
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
    onWarehouseChange(value) {
        this.clickedReciept.warehouse_id = value.warehouse_id;
        this.clickedReciept.warehouse_name = value.warehouse_name;
        this.checkFields();
    }


    @action
    onCityChange(value) {
        this.clickedReciept.city_id = value.city_id;
        this.clickedReciept.city_name = value.city_name;

        this.filteredLocations = this.locations.filter((element) => element.city_id == this.clickedReciept.city_id);
        this.filteredWarehouses = [];

        if (this.filteredLocations.findIndex(location => location.location_id == this.clickedReciept.location_id) == -1) {
            this.clickedReciept.location_id = "";
            this.clickedReciept.location_name = "Odaberi lokaciju";
            this.clickedReciept.warehouse_id = "";
            this.clickedReciept.warehouse_name = "Odaberi skladište";
        }

        this.checkFields();
    }


    @action
    onLocationChange(value) {
        this.clickedReciept.location_id = value.location_id;
        this.clickedReciept.location_name = value.location_name;

        this.filteredWarehouses = this.warehouses.filter((element) => element.location_id == value.location_id);
        this.clickedReciept.warehouse_id = "";
        this.clickedReciept.warehouse_name = "Odaberi skladište";
        this.checkFields();
    }

    @action
    onProductChange(value) {
        this.clickedReciept.product_id = value.product_id;
        this.clickedReciept.product_name = value.product_name;

        if (value.category_id != "") {
            this.clickedReciept.category_id = value.category_id;
            this.clickedReciept.category_name = value.category_name;
        }
        else {
            this.clickedReciept.category_id = "";
            this.clickedReciept.category_name = "";
        }

        if (value.subcategory_id != "") {
            this.clickedReciept.subcategory_id = value.subcategory_id;
            this.clickedReciept.subcategory_name = value.subcategory_name;
        }
        else {
            this.clickedReciept.subcategory_id = "";
            this.clickedReciept.subcategory_name = "";
        }

        if (value.packaging_id != "") {
            this.clickedReciept.packaging_id = value.packaging_id;
            this.clickedReciept.packaging_name = value.packaging_name;
        }
        else {
            this.clickedReciept.packaging_id = "";
            this.clickedReciept.packaging_name = "";
        }
        this.checkFields();
    }

    @action
    onPackagingChange(value) {
        this.clickedReciept.packaging_id = value.packaging_id;
        this.clickedReciept.packaging_name = value.packaging_name;
        this.checkFields();
    }

    @action
    onQuantityChange(value) {
        this.clickedReciept.quantity = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            city: null,
            location: null,
            warehouse: null,
            product: null,
            quantity: null
        };
        if (this.clickedReciept.city_id.toString() == "") {
            this.errorMessage.city = "Odaberite grad!";
        }
        if (this.clickedReciept.location_id.toString() == "") {
            this.errorMessage.location = "Odaberite lokaciju!";
        }
        if (this.clickedReciept.warehouse_id.toString() == "") {
            this.errorMessage.warehouse = "Odaberite skladište!";
        }
        if (this.clickedReciept.product_id.toString() == "") {
            this.errorMessage.product = "Odaberite proizvod!";
        }
        if (this.clickedReciept.quantity < 1) {
            this.errorMessage.quantity = "Minimalna količina: 1";
        }

        if (this.errorMessage.city == null
            && this.errorMessage.location == null
            && this.errorMessage.warehouse == null
            && this.errorMessage.product == null
            && this.errorMessage.quantity == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    onClickedRow(key) {
        if (!this.clickedRows.includes(key)) {
            this.clickedRows.push(key);
        }
        else {
            const index = this.clickedRows.indexOf(key);
            if (index > -1) {
                this.clickedRows.splice(index, 1);
            }
        }
    }

    @action
    groupData() {
        this.grouppedData = [];

        this.allData.forEach(element => {
            var key = element.warehouse_id + '-' + element.user_id + '-' + element.date_created;
            if (this.grouppedData.findIndex((element) => element.name.toString() === key.toString()) === -1) {
                this.grouppedData.push({ name: key, data: [] });
            }
            let index = this.grouppedData.findIndex((element) => element.name.toString() === key.toString())
            this.grouppedData[index].data.push(element);
        })
    }

    @action
    async onGeneratePdfClick() {
        let startDate = this.dateFilter.startDate;
        let endDate = this.dateFilter.endDate;
        if (startDate != "" && endDate != "" && moment(startDate).diff(moment(endDate), 'days') <= 0) {
            let response = await (this.dataStore.report(startDate, endDate));
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
                if (response.reciepts.length == 0) {
                    toast.error("Nema podataka za dobiveni raspon datuma", {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        progress: undefined,
                    });
                }
                else {
                    generateRecieptPdf(response.reciepts, startDate, endDate);
                }
            }
        }
        else {
            toast.error("Potrebno je odabrati početni i krajnji datum za generiranje izvješća", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
        }
    }

}

export default RecieptViewStore;