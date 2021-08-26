import { action, observable } from "mobx";
import { toast } from 'react-toastify';
import moment from "moment";
import { getUser, getWarehouse, saveWarehouse } from "../../../common/components/LocalStorage";
import generateStocktakingPdf from "../../../common/components/PDFGenerator/StocktakingReportGenerator";

class StocktakingViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.stocktakingModuleStore.stocktakingDataStore;
        this.cityDataStore = rootStore.cityModuleStore.cityDataStore;
        this.locationDataStore = rootStore.locationModuleStore.locationDataStore;
        this.warehouseDataStore = rootStore.warehouseModuleStore.warehouseDataStore;
        this.productDataStore = rootStore.productModuleStore.productDataStore;
        this.stockDataStore = rootStore.stockModuleStore.stockDataStore;
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
        this.onStocktakingClicked = this.onStocktakingClicked.bind(this);
        this.onWarehouseChange = this.onWarehouseChange.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.onClickedRow = this.onClickedRow.bind(this);
        this.groupData = this.groupData.bind(this);
        this.onCityFilterChange = this.onCityFilterChange.bind(this);
        this.onLocationFilterChange = this.onLocationFilterChange.bind(this);
        this.onWarehouseFilterChange = this.onWarehouseFilterChange.bind(this);
        this.onStartDateFilterChange = this.onStartDateFilterChange.bind(this);
        this.onEndDateFilterChange = this.onEndDateFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);
        this.checkProductExistInStocktaking = this.checkProductExistInStocktaking.bind(this);
        this.onGeneratePdfClick = this.onGeneratePdfClick.bind(this);
        this.onGeneratePdfRowClick = this.onGeneratePdfRowClick.bind(this);
        this.onSubmitAllClicked = this.onSubmitAllClicked.bind(this);
        this.onSubmitAllConfirmed = this.onSubmitAllConfirmed.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCities = this.findCities.bind(this);
        this.findLocations = this.findLocations.bind(this);
        this.findWarehouses = this.findWarehouses.bind(this);
        this.findProducts = this.findProducts.bind(this);
        this.filterValuesForLoggedUser = this.filterValuesForLoggedUser.bind(this);
        this.findStocks = this.findStocks.bind(this);

        this.showLoader();
        this.findCities();
        this.findStocks();
    }

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;
    @observable clickedStocktakingProductId = "";
    @observable clickedStocktakingDate = "";

    @observable clickedStocktaking = {
        id: "",
        warehouse_id: "",
        warehouse_name: "Odaberi skladište",
        city_id: "",
        location_id: "",
        product_id: "",
        product_name: "Odaberi proizvod",
        category_id: "",
        subcategory_id: "",
        packaging_id: "",
        quantity: "",
        date_created: "",
        isSubmitted: false
    };

    @observable errorMessage = {
        warehouse: null,
        product: null,
        quantity: null
    };

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];
    @observable grouppedData = [];

    @observable clickedRows = [];
    @observable paginatedData = [];
    @observable submittedIds = [];

    title = "Inventura";
    parentColumns = ['Skladište', 'Lokacija', 'Grad', 'Datum kreiranja'];
    childColumns = ['Proizvod', 'Kategorija', 'Potkategorija', 'Ambalaža', 'Izbrojena količina', 'Prava količina', 'Potvrđeno', 'Izmijeni', 'Obriši'];

    @observable allData = [];
    @observable warehouses = [];
    @observable warehouseFilterWarehouses = [];
    @observable cities = [];
    @observable locations = [];
    @observable products = [];
    @observable stocks = [];

    @observable filteredProducts = [];
    @observable filteredLocations = [];
    @observable filteredWarehouses = [];

    @observable response = [];
    @observable cityFilter = {
        city_id: "",
        city_name: "",
        location_id: "",
        location_name: "",
        warehouse_id: "",
        warehouse_name: ""
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
        this.cityFilter.location_id = "";
        this.cityFilter.location_name = "";
        this.cityFilter.warehouse_id = "";
        this.cityFilter.warehouse_name = "";
        this.filteredLocations = [];

        if (value.city_id != "") {
            filteredData = filteredData.filter(data => data.city_id == value.city_id);
            this.cityFilter.city_id = value.city_id;
            this.cityFilter.city_name = value.city_name;
            this.filteredLocations = this.locations.filter(location => location.city_id == value.city_id);
        }
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).utc().format("DD/MM/YYYY");
            let endDate = moment(new Date(this.dateFilter.endDate)).utc().format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).utc().diff(moment(this.dateFilter.endDate).utc(), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").utc().isAfter(moment(startDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(startDate, "DD/MM/YYYY")))
                    && (moment(data.date_created, "DD/MM/YYYY").utc().isBefore(moment(endDate, "DD/MM/YYYY")) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(endDate, "DD/MM/YYYY")))
                );
            }
        }
        this.allData = filteredData;
        this.groupData();
        this.setPagination(1);
    }

    @action
    onLocationFilterChange(value) {
        let filteredData = this.response;
        this.cityFilter.location_id = value.location_id;
        this.cityFilter.location_name = value.location_name;
        this.cityFilter.warehouse_id = "";
        this.cityFilter.warehouse_name = "";
        this.filteredWarehouses = [];

        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).utc().format("DD/MM/YYYY");
            let endDate = moment(new Date(this.dateFilter.endDate)).utc().format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).utc().diff(moment(this.dateFilter.endDate).utc(), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").utc().isAfter(moment(startDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(startDate, "DD/MM/YYYY").utc()))
                    && (moment(data.date_created, "DD/MM/YYYY").utc().isBefore(moment(endDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(endDate, "DD/MM/YYYY").utc()))
                );
            }
        }
        if (value.location_id != "") {
            filteredData = filteredData.filter(data => data.city_id == this.cityFilter.city_id && data.location_id == value.location_id);
            this.cityFilter.location_id = value.location_id;
            this.cityFilter.location_name = value.location_name;
            this.filteredWarehouses = this.warehouseFilterWarehouses.filter(warehouse => warehouse.location_id == this.cityFilter.location_id);
        }
        else if (this.cityFilter.city_id != "") {
            filteredData = filteredData.filter(data => data.city_id == this.cityFilter.city_id);
        }
        this.allData = filteredData;
        this.groupData();
        this.setPagination(1);
    }

    @action
    onWarehouseFilterChange(value) {
        let filteredData = this.response;
        this.cityFilter.warehouse_id = value.warehouse_id;
        this.cityFilter.warehouse_name = value.warehouse_name;
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).utc().format("DD/MM/YYYY");
            let endDate = moment(new Date(this.dateFilter.endDate)).utc().format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).utc().diff(moment(this.dateFilter.endDate).utc(), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").utc().isAfter(moment(startDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(startDate, "DD/MM/YYYY").utc()))
                    && (moment(data.date_created, "DD/MM/YYYY").utc().isBefore(moment(endDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(endDate, "DD/MM/YYYY").utc()))
                );
            }
        }
        if (this.cityFilter.location_id != "") {
            filteredData = filteredData.filter(data => data.city_id == this.cityFilter.city_id && data.location_id == this.cityFilter.location_id);
        }
        if (this.cityFilter.warehouse_id != "") {
            filteredData = filteredData.filter(data => data.warehouse_id == this.cityFilter.warehouse_id);
        }
        if (this.cityFilter.warehouse_id != "") {
            filteredData = filteredData.filter(data => data.warehouse_id == this.cityFilter.warehouse_id);
        }
        this.allData = filteredData;
        this.groupData();
        this.setPagination(1);
    }


    @action
    onStartDateFilterChange(value) {
        let filteredData = this.response;
        this.dateFilter.startDate = value;
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).utc().format("DD/MM/YYYY");
            let endDate = moment(new Date(this.dateFilter.endDate)).utc().format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).diff(moment(this.dateFilter.endDate), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").utc().isAfter(moment(startDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(startDate, "DD/MM/YYYY").utc()))
                    && (moment(data.date_created, "DD/MM/YYYY").utc().isBefore(moment(endDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(endDate, "DD/MM/YYYY").utc()))
                );
            }
        }
        if (this.cityFilter.city_id != "") {
            filteredData = filteredData.filter(data => data.city_id === this.cityFilter.city_id);
        }
        if (this.cityFilter.location_id != "") {
            filteredData = filteredData.filter(data => data.location_id === this.cityFilter.location_id);
        }
        if (this.cityFilter.warehouse_id != "") {
            filteredData = filteredData.filter(data => data.warehouse_id == this.cityFilter.warehouse_id);
        }
        this.allData = filteredData;
        this.groupData();
        this.setPagination(1);
    }

    @action
    onEndDateFilterChange(value) {
        let filteredData = this.response;
        this.dateFilter.endDate = value;
        if (this.dateFilter.startDate != "" && this.dateFilter.endDate != "") {
            let startDate = moment(new Date(this.dateFilter.startDate)).utc().format("DD/MM/YYYY");
            let endDate = moment(new Date(this.dateFilter.endDate)).utc().format("DD/MM/YYYY");
            if (moment(this.dateFilter.startDate).utc().diff(moment(this.dateFilter.endDate).utc(), 'days') <= 0) {
                filteredData = filteredData.filter(data =>
                    (moment(data.date_created, "DD/MM/YYYY").utc().isAfter(moment(startDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(startDate, "DD/MM/YYYY").utc()))
                    && (moment(data.date_created, "DD/MM/YYYY").utc().isBefore(moment(endDate, "DD/MM/YYYY").utc()) || moment(data.date_created, "DD/MM/YYYY").utc().isSame(moment(endDate, "DD/MM/YYYY").utc()))
                );
            }
        }
        if (this.cityFilter.city_id != "") {
            filteredData = filteredData.filter(data => data.city_id === this.cityFilter.city_id);
        }
        if (this.cityFilter.location_id != "") {
            filteredData = filteredData.filter(data => data.location_id === this.cityFilter.location_id);
        }
        if (this.cityFilter.warehouse_id != "") {
            filteredData = filteredData.filter(data => data.warehouse_id == this.cityFilter.warehouse_id);
        }
        this.allData = filteredData;
        this.groupData();
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.cityFilter.city_id = "";
        this.cityFilter.city_name = "";
        this.cityFilter.location_id = "";
        this.cityFilter.location_name = "";
        this.cityFilter.warehouse_id = "";
        this.cityFilter.warehouse_name = "";
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
        let response = await (this.dataStore.delete(this.clickedStocktaking.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedStocktaking));
        this.processData(response);
        saveWarehouse(this.clickedStocktaking.warehouse_id, this.clickedStocktaking.product_id);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedStocktaking));
        this.processData(response);
        saveWarehouse(this.clickedStocktaking.warehouse_id, this.clickedStocktaking.product_id);
        await this.hideLoader();
    }

    @action
    async onSubmitClick() {
        this.showLoader();
        let response = await (this.dataStore.submit(this.clickedStocktaking.id));
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
            if (response.stocktakings.length > 0) {
                response.stocktakings.forEach(item => item.date_created = moment(new Date(item.date_created)).utc().format('DD/MM/YYYY'));
                this.allData = response.stocktakings;
                this.response = response.stocktakings;
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
                this.paginatedData = [];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    async findStocks() {
        let response = await (this.stockDataStore.get())
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
            if (response.stocks.length > 0) {
                this.stocks = response.stocks;
            }
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
                this.warehouseFilterWarehouses = response.warehouses.map((warehouse) => {
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
                this.warehouses = response.warehouses.map((warehouse) => {
                    let warehouseArray = [];
                    warehouseArray.push(warehouse.name);
                    warehouseArray.push(warehouse.location_name);
                    warehouseArray.push(warehouse.city_name);
                    return {
                        warehouse_id: warehouse.id,
                        warehouse_name: warehouseArray.join(", "),
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
                    let productInfo = [];
                    productInfo.push(product.name);
                    productInfo.push(product.category_name);
                    if (product.subcategory_name != "") {
                        productInfo.push(product.subcategory_name);
                    }
                    productInfo.push(product.packaging_name);
                    return {
                        product_id: product.id,
                        product_name: productInfo.join(", "),
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
    onStocktakingClicked(data, isCreate) {
        this.errorMessage = {
            warehouse: null,
            product: null,
            quantity: null,
            min_quantity: null
        };
        if (isCreate) {
            let defaultWarehouse = getWarehouse();
            let warehouse = null;
            let product = null;

            if (defaultWarehouse.warehouse_id != "" && defaultWarehouse.product_id != "") {
                warehouse = this.warehouses.find(warehouse => warehouse.warehouse_id == defaultWarehouse.warehouse_id);
                product = this.products.find(product => product.product_id == defaultWarehouse.product_id);
            }

            this.clickedStocktakingProductId = "";
            this.clickedStocktakingDate = moment().utc().format('DD/MM/YYYY');
            this.clickedStocktaking = {
                id: "",
                warehouse_id: "",
                warehouse_name: "Odaberi skladište",
                city_id: "",
                location_id: "",
                product_id: "",
                product_name: "Odaberi proizvod",
                category_id: "",
                subcategory_id: "",
                packaging_id: "",
                quantity: 0,
                date_created: "",
                isSubmitted: false
            };
            if (warehouse) this.onWarehouseChange(warehouse);
            if (product) this.onProductChange(product);

            let filteredStocks = this.stocks.filter(stock => stock.warehouse_id == this.clickedStocktaking.warehouse_id);
            this.filteredProducts = filteredStocks.map(stock => {
                let productInfo = [];
                productInfo.push(stock.product_name);
                productInfo.push(stock.category_name);
                if (stock.subcategory_name != "") {
                    productInfo.push(stock.subcategory_name);
                }
                productInfo.push(stock.packaging_name);

                return {
                    product_id: stock.product_id,
                    product_name: productInfo.join(", "),
                    category_id: stock.category_id,
                    category_name: stock.category_name,
                    subcategory_id: stock.subcategory_id,
                    subcategory_name: stock.subcategory_name,
                    packaging_id: stock.packaging_id,
                    packaging_name: stock.packaging_name
                }
            });
            this.filteredLocations = [];
            this.filteredWarehouses = [];
        }
        else {
            this.clickedStocktakingProductId = data.product_id;
            this.clickedStocktakingDate = data.date_created;

            this.clickedStocktaking = {
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
            this.filteredProducts = this.stocks.filter(stock => stock.warehouse_id == this.clickedStocktaking.warehouse_id)
                .map(stock => {
                    return {
                        product_id: stock.product_id,
                        product_name: stock.product_name,
                        category_id: stock.category_id,
                        category_name: stock.category_name,
                        subcategory_id: stock.subcategory_id,
                        subcategory_name: stock.subcategory_name,
                        packaging_id: stock.packaging_id,
                        packaging_name: stock.packaging_name
                    }
                });
            this.checkFields();
        }
    }

    @action
    async onSubmitAllConfirmed() {
        if (this.submittedIds.length > 0) {
            this.showLoader();
            let response = await (this.dataStore.submitAll(this.submittedIds));
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
                this.onFind();
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
            await this.hideLoader();
        }
    }

    @action
    onSubmitAllClicked(stocktakings) {
        this.submittedIds = stocktakings.filter(stocktaking => !stocktaking.isSubmitted).map(stocktaking => stocktaking.id);
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
        this.clickedStocktaking.warehouse_id = value.warehouse_id;
        this.clickedStocktaking.warehouse_name = value.warehouse_name;

        let filteredStocks = this.stocks.filter(stock => stock.warehouse_id == this.clickedStocktaking.warehouse_id);
        this.filteredProducts = filteredStocks.map(stock => {
            let productInfo = [];
            productInfo.push(stock.product_name);
            productInfo.push(stock.category_name);
            if (stock.subcategory_name != "") {
                productInfo.push(stock.subcategory_name);
            }
            productInfo.push(stock.packaging_name);

            return {
                product_id: stock.product_id,
                product_name: productInfo.join(", "),
                category_id: stock.category_id,
                category_name: stock.category_name,
                subcategory_id: stock.subcategory_id,
                subcategory_name: stock.subcategory_name,
                packaging_id: stock.packaging_id,
                packaging_name: stock.packaging_name
            }
        });

        if (this.clickedStocktaking.product_id != "" && (filteredStocks.length == 0 || filteredStocks.findIndex(stock => stock.product_id == this.clickedStocktaking.product_id) == -1)) {
            this.onProductChange({ product_id: "", product_name: "Odaberi proizvod" });
        }
        this.checkFields();
    }

    @action
    onProductChange(value) {
        this.clickedStocktaking.product_id = value.product_id;
        this.clickedStocktaking.product_name = value.product_name;

        if (value.category_id != "") {
            this.clickedStocktaking.category_id = value.category_id;
            this.clickedStocktaking.category_name = value.category_name;
        }
        else {
            this.clickedStocktaking.category_id = "";
            this.clickedStocktaking.category_name = "";
        }

        if (value.subcategory_id != "") {
            this.clickedStocktaking.subcategory_id = value.subcategory_id;
            this.clickedStocktaking.subcategory_name = value.subcategory_name;
        }
        else {
            this.clickedStocktaking.subcategory_id = "";
            this.clickedStocktaking.subcategory_name = "";
        }

        if (value.packaging_id != "") {
            this.clickedStocktaking.packaging_id = value.packaging_id;
            this.clickedStocktaking.packaging_name = value.packaging_name;
        }
        else {
            this.clickedStocktaking.packaging_id = "";
            this.clickedStocktaking.packaging_name = "";
        }
        this.checkFields();
    }

    @action
    onQuantityChange(value) {
        this.clickedStocktaking.quantity = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            warehouse: null,
            product: null,
            quantity: null
        };
        if (this.checkProductExistInStocktaking()) {
            this.errorMessage.product = "Odabrani proizvod i skladište su već zapisani u današnjoj inventuri!";
        }
        if (this.clickedStocktaking.warehouse_id.toString() == "") {
            this.errorMessage.warehouse = "Odaberite skladište!";
        }
        if (this.clickedStocktaking.product_id.toString() == "") {
            this.errorMessage.product = "Odaberite proizvod!";
        }
        if (this.filteredProducts.length == 0) {
            this.errorMessage.product = "U odabranom skladištu nisu dodani proizvodi!";
        }
        if (this.clickedStocktaking.quantity < 0) {
            this.errorMessage.quantity = "Minimalna količina: 0";
        }

        if (this.errorMessage.warehouse == null
            && this.errorMessage.product == null
            && this.errorMessage.quantity == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    checkProductExistInStocktaking() {
        let itemExistInStocktaking = null;

        if (this.clickedStocktaking.product_id != "" && this.clickedStocktaking.warehouse_id != "") {
            if (this.clickedStocktakingProductId != "" && this.clickedStocktaking.product_id != this.clickedStocktakingProductId || this.clickedStocktakingProductId == "") {
                itemExistInStocktaking = this.allData.find(data =>
                    data.product_id == this.clickedStocktaking.product_id
                    && data.warehouse_id == this.clickedStocktaking.warehouse_id
                    && data.date_created == this.clickedStocktakingDate);
            }
        }
        if (itemExistInStocktaking) {
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
    groupData() {
        this.grouppedData = [];

        if (this.allData.length == 0) return;

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
    async onGeneratePdfRowClick(date, city_id, location_id) {
        let dateArray = [];
        dateArray = date.split("/");
        let pdfDate = dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
        let response = await (this.dataStore.report(pdfDate, pdfDate, city_id, location_id, ""))
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
            if (response.stocktakings.length == 0) {
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
                generateStocktakingPdf(response.stocktakings, date, date);
            }
        }
    }

    @action
    async onGeneratePdfClick() {
        let startDate = this.dateFilter.startDate;
        let endDate = this.dateFilter.endDate;
        if (startDate != "" && endDate != "" && moment(startDate).utc().diff(moment(endDate).utc(), 'days') <= 0) {
            let response = await (this.dataStore.report(startDate, endDate, this.cityFilter.city_id, this.cityFilter.location_id, this.cityFilter.warehouse_id))
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
                if (response.stocktakings.length == 0) {
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
                    generateStocktakingPdf(response.stocktakings, startDate, endDate);
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

export default StocktakingViewStore;