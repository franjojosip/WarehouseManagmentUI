import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import HomeViewStore from '../stores/HomeViewStore';
import { ToastContainer } from 'react-toastify';

import "../styles/Home.css";
import SideBarViewStore from '../../../common/components/Navigation/Sidebar/SideBarViewStore';
import { getUser } from '../../../common/components/LocalStorage';

@inject(
    i => ({
        viewStore: new HomeViewStore(i.rootStore),
        sidebarViewStore: new SideBarViewStore(i.rootStore)
    })
)

@observer
class Home extends React.Component {
    render() {
        const { isLoaderVisible, data } = this.props.viewStore;
        const { onNavigate } = this.props.sidebarViewStore;

        let user = getUser();
        let isUserAdmin = user && user.id != "" && user.role == "Administrator";

        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <div className="row homeRow">
                    <div className="col-md-3 homeCard">
                        <a onClick={(e) => { e.preventDefault(); onNavigate("reciept") }} className="data-card">
                            <h3>{data.total_reciepts}</h3>
                            <h4>UKUPNO PREUZIMANJA</h4>
                            <p>Ukupno preuzimanja ovaj mjesec</p>
                            <span className="link-text">
                                Prikaži više
                                <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z" fill="#2e3c40" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    <div className="col-md-3 homeCard">
                        <a onClick={(e) => { e.preventDefault(); onNavigate("stocktaking") }} className="data-card">
                            <h3>{data.total_stocktakings}</h3>
                            <h4>UKUPNO INVENTURA</h4>
                            <p>Ukupno inventura ovaj mjesec</p>
                            <span className="link-text">
                                Prikaži više
                                <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z" fill="#2e3c40" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    <div className="col-md-3 homeCard">
                        <a onClick={(e) => { e.preventDefault(); onNavigate("entry") }} className="data-card">
                            <h3>{data.total_entries}</h3>
                            <h4>UKUPNO UNOSA U SKLADIŠTE</h4>
                            <p>Ukupno unosa u skladište ovaj mjesec</p>
                            <span className="link-text">
                                Prikaži više
                                <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z" fill="#2e3c40" />
                                </svg>
                            </span>
                        </a>
                    </div>
                    {
                        isUserAdmin ?
                            <div className="col-md-3 homeCard">
                                <a onClick={(e) => { e.preventDefault(); onNavigate("user") }} className="data-card">
                                    <h3>{data.total_users}</h3>
                                    <h4>UKUPNO ZAPOSLENIKA</h4>
                                    <p>Ukupan broj zaposlenika u skladištima</p>
                                    <span className="link-text">
                                        Prikaži više
                                        <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z" fill="#2e3c40" />
                                        </svg>
                                    </span>
                                </a>
                            </div>
                            :
                            null
                    }
                </div>
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        );
    }
}

export default Home;