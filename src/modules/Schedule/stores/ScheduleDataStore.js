import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class ScheduleDataStore extends React.Component {
    constructor() {
        super();
        this.httpClient = new HttpClient("schedule");
    }

    refreshSchedule = async (password) => this.httpClient.refreshSchedule(
        this.httpClient.createBodyWithTokens({
            password
        }, true))
}