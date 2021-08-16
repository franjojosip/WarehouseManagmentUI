import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import NotificationSettingViewStore from '../stores/NotificationSettingViewStore'
import Table from '../../../common/components/Table/Table';
import ModalNotificationSetting from '../components/ModalNotificationSetting';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Notification.css";

@inject(
    i => ({
        viewStore: new NotificationSettingViewStore(i.rootStore)
    })
)

@observer
class NotificationSetting extends React.Component {
    render() {
        const { isLoaderVisible, notifcationTypeFilter, onEmailChange, onNotificationTypeFilterChange, onResetFilterClick, title, clickedNotificationSetting, notification_types, days, columns, rows, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onDayOfWeekChange, onTimeChange, onNotificationTypeChange, onPageClick, onChangePageSize, onNotificationSettingClicked, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.notification_type_name}</td>
                <td className="cell">{element.notification_type_name == "Tjedna obavijest" ? element.day_of_week_name : null}</td>
                <td className="cell">{element.time}</td>
                <td className="cell">{element.email}</td>
                <td className="cell btnCell">
                    {
                        element.id ?
                            <button type="button" onClick={() => onNotificationSettingClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btnAction btn-primary btn-rounded btn-sm my-0">
                                Edit
                            </button>
                            : null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id ?
                            <button type="button" onClick={() => onNotificationSettingClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btnAction btn-danger btn-rounded btn-sm my-0">
                                Obriši
                            </button>
                            : null
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
            </tr>);
        }
        let filterRow = (
            <div className="filterCard" style={{ marginBottom: 10 }}>
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
                        <DropdownButton style={{ margin: "auto" }} className="vertical-center lowerDropdown" variant="light" title={notifcationTypeFilter.name ? notifcationTypeFilter.name : "Svi tipovi notifikacije"} style={{ marginBottom: 10 }}>
                            <Dropdown.Item key="default_notification_setting" onSelect={() => onNotificationTypeFilterChange({ notification_type_id: "", notification_type_name: "" })}>Svi tipovi notifikacije</Dropdown.Item>
                            {notification_types.map((notification_type) => {
                                return <Dropdown.Item key={notification_type.notification_type_id} onSelect={() => onNotificationTypeFilterChange(notification_type)}>{notification_type.notification_type_name}</Dropdown.Item>;
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
                <ModalNotificationSetting modalTarget="modalTargetAdd" onEmailChange={onEmailChange} days={days} notification_types={notification_types} day_of_week_name={clickedNotificationSetting.day_of_week_name} time={clickedNotificationSetting.time} email={clickedNotificationSetting.email} notification_type_name={clickedNotificationSetting.notification_type_name} onDayOfWeekChange={onDayOfWeekChange} onTimeChange={onTimeChange} onNotificationTypeChange={onNotificationTypeChange} onSubmit={onCreateClick} isSubmitDisabled={isSubmitDisabled} />
                <ModalNotificationSetting modalTarget="modalTargetEdit" onEmailChange={onEmailChange} days={days} notification_types={notification_types} day_of_week_name={clickedNotificationSetting.day_of_week_name} time={clickedNotificationSetting.time} email={clickedNotificationSetting.email} notification_type_name={clickedNotificationSetting.notification_type_name} onDayOfWeekChange={onDayOfWeekChange} onTimeChange={onTimeChange} onNotificationTypeChange={onNotificationTypeChange} onSubmit={onEditClick} isSubmitDisabled={isSubmitDisabled} />
                <ModalNotificationSetting modalTarget="modalTargetDelete" onEmailChange={onEmailChange} days={days} notification_types={notification_types} day_of_week_name={clickedNotificationSetting.day_of_week_name} time={clickedNotificationSetting.time} email={clickedNotificationSetting.email} notification_type_name={clickedNotificationSetting.notification_type_name} onDayOfWeekChange={onDayOfWeekChange} onTimeChange={onTimeChange} onNotificationTypeChange={onNotificationTypeChange} onSubmit={onDeleteClick} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onNotificationSettingClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout >
        )
    }
}

export default NotificationSetting;