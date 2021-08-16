import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class RecieptDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("reciept");
    }

    create = async (reciept) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            warehouse_id: reciept.warehouse_id,
            product_id: reciept.product_id,
            user_id: reciept.user_id,
            quantity: reciept.quantity
        }))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (reciept) => this.httpClient.update(
        reciept.id,
        this.httpClient.createBodyWithTokens({
            warehouse_id: reciept.warehouse_id,
            product_id: reciept.product_id,
            user_id: reciept.user_id,
            quantity: reciept.quantity
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}));

    submit = async (id) => this.httpClient.submit(id, this.httpClient.createBodyWithTokens({}));

    report = async (startDate, endDate) => this.httpClient.report(this.httpClient.createBodyWithTokens({ start_date: startDate, end_date: endDate }));
}