import { Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import "../../../common/styles/Modal.css";

export default function ModalNotificationSetting({ modalTarget, onSubmit, days, day_of_week_name, time, email, onEmailChange, notification_type_name, notification_types, onDayOfWeekChange, onTimeChange, onNotificationTypeChange, isSubmitDisabled }) {
  let classes = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  let submitClassName = "";
  let modalTitle = "";
  let submitText = "";
  let isDisabled = false;

  if (modalTarget === "modalTargetAdd") {
    submitClassName = "btn btn-success";
    modalTitle = "Kreiraj novu automatsku obavijest";
    submitText = "Dodaj"
  }
  else if (modalTarget === "modalTargetEdit") {
    submitClassName = "btn btn-success";
    modalTitle = "Izmijenite ovu automatsku obavijest";
    submitText = "Izmijeni";
  }
  else {
    submitClassName = "btn btn-danger";
    modalTitle = "Želite li sigurno obrisati ovu automatsku obavijest?";
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
            {
              notification_type_name == "Tjedna obavijest" ?
                <Form.Group size="md" controlId="day_of_week_name">
                  <Form.Label>Dan u Tjednu *</Form.Label>
                  {
                    isDisabled ?
                      < Form.Control
                        type="text"
                        value={day_of_week_name}
                        disabled={isDisabled}
                      /> :
                      <DropdownButton className="modalFormDropdown" variant="light" title={day_of_week_name} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                        {days.map((day) => {
                          return <Dropdown.Item key={day.id} onSelect={() => onDayOfWeekChange(day)}>{day.name}</Dropdown.Item>;
                        })}
                      </DropdownButton>
                  }
                </Form.Group>
                : null
            }
            <Form.Group size="md" controlId="time">
              <Form.Label>Vrijeme *</Form.Label>
              <br />
              <TextField
                id="time"
                type="time"
                value={time}
                className={classes.textField}
                onChange={(e) => onTimeChange(e.target.value)}
                disabled={isDisabled}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Form.Group>
            <Form.Group size="md" controlId="email" className="pt-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="text"
                value={email}
                disabled={isDisabled}
                onChange={(e) => onEmailChange(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="md" controlId="notification_type">
              <Form.Label>Tip obavijesti *</Form.Label>
              {
                isDisabled ?
                  < Form.Control
                    type="text"
                    value={notification_type_name}
                    disabled={isDisabled}
                  /> :
                  <DropdownButton className="modalFormDropdown" variant="light" title={notification_type_name} style={{ marginBottom: 10 }} disabled={isDisabled} required>
                    {notification_types.map((type) => {
                      return <Dropdown.Item key={type.notification_type_id} onSelect={() => onNotificationTypeChange(type)}>{type.notification_type_name}</Dropdown.Item>;
                    })}
                  </DropdownButton>
              }
            </Form.Group>
            <div hidden={isDisabled || !isSubmitDisabled}>
              <p style={{ color: "red" }}>
                Provjerite sva polja !!!
              </p>
            </div>
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