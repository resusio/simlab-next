import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SettingsType } from '../../contexts/settingsContext';

import styles from './settingsBox.module.scss';
import { diseaseType } from '@resusio/simlab';

export interface SettingsBoxType {
  settings: SettingsType;
  diseaseList: diseaseType[];
}

const SettingsBox: FC<SettingsBoxType> = ({ settings, diseaseList }) => (
  <Container className={`mt-4 pt-2 ${styles.settingsBox}`}>
    <Row>
      <Col>
        <b>
          <em>{settings.patient.name}</em>
        </b>
      </Col>
    </Row>
    <Row>
      <Col>{settings.patient.age} years</Col>
      <Col>{settings.patient.gender}</Col>
    </Row>
    <Row>
      <Col>{settings.patient.height} cm</Col>
      <Col>{settings.patient.weight} kg</Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <b>Tests</b>
      </Col>
    </Row>
    <Row>
      <Col>
        <em>{settings.testIds.join(', ')}</em>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <b>Order Sets</b>
      </Col>
    </Row>
    <Row>
      <Col>
        <em>{settings.orderSetIds.join(', ')}</em>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <b>Diseases</b>
      </Col>
    </Row>
    <Row>
      <Col>
        <em>
          {settings.diseaseIds.map((diseaseId) => {
            const disease = diseaseList.find((diseaseToTest) => diseaseToTest.id === diseaseId);

            return <div>{disease?.nomenclature.short}</div>;
          })}
        </em>
      </Col>
    </Row>
  </Container>
);

export default SettingsBox;
