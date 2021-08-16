import moment from "moment";

export const saveUser = (user) => {
    user.logged_date = moment().format('DD/MM/YYYY');
    localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
    var user = JSON.parse(localStorage.getItem('user'));
    return user;
}

export const clearUser = () => {
    localStorage.removeItem('user');
}

export const clearStorage = () => {
    localStorage.clear();
}

export const isUserLoggedIn = () => {
    var user = JSON.parse(localStorage.getItem('user'));
    return user && user.id != "";
}

export const isUserAdmin = () => {
    var user = JSON.parse(localStorage.getItem('user'));
    return user && user.id != "" && user.role == "Administrator";
}

export const isUserTokenExpired = () => {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user && user.logged_date) {
        return moment().diff(moment(user.logged_date, "DD/MM/YYYY"), 'days') > 0;
    }
    else return true;
}