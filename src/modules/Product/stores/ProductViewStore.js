import { ThumbUpSharp } from "@material-ui/icons";
import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class ProductViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.productModuleStore.productDataStore;
        this.categoryDataStore = rootStore.categoryModuleStore.categoryDataStore;
        this.subcategoryDataStore = rootStore.subcategoryModuleStore.subcategoryDataStore;
        this.packagingDataStore = rootStore.packagingModuleStore.packagingDataStore;
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
        this.onProductClicked = this.onProductClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onSubcategoryChange = this.onSubcategoryChange.bind(this);
        this.onPackagingChange = this.onPackagingChange.bind(this);
        this.onCategoryFilterChange = this.onCategoryFilterChange.bind(this);
        this.onSubcategoryFilterChange = this.onSubcategoryFilterChange.bind(this);
        this.onPackagingFilterChange = this.onPackagingFilterChange.bind(this);
        this.filterData = this.filterData.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCategories = this.findCategories.bind(this);
        this.findSubcategories = this.findSubcategories.bind(this);
        this.findPackagings = this.findPackagings.bind(this);
        this.productExist = this.productExist.bind(this);

        this.setPagination();
        this.findCategories();
        this.findSubcategories();
        this.findPackagings();
        this.onFind();
    }

    title = "Proizvodi";
    columns = ['Naziv', 'Kategorija', 'Potkategorija', 'Ambalaža', '', ''];

    @observable clickedProduct = {
        id: "",
        name: "",
        category_id: "",
        category_name: "Odaberi kategoriju",
        subcategory_id: "",
        subcategory_name: "Odaberi potkategoriju",
        packaging_id: "",
        packaging_name: "Odaberi ambalažu"
    };

    @observable errorMessage = {
        name: null,
        category: null,
        packaging: null
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
    @observable categories = [];
    @observable subcategories = [];
    @observable packagings = [];

    @observable filteredSubcategories = [];

    @observable response = [];
    @observable productFilter = {
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
        packaging_id: "",
        packaging_name: "",
    };

    @action
    onCategoryFilterChange(value) {
        this.productFilter.category_id = value.category_id;
        this.productFilter.category_name = value.category_name;
        this.filterData();
    }

    @action
    onSubcategoryFilterChange(value) {
        this.productFilter.subcategory_id = value.subcategory_id;
        this.productFilter.subcategory_name = value.subcategory_name;
        this.filterData();
    }

    @action
    onPackagingFilterChange(value) {
        this.productFilter.packaging_id = value.packaging_id;
        this.productFilter.packaging_name = value.packaging_name;
        this.filterData();
    }

    filterData() {
        let filteredData = this.response;
        if (this.productFilter.category_id != "") {
            filteredData = filteredData.filter(data => data.category_id === this.productFilter.category_id);
        }
        if (this.productFilter.subcategory_id != "") {
            filteredData = filteredData.filter(data => data.subcategory_id === this.productFilter.subcategory_id);
        }
        if (this.productFilter.packaging_id != "") {
            filteredData = filteredData.filter(data => data.packaging_id === this.productFilter.packaging_id);
        }
        if (filteredData.length == 0) {
            filteredData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "" }];
        }
        this.allData = filteredData;
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.productFilter.category_id = "";
        this.productFilter.category_name = "";
        this.productFilter.subcategory_id = "";
        this.productFilter.subcategory_name = "";
        this.productFilter.packaging_id = "";
        this.productFilter.packaging_name = "";
        this.allData = this.response;
        if (this.allData.length == 0) {
            this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "" }];
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
        let response = await (this.dataStore.delete(this.clickedProduct.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedProduct));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedProduct));
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
            this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "" }];
        }
        else {
            if (response.products.length > 0) {
                this.allData = response.products;
                this.response = response.products;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "", subcategory_id: "", subcategory_name: "", packaging_id: "", packaging_name: "" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    async findCategories() {
        let response = await (this.categoryDataStore.get())
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
            if (response.categories.length > 0) {
                this.categories = response.categories.map((category) => {
                    return { category_id: category.id, category_name: category.name }
                });
            }
        }
    }

    @action
    async findSubcategories() {
        let response = await (this.subcategoryDataStore.get())
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
            if (response.subcategories.length > 0) {
                this.subcategories = response.subcategories.map((subcategory) => {
                    return {
                        subcategory_id: subcategory.id,
                        subcategory_name: subcategory.name,
                        category_id: subcategory.category_id,
                        category_name: subcategory.category_name
                    }
                });
            }
        }
    }

    @action
    async findPackagings() {
        let response = await (this.packagingDataStore.get())
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
            if (response.packagings.length > 0) {
                this.packagings = response.packagings.map((packaging) => {
                    return { packaging_id: packaging.id, packaging_name: packaging.name }
                });
            }
        }
    }

    @action
    onProductClicked(data, isCreate) {
        this.errorMessage = {
            name: null,
            category: null,
            packaging: null
        };

        if (isCreate) {
            this.clickedProduct = {
                id: "",
                name: "",
                category_id: "",
                category_name: "",
                subcategory_id: "",
                subcategory_name: "",
                packaging_id: "",
                packaging_name: ""
            };
            this.filteredSubcategories = [];
            this.isSubmitDisabled = true;
        }
        else {
            this.clickedProduct = {
                id: data.id,
                name: data.name,
                category_id: data.category_id,
                category_name: data.category_name,
                subcategory_id: data.subcategory_id,
                subcategory_name: data.subcategory_name ? data.subcategory_name : "",
                packaging_id: data.packaging_id,
                packaging_name: data.packaging_name ? data.packaging_name : ""
            };
            this.filteredSubcategories = this.subcategories.filter(subcategory => subcategory.category_id === data.category_id);
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
        this.clickedProduct.name = value;
        this.checkFields();
    }

    @action
    onCategoryChange(value) {
        this.clickedProduct.category_id = value.category_id;
        this.clickedProduct.category_name = value.category_name;
        this.filteredSubcategories = this.subcategories.filter(subcategory => subcategory.category_id === value.category_id);

        let subcategory = this.subcategories.find(subcategory => subcategory.subcategory_id === this.clickedProduct.subcategory_id);
        if (subcategory && subcategory.category_id !== value.category_id) {
            this.clickedProduct.subcategory_id = "";
            this.clickedProduct.subcategory_name = "";
        }

        this.checkFields();
    }

    @action
    onSubcategoryChange(value) {
        this.clickedProduct.subcategory_id = value.subcategory_id;
        this.clickedProduct.subcategory_name = value.subcategory_name;
    }

    @action
    onPackagingChange(value) {
        this.clickedProduct.packaging_id = value.packaging_id;
        this.clickedProduct.packaging_name = value.packaging_name;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            name: null,
            category: null,
            packaging: null
        };
        if (this.productExist()) {
            this.errorMessage.name = "Proizvod s istim nazivom, kategorijom i ambalažom već postoji!";
        }
        if (this.clickedProduct.name.length < 2) {
            this.errorMessage.name = "Neispravna duljina naziva proizvoda!";
        }
        if (this.clickedProduct.category_id.toString() == "") {
            this.errorMessage.category = "Odaberite kategoriju!";
        }
        if (this.clickedProduct.packaging_id.toString() == "") {
            this.errorMessage.packaging = "Odaberite ambalažu!";
        }
        if (this.errorMessage.name == null && this.errorMessage.category == null && this.errorMessage.packaging == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    productExist() {
        if (this.clickedProduct.name.length > 0 && this.clickedProduct.category_id.toString() != "" && this.clickedProduct.packaging_id.toString() != "") {
            let filteredProducts = this.allData.filter(product => product.id !== this.clickedProduct.id);
            return filteredProducts.findIndex(product =>
                product.name.toLowerCase() == this.clickedProduct.name.toLowerCase()
                && product.packaging_id.toLowerCase() == this.clickedProduct.packaging_id.toLowerCase()
                && product.category_id.toLowerCase() == this.clickedProduct.category_id.toLowerCase()) !== -1;
        }
        return false;
    }

}

export default ProductViewStore;