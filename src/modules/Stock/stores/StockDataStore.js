import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class StockDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("stock");
    }

    create = async (stock) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            warehouse_id: stock.warehouse_id,
            product_id: stock.product_id,
            quantity: stock.quantity,
            minimum_quantity: stock.min_quantity,
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (stock) => this.httpClient.update(
        stock.id,
        this.httpClient.createBodyWithTokens({
            warehouse_id: stock.warehouse_id,
            product_id: stock.product_id,
            quantity: stock.quantity,
            minimum_quantity: stock.min_quantity,
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));
}