import React from "react";
import HttpClient from "../../../common/HttpClient";

export default class NotificationDataStore extends React.Component {
    constructor() {
        super();
        this.httpClientNotificationLog = new HttpClient("notification_log");
        this.httpClientNotificationType = new HttpClient("notification_type");
        this.httpClientNotificationSetting = new HttpClient("notification_settings");
    }
    createNotificationLog = async () => this.httpClientNotificationLog.get(this.httpClientNotificationLog.createBodyWithTokens({}, true));

    get = async () => this.httpClientNotificationLog.get(this.httpClientNotificationLog.createBodyWithTokens({}, true));

    delete = async (id) => this.httpClientNotificationLog.delete(id, this.httpClientNotificationLog.createBodyWithTokens({}, true));

    getNotificationTypes = async () => this.httpClientNotificationType.get(this.httpClientNotificationType.createBodyWithTokens({}));


    createNotificationSetting = async (notificationSetting) => this.httpClientNotificationSetting.create(
        this.httpClientNotificationSetting.createBodyWithTokens({
            day_of_week: notificationSetting.day_of_week_id,
            time: notificationSetting.time,
            notification_type_id: notificationSetting.notification_type_id,
            email: notificationSetting.email,
        }))

    getNotificationSetting = async () => this.httpClientNotificationSetting.get(this.httpClientNotificationSetting.createBodyWithTokens({}, true));

    updateNotificationSetting = async (notificationSetting) => this.httpClientNotificationSetting.update(
        notificationSetting.id,
        this.httpClientNotificationSetting.createBodyWithTokens({
            day_of_week: notificationSetting.day_of_week_id,
            time: notificationSetting.time,
            notification_type_id: notificationSetting.notification_type_id,
            email: notificationSetting.email,
        }))

    deleteNotificationSetting = async (id) => this.httpClientNotificationSetting.delete(id, this.httpClientNotificationSetting.createBodyWithTokens({}, true));

}