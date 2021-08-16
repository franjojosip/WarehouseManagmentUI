import React from 'react';
import TopNavigationBar from './Navigation/Navbar/TopNavigationBar';
import SideBar from './Navigation/Sidebar/SideBar';
import Loading from './Loading/Loading';

export default (props) => {
    return (
        <React.Fragment>
            <SideBar />
            <TopNavigationBar />
            <Loading visible={props.isLoaderVisible} />
            <div id="layout">
                {props.children}
            </div>
        </React.Fragment>
    )
}
