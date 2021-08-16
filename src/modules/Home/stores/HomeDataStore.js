import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class HomeDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("home");
    }
    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}, true));
}