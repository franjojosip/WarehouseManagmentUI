import React from 'react';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { inject } from 'mobx-react';
import SideBarViewStore from "./SideBarViewStore";
import { getUser } from '../../LocalStorage';
import "./styles/SideBar.css"

@inject(
    i => ({
        viewStore: new SideBarViewStore(i.rootStore)
    })
)
class SideBar extends React.Component {
    render() {
        const { route, subroute, onNavigate } = this.props.viewStore;
        const loggedUser = getUser();
        let isLoggedAdmin = loggedUser && loggedUser.role.toLowerCase() == "administrator";

        let textStyle = {
            color: "black",
            textAlign: "center",
            marginTop: 10
        };
        return (
            <SideNav
                className="sideNavbar"
                onSelect={(route) => {
                    if (route && route.length > 0) {
                        onNavigate(route);
                    }
                }}
            >
                <SideNav.Nav defaultSelected={route} style={{ marginTop: 20 }}>
                    <NavItem eventKey="home">
                        <NavIcon style={{ paddingTop: 5 }}>
                            <i className="fa fa-fw fa-home" />
                        </NavIcon>
                        <NavText style={textStyle}>
                            Naslovnica
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="warehouses">
                        <NavIcon style={{ paddingTop: 5 }}>
                            <i className="fa fa-fw fa-warehouse" />
                        </NavIcon>
                        <NavText style={textStyle}>
                            Skladište
                        </NavText>
                        {
                            isLoggedAdmin ?
                                <NavItem eventKey="warehouse" className={subroute == "warehouse" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Pregled skladišta
                                    </NavText>
                                </NavItem>
                                : null
                        }
                        <NavItem eventKey="stock" className={subroute == "stock" ? "active" : null}>
                            <NavText style={textStyle}>
                                Stanje skladišta
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="entry" className={subroute == "entry" ? "active" : null}>
                            <NavText style={textStyle}>
                                Unos u skladište
                            </NavText>
                        </NavItem>
                    </NavItem>
                    {
                        isLoggedAdmin ?
                            <NavItem eventKey="products">
                                <NavIcon style={{ paddingTop: 5 }}>
                                    <i className="fa fa-fw fa-boxes" />
                                </NavIcon>
                                <NavText style={textStyle}>
                                    Proizvodi
                                </NavText>
                                <NavItem eventKey="product" className={subroute == "product" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Pregled proizvoda
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="category" className={subroute == "category" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Kategorije
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="subcategory" className={subroute == "subcategory" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Potkategorije
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="packaging" className={subroute == "packaging" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Ambalaža
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            : null
                    }
                    {
                        isLoggedAdmin ?
                            <NavItem eventKey="cities">
                                <NavIcon style={{ paddingTop: 5 }}>
                                    <i className="fa fa-fw fa-city" />
                                </NavIcon>
                                <NavText style={textStyle}>
                                    Gradovi
                                </NavText>
                                <NavItem eventKey="city" className={subroute == "city" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Pregled gradova
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="location" className={subroute == "location" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Lokacije
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            : null
                    }
                    {
                        isLoggedAdmin ?
                            <NavItem eventKey="user" className="tooltipNavbar">
                                <NavIcon style={{ paddingTop: 5 }}>
                                    <i className="fa fa-fw fa-users" />
                                </NavIcon>
                                <div className={subroute == "user" ? "tooltiptext activeTooltip" : "tooltiptext"} onClick={
                                    () => onNavigate("user")
                                }>Korisnici</div>
                            </NavItem>
                            : null
                    }
                    <NavItem eventKey="reciept" className="tooltipNavbar">
                        <NavIcon style={{ paddingTop: 5 }}>
                            <i className="fa fa-fw fa-receipt" />
                        </NavIcon>
                        <div className={subroute == "reciept" ? "tooltiptext activeTooltip" : "tooltiptext"} onClick={
                            () => onNavigate("reciept")
                        }>Preuzimanja</div>
                    </NavItem>
                    <NavItem eventKey="stocktaking" className="tooltipNavbar">
                        <NavIcon style={{ paddingTop: 5 }}>
                            <i className="fa fa-fw fa-cubes" />
                        </NavIcon>
                        <div className={subroute == "stocktaking" ? "tooltiptext activeTooltip" : "tooltiptext"} onClick={
                            () => onNavigate("stocktaking")
                        }>Inventure</div>
                    </NavItem>
                    {
                        isLoggedAdmin ?
                            <NavItem eventKey="notifications">
                                <NavIcon style={{ paddingTop: 5 }}>
                                    <i className="fa fa-fw fa-bell" />
                                </NavIcon>
                                <NavText style={textStyle}>
                                    Obavijesti
                                </NavText>
                                <NavItem eventKey="notificationlog" className={subroute == "notificationlog" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Dnevnik obavijesti
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="notificationsettings" className={subroute == "notificationsettings" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Postavke obavijesti
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="schedule" className={subroute == "schedule" ? "active" : null}>
                                    <NavText style={textStyle}>
                                        Osvježenje obavijesti
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            : null
                    }
                </SideNav.Nav>
            </SideNav>

        );
    }
}

export default SideBar;