import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class EntryDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("entry");
    }

    create = async (entry) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            warehouse_id: entry.warehouse_id,
            product_id: entry.product_id,
            user_id: entry.user_id,
            quantity: entry.quantity
        }))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (entry) => this.httpClient.update(
        entry.id,
        this.httpClient.createBodyWithTokens({
            warehouse_id: entry.warehouse_id,
            product_id: entry.product_id,
            user_id: entry.user_id,
            quantity: entry.quantity
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}));

    submit = async (id) => this.httpClient.submit(id, this.httpClient.createBodyWithTokens({}));
    
    report = async (startDate, endDate) => this.httpClient.report(this.httpClient.createBodyWithTokens({ start_date: startDate, end_date: endDate }));
}