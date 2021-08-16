import React from "react";
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../../../common/styles/Modal.css";


export default function ModalSubcategory({ modalTarget, errorMessage, categories, onSubmit, name, category_name, onNameChange, onCategoryChange, isSubmitDisabled }) {

  let submitClassName = "";
  let modalTitle = "";
  let submitText = "";
  let isDisabled = false;

  if (modalTarget === "modalTargetAdd") {
    submitClassName = "btn btn-success";
    modalTitle = "Kreiraj novu potkategoriju";
    submitText = "Dodaj"
  }
  else if (modalTarget === "modalTargetEdit") {
    submitClassName = "btn btn-success";
    modalTitle = "Izmijenite ovu potkategoriju";
    submitText = "Izmijeni";
  }
  else {
    submitClassName = "btn btn-danger";
    modalTitle = "Želite li sigurno obrisati ovu potkategoriju?";
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
            <Form.Group size="md" controlId="subcategory_name">
              <Form.Label>Naziv Potkategorije *</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={name}
                minLength="2"
                placeholder="Unesite naziv potkategorije"
                onChange={(e) => onNameChange(e.target.value)}
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled} style={{ paddingTop: 5 }}>
                <p style={{ color: "red" }}>
                  {errorMessage.name ?
                    errorMessage.name
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            <Form.Group size="md" controlId="category_name">
              <Form.Label>Naziv Kategorije *</Form.Label>
              {
                isDisabled ?
                  <Form.Control
                    type="text"
                    value={category_name}
                    disabled={isDisabled}
                  />
                  :
                  <DropdownButton className="modalFormDropdown" variant="light" title={category_name} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                    {categories.map((category) => {
                      return <Dropdown.Item key={category.category_id} onSelect={() => onCategoryChange(category)}>{category.category_name}</Dropdown.Item>;
                    })}
                  </DropdownButton>
              }
              <div hidden={isDisabled || !isSubmitDisabled} style={{ paddingTop: 5 }}>
                <p style={{ color: "red" }}>
                  {errorMessage.category ?
                    errorMessage.category
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