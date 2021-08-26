import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class RecieptDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("stocktaking");
    }

    create = async (stocktaking) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            warehouse_id: stocktaking.warehouse_id,
            product_id: stocktaking.product_id,
            user_id: stocktaking.user_id,
            counted_quantity: stocktaking.quantity
        }))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (stocktaking) => this.httpClient.update(
        stocktaking.id,
        this.httpClient.createBodyWithTokens({
            warehouse_id: stocktaking.warehouse_id,
            product_id: stocktaking.product_id,
            user_id: stocktaking.user_id,
            counted_quantity: stocktaking.quantity
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}));

    submit = async (id) => this.httpClient.submit(id, this.httpClient.createBodyWithTokens({}));

    submitAll = async (ids) => this.httpClient.submitAll(this.httpClient.createBodyWithTokens({ stocktaking_ids: ids }));

    report = async (start_date, end_date, city_id, location_id, warehouse_id) => this.httpClient.report(this.httpClient.createBodyWithTokens({ start_date: start_date, end_date: end_date, city_id: city_id, location_id: location_id, warehouse_id: warehouse_id }));
}