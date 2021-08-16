import React from "react";
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../../../common/styles/Modal.css";


export default function ModalLocation({ modalTarget, errorMessage, cities, onSubmit, name, city_name, onNameChange, onCityChange, isSubmitDisabled }) {

  let submitClassName = "";
  let modalTitle = "";
  let submitText = "";
  let isDisabled = false;

  if (modalTarget === "modalTargetAdd") {
    submitClassName = "btn btn-success";
    modalTitle = "Kreiraj novu lokaciju";
    submitText = "Dodaj"
  }
  else if (modalTarget === "modalTargetEdit") {
    submitClassName = "btn btn-success";
    modalTitle = "Izmijenite ovu lokaciju";
    submitText = "Izmijeni";
  }
  else {
    submitClassName = "btn btn-danger";
    modalTitle = "Želite li sigurno obrisati ovu lokaciju?";
    submitText = "Obriši";
    isDisabled = true;
  }

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
            <Form.Group size="md" controlId="location_name">
              <Form.Label>Naziv Lokacije *</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={name}
                minLength="5"
                placeholder="Unesite naziv lokacije"
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
            <Form.Group size="md" controlId="city_name">
              <Form.Label>Naziv Grada *</Form.Label>
              {
                isDisabled ?
                  <Form.Control
                    type="text"
                    value={city_name}
                    disabled={isDisabled}
                  />
                  :
                  <DropdownButton className="modalFormDropdown" variant="light" title={city_name} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                    {cities.map((city) => {
                      return <Dropdown.Item key={city.city_id} onSelect={() => onCityChange(city)}>{city.city_name}</Dropdown.Item>;
                    })}
                  </DropdownButton>
              }
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.city ?
                    errorMessage.city
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