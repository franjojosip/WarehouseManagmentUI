import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class PackagingDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("packaging");
    }

    create = async (packaging) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: packaging.name
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (packaging) => this.httpClient.update(
        packaging.id,
        this.httpClient.createBodyWithTokens({
            name: packaging.name
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));
}