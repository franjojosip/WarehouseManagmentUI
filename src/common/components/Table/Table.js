import React from 'react';
import { Button } from 'react-bootstrap';
import Pagination from './Pagination';

import "./styles/Table.css";

export default function Table({ title, filterRow, hideAddButton, columns, tableRows, page, pageSize, totalPages, previousEnabled, nextEnabled, onActionClicked, onPageClick, onChangePageSize, onPreviousPageClick, onNextPageClick }) {

  return (
    <div className="card mb-3 basicCard">
      <div className="card-body">
        <h1 className="text-center font-weight-bold tableTitle">
          {title}
        </h1>
        {
          hideAddButton != null ?
            null
            :
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <a className="text-success" style={{ width: "fit-content" }}><i className="fas fa-plus fa-2x" aria-hidden="true" data-toggle="modal" data-target="#modalTargetAdd" onClick={() => onActionClicked(null, true)}></i></a>
            </div>
        }
        {
          filterRow ?
            filterRow :
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
                  <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onChangePageSize(5) }}>Resetiraj</Button>
                </div>
              </div>
            </div>
        }
        <div className="table-responsive">
          <table className="table table-bordered table-striped text-center">
            <thead>
              <tr>
                {columns.map((element, i) => {
                  return <th key={i} className="text-center cellHeaderThree">{element}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination totalPages={totalPages} page={page} previousEnabled={previousEnabled} onPageClick={onPageClick} nextEnabled={nextEnabled} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />

    </div >
  );
}