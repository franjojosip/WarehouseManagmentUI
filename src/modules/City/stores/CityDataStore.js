import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class CityDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("city");
    }

    create = async (city) => this.httpClient.create(
        this.httpClient.createBodyWithTokens({
            name: city.name,
            zip_code: city.zip_code
        }, true))

    get = async () => this.httpClient.get(this.httpClient.createBodyWithTokens({}));

    update = async (city) => this.httpClient.update(
        city.id,
        this.httpClient.createBodyWithTokens({
            name: city.name,
            zip_code: city.zip_code
        }, true))

    delete = async (id) => this.httpClient.delete(id, this.httpClient.createBodyWithTokens({}, true));
}