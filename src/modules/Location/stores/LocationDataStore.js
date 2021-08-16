import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class LocationDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("location");
    }

    create = async (location) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: location.name,
            city_id: location.city_id
        }))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (location) => this.httpClient.update(
        location.id,
        this.httpClient.createBodyWithTokens({
            name: location.name,
            city_id: location.city_id
        }))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}));
}