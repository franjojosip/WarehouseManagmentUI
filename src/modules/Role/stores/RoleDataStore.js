import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class RoleDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("role");
    }
    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));
}