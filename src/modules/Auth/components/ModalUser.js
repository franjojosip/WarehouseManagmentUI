import React from "react";
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../../../common/styles/Modal.css";


export default function ModalUser({ modalTarget, roles, onSubmit, fname, lname, email, phone, password, role_name, onRoleChange, onFirstNameChange, onLastNameChange, onEmailChange, onPhoneChange, onPasswordChange, isSubmitDisabled, errorMessage }) {

  let submitClassName = "";
  let modalTitle = "";
  let submitText = "";
  let isDisabled = false;
  let isCreate = false;

  if (modalTarget === "modalTargetAdd") {
    submitClassName = "btn btn-success";
    modalTitle = "Kreiraj novog korisnika";
    submitText = "Dodaj"
    isCreate = true;
  }
  else if (modalTarget === "modalTargetEdit") {
    submitClassName = "btn btn-success";
    modalTitle = "Izmijenite korisnika";
    submitText = "Izmijeni";
  }
  else {
    submitClassName = "btn btn-danger";
    modalTitle = "Želite li sigurno obrisati ovog korisnika?";
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
            <Form.Group size="md" controlId="fname">
              <Form.Label>Ime *</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={fname}
                minLength="2"
                placeholder="Unesite ime"
                onChange={(e) => onFirstNameChange(e.target.value)}
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.fname ?
                    errorMessage.fname
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            <Form.Group size="md" controlId="lname">
              <Form.Label>Prezime *</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={lname}
                minLength="2"
                placeholder="Unesite prezime"
                onChange={(e) => onLastNameChange(e.target.value)}
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.lname ?
                    errorMessage.lname
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            <Form.Group size="md" controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                autoFocus
                type="email"
                value={email}
                minLength="4"
                placeholder="Unesite email"
                onChange={(e) => onEmailChange(e.target.value)}
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.email ?
                    errorMessage.email
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            <Form.Group size="md" controlId="phone">
              <Form.Label>Broj mobitela *</Form.Label>
              <Form.Control
                autoFocus
                type="text"
                value={phone}
                minLength="6"
                maxLength="10"
                placeholder="Unesite broj mobitela"
                onChange={(e) => onPhoneChange(e.target.value)}
                disabled={isDisabled}
              />
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.phone ?
                    errorMessage.phone
                    : null
                  }
                </p>
              </div>
            </Form.Group>
            {
              isCreate ?
                <Form.Group size="md" controlId="password">
                  <Form.Label>Lozinka *</Form.Label>
                  <Form.Control
                    autoFocus
                    type="text"
                    value={password}
                    minLength="6"
                    placeholder="Unesite lozinku"
                    onChange={(e) => onPasswordChange(e.target.value)}
                  />
                  <div hidden={isDisabled || !isSubmitDisabled}>
                    <p style={{ color: "red" }}>
                      {errorMessage.password ?
                        errorMessage.password
                        : null
                      }
                    </p>
                  </div>
                </Form.Group>
                : null
            }
            <Form.Group size="md" controlId="role_name">
              <Form.Label>Uloga *</Form.Label>
              {
                isDisabled ?
                  <Form.Control
                    type="text"
                    value={role_name}
                    disabled={isDisabled}
                  />
                  :
                  <DropdownButton className="modalFormDropdown" variant="light" title={role_name ? role_name : "Odaberi ulogu"} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                    {roles.map((role) => {
                      return <Dropdown.Item key={role.role_id} onSelect={() => onRoleChange(role)}>{role.role_name}</Dropdown.Item>;
                    })}
                  </DropdownButton>
              }
              <div hidden={isDisabled || !isSubmitDisabled}>
                <p style={{ color: "red" }}>
                  {errorMessage.role ?
                    errorMessage.role
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