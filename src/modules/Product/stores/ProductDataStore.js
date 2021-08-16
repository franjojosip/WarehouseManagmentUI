import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class ProductDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("product");
    }

    create = async (product) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: product.name,
            category_id: product.category_id,
            subcategory_id: product.subcategory_id !== "" ? product.subcategory_id : null,
            packaging_id: product.packaging_id !== "" ? product.packaging_id : null,
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (product) => this.httpClient.update(
        product.id,
        this.httpClient.createBodyWithTokens({
            name: product.name,
            category_id: product.category_id,
            subcategory_id: product.subcategory_id !== "" ? product.subcategory_id : null,
            packaging_id: product.packaging_id !== "" ? product.packaging_id : null,
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));
}