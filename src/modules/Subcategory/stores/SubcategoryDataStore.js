import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class SubcategoryDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("subcategory");
    }

    create = async (subcategory) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: subcategory.name,
            category_id: subcategory.category_id
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (subcategory) => this.httpClient.update(
        subcategory.id,
        this.httpClient.createBodyWithTokens({
            name: subcategory.name,
            category_id: subcategory.category_id
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));

    submit = async (id) => this.httpClient.submit(id, this.httpClient.createBodyWithTokens({}));
}