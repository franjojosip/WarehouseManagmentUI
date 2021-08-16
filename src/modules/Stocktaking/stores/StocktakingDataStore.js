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
    
    report = async (startDate, endDate) => this.httpClient.report(this.httpClient.createBodyWithTokens({ start_date: startDate, end_date: endDate }));
}