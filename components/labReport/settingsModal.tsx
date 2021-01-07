import { FC, useState, useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

import styles from './settingsModal.module.scss';
import PatientSettings from './settingsModal/patientSettings';
import ListSettings from './settingsModal/listSettings';

import { gender, labTestType } from '@resusio/simlab';
import { SimlabContext } from '../../contexts/simlabContext';
import { SettingsContext, SettingsType } from '../../contexts/settingsContext';

interface SettingsModalProps {
  onCancel: () => void;
  onSave: (newSettings: SettingsType) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ onCancel, onSave }) => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { simlab } = useContext(SimlabContext);

  const [ptInfo, setPtInfo] = useState(settings.patient);
  const [selectedTests, setSelectedTests] = useState(settings.testIds);
  const [selectedOrderSets, setSelectedOrderSets] = useState(settings.orderSetIds);
  const [selectedDiseases, setSelectedDiseases] = useState(settings.diseaseIds);

  const masterLabList = simlab.getAllLabTests();
  const masterOrdersetList = simlab.getAllOrderSets();
  const masterDiseaseList = simlab.getAllDiseases();

  return (
    <Tab.Container defaultActiveKey="patient">
      <Modal show={true} onHide={onCancel} dialogClassName={styles.modal} backdrop="static">
        <Modal.Header>
          <Nav variant="pills" className="px-3">
            <Nav.Item>
              <Nav.Link eventKey="patient">Patient</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="report">Tests</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="diseases">Diseases</Nav.Link>
            </Nav.Item>
          </Nav>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-0">
          <Row>
            <Col xs={12}>
              <Tab.Content className="px-3">
                <Tab.Pane eventKey="report">
                  <Container fluid>
                    <Row className="pt-4">
                      <Col>
                        <h5>Individual Tests</h5>
                        <ListSettings
                          masterList={masterLabList}
                          selected={selectedTests}
                          onChange={(newTests) => setSelectedTests(newTests)}
                        />
                      </Col>
                    </Row>
                    <hr className="my-4" />
                    <Row className="">
                      <Col>
                        <h5>Order Sets</h5>
                        <ListSettings
                          masterList={masterOrdersetList}
                          selected={selectedOrderSets}
                          onChange={(newOrderSets) => setSelectedOrderSets(newOrderSets)}
                        />
                      </Col>
                    </Row>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="patient">
                  <PatientSettings
                    patientInfo={ptInfo}
                    onChange={(newPtInfo) => setPtInfo(newPtInfo)}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="diseases">
                  <Row className="pt-4">
                    <Col>
                      <ListSettings
                        masterList={masterDiseaseList}
                        selected={selectedDiseases}
                        onChange={(newDiseases) => setSelectedDiseases(newDiseases)}
                      />
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const newSettings = {
                patient: ptInfo,
                testIds: selectedTests,
                orderSetIds: selectedOrderSets,
                diseaseIds: selectedDiseases,
              };
              setSettings(newSettings);
              onSave(newSettings);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Tab.Container>
  );
};

export default SettingsModal;
