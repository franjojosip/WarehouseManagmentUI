import { RouterState, RouterStore } from 'mobx-state-router';
import { routes } from "./Routes";
import AuthenticationModuleStore from "../modules/Auth/stores/AuthenticationModuleStore";
import CityModuleStore from "../modules/City/stores/CityModuleStore";
import PackagingModuleStore from "../modules/Packaging/stores/PackagingModuleStore";
import CategoryModuleStore from "../modules/Category/stores/CategoryModuleStore";
import SubcategoryModuleStore from "../modules/Subcategory/stores/SubcategoryModuleStore";
import ProductModuleStore from "../modules/Product/stores/ProductModuleStore";
import LocationModuleStore from "../modules/Location/stores/LocationModuleStore";
import WarehouseModuleStore from "../modules/Warehouse/stores/WarehouseModuleStore";
import RecieptModuleStore from "../modules/Reciept/stores/RecieptModuleStore";
import StockModuleStore from "../modules/Stock/stores/StockModuleStore";
import StocktakingModuleStore from "../modules/Stocktaking/stores/StocktakingModuleStore";
import EntryModuleStore from "../modules/Entry/stores/EntryModuleStore";
import NotificationModuleStore from "../modules/Notification/stores/NotificationModuleStore";
import RoleModuleStore from "../modules/Role/stores/RoleModuleStore";
import HomeModuleStore from "../modules/Home/stores/HomeModuleStore";
import ScheduleModuleStore from "../modules/Schedule/stores/ScheduleModuleStore";

const notFound = new RouterState('notFound');

export class RootStore {

    constructor() {
        this.routerStore = new RouterStore(this, routes, notFound);

        this.authenticationModuleStore = new AuthenticationModuleStore(this);
        this.roleModuleStore = new RoleModuleStore(this);
        this.cityModuleStore = new CityModuleStore(this);
        this.packagingModuleStore = new PackagingModuleStore(this);
        this.categoryModuleStore = new CategoryModuleStore(this);
        this.subcategoryModuleStore = new SubcategoryModuleStore(this);
        this.productModuleStore = new ProductModuleStore(this);
        this.locationModuleStore = new LocationModuleStore(this);
        this.warehouseModuleStore = new WarehouseModuleStore(this);
        this.recieptModuleStore = new RecieptModuleStore(this);
        this.stockModuleStore = new StockModuleStore(this);
        this.stocktakingModuleStore = new StocktakingModuleStore(this);
        this.entryModuleStore = new EntryModuleStore(this);
        this.notificationModuleStore = new NotificationModuleStore(this);
        this.homeModuleStore = new HomeModuleStore(this);
        this.scheduleModuleStore = new ScheduleModuleStore(this);
    }
}