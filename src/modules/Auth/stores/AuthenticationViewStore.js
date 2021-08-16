import { action, observable } from "mobx";
import EmailValidator from "email-validator";
import { toast } from 'react-toastify';
import { saveUser, getUser, clearUser } from '../../../common/components/LocalStorage'

class AuthenticationViewStore {
    constructor(rootStore) {
        this.dataStore = rootStore.authenticationModuleStore.authenticationDataStore;
        this.routerStore = rootStore.routerStore;

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onResetPasswordEmailChange = this.onResetPasswordEmailChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
        this.onForgotPasswordSubmit = this.onForgotPasswordSubmit.bind(this);
        this.onResetPasswordSubmit = this.onResetPasswordSubmit.bind(this);
        this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
        this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
        this.checkResetPasswordFields = this.checkResetPasswordFields.bind(this);

        this.delay = this.delay.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.processData = this.processData.bind(this);
    }

    @observable isSubmitDisabled = true;
    @observable isLoaderVisible = false;

    @observable email = "";
    @observable password = "";
    @observable errorMessage = {
        email: null,
        password: null,
        credentials: null
    };


    @observable oldPassword = "";
    @observable newPassword = "";
    @observable resetPasswordMessage = {
        oldPassword: null,
        newPassword: null
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
    onEmailChange(value) {
        this.email = value;
        this.checkFields();
    }

    @action
    onPasswordChange(value) {
        this.password = value;
        this.checkFields();
    }

    @action
    checkFields() {
        this.errorMessage = {
            email: null,
            password: null
        };
        let isEmailValid = EmailValidator.validate(this.email);

        if (!isEmailValid) {
            this.errorMessage.email = "Neispravan oblik email-a, primjer. marko@outlook.com"
        }
        if (this.password.length < 4) {
            this.errorMessage.password = "Neispravna duljina lozinke (min. 4)"
        }
        if (this.errorMessage.email == null && this.errorMessage.password == null) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    async onLogin() {
        this.showLoader();
        let response = await (this.dataStore.login({ email: this.email, password: this.password }));
        this.processData(response);
        await this.hideLoader();
    }

    @action
    async onLogout() {
        this.showLoader();
        let user = getUser();
        if (user != null && user.refreshToken != "") {
            let response = await (this.dataStore.logout(user.accessToken, user.refreshToken));
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
                await this.hideLoader();
            }
            clearUser();
            this.routerStore.goTo("login");
        }
        await this.hideLoader();
    }

    @action
    async processData(response) {
        if (response.error) {
            this.errorMessage.credentials = response.error;
        }
        else {
            saveUser(response.user);
            toast.success("Uspješna autentifikacija!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
            this.routerStore.goTo("home");
        }
    }

    @action
    onResetPasswordEmailChange(value) {
        this.email = value;
        let isEmailValid = EmailValidator.validate(value);
        this.errorMessage = {
            email: null,
            password: null
        };

        if (!isEmailValid) {
            this.errorMessage.email = "Neispravan oblik email-a, primjer. marko@outlook.com"
        }
        if (isEmailValid) {
            this.isSubmitDisabled = false
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    onForgotPasswordClick() {
        this.routerStore.goTo("forgotpassword");
    }

    @action
    async onForgotPasswordSubmit() {
        this.showLoader();

        let response = await (this.dataStore.requestResetPassword(this.email));
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
        }
        await this.hideLoader();
    }

    @action
    onOldPasswordChange(value) {
        this.oldPassword = value;
        this.checkResetPasswordFields();
    }

    @action
    onNewPasswordChange(value) {
        this.newPassword = value;
        this.checkResetPasswordFields();
    }

    @action
    checkResetPasswordFields() {
        this.resetPasswordMessage = {
            oldPassword: null,
            newPassword: null
        }
        if (this.oldPassword.length < 4) {
            this.resetPasswordMessage.oldPassword = "Neispravna duljina lozinke!"
        }
        if (this.newPassword.length < 4) {
            this.resetPasswordMessage.newPassword = "Neispravna duljina lozinke!"
        }

        if (!this.resetPasswordMessage.oldPassword && !this.resetPasswordMessage.newPassword) {
            this.isSubmitDisabled = false;
        }
        else {
            this.isSubmitDisabled = true;
        }
    }

    @action
    async onResetPasswordSubmit() {
        let id = window.location.search.split('id=')[1]
        if (!id || id.length != 24) {
            toast.error("Provjerite ispravnost linka!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
            });
        }
        this.showLoader();

        let response = await (this.dataStore.resetPassword(
            {
                token: id,
                old_password: this.oldPassword,
                new_password: this.newPassword
            }
        ));
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
            this.oldPassword = "";
            this.newPassword = "";
            this.isSubmitDisabled = true;
        }
        await this.hideLoader();
    }

}

export default AuthenticationViewStore;