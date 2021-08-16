import React from "react";
import { Form, Button } from 'react-bootstrap';

import "../../../common/styles/Form.css"


export default function ResetPasswordForm({ resetPasswordMessage, newPassword, onNewPasswordChange, onSubmit, onBackClick, isSubmitDisabled }) {
  return (
    <div className="ForgotPassword">
      <Form style={{ margin: 15 }}>
        <h1 className="formTitle">Resetiranje lozinke</h1>
        <Form.Group size="md" controlId="email" style={{ marginTop: 50 }}>
          <Form.Label>Nova lozinka *</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={newPassword}
            placeholder="Unesite novu lozinku"
            onChange={(e) => onNewPasswordChange(e.target.value)}
          />
          <div className="errorRow" hidden={resetPasswordMessage == null}>
            <p style={{ color: "red", paddingTop: 10 }}>
              {resetPasswordMessage.newPassword ?
                resetPasswordMessage.newPassword
                : null
              }
            </p>
          </div>
        </Form.Group>
        <div className="modal-footer" style={{ padding: 0 }}>
          <a onClick={(e)=> e.preventDefault(), onBackClick()} className="btn btn-primary">Nazad</a>
          <Button type="submit" disabled={isSubmitDisabled} className="btn btn-success" onClick={(e) => { e.preventDefault(); onSubmit() }}>Resetiraj lozinku</Button>
        </div>
      </Form>
    </div >
  );
};