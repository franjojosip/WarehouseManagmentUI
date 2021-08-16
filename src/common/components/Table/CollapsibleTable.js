import { Button } from 'bootstrap';
import React from 'react';
import Pagination from './Pagination';

import "./styles/Table.css";

export default function CollapsibleTable({ filterRow, isAdmin, tableParentColumns, tableNestedRows, title, page, pageSize, totalPages, previousEnabled, nextEnabled, onActionClicked, onPageClick, onChangePageSize, onPreviousPageClick, onNextPageClick }) {
  return (
    <div className="card mb-5 basicCard">
      <div className="card-body">
        <h2 className="text-center font-weight-bold tableTitle">
          {title}
        </h2>
        {
          isAdmin == null ?
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
                  <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuPageSize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {pageSize}
                  </button>
                  <div className="dropdown-menu pagesize" aria-labelledby="dropdownMenuPageSize">
                    <button className="dropdown-item" onClick={() => onChangePageSize(5)} type="button">5</button>
                    <button className="dropdown-item" onClick={() => onChangePageSize(10)} type="button">10</button>
                    <button className="dropdown-item" onClick={() => onChangePageSize(15)} type="button">15</button>
                  </div>
                </div>
                <div className='col-md-3 filterColumn'>
                  <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onChangePageSize(5) }}>Resetiraj</Button>
                </div>
              </div>
            </div>
        }
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th className="cellHeader"></th>
                {tableParentColumns}
              </tr>
            </thead>
            {tableNestedRows}
          </table>
        </div>
        <Pagination totalPages={totalPages} page={page} previousEnabled={previousEnabled} onPageClick={onPageClick} nextEnabled={nextEnabled} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
      </div>
    </div>
  );
}