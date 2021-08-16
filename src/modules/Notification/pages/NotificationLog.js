import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import NotificationViewStore from '../stores/NotificationViewStore'
import Table from '../../../common/components/Table/Table';
import ModalNotificationLog from '../components/ModalNotificationLog';
import ModalNotificationLogShow from '../components/ModalNotificationLogShow';
import { ToastContainer } from 'react-toastify';
import moment from "moment";

import "../styles/Notification.css";
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';

@inject(
    i => ({
        viewStore: new NotificationViewStore(i.rootStore)
    })
)

@observer
class Notification extends React.Component {
    render() {
        const { isLoaderVisible, types, notificationTypeFilter, onNotificationTypeFilterChange, onResetFilterClick, title, clickedNotificationLog, onNotificationClicked, columns, rows, page, pageSize, totalPages, previousEnabled, nextEnabled, onPageClick, onChangePageSize, onPreviousPageClick, onNextPageClick, onDeleteClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.subject}</td>
                <td className="cell">{element.notification_type_name}</td>
                <td className="cell">{element.email}</td>
                <td className="cell">{element.date_created ? moment(element.date_created).format("DD/MM/YYYY HH:mm") : null}</td>
                <td className="cell">{element.data.substring(0, 20) + "..."}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onNotificationClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm my-0">
                                Obriši
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onNotificationClicked(element, false)} data-toggle="modal" data-target="#modalTargetShow" className="btn btnAction btn-info btn-rounded btn-sm my-0">
                                Prikaži
                            </button>
                            :
                            null
                    }
                </td>
            </tr>);
        });
        if (tableRows.length === 0) {
            tableRows.push(<tr key="noData">
                <td className="cell">Nema podataka</td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
            </tr>);
        }
        let filterRow = (
            <div className="filterCard" style={{ marginBottom: 10, marginTop: 40 }}>
                <div className="row">
                    <div className="col-md-2 filterColumn">
                        <span id="filterTitle">FILTERI</span>
                    </div>
                    <div className="col-md-3 filterColumn">
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuPageSizeSecond" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {pageSize}
                        </button>
                        <div className="dropdown-menu pagesize" aria-labelledby="dropdownMenuPageSizeSecond">
                            <button className="dropdown-item" onClick={() => onChangePageSize(5)} type="button">5</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(10)} type="button">10</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(15)} type="button">15</button>
                        </div>
                    </div>
                    <div className='col-md-4 filterColumn'>
                        <DropdownButton style={{ margin: "auto" }} className="vertical-center lowerDropdown" variant="light" title={notificationTypeFilter.name ? notificationTypeFilter.name : "Svi tipovi notifikacija"} style={{ marginBottom: 10 }}>
                            <Dropdown.Item key="default_type" onSelect={() => onNotificationTypeFilterChange({ notification_type_id: "", notification_type_name: "" })}>Svi tipovi notifikacija</Dropdown.Item>
                            {types.map((type) => {
                                return <Dropdown.Item key={type.notification_type_id} onSelect={() => onNotificationTypeFilterChange(type)}>{type.notification_type_name}</Dropdown.Item>;
                            })
                            }
                        </DropdownButton>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                    </div>
                </div>
            </div>);
        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalNotificationLog modalTarget="modalTargetDelete" data={clickedNotificationLog.data} email={clickedNotificationLog.email} date_created={clickedNotificationLog.date_created} notification_type_name={clickedNotificationLog.notification_type_name} onSubmit={onDeleteClick} />
                <ModalNotificationLogShow modalTarget="modalTargetShow" data={clickedNotificationLog.data} email={clickedNotificationLog.email} date_created={clickedNotificationLog.date_created} notification_type_name={clickedNotificationLog.notification_type_name} />
                <Table hideAddButton={true} filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )
    }
}

export default Notification;