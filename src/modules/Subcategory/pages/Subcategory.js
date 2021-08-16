import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import SubcategoryViewStore from '../stores/SubcategoryViewStore'
import Table from '../../../common/components/Table/Table';
import ModalSubcategory from '../components/ModalSubcategory';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/Subcategory.css";

@inject(
    i => ({
        viewStore: new SubcategoryViewStore(i.rootStore)
    })
)

@observer
class Subcategory extends React.Component {
    render() {
        const { isLoaderVisible, categoryFilter, onCategoryFilterChange, onResetFilterClick, errorMessage, title, clickedSubcategory, onCategoryChange, columns, rows, categories, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onNameChange, onSubcategoryClicked, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            return (<tr key={i}>
                <td className="cell">{element.name}</td>
                <td className="cell">{element.category_name}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onSubcategoryClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btn-primary btnAction btn-rounded btn-sm my-0">
                                Izmijeni
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onSubcategoryClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm my-0">
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
                        <DropdownButton style={{ margin: "auto" }} className="vertical-center lowerDropdown" variant="light" title={categoryFilter.name ? categoryFilter.name : "Sve kategorije"} style={{ marginBottom: 10 }}>
                            <Dropdown.Item key="default_category" onSelect={() => onCategoryFilterChange({ category_id: "", category_name: "" })}>Sve kategorije</Dropdown.Item>
                            {categories.map((category) => {
                                return <Dropdown.Item key={category.category_id} onSelect={() => onCategoryFilterChange(category)}>{category.category_name}</Dropdown.Item>;
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
                <ModalSubcategory modalTarget="modalTargetAdd" errorMessage={errorMessage} categories={categories} onSubmit={onCreateClick} name={clickedSubcategory.name} category_name={clickedSubcategory.category_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalSubcategory modalTarget="modalTargetEdit" errorMessage={errorMessage} categories={categories} onSubmit={onEditClick} name={clickedSubcategory.name} category_name={clickedSubcategory.category_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalSubcategory modalTarget="modalTargetDelete" errorMessage={errorMessage} categories={categories} onSubmit={onDeleteClick} name={clickedSubcategory.name} category_name={clickedSubcategory.category_name} onNameChange={onNameChange} onCategoryChange={onCategoryChange} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onSubcategoryClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )
    }
}

export default Subcategory;