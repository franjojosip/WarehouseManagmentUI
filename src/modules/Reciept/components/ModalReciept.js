import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import React from "react";

import "../../../common/styles/Modal.css";

export default function ModalReciept({ errorMessage, modalTarget, warehouses, cities, locations, products, category_name, subcategory_name, warehouse_name, city_name, location_name, product_name, packaging_name, old_quantity, quantity, onSubmit, onWarehouseChange, onCityChange, onLocationChange, onProductChange, onPackagingChange, onQuantityChange, isSubmitDisabled }) {

  let submitClassName = "";
  let modalTitle = "";
  let submitText = "";
  let isDisabled = false;

  if (modalTarget === "modalTargetAdd") {
    submitClassName = "btn btn-success";
    modalTitle = "Dodaj preuzimanje";
    submitText = "Dodaj"
  }
  else if (modalTarget === "modalTargetEdit") {
    submitClassName = "btn btn-success";
    modalTitle = "Izmijenite odabrano preuzimanje";
    submitText = "Izmijeni";
  }
  else {
    submitClassName = "btn btn-danger";
    modalTitle = "Želite li sigurno obrisati odabrano preuzimanje?";
    submitText = "Obriši";
    isDisabled = true;
  }
  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: "Unesite vrijednost u polje",
      },
    ],
  };

  return (
    <div className="modal fade" id={modalTarget} tabIndex="-1" aria-labelledby="modalTarget" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="title" id="modalTarget">{modalTitle}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Form style={{ margin: 15 }}>
            <Form.Group size="md" controlId="warehouse_name">
              <Form.Label>Skladište *</Form.Label>
              {
                isDisabled ?
                  <Form.Control
                    type="text"
                    value={warehouse_name}
                    disabled={isDisabled}
                  />
                  :
                  <DropdownButton className="modalFormDropdown" variant="light" title={warehouse_name} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                    {warehouses.map((warehouse) => {
                      return <Dropdown.Item key={warehouse.warehouse_id} onSelect={() => onWarehouseChange(warehouse)}>{warehouse.warehouse_name}</Dropdown.Item>;
                    })}
                  </DropdownButton>
              }
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.warehouse ?
                    errorMessage.warehouse
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            {
              warehouse_name != "Odaberi skladište" ?
                <Form.Group size="md" controlId="product_name">
                  <Form.Label>Proizvod *</Form.Label>
                  {
                    isDisabled ?
                      <Form.Control
                        type="text"
                        value={product_name}
                        disabled={isDisabled}
                      />
                      :
                      <DropdownButton className="modalFormDropdown" variant="light" title={product_name} style={{ marginBottom: 10 }} disabled={isDisabled || products.length == 0} required>
                        {products.map((product) => {
                          return <Dropdown.Item key={product.product_id} onSelect={() => onProductChange(product)}>{product.product_name}</Dropdown.Item>;
                        })}
                      </DropdownButton>
                  }
                  <div hidden={isDisabled || !isSubmitDisabled}>
                    <p style={{ color: "red" }}>
                      {errorMessage.product ?
                        errorMessage.product
                        : null
                      }
                    </p>
                  </div>
                </Form.Group>
                : null
            }
            {
              old_quantity != 0 ?
                <Form.Group size="md" controlId="quantity">
                  <Form.Label>Trenutna količina</Form.Label>
                  <Form.Control
                    type="number"
                    value={old_quantity}
                    disabled={true}
                    style={{ width: 300 }}
                  />
                </Form.Group>
                : null
            }
            <Form.Group size="md" controlId="quantity">
              <Form.Label>Količina *</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => {
                  onQuantityChange(e.target.value);
                }}
                style={{ width: 300 }}
                placeholder="Unesite količinu koju preuzimate sa stanja [min: 1]"
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.quantity ?
                    errorMessage.quantity
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            <div className="modal-footer" style={{ padding: 0 }}>
              <Button className="btn btn-primary" data-dismiss="modal">Odustani</Button>
              <Button type="submit" data-dismiss="modal" disabled={isSubmitDisabled && !isDisabled} className={submitClassName} onClick={(e) => { e.preventDefault(); onSubmit() }}>{submitText}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div >
  );
};