import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import ProductViewStore from '../stores/ProductViewStore'
import Table from '../../../common/components/Table/Table';
import ModalProduct from '../components/ModalProduct';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Product.css";

@inject(
    i => ({
        viewStore: new ProductViewStore(i.rootStore)
    })
)

@observer
class Product extends React.Component {
    render() {
        const { isLoaderVisible, productFilter, onResetFilterClick, subcategories, onCategoryFilterChange, onSubcategoryFilterChange, onPackagingFilterChange, errorMessage, title, clickedProduct, onCategoryChange, onSubcategoryChange, onPackagingChange, columns, rows, categories, filteredSubcategories, packagings, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onNameChange, onProductClicked, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.name}</td>
                <td className="cell">{element.category_name}</td>
                <td className="cell">{element.subcategory_name}</td>
                <td className="cell">{element.packaging_name}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onProductClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btn-primary btnAction btn-rounded btn-sm my-0">
                                Izmijeni
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onProductClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm my-0">
                                Obriši
                            </button>
                            :
                            null
                    }
                </td>
            </tr>);
        });
        let categoryFilterDropdown = (<DropdownButton style={{ margin: "auto" }} className="vertical-center" variant="light" title={productFilter.category_name ? productFilter.category_name : "Sve kategorije"} style={{ marginBottom: 10 }}>
            <Dropdown.Item key="default_category" onSelect={() => onCategoryFilterChange({ category_id: "", category_name: "" })}>Sve kategorije</Dropdown.Item>
            {categories.map((category) => {
                return <Dropdown.Item key={category.category_id} onSelect={() => onCategoryFilterChange(category)}>{category.category_name}</Dropdown.Item>;
            })
            }
        </DropdownButton>);

        let subcategoryFilterDropdown = (<DropdownButton style={{ margin: "auto" }} className="vertical-center" variant="light" title={productFilter.subcategory_name ? productFilter.subcategory_name : "Sve potkategorije"} style={{ marginBottom: 10 }}>
            <Dropdown.Item key="default_subcategory" onSelect={() => onSubcategoryFilterChange({ subcategory_id: "", subcategory_name: "" })}>Sve potkategorije</Dropdown.Item>
            {subcategories.map((subcategory) => {
                return <Dropdown.Item key={subcategory.subcategory_id} onSelect={() => onSubcategoryFilterChange(subcategory)}>{subcategory.subcategory_name}</Dropdown.Item>;
            })
            }
        </DropdownButton>);

        let packagingFilterDropdown = (<DropdownButton style={{ margin: "auto" }} className="vertical-center" variant="light" title={productFilter.packaging_name ? productFilter.packaging_name : "Sve ambalaže"} style={{ marginBottom: 10 }}>
            <Dropdown.Item key="default_packaging" onSelect={() => onPackagingFilterChange({ packaging_id: "", packaging_name: "" })}>Sve ambalaže</Dropdown.Item>
            {packagings.map((packaging) => {
                return <Dropdown.Item key={packaging.packaging_id} onSelect={() => onPackagingFilterChange(packaging)}>{packaging.packaging_name}</Dropdown.Item>;
            })
            }
        </DropdownButton>);

        let filterRow = (
            <div className="filterCard" style={{ marginBottom: 10 }}>
                <div className="row">
                    <div className="col-md-3 filterColumn">
                        <span id="filterTitle">FILTERI</span>
                    </div>
                    <div className="col-md-3 filterColumn">
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuPageSize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {pageSize}
                        </button>
                        <div className="dropdown-menu productPageSize pagesize" aria-labelledby="dropdownMenuPageSize">
                            <button className="dropdown-item" onClick={() => onChangePageSize(5)} type="button">5</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(10)} type="button">10</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(15)} type="button">15</button>
                        </div>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        {categoryFilterDropdown}
                    </div>
                    <div className='col-md-3 filterColumn'>
                        {subcategoryFilterDropdown}
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-3 filterColumn'>
                        {packagingFilterDropdown}
                    </div>
                    <div className='col-md-6 filterColumn'>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                    </div>
                </div>
            </div>);

        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalProduct modalTarget="modalTargetAdd" errorMessage={errorMessage} categories={categories} subcategories={filteredSubcategories} packagings={packagings} onSubmit={onCreateClick} name={clickedProduct.name} category_name={clickedProduct.category_name} subcategory_name={clickedProduct.subcategory_name} packaging_name={clickedProduct.packaging_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} onSubcategoryChange={onSubcategoryChange} onPackagingChange={onPackagingChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalProduct modalTarget="modalTargetEdit" errorMessage={errorMessage} categories={categories} subcategories={filteredSubcategories} packagings={packagings} onSubmit={onEditClick} name={clickedProduct.name} category_name={clickedProduct.category_name} subcategory_name={clickedProduct.subcategory_name} packaging_name={clickedProduct.packaging_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} onSubcategoryChange={onSubcategoryChange} onPackagingChange={onPackagingChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalProduct modalTarget="modalTargetDelete" errorMessage={errorMessage} categories={categories} subcategories={filteredSubcategories} packagings={packagings} onSubmit={onDeleteClick} name={clickedProduct.name} category_name={clickedProduct.category_name} subcategory_name={clickedProduct.subcategory_name} packaging_name={clickedProduct.packaging_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} onSubcategoryChange={onSubcategoryChange} onPackagingChange={onPackagingChange} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onProductClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )
    }
}

export default Product;