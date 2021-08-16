import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import LocationViewStore from '../stores/LocationViewStore'
import Table from '../../../common/components/Table/Table';
import ModalLocation from '../components/ModalLocation';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Location.css";

@inject(
    i => ({
        viewStore: new LocationViewStore(i.rootStore)
    })
)

@observer
class Location extends React.Component {
    render() {
        const { isLoaderVisible, cityFilter, onCityFilterChange, onResetFilterClick, errorMessage, cities, title, clickedLocation, onCityChange, columns, rows, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onNameChange, onLocationClicked, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.name}</td>
                <td className="cell">{element.city_name}</td>
                <td className="cell zipCode">{element.zip_code}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onLocationClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btnAction btn-primary btn-rounded btn-sm my-0">
                                Izmijeni
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onLocationClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btnAction btn-danger btn-rounded btn-sm my-0">
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
                    <div className="col-md-3 filterColumn">
                        <span id="filterTitle">FILTERI</span>
                    </div>
                    <div className="col-md-3 filterColumn">
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuPageSizeSecond"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {pageSize}
                        </button>
                        <div className="dropdown-menu pagesize" aria-labelledby="dropdownMenuPageSizeSecond">
                            <button className="dropdown-item" onClick={() => onChangePageSize(5)} type="button">5</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(10)} type="button">10</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(15)} type="button">15</button>
                        </div>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        <DropdownButton style={{ margin: "auto" }} variant="light" title={cityFilter.name ? cityFilter.name : "Svi gradovi"}>
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
        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalLocation modalTarget="modalTargetAdd" errorMessage={errorMessage} cities={cities} onSubmit={onCreateClick} name={clickedLocation.name} city_name={clickedLocation.city_name} onNameChange={onNameChange} onCityChange={onCityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalLocation modalTarget="modalTargetEdit" errorMessage={errorMessage} cities={cities} onSubmit={onEditClick} name={clickedLocation.name} city_name={clickedLocation.city_name} onNameChange={onNameChange} onCityChange={onCityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalLocation modalTarget="modalTargetDelete" errorMessage={errorMessage} cities={cities} onSubmit={onDeleteClick} name={clickedLocation.name} city_name={clickedLocation.city_name} onNameChange={onNameChange} onCityChange={onCityChange} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onLocationClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )
    }
}

export default Location;