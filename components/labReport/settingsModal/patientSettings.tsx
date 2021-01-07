import { FC, useState } from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';

import { patientInfoType, gender } from '@resusio/simlab';

export interface PatientSettingsProps {
  patientInfo: patientInfoType & { name: string; mrn: string };
  onChange: (newPatientInfo: patientInfoType & { name: string; mrn: string }) => void;
}

const PatientSettings: FC<PatientSettingsProps> = ({ patientInfo, onChange }) => {
  return (
    <Form className="m-2">
      <Form.Row>
        <Col>
          <Form.Group controlId="formPatientName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={patientInfo.name}
              onChange={(e) => onChange({ ...patientInfo, name: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formPatientMRN">
            <Form.Label>Medical Record Number</Form.Label>
            <Form.Control
              type="text"
              value={patientInfo.mrn}
              onChange={(e) => onChange({ ...patientInfo, mrn: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formPatientSex">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              as="select"
              value={patientInfo.gender}
              onChange={(e) => onChange({ ...patientInfo, gender: e.target.value as gender })}
            >
              <option value={gender.Male}>Male</option>
              <option value={gender.Female}>Female</option>
              <option value={gender.Other}>Unknown/Other</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formPatientAge">
            <Form.Label>Age</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={patientInfo.age}
                onChange={(e) => onChange({ ...patientInfo, age: parseFloat(e.target.value) })}
              />
              <InputGroup.Append>
                <InputGroup.Text>years</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formPatientHeight">
            <Form.Label>Height</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={patientInfo.height}
                onChange={(e) =>
                  onChange({
                    ...patientInfo,
                    height: parseFloat(e.target.value),
                  })
                }
              />
              <InputGroup.Append>
                <InputGroup.Text>cm</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formPatientWeight">
            <Form.Label>Weight</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={patientInfo.weight}
                onChange={(e) =>
                  onChange({
                    ...patientInfo,
                    weight: parseFloat(e.target.value),
                  })
                }
              />
              <InputGroup.Append>
                <InputGroup.Text>kg</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  );
};

export default PatientSettings;
