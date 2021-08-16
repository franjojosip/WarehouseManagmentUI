import React from 'react';
import { getUser } from './components/LocalStorage';
const { BACKEND_URL, REACT_APP_SUPER_ADMIN_PASSWORD } = process.env;

export default class HttpClient extends React.Component {
    constructor(name) {
        super();
        const { BACKEND_URL } = process.env;
        this.createAppJsonHeaders = this.createAppJsonHeaders.bind(this);
        console.log(BACKEND_URL);
        console.log(REACT_APP_SUPER_ADMIN_PASSWORD);
        this.webApiUrl = BACKEND_URL + name;
        this.createAppJsonHeaders();
    }

    createAppJsonHeaders() {
        this.appJsonHeaders = new Headers();
        this.appJsonHeaders.append("Content-Type", "application/json");
        this.appJsonHeaders.append('Access-Control-Allow-Credentials', 'true');
    }

    createBodyWithTokens(object, isAdminRoute) {
        let loggedUser = getUser();
        object.accessToken = loggedUser.accessToken;
        object.refreshToken = loggedUser.refreshToken;
        if(isAdminRoute){
            object.userId = loggedUser.id;
        }
        return JSON.stringify(object);
    }

    create = async (body) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/add", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    get = async (body) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    update = async (id, body) => {
        const options = {
            method: "PATCH",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/" + id, options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    delete = async (id, body) => {
        const options = {
            method: "DELETE",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/remove/" + id, options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    submit = async (id, body) => {
        const options = {
            method: "PATCH",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/submit/" + id, options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }
    report = async (body) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/report", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    requestResetPassword = async (email) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body: JSON.stringify({email: email})
        }
        const request = new Request(this.webApiUrl + "/requestresetpassword", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    resetPassword = async (credentials) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body: JSON.stringify(credentials)
        }
        const request = new Request(this.webApiUrl + "/resetpassword", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    refreshSchedule = async (body) => {
        const options = {
            method: "POST",
            headers: this.appJsonHeaders,
            body
        }
        const request = new Request(this.webApiUrl + "/refresh", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }
}