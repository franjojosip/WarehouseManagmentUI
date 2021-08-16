import { action } from "mobx";

class SideBarViewStore {
    constructor(rootStore) {
        this.routerStore = rootStore.routerStore;
        this.onNavigate = this.onNavigate.bind(this);

        let selectedRoute = window.location.pathname.substring(1, window.location.pathname.length);
        this.route = "";
        this.subroute = "";

        if (selectedRoute === "warehouse" || selectedRoute === "stock" || selectedRoute === "entry") {
            this.route = "warehouses";
        }
        else if (selectedRoute === "product" || selectedRoute === "category" || selectedRoute === "subcategory" || selectedRoute === "packaging") {
            this.route = "products";
        }
        else if (selectedRoute === "city" || selectedRoute === "location") {
            this.route = "cities";
        }
        else if (selectedRoute === "user" || selectedRoute === "location") {
            this.route = "users";
        }
        else if (selectedRoute === "reciept") {
            this.route = "reciepts";
        }
        else if (selectedRoute === "stocktaking") {
            this.route = "stocktakings";
        }
        else if (selectedRoute === "notificationlog" || selectedRoute === "notificationsettings" || selectedRoute === "schedule") {
            this.route = "notifications";
        }
        else {
            this.route = "home";
        }
        this.subroute = selectedRoute;
    }

    @action
    onNavigate(route) {
        this.routerStore.goTo(route);
    }

}

export default SideBarViewStore;