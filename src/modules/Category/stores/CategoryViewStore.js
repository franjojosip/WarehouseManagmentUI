import { action, observable } from "mobx";
import { toast } from 'react-toastify';

class CategoryViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.categoryModuleStore.categoryDataStore;
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
        this.onCategoryClicked = this.onCategoryClicked.bind(this);
        this.onNameChange = this.onNameChange.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.categoryNameExist = this.categoryNameExist.bind(this);

        this.setPagination();
        this.onFind();
    }

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;

    @observable clickedCategory = {
        id: "",
        name: ""
    };

    @observable errorMessage = {
        name: null
    };


    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];

    title = "Kategorije";
    columns = ['Naziv', '', ''];

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
        let response = await (this.dataStore.delete(this.clickedCategory.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedCategory));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedCategory));
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
            this.allData = [{ id: "", name: "Nema podataka" }];
        }
        else {
            if (response.categories.length > 0) {
                this.allData = response.categories;
            }
            else {
                this.allData = [{ id: "", name: "Nema podataka" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    onCategoryClicked(data, isCreate) {
        this.errorMessage = {
            name: null
        };
        if (isCreate) {
            this.clickedCategory = {
                id: "",
                name: ""
            };
        }
        else {
            this.clickedCategory = {
                id: data.id,
                name: data.name
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
        this.clickedCategory.name = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            name: null
        };

        if (this.clickedCategory.name.length < 3) {
            this.errorMessage.name = "Neispravna duljina naziva kategorije!";
        }
        if (this.categoryNameExist()) {
            this.errorMessage.name = "Kategorija s istim nazivom već postoji!";
        }
        
        if (this.errorMessage.name == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    categoryNameExist() {
        if (this.clickedCategory.name.length > 0) {
            let filteredCategories = this.allData.filter(category => category.id !== this.clickedCategory.id);
            return filteredCategories.findIndex(category => category.name.toLowerCase() == this.clickedCategory.name.toLowerCase()) !== -1;
        }
        return false;
    }

}

export default CategoryViewStore;