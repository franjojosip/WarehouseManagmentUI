import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class SubcategoryViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.subcategoryModuleStore.subcategoryDataStore;
        this.categoryDataStore = rootStore.categoryModuleStore.categoryDataStore;
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
        this.onSubcategoryClicked = this.onSubcategoryClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onCategoryFilterChange = this.onCategoryFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findCategories = this.findCategories.bind(this);
        this.subcategoryNameExist = this.subcategoryNameExist.bind(this);

        this.setPagination();
        this.findCategories();
        this.onFind();
    }

    title = "Potkategorije";
    columns = ['Naziv potkategorije', 'Naziv kategorije', '', ''];

    @observable clickedSubcategory = {
        id: "",
        name: "",
        category_id: "",
        category_name: "Odaberi kategoriju"
    };

    @observable clickedCategory = {
        category_id: "",
        category_name: "Odaberi kategoriju"
    }

    @observable errorMessage = {
        name: null,
        category: null
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

    @observable response = [];
    @observable categoryFilter = {
        id: "",
        name: ""
    };

    @action
    onCategoryFilterChange(value) {
        this.categoryFilter.id = value.category_id;
        this.categoryFilter.name = value.category_name;
        if (value.category_id != "") {
            this.allData = this.response.filter(data => data.category_id === value.category_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length == 0) {
            this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "" }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.categoryFilter.id = "";
        this.categoryFilter.name = "";
        this.allData = this.response;
        if (this.allData.length == 0) {
            this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "" }];
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
        let response = await (this.dataStore.delete(this.clickedSubcategory.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedSubcategory));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedSubcategory));
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
            this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "" }];
        }
        else {
            if (response.subcategories.length > 0) {
                this.allData = response.subcategories;
                this.response = response.subcategories;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka", category_id: "", category_name: "" }];
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
    onSubcategoryClicked(data, isCreate) {
        this.errorMessage = {
            name: null,
            category: null
        };
        if (isCreate) {
            this.clickedSubcategory = {
                id: "",
                name: "",
                category_id: "",
                category_name: "Odaberi kategoriju"
            };
        }
        else {
            this.clickedSubcategory = {
                id: data.id,
                name: data.name,
                category_id: data.category_id,
                category_name: data.category_name
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

        this.loadPageData()
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
        this.clickedSubcategory.name = value;
        this.checkFields();
    }

    @action
    onCategoryChange(value) {
        this.clickedSubcategory.category_id = value.category_id;
        this.clickedSubcategory.category_name = value.category_name;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            name: null,
            category: null
        };
        if (this.subcategoryNameExist()) {
            this.errorMessage.name = "Potkategorija s istim nazivom već postoji!";
        }
        if (this.clickedSubcategory.name.length < 2) {
            this.errorMessage.name = "Neispravna duljina naziva potkategorije!";
        }
        if (this.clickedSubcategory.category_id.toString() == "") {
            this.errorMessage.category = "Odaberite kategoriju!";
        }
        if (this.errorMessage.name == null && this.errorMessage.category == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    subcategoryNameExist() {
        if (this.clickedSubcategory.name.length > 0) {
            let filteredSubcategories = this.allData.filter(subcategory => subcategory.id !== this.clickedSubcategory.id);
            return filteredSubcategories.findIndex(clickedSubcategory => clickedSubcategory.name.toLowerCase() == this.clickedSubcategory.name.toLowerCase()) !== -1;
        }
        return false;
    }

}

export default SubcategoryViewStore;