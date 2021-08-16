import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import RecieptViewStore from '../stores/RecieptViewStore'
import CollapsibleTable from '../../../common/components/Table/CollapsibleTable';
import ModalReciept from '../components/ModalReciept';
import ModalRecieptSubmit from '../components/ModalRecieptSubmit';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import "../styles/Reciept.css";
import { getUser } from '../../../common/components/LocalStorage';

@inject(
    i => ({
        viewStore: new RecieptViewStore(i.rootStore),
        rootStore: i.rootStore
    })
)
@observer
class Reciept extends React.Component {
    render() {
        const { errorMessage, onGeneratePdfClick, dateFilter, cityFilter, onCityFilterChange, onStartDateFilterChange, onEndDateFilterChange, onResetFilterClick, cities, filteredLocations, filteredWarehouses, products, onSubmitClick, clickedReciept, onClickedRow, parentColumns, childColumns, paginatedData, onRecieptClicked, onWarehouseChange, onCityChange, onLocationChange, onProductChange, onQuantityChange, isLoaderVisible, title, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let user = getUser();
        let isUserAdmin = user && user.id != "" && user.role == "Administrator";


        let tableParentColumns = parentColumns.map((element, i) => {
            return <th key={"parentColumn" + i} className="text-center cellHeader">{element}</th>
        });
        let tableChildColumns = childColumns.map((element, i) => {
            return <th key={"childColumn" + i} className="text-center cellHeaderTwo">{element}</th>
        });

        let tableNestedRows = (<tbody>
            <tr key="tableNestedRows">
                <td className="cell">Nema podataka</td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
                <td className="cell"></td>
            </tr>
        </tbody>);

        if (paginatedData.length > 0) {
            tableNestedRows = paginatedData.map((element, i) => {
                let parentRow = element.name.split("-");
                parentRow[0] = element.data.find(item => item.warehouse_id.toString() === parentRow[0]).warehouse_name;
                parentRow[1] = element.data.find(item => item.user_id.toString() === parentRow[1]).user_name;

                let nestedIndex = i;

                return (
                    <tbody key={"tbody" + i}>
                        <tr key={i} onClick={() => onClickedRow(nestedIndex)} className="accordion-toggle collapsed complexAccordion" style={{ backgroundColor: "#F2F2F2" }} id="accordion1" data-toggle="collapse" data-parent="#accordion1" data-target={"#row" + nestedIndex}>
                            <td className="complexCell"><Button className="btnShowMore">Prikaži</Button></td>
                            <td className="complexCell">{parentRow[0]}</td>
                            <td className="complexCell">{parentRow[1]}</td>
                            <td className="complexCell">{element.data[0].city_name}</td>
                            <td className="complexCell">{parentRow[2]}</td>
                        </tr>
                        <tr>
                            <td colSpan="12" className="hiddenRow">
                                <div className="collapse" id={"row" + i}>
                                    <table className="table table-bordered table-responsive-md table-striped text-center mb-0">
                                        <thead>
                                            <tr className="info">
                                                {tableChildColumns}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                element.data.map((item, i) => {
                                                    return (
                                                        <tr key={"element_data" + i}>
                                                            <td className="cell">{item.product_name}</td>
                                                            <td className="cell">{item.category_name}</td>
                                                            <td className="cell">{item.subcategory_name}</td>
                                                            <td className="cell">{item.packaging_name}</td>
                                                            <td className="cell">{item.quantity}</td>
                                                            <td className="nestedComplexCell">
                                                                {
                                                                    item.isSubmitted ?
                                                                        null
                                                                        :
                                                                        <button type="button" onClick={() => onRecieptClicked(item, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btn-primary btnAction btn-rounded btn-sm my-0">
                                                                            Izmijeni
                                                                        </button>
                                                                }
                                                            </td>
                                                            <td className="nestedComplexCell">
                                                                {
                                                                    item.isSubmitted ?
                                                                        null
                                                                        :
                                                                        <button type="button" onClick={() => onRecieptClicked(item, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm my-0">
                                                                            Obriši
                                                                        </button>
                                                                }
                                                            </td>
                                                            <td className="nestedComplexCell">
                                                                {
                                                                    item.isSubmitted ?
                                                                        <i className="fa fa-fw fa-check" style={{ fontSize: '1.4em' }} />
                                                                        :
                                                                        <button type="button" onClick={() => onRecieptClicked(item, false)} data-toggle="modal" data-target="#modalTargetSubmit" className="btn btn-info btnAction btn-rounded btn-sm my-0">
                                                                            Potvrdi
                                                                        </button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>
                            </td>
                        </tr>
                    </tbody>
                );
            })
        }

        let classes = makeStyles((theme) => ({
            container: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                width: 100,
            },
        }));
        let filterRow = null;
        if (isUserAdmin) {
            filterRow = (
                <div className="filterCard" style={{ marginBottom: 10 }}>
                    <div className="row firstRow">
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
                        <div className='col-md-3 filterColumn'>
                            <div className="dateText startDateText">
                                POČETNI DATUM
                            </div>
                            <TextField
                                id="startDate"
                                type="date"
                                format="DD/MM/YYYY"
                                value={dateFilter.startDate}
                                className={classes.textField}
                                onChange={(e) => onStartDateFilterChange(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                        <div className='col-md-3 filterColumn'>
                            <div className="dateText">
                                KRAJNJI DATUM
                            </div>
                            <TextField
                                id="endDate"
                                type="date"
                                format="DD/MM/YYYY"
                                value={dateFilter.endDate}
                                className={classes.textField}
                                onChange={(e) => onEndDateFilterChange(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-md-2 filterColumn'>
                        </div>
                        <div className='col-md-3 filterColumn'>
                            <DropdownButton style={{ margin: "auto" }} className="vertical-center lowerDropdown" variant="light" title={cityFilter.city_name != "" ? cityFilter.city_name : "Svi gradovi"} style={{ marginBottom: 10 }}>
                                <Dropdown.Item key="default_city" onSelect={() => onCityFilterChange({ city_id: "", city_name: "" })}>Svi gradovi</Dropdown.Item>
                                {cities.map((city) => {
                                    return <Dropdown.Item key={city.city_id} onSelect={() => onCityFilterChange(city)}>{city.city_name}</Dropdown.Item>;
                                })
                                }
                            </DropdownButton>
                        </div>
                        <div className='col-md-3 filterColumn'>
                            <Button className="btn btn-primary btnGenerate" onClick={(e) => { e.preventDefault(); onGeneratePdfClick() }}>Generiraj izvješće</Button>
                        </div>
                        <div className='col-md-3 filterColumn'>
                            <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                        </div>
                    </div>
                </div>);
        }
        else {
            filterRow = (
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
                        </div>
                        <div className='col-md-3 filterColumn'>
                            <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                        </div>
                    </div>
                </div>);
        }


        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalReciept modalTarget="modalTargetAdd" errorMessage={errorMessage} warehouses={filteredWarehouses} cities={cities} locations={filteredLocations} products={products} onSubmit={onCreateClick} warehouse_name={clickedReciept.warehouse_name} city_name={clickedReciept.city_name} location_name={clickedReciept.location_name} category_name={clickedReciept.category_name} subcategory_name={clickedReciept.subcategory_name} product_name={clickedReciept.product_name} packaging_name={clickedReciept.packaging_name} quantity={clickedReciept.quantity} onWarehouseChange={onWarehouseChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onProductChange={onProductChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalReciept modalTarget="modalTargetEdit" errorMessage={errorMessage} warehouses={filteredWarehouses} cities={cities} locations={filteredLocations} products={products} onSubmit={onEditClick} warehouse_name={clickedReciept.warehouse_name} city_name={clickedReciept.city_name} location_name={clickedReciept.location_name} category_name={clickedReciept.category_name} subcategory_name={clickedReciept.subcategory_name} product_name={clickedReciept.product_name} packaging_name={clickedReciept.packaging_name} quantity={clickedReciept.quantity} onWarehouseChange={onWarehouseChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onProductChange={onProductChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalReciept modalTarget="modalTargetDelete" errorMessage={errorMessage} warehouses={filteredWarehouses} cities={cities} locations={filteredLocations} products={products} onSubmit={onDeleteClick} warehouse_name={clickedReciept.warehouse_name} city_name={clickedReciept.city_name} location_name={clickedReciept.location_name} category_name={clickedReciept.category_name} subcategory_name={clickedReciept.subcategory_name} product_name={clickedReciept.product_name} packaging_name={clickedReciept.packaging_name} quantity={clickedReciept.quantity} onWarehouseChange={onWarehouseChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onProductChange={onProductChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalRecieptSubmit onSubmit={onSubmitClick} />
                <ToastContainer style={{ fontSize: 15 }} />
                <CollapsibleTable filterRow={filterRow} isAdmin={true} title={title} tableNestedRows={tableNestedRows} tableParentColumns={tableParentColumns} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onRecieptClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
            </Layout>
        );
    }
}

export default Reciept;