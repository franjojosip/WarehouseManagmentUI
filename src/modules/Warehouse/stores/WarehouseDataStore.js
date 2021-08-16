import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class WarehouseDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("warehouse");
    }

    create = async (warehouse) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: warehouse.name,
            location_id: warehouse.location_id,
            users: warehouse.users.length > 0 ? warehouse.users.map(user => user.id) : []
        }))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (warehouse) => this.httpClient.update(
        warehouse.id,
        this.httpClient.createBodyWithTokens({
            name: warehouse.name,
            location_id: warehouse.location_id,
            users: warehouse.users.length > 0 ? warehouse.users.map(user => user.id) : []
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, false));
}