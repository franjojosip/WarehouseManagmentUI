import { isUserLoggedIn, isUserAdmin, getUser, clearUser, isUserTokenExpired } from './components/LocalStorage';
import { RouterState } from 'mobx-state-router';


const checkUserAuthenticated = (fromState, toState, routerStore) => {
    if(isUserTokenExpired() && getUser() != null || getUser() == null){
        clearUser();
        return Promise.reject(new RouterState('login'));
    }

    if (isUserLoggedIn()) {
        if (!isUserAdmin() && (toState.routeName == "notificationlog" || toState.routeName == "notificationsettings")) {
            return Promise.reject(new RouterState('home'));
        }
        else if (toState.routeName == "login") {
            return Promise.reject(new RouterState('home'));
        }
        else {
            return Promise.resolve();
        }
    }
    else {
        return Promise.reject(new RouterState('login'));
    }
};

export const routes = [
    {
        name: 'home',
        pattern: '/',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'login',
        pattern: '/login',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'notFound',
        pattern: '/notfound',
    },
    {
        name: 'city',
        pattern: '/city',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'packaging',
        pattern: '/packaging',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'category',
        pattern: '/category',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'subcategory',
        pattern: '/subcategory',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'product',
        pattern: '/product',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'location',
        pattern: '/location',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'warehouse',
        pattern: '/warehouse',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'user',
        pattern: '/user',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'forgotpassword',
        pattern: '/forgotpassword'
    },
    {
        name: 'resetpassword',
        pattern: '/resetpassword'
    },
    {
        name: 'reciept',
        pattern: '/reciept',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'schedule',
        pattern: '/schedule',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'stock',
        pattern: '/stock',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'stocktaking',
        pattern: '/stocktaking',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'entry',
        pattern: '/entry',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'notificationlog',
        pattern: '/notificationlog',
        beforeEnter: checkUserAuthenticated
    },
    {
        name: 'notificationsettings',
        pattern: '/notificationsettings',
        beforeEnter: checkUserAuthenticated
    }
];