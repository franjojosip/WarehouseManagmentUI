import React from "react";
import { Form, Button } from 'react-bootstrap';

import "../../../common/styles/Form.css"


const ScheduleForm = (props) => {
  return (
    <div className="Schedule">
      <Form style={{ margin: 15 }}>
        <h1 className="scheduleTitle">Osvježi automatske obavijesti</h1>
        <br />
        <Form.Group size="md" controlId="password">
          <Form.Label>Lozinka</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={props.password}
            minLength="4"
            placeholder="Unesite super admin lozinku"
            onChange={(e) => props.onPasswordChange(e.target.value)}
          />
          <div className="errorRow" hidden={!props.isSubmitDisabled}>
            <p style={{ color: "red", paddingTop: 5 }}>
              {props.errorMessage ?
                props.errorMessage
                : null
              }
            </p>
          </div>
        </Form.Group>
        <div className="modal-footer" style={{ padding: 0, paddingTop: 5 }}>
          <Button type="submit" disabled={props.isSubmitDisabled} className="btn btn-success" onClick={(e) => { e.preventDefault(); props.onSubmit() }}>Osvježi</Button>
        </div>
      </Form>
    </div>
  );
};

export default ScheduleForm;