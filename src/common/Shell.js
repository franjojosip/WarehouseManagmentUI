import React from 'react';
import { inject } from 'mobx-react';
import { RouterView } from 'mobx-state-router';
import LoginPage from "../modules/Auth/pages/Login";
import UserPage from "../modules/Auth/pages/User";
import ForgotPasswordPage from "../modules/Auth/pages/ForgotPassword";
import ResetPasswordPage from "../modules/Auth/pages/ResetPassword";
import NotFoundPage from "../modules/NotFound/pages/NotFound";
import CityPage from "../modules/City/pages/City";
import PackagingPage from "../modules/Packaging/pages/Packaging";
import CategoryPage from "../modules/Category/pages/Category";
import SubcategoryPage from "../modules/Subcategory/pages/Subcategory";
import ProductPage from "../modules/Product/pages/Product";
import LocationPage from "../modules/Location/pages/Location";
import WarehousePage from "../modules/Warehouse/pages/Warehouse";
import RecieptPage from "../modules/Reciept/pages/Reciept";
import StockPage from "../modules/Stock/pages/Stock";
import StocktakingPage from "../modules/Stocktaking/pages/Stocktaking";
import EntryPage from "../modules/Entry/pages/Entry";
import NotificationLogPage from "../modules/Notification/pages/NotificationLog";
import NotificationSettingPage from "../modules/Notification/pages/NotificationSetting";
import HomePage from "../modules/Home/pages/Home";
import SchedulePage from "../modules/Schedule/pages/Schedule";

const viewMap = {
    home: <HomePage />,
    login: <LoginPage />,
    user: <UserPage />,
    forgotpassword: <ForgotPasswordPage />,
    resetpassword: <ResetPasswordPage />,
    city: <CityPage />,
    packaging: <PackagingPage />,
    category: <CategoryPage />,
    subcategory: <SubcategoryPage />,
    product: <ProductPage />,
    location: <LocationPage />,
    warehouse: <WarehousePage />,
    reciept: <RecieptPage />,
    stock: <StockPage />,
    stocktaking: <StocktakingPage />,
    schedule: <SchedulePage />,
    entry: <EntryPage />,
    notificationlog: <NotificationLogPage />,
    notificationsettings: <NotificationSettingPage />,
    notFound: <NotFoundPage />,
};

export const Shell = inject('rootStore')(
    class extends React.Component {
        render() {
            const { rootStore } = this.props;
            const { routerStore } = rootStore;

            return <RouterView routerStore={routerStore} viewMap={viewMap} />;
        }
    }
);
