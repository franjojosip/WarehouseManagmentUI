import React from "react";
import { Form, Button } from 'react-bootstrap';

import "../../../common/styles/Form.css"


export default function ResetPasswordForm({ resetPasswordMessage, oldPassword, newPassword, onOldPasswordChange, onNewPasswordChange, onSubmit, isSubmitDisabled }) {
  return (
    <div className="ForgotPassword">
      <Form style={{ margin: 15 }}>
        <h1 className="formTitle">Resetiranje lozinke</h1>
        <Form.Group size="md" controlId="email">
          <Form.Label>Stara lozinka *</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={oldPassword}
            placeholder="Unesite staru lozinku"
            onChange={(e) => onOldPasswordChange(e.target.value)}
          />
          <div className="errorRow" hidden={resetPasswordMessage == null}>
            <p style={{ color: "red", paddingTop: 10 }}>
              {resetPasswordMessage.oldPassword ?
                resetPasswordMessage.oldPassword
                : null
              }
            </p>
          </div>
        </Form.Group>
        <Form.Group size="md" controlId="email">
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
          <a href="/login" className="btn btn-primary">Nazad</a>
          <Button type="submit" disabled={isSubmitDisabled} className="btn btn-success" onClick={(e) => { e.preventDefault(); onSubmit() }}>Resetiraj lozinku</Button>
        </div>
      </Form>
    </div>
  );
};