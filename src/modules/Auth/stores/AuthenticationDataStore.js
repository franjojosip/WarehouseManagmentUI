import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class AuthenticationDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("users");
    }

    login = async (credentials) => {
        const options = {
            method: "POST",
            headers: this.httpClient.appJsonHeaders,
            body: JSON.stringify(credentials)
        }
        const request = new Request(this.httpClient.webApiUrl + "/login", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    logout = async (accessToken, refreshToken) => {
        const options = {
            method: "POST",
            headers: this.httpClient.appJsonHeaders,
            body: JSON.stringify({
                accessToken,
                refreshToken
            })
        }
        const request = new Request(this.httpClient.webApiUrl + "/logout", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    create = async (user) => {
        const options = {
            method: "POST",
            headers: this.httpClient.appJsonHeaders,
            body: this.httpClient.createBodyWithTokens({
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                password: user.password,
                role_id: user.role_id,
                phone: user.phone
            })
        }
        const request = new Request(this.httpClient.webApiUrl + "/register", options);
        let response = await (fetch(request));
        let data = await response.json();
        return data;
    }

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (user) => this.httpClient.update(
        user.id,
        this.httpClient.createBodyWithTokens({
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role_id: user.role_id,
            phone: user.phone
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));

    requestResetPassword = async (email) => this.httpClient.requestResetPassword(email);

    resetPassword = async (data) => this.httpClient.resetPassword(data);
}