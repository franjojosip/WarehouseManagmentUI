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

    submitAll = async (ids) => this.httpClient.submitAll(this.httpClient.createBodyWithTokens({ reciept_ids: ids }));

    report = async (start_date, end_date, city_id, location_id, warehouse_id) => this.httpClient.report(this.httpClient.createBodyWithTokens({ start_date: start_date, end_date: end_date, city_id: city_id, location_id: location_id, warehouse_id: warehouse_id }));
}