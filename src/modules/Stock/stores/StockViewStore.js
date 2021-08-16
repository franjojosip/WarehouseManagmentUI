import { action, observable } from "mobx";
import { toast } from 'react-toastify';
import { getUser } from "../../../common/components/LocalStorage";

class StockViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.stockModuleStore.stockDataStore;
        this.cityDataStore = rootStore.cityModuleStore.cityDataStore;
        this.locationDataStore = rootStore.locationModuleStore.locationDataStore;
        this.warehouseDataStore = rootStore.warehouseModuleStore.warehouseDataStore;
        this.productDataStore = rootStore.productModuleStore.productDataStore;
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
        this.onStockClicked = this.onStockClicked.bind(this);
        this.onWarehouseChange = this.onWarehouseChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.onMinimumQuantityChange = this.onMinimumQuantityChange.bind(this);
        this.onClickedRow = this.onClickedRow.bind(this);
        this.onClickedNestedRow = this.onClickedNestedRow.bind(this);
        this.groupData = this.groupData.bind(this);
        this.groupCategoryData = this.groupCategoryData.bind(this);
        this.productExistsInWarehouse = this.productExistsInWarehouse.bind(this);
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCities = this.findCities.bind(this);
        this.findLocations = this.findLocations.bind(this);
        this.findWarehouses = this.findWarehouses.bind(this);
        this.findProducts = this.findProducts.bind(this);
        this.filterValuesForLoggedUser = this.filterValuesForLoggedUser.bind(this);
        this.setPagination();
        this.findCities();
        this.findLocations();
        this.findWarehouses();
        this.findProducts();
        this.onFind();
    }

    title = "Stanje proizvoda u skladištima";
    parentColumns = ['Skladište', 'Lokacija', 'Grad'];
    childColumns = ['Kategorija'];
    nestedChildColumns = ['Proizvod', 'Potkategorija', 'Ambalaža', 'Količina', 'Min. Količina', 'Izmijeni', 'Obriši'];

    @observable clickedStock = {
        id: "",
        city_id: "",
        city_name: "Odaberi grad",
        location_id: "",
        location_name: "Odaberi lokaciju",
        warehouse_id: "",
        warehouse_name: "Odaberi skladište",
        product_id: "",
        product_name: "Odaberi proizvod",
        subcategory_id: "",
        subcategory_name: "",
        packaging_id: "",
        packaging_name: "",
        quantity: "",
        min_quantity: ""
    };

    @observable errorMessage = {
        city: null,
        location: null,
        warehouse: null,
        product: null,
        quantity: null,
        min_quantity: null
    };

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;
    @observable clickedWarehouseProductId = "";

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable grouppedData = [];

    @observable clickedRows = [];
    @observable clickedNestedRows = [];

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
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", warehouse_id: "", warehouse_name: "", product_id: "", product_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "", quantity: 0, min_quantity: 1 }];
        }
        if(this.response.length !== 0){
            this.groupData();
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.cityFilter.id = "";
        this.cityFilter.name = "";
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
        let response = await (this.dataStore.delete(this.clickedStock.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedStock));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedStock));
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
            this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", warehouse_id: "", warehouse_name: "", product_id: "", product_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "", quantity: 0, min_quantity: 1 }];
        }
        else {
            this.filterValuesForLoggedUser();
            if (response.stocks.length > 0) {
                this.allData = response.stocks;
                this.response = response.stocks;
                this.groupData();
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", city_id: "", city_name: "", location_id: "", location_name: "", warehouse_id: "", warehouse_name: "", product_id: "", product_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "", quantity: 0, min_quantity: 1 }];
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
                        packaging_name: product.packaging_name
                    }
                });
            }
        }
    }

    @action
    onStockClicked(product, isCreate) {
        this.errorMessage = {
            city: null,
            location: null,
            warehouse: null,
            product: null,
            quantity: null,
            min_quantity: null
        };

        if (isCreate) {
            this.clickedWarehouseProductId = "";
            this.clickedStock = {
                warehouse_id: "",
                warehouse_name: "Odaberi skladište",
                city_id: "",
                city_name: "Odaberi grad",
                location_id: "",
                location_name: "Odaberi lokaciju",
                product_id: "",
                product_name: "Odaberi proizvod",
                packaging_id: "",
                packaging_name: "",
                quantity: "",
                min_quantity: ""
            };
            this.filteredLocations = [];
            this.filteredWarehouses = [];
        }
        else {
            let data = product;
            this.clickedWarehouseProductId = data.product_id;
            this.clickedStock = {
                id: data.id,
                warehouse_id: data.warehouse_id,
                warehouse_name: data.warehouse_name,
                city_id: data.location_id,
                city_name: data.location_name,
                location_id: data.location_id,
                location_name: data.location_name,
                product_id: data.product_id,
                product_name: data.product_name,
                packaging_id: data.packaging_id,
                packaging_name: data.packaging_name,
                quantity: data.quantity,
                min_quantity: data.min_quantity
            };
            this.filteredLocations = this.locations.filter(location => location.city_id === data.city_id);
            this.filteredWarehouses = this.warehouses.filter(warehouse => warehouse.city_id === data.city_id);
            this.checkFields();
        }
    }

    @action
    setPagination(page) {
        if (page != null) {
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
    onCityChange(value) {
        this.clickedStock.city_id = value.city_id;
        this.clickedStock.city_name = value.city_name;

        this.filteredLocations = this.locations.filter((element) => element.city_id == this.clickedStock.city_id);
        this.filteredWarehouses = [];

        if (this.filteredLocations.findIndex(location => location.location_id == this.clickedStock.location_id) == -1) {
            this.clickedStock.location_id = "";
            this.clickedStock.location_name = "Odaberi lokaciju";
            this.clickedStock.warehouse_id = "";
            this.clickedStock.warehouse_name = "Odaberi skladište";
        }

        this.checkFields();
    }

    @action
    onLocationChange(value) {
        this.clickedStock.location_id = value.location_id;
        this.clickedStock.location_name = value.location_name;

        this.filteredWarehouses = this.warehouses.filter((element) => element.location_id == value.location_id);
        this.clickedStock.warehouse_id = "";
        this.clickedStock.warehouse_name = "Odaberi skladište";
        this.checkFields();
    }

    @action
    onWarehouseChange(value) {
        this.clickedStock.warehouse_id = value.warehouse_id;
        this.clickedStock.warehouse_name = value.warehouse_name;
        this.checkFields();
    }

    @action
    onMinimumQuantityChange(value) {
        this.clickedStock.min_quantity = value;
        this.checkFields();
    }

    @action
    onProductChange(value) {
        this.clickedStock.product_id = value.product_id;
        this.clickedStock.product_name = value.product_name;
        this.checkFields();
    }

    @action
    onQuantityChange(value) {
        this.clickedStock.quantity = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            city: null,
            location: null,
            warehouse: null,
            product: null,
            quantity: null,
            min_quantity: null
        };

        if (this.productExistsInWarehouse()) {
            this.errorMessage.product = "Skladište na istoj lokaciji već sadrži ovaj proizvod!";
        }
        if (this.clickedStock.city_id.toString() == "") {
            this.errorMessage.city = "Odaberite grad!";
        }
        if (this.clickedStock.location_id.toString() == "") {
            this.errorMessage.location = "Odaberite lokaciju!";
        }
        if (this.clickedStock.warehouse_id.toString() == "") {
            this.errorMessage.warehouse = "Odaberite skladište!";
        }
        if (this.clickedStock.product_id.toString() == "") {
            this.errorMessage.product = "Odaberite proizvod!";
        }
        if (this.clickedStock.quantity < 1) {
            this.errorMessage.quantity = "Minimalna količina: 1";
        }
        if (this.clickedStock.min_quantity < 1) {
            this.errorMessage.min_quantity = "Minimalna količina: 1";
        }

        if (this.errorMessage.city == null
            && this.errorMessage.location == null
            && this.errorMessage.warehouse == null
            && this.errorMessage.product == null
            && this.errorMessage.quantity == null
            && this.errorMessage.min_quantity == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    productExistsInWarehouse() {
        let itemExistInWarehouse = null;
        if (this.clickedWarehouseProductId == "") {
            itemExistInWarehouse = this.allData.find(data => data.warehouse_id == this.clickedStock.warehouse_id && data.product_id == this.clickedStock.product_id);
        }
        else {
            itemExistInWarehouse = this.allData.find(data =>
                data.warehouse_id == this.clickedStock.warehouse_id
                && data.product_id == this.clickedStock.product_id
                && data.product_id != this.clickedWarehouseProductId
            );
        };


        if (itemExistInWarehouse) {
            return true;
        }
        return false;
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
    onClickedNestedRow(key) {
        if (!this.clickedNestedRows.includes(key)) {
            this.clickedNestedRows.push(key);
        }
        else {
            const index = this.clickedNestedRows.indexOf(key);
            if (index > -1) {
                this.clickedNestedRows.splice(index, 1);
            }
        }
    }

    @action
    groupData() {
        this.grouppedData = [];
        this.allData.forEach(element => {
            var key = element.warehouse_id;
            if (this.grouppedData.findIndex((element) => element.name.toString() === key.toString()) === -1) {
                this.grouppedData.push({ name: key, data: [], grouppedCategoryData: [] });
            }
            let index = this.grouppedData.findIndex((element) => element.name.toString() === key.toString())
            this.grouppedData[index].data.push(element);
        })

        this.grouppedData.forEach((element, i) => {
            this.grouppedData[i].grouppedCategoryData = this.groupCategoryData(element.data);
        })
    }

    @action
    groupCategoryData(products) {
        let grouppedCategoryData = [];

        products.forEach(element => {
            var key = element.category_id;
            if (grouppedCategoryData.findIndex((element) => element.name.toString() === key.toString()) === -1) {
                grouppedCategoryData.push({ name: key, data: [] });
            }
            let index = grouppedCategoryData.findIndex((element) => element.name.toString() === key.toString())
            grouppedCategoryData[index].data.push(element);
        });
        return grouppedCategoryData;
    }

}

export default StockViewStore;