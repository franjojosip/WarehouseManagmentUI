import { Form, Button } from 'react-bootstrap';
import React from "react";
import moment from "moment";

import "../../../common/styles/Modal.css";

export default function ModalNotificationLogShow({ modalTarget, notification_type_name, data, email, date_created }) {
  let isDisabled = true;
  return (
    <div className="modal fade" id={modalTarget} tabIndex="-1" aria-labelledby="modalTarget" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="title" id="modalTarget">Prikaz detalja obavijesti</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <Form style={{ margin: 15 }}>
            <Form.Group size="md" controlId="notification_type">
              <Form.Label>Tip Notifikacije</Form.Label>
              <Form.Control
                type="text"
                value={notification_type_name}
                disabled={isDisabled}
              />
            </Form.Group>
            <Form.Group size="md" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                disabled={isDisabled}
              />
            </Form.Group>
            <Form.Group size="md" controlId="date_created">
              <Form.Label>Datum slanja</Form.Label>
              <Form.Control
                type="text"
                value={moment(date_created).format("DD/MM/YYYY, HH:mm") + "h"}
                disabled={isDisabled}
              />
            </Form.Group>
            <Form.Group size="md" controlId="data">
              <Form.Label>Podatci</Form.Label>
              <textarea className="form-control" value={data} rows={data.length < 40 ? "2" : "12"}  readOnly></textarea>
            </Form.Group>
            <div className="modal-footer" style={{ padding: 0 }}>
              <Button className="btn btn-primary" data-dismiss="modal">Uredu</Button>

            </div>
          </Form>
        </div>
      </div>
    </div >
  );
};