import React from "react";
import { Form, Button } from 'react-bootstrap';

import "../../../common/styles/Form.css"

const LoginForm = (props) => {
  return (
    <div className="Login">
      <Form style={{ margin: 15 }}>
        <h1 className="formTitle">Prijava</h1>
        <Form.Group size="md" controlId="email">
          <Form.Label>Email *</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={props.email}
            minLength="4"
            placeholder="Unesite email"
            onChange={(e) => props.onEmailChange(e.target.value)}
          />
          <div className="errorRow" hidden={!props.isSubmitDisabled}>
            <p style={{ color: "red", paddingTop: 5 }}>
              {props.errorMessage.email ?
                props.errorMessage.email
                : null
              }
            </p>
          </div>
        </Form.Group>
        <Form.Group size="md" controlId="password">
          <Form.Label>Lozinka *</Form.Label>
          <Form.Control
            type="password"
            value={props.password}
            minLength="4"
            placeholder="Unesite lozinku"
            onChange={(e) => props.onPasswordChange(e.target.value)}
          />
          <div className="errorRow" hidden={!props.isSubmitDisabled}>
            <p style={{ color: "red", paddingTop: 5 }}>
              {props.errorMessage.password ?
                props.errorMessage.password
                : null
              }
            </p>
          </div>
        </Form.Group>
        <div className="errorRow" hidden={props.errorMessage.credentials == null}>
          <p style={{ color: "red" }}>
            {props.errorMessage.credentials ?
              props.errorMessage.credentials
              : null
            }
          </p>
        </div>
        <a id="forgotPassword" href="/forgotpassword">Zaboravljena lozinka?</a>
        <div className="modal-footer" style={{ paddingBottom: 0, paddingBlockStart: 0, paddingBlockEnd: 0, paddingTop:10 }}>
          <Button type="submit" disabled={props.isSubmitDisabled} className="btn btn-success" onClick={(e) => { e.preventDefault(); props.onSubmit() }}>Prijavi se</Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;