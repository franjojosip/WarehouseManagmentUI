import { action, observable } from "mobx";
import { toast } from 'react-toastify';
import EmailValidator from "email-validator";


class UserViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.authenticationModuleStore.authenticationDataStore;
        this.roleDataStore = rootStore.roleModuleStore.roleDataStore;
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
        this.onUserClicked = this.onUserClicked.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onRoleChange = this.onRoleChange.bind(this);
        this.onRoleFilterChange = this.onRoleFilterChange.bind(this);
        this.onResetFilterClick = this.onResetFilterClick.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);

        this.findRoles = this.findRoles.bind(this);
        this.emailExists = this.emailExists.bind(this);

        this.setPagination();
        this.findRoles();
        this.onFind();
    }

    @observable isLoaderVisible = false;
    @observable isSubmitDisabled = true;
    @observable isCreateClick = false;

    @observable errorMessage = {
        fname: null,
        lname: null,
        email: null,
        phone: null,
        password: null,
        role: null
    };

    @observable clickedUser = {
        id: "",
        fname: "",
        lname: "",
        email: "",
        phone: "",
        password: "",
        role_id: "",
        role_name: "Odaberi ulogu"
    };

    @observable page = 1;
    @observable pageSize = 5;
    @observable totalPages = 1;
    @observable previousEnabled = false;
    @observable nextEnabled = false;
    @observable rows = [];

    title = "Korisnici";
    columns = ['Ime i prezime', 'Email', 'Mobitel', 'Uloga', '', ''];

    @observable allData = [];
    @observable roles = [];

    @observable response = [];
    @observable roleFilter = {
        id: "",
        name: ""
    };

    @action
    onRoleFilterChange(value) {
        this.roleFilter.id = value.role_id;
        this.roleFilter.name = value.role_name;
        if (value.role_id) {
            this.allData = this.response.filter(data => data.role_id === value.role_id);
        }
        else {
            this.allData = this.response;
        }
        if (this.allData.length == 0) {
            this.allData = [{ id: "", fname: "Nema podataka", lname: "", email: "", phone: "", role_id: "", role_name: "", password: "" }];
        }
        this.setPagination(1);
    }

    @action
    onResetFilterClick() {
        this.roleFilter.id = "";
        this.roleFilter.name = "";
        this.allData = this.response;
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
        let response = await (this.dataStore.delete(this.clickedUser.id));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onEditClick() {
        this.showLoader();
        let response = await (this.dataStore.update(this.clickedUser));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onCreateClick() {
        this.showLoader();
        let response = await (this.dataStore.create(this.clickedUser));
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
            this.allData = [{ id: "", fname: "Nema podataka", lname: "", email: "", phone: "", role_id: "", role_name: "", password: "" }];
        }
        else {
            if (response.users.length > 0) {
                this.allData = response.users;
                this.response = response.users;
            }
            else {
                this.allData = [{ id: "", fname: "Nema podataka", lname: "", email: "", phone: "", role_id: "", role_name: "", password: "" }];
            }
        }
        this.setPagination();
        await this.hideLoader();
    };

    @action
    async findRoles() {
        let response = await (this.roleDataStore.get())
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
            if (response.roles.length > 0) {
                this.roles = response.roles.map((role) => {
                    return { role_id: role.id, role_name: role.name }
                });
            }
        }
    }
    @action
    onUserClicked(data, isCreate) {
        this.errorMessage = {
            fname: null,
            lname: null,
            email: null,
            phone: null,
            password: null,
            role: null
        };
        if (isCreate) {
            this.isCreateClick = true;
            this.clickedUser = {
                id: "",
                fname: "",
                lname: "",
                email: "",
                phone: "",
                password: "",
                role_id: "",
                role_name: "Odaberi ulogu"
            };
        }
        else {
            this.isCreateClick = false;
            this.clickedUser = {
                id: data.id,
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                phone: data.phone,
                password: "",
                role_id: data.role_id,
                role_name: data.role_name
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
    onFirstNameChange(value) {
        this.clickedUser.fname = value;
        this.checkFields();
    }

    @action
    onLastNameChange(value) {
        this.clickedUser.lname = value;
        this.checkFields();
    }

    @action
    onEmailChange(value) {
        this.clickedUser.email = value;
        this.checkFields();
    }

    @action
    onPhoneChange(value) {
        this.clickedUser.phone = value;
        this.checkFields();
    }

    @action
    onPasswordChange(value) {
        this.clickedUser.password = value;
        this.checkFields();
    }

    @action
    onRoleChange(value) {
        this.clickedUser.role_id = value.role_id;
        this.clickedUser.role_name = value.role_name;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            fname: null,
            lname: null,
            email: null,
            phone: null,
            password: null,
            role: null
        };

        let isEmailValid = EmailValidator.validate(this.clickedUser.email);
        let isValidPhoneNumber = /^\d+$/.test(this.clickedUser.phone);

        if (this.clickedUser.fname.length > 2
            && this.clickedUser.fname.length > 2
            && this.clickedUser.password.length >= 4
            && this.clickedUser.role_id != null
            && this.clickedUser.phone.length >= 6
            && this.clickedUser.phone.length <= 12
            && isValidPhoneNumber
            && isEmailValid) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    checkFields() {
        this.errorMessage = {
            fname: null,
            lname: null,
            email: null,
            phone: null,
            password: null,
            role: null
        };

        let isEmailValid = EmailValidator.validate(this.clickedUser.email);
        let isValidPhoneNumber = /^\d+$/.test(this.clickedUser.phone);

        if (this.emailExists()) {
            this.errorMessage.email = "Email se već koristi!";
        }
        if (!isEmailValid) {
            this.errorMessage.email = "Neispravan format email-a!";
        }
        if (!isValidPhoneNumber) {
            this.errorMessage.phone = "Neispravan broj telefona!";
        }
        if (this.clickedUser.fname.length < 2) {
            this.errorMessage.fname = "Neispravna duljina imena (min. 2)";
        }
        if (this.clickedUser.lname.length < 2) {
            this.errorMessage.lname = "Neispravna duljina prezimena (min. 2)";
        }
        if (this.clickedUser.phone.length < 6) {
            this.errorMessage.phone = "Neispravna duljina telefona (6-10 znamenki)";
        }
        if (this.clickedUser.email.length < 4) {
            this.errorMessage.email = "Neispravna duljina email-a (min. 4)";
        }
        if (this.isCreateClick && this.clickedUser.password.length < 6) {
            this.errorMessage.password = "Neispravna duljina šifre (min. 6)";
        }
        if (this.clickedUser.role_id.toString() == "") {
            this.errorMessage.role = "Odaberite ulogu!";
        }

        if (this.errorMessage.fname == null
            && this.errorMessage.lname == null
            && this.errorMessage.email == null
            && this.errorMessage.phone == null
            && this.errorMessage.password == null
            && this.errorMessage.role == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    emailExists() {
        if (this.clickedUser.email.length > 0) {
            let filteredUsers = this.allData.filter(user => user.id !== this.clickedUser.id);
            return filteredUsers.findIndex(user => user.email.toLowerCase() == this.clickedUser.email.toLowerCase()) !== -1;
        }
        return false;
    }

}

export default UserViewStore;