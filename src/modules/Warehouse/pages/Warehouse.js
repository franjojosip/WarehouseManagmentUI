import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import WarehouseViewStore from '../stores/WarehouseViewStore'
import Table from '../../../common/components/Table/Table';
import ModalWarehouse from '../components/ModalWarehouse';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Warehouse.css";

@inject(
    i => ({
        viewStore: new WarehouseViewStore(i.rootStore)
    })
)

@observer
class Warehouse extends React.Component {
    render() {
        const { cityFilter, onCityFilterChange, onResetFilterClick, clickedUsers, isLoaderVisible, onMultiSelect, errorMessage, title, users, clickedWarehouse, onLocationChange, columns, rows, filteredLocations, cities, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onCityChange, onNameChange, onWarehouseClicked, onUserSelect, onUserRemove, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.name}</td>
                <td className="cell">{element.location_name}</td>
                <td className="cell">{element.city_name}</td>
                <td className="cell">{element.users ? element.users.map((user) => user.name).join(", ") : null}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onWarehouseClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btnAction btn-primary btn-rounded btn-sm my-0">
                                Izmijeni
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onWarehouseClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btnAction btn-danger btn-rounded btn-sm my-0">
                                Obriši
                            </button>
                            :
                            null
                    }
                </td>
            </tr>);
        });

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
                        <DropdownButton style={{ margin: "auto" }} className="vertical-center" variant="light" title={cityFilter.name ? cityFilter.name : "Svi gradovi"}>
                            <Dropdown.Item key="default_city" onSelect={() => onCityFilterChange({ city_id: "", city_name: "" })}>Svi gradovi</Dropdown.Item>
                            {cities.map((city) => {
                                return <Dropdown.Item key={city.city_id} onSelect={() => onCityFilterChange(city)}>{city.city_name}</Dropdown.Item>;
                            })
                            }
                        </DropdownButton>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                    </div>
                </div>
            </div>);

        let mappedUsers = users ? users.map(user => { return { id: user.id, name: user.name } }) : [];

        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalWarehouse modalTarget="modalTargetAdd" onMultiSelect={onMultiSelect} errorMessage={errorMessage} users={mappedUsers} selectedUsers={clickedUsers} locations={filteredLocations} cities={cities} onSelect={onUserSelect} onRemove={onUserRemove} onSubmit={onCreateClick} name={clickedWarehouse.name} city_name={clickedWarehouse.city_name} location_name={clickedWarehouse.location_name} onNameChange={onNameChange} onCityChange={onCityChange} onLocationChange={onLocationChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalWarehouse modalTarget="modalTargetEdit" onMultiSelect={onMultiSelect} errorMessage={errorMessage} users={mappedUsers} selectedUsers={clickedUsers} locations={filteredLocations} cities={cities} onSelect={onUserSelect} onRemove={onUserRemove} onSubmit={onEditClick} name={clickedWarehouse.name} city_name={clickedWarehouse.city_name} location_name={clickedWarehouse.location_name} onNameChange={onNameChange} onCityChange={onCityChange} onLocationChange={onLocationChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalWarehouse modalTarget="modalTargetDelete" onMultiSelect={onMultiSelect} errorMessage={errorMessage} users={mappedUsers} selectedUsers={clickedUsers} locations={filteredLocations} cities={cities} onSelect={onUserSelect} onRemove={onUserRemove} onSubmit={onDeleteClick} name={clickedWarehouse.name} city_name={clickedWarehouse.city_name} location_name={clickedWarehouse.location_name} onNameChange={onNameChange} onCityChange={onCityChange} onLocationChange={onLocationChange} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onWarehouseClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )
    }
}

export default Warehouse;