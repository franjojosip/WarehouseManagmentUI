import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import StockViewStore from '../stores/StockViewStore'
import CollapsibleTable from '../../../common/components/Table/CollapsibleTable';
import ModalStock from '../components/ModalStock';
import { ToastContainer } from 'react-toastify';
import { getUser } from '../../../common/components/LocalStorage';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Stock.css";

@inject(
    i => ({
        viewStore: new StockViewStore(i.rootStore)
    })
)

@observer
class Stock extends React.Component {
    render() {

        const { products, cityFilter, onCityFilterChange, onResetFilterClick, errorMessage, cities, filteredWarehouses, filteredLocations, clickedStock, onClickedRow, onClickedNestedRow, parentColumns, childColumns, nestedChildColumns, paginatedData, onStockClicked, onWarehouseChange, onProductChange, onCityChange, onLocationChange, onMinimumQuantityChange, onQuantityChange, isLoaderVisible, title, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;
        const loggedUser = getUser();
        let isLoggedAdmin = loggedUser && loggedUser.role.toLowerCase() == "administrator";

        let tableParentColumns = parentColumns.map((element, i) => {
            return <th key={"parentColumn" + i} className="text-center cellHeader">{element}</th>
        });
        let tableChildColumns = childColumns.map((element, i) => {
            return <th key={"childColumn" + i} className="text-center complexHeader">{element}</th>
        });
        let tableNestedChildColumns = nestedChildColumns.map((element, i) => {
            return <th key={"nestedChildColumn" + i} className="text-center secondComplexHeader">{element}</th>
        });

        let tableNestedRows = (<tbody>
            <tr>
                <td className="cell"></td>
                <td>Nema podataka</td>
                <td className="cell"></td>
                <td className="cell"></td>
            </tr>
        </tbody>);

        if (paginatedData.length > 0) {
            if (!isLoggedAdmin) {
                tableNestedChildColumns = tableNestedChildColumns.slice(0, -2)
            }

            tableNestedRows = paginatedData.map((element, i) => {
                let parentRow = element.data.find(item => item.warehouse_id.toString() === element.name.toString());

                let parentIndex = i;
                return (
                    <tbody key={"tbody" + i}>
                        <tr key={i} onClick={() => onClickedRow(parentIndex)} className="accordion-toggle collapsed" style={{ backgroundColor: "#F2F2F2" }} className="complexAccordion" id="accordion1" data-toggle="collapse" data-parent="#accordion1" data-target={"#row" + parentIndex}>
                            <td className="complexCell"><Button className="btnShowMore">Prikaži</Button></td>
                            <td className="complexCell">{parentRow.warehouse_name}</td>
                            <td className="complexCell">{parentRow.location_name}</td>
                            <td className="complexCell">{parentRow.city_name}</td>
                        </tr>
                        <tr>
                            <td colSpan="12" className="hiddenRow">
                                <div className="collapse" id={"row" + i}>
                                    <div className=" table-responsive ">
                                        <table className="table table-bordered table-striped text-center mb-0">
                                            <thead>
                                                <tr className="info">
                                                    <th className="complexHeader"></th>
                                                    {tableChildColumns}
                                                </tr>
                                            </thead>
                                            {
                                                element.grouppedCategoryData.map((categoryData, nestedKey) => {
                                                    let categoryRow = categoryData.data.find(item => item.category_id.toString() === categoryData.name.toString());
                                                    return (
                                                        <tbody key={"nestedBody-" + nestedKey + "-" + parentRow.id}>
                                                            <tr key={"nestedKey-" + parentRow.id} onClick={() => onClickedNestedRow(parentRow.id)} className="accordion-toggle collapsed" style={{ backgroundColor: "#F2F2F2" }} id="accordion1" data-toggle="collapse" data-parent="#accordion1" data-target={"#nestedrow-" + nestedKey + "-" + parentRow.id}>
                                                                <td className="complexCell"><Button className="btnShowMore">Prikaži proizvode</Button></td>
                                                                <td className="complexCell">{categoryRow.category_name}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="12" className="hiddenNestedRow cell">
                                                                    <div className="collapse" id={"nestedrow-" + nestedKey + "-" + parentRow.id}>
                                                                        <div className="table-responsive">
                                                                            <table className="table table-bordered table-striped text-center mb-0">
                                                                                <thead>
                                                                                    <tr className="info">
                                                                                        {
                                                                                            tableNestedChildColumns
                                                                                        }
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {categoryData.data.map((product, i) => {
                                                                                        return (
                                                                                            <tr key={"categoryData" + i + "-" + parentRow.id}>
                                                                                                <td className="nestedComplexCell">{product.product_name}</td>
                                                                                                <td className="nestedComplexCell">{product.subcategory_name}</td>
                                                                                                <td className="nestedComplexCell">{product.packaging_name}</td>
                                                                                                <td className="nestedComplexCell">{product.quantity}</td>
                                                                                                <td className="nestedComplexCell">{product.min_quantity}</td>
                                                                                                {
                                                                                                    isLoggedAdmin ?
                                                                                                        <td className="nestedComplexCell">
                                                                                                            <button type="button" onClick={() => onStockClicked(product, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btn-primary btnAction btn-rounded btn-sm">
                                                                                                                Izmijeni
                                                                                                            </button>
                                                                                                        </td>
                                                                                                        : null
                                                                                                }
                                                                                                {
                                                                                                    isLoggedAdmin ?
                                                                                                        <td className="nestedComplexCell">
                                                                                                            <button type="button" onClick={() => onStockClicked(product, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm">
                                                                                                                Obriši
                                                                                                            </button>
                                                                                                        </td>
                                                                                                        : null
                                                                                                }
                                                                                            </tr>
                                                                                        );
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    );
                                                })
                                            }
                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody >
                );
            })
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
        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalStock modalTarget="modalTargetAdd" errorMessage={errorMessage} warehouses={filteredWarehouses} locations={filteredLocations} cities={cities} products={products} onSubmit={onCreateClick} warehouse_name={clickedStock.warehouse_name} product_name={clickedStock.product_name} location_name={clickedStock.location_name} city_name={clickedStock.city_name} quantity={clickedStock.quantity} min_quantity={clickedStock.min_quantity} onWarehouseChange={onWarehouseChange} onProductChange={onProductChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onMinimumQuantityChange={onMinimumQuantityChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalStock modalTarget="modalTargetEdit" errorMessage={errorMessage} warehouses={filteredWarehouses} locations={filteredLocations} cities={cities} products={products} onSubmit={onEditClick} warehouse_name={clickedStock.warehouse_name} product_name={clickedStock.product_name} location_name={clickedStock.location_name} city_name={clickedStock.city_name} quantity={clickedStock.quantity} min_quantity={clickedStock.min_quantity} onWarehouseChange={onWarehouseChange} onProductChange={onProductChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onMinimumQuantityChange={onMinimumQuantityChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalStock modalTarget="modalTargetDelete" errorMessage={errorMessage} warehouses={filteredWarehouses} locations={filteredLocations} cities={cities} products={products} onSubmit={onDeleteClick} warehouse_name={clickedStock.warehouse_name} product_name={clickedStock.product_name} location_name={clickedStock.location_name} city_name={clickedStock.city_name} quantity={clickedStock.quantity} min_quantity={clickedStock.min_quantity} onWarehouseChange={onWarehouseChange} onProductChange={onProductChange} onCityChange={onCityChange} onLocationChange={onLocationChange} onMinimumQuantityChange={onMinimumQuantityChange} onQuantityChange={onQuantityChange} isSubmitDisabled={isSubmitDisabled} />
                <ToastContainer style={{ fontSize: 15 }} />
                <CollapsibleTable filterRow={filterRow} isAdmin={isLoggedAdmin} title={title} tableNestedRows={tableNestedRows} tableParentColumns={tableParentColumns} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onStockClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
            </Layout >
        );
    }
}

export default Stock;