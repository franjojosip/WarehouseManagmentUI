import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class CategoryDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("category");
    }

    create = async (category) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: category.name
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (category) => this.httpClient.update(
        category.id,
        this.httpClient.createBodyWithTokens({
            name: category.name
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));
}