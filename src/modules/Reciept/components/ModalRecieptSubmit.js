import { Form, Button } from 'react-bootstrap';
import React from "react";

import "../../../common/styles/Modal.css";

export default function ModalRecieptSubmit({ modalTarget, onSubmit, isConfirmAll }) {
  let title = "";
  let btnTitle = "";
  if (isConfirmAll) {
    title = "Želite li potvrditi ova preuzimanja?";
    btnTitle = "Potvrdi preuzimanja";
  }
  else {
    title = "Želite li potvrditi ono preuzimanje?";
    btnTitle = "Potvrdi preuzimanje";
  }

  return (
    <div className="modal fade" id={modalTarget} tabIndex="-1" aria-labelledby="modalTarget" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="title" id="modalTarget">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Form style={{ margin: 15 }}>
            <div style={{ padding: 0, float: "right" }}>
              <Button className="btn btn-primary" data-dismiss="modal">Odustani</Button>
              <Button type="submit" data-dismiss="modal" className="btn btn-success" onClick={(e) => { e.preventDefault(); onSubmit() }}>{btnTitle}</Button>
            </div>
          </Form>
        </div>
      </div>
    </div >
  );
};