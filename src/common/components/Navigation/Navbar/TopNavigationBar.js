import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { inject } from 'mobx-react';
import AuthenticationViewStore from "../../../../modules/Auth/stores/AuthenticationViewStore";
import { getUser } from '../../LocalStorage';
import logo from "./images/logout.png"
import "./styles/TopNavigationBar.css"


@inject(
    i => ({
        viewStore: new AuthenticationViewStore(i.rootStore)
    })
)
class TopNavigationBar extends React.Component {
    render() {
        const { onLogout } = this.props.viewStore;
        let user = getUser();
        return (
            <div className="navbar navbar-light fixed-top">
                <Nav.Link id="welcomeMessage" style={{ float: "left", color: "white" }} href="">Dobrodošao nazad, {user.fname} {user.lname}!</Nav.Link>
                <Nav.Link id="link" onClick={() => onLogout()}>
                    <span id="logout">Odjavi se</span>
                    <img src={logo} />
                </Nav.Link>
            </div>
        );
    }
}

export default TopNavigationBar;