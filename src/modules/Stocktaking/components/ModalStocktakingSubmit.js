import { Form, Button } from 'react-bootstrap';
import React from "react";

import "../../../common/styles/Modal.css";

export default function ModalStocktakingSubmit({ onSubmit }) {

  return (
    <div className="modal fade" id="modalTargetSubmit" tabIndex="-1" aria-labelledby="modalTarget" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="title" id="modalTarget">Želite li potvrditi ovu inventuru?</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Form style={{ margin: 15 }}>

            <div style={{ padding: 0, float: "right" }}>
              <Button className="btn btn-primary" data-dismiss="modal">Odustani</Button>
              <Button type="submit" data-dismiss="modal" className="btn btn-success" onClick={(e) => { e.preventDefault(); onSubmit() }}>Potvrdi inventuru</Button>
            </div>
          </Form>
        </div>
      </div>
    </div >
  );
};