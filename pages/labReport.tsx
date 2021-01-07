import { Fragment, useEffect, useState, useContext } from 'react';
import _ from 'underscore';

//import simlabService from "../components/simlabService";
import { SettingsContext } from '../contexts/settingsContext';
import { SimlabContext } from '../contexts/simlabContext';

import TestResultTable from '../components/labReport/testResultTable';
import SettingsModal from '../components/labReport/settingsModal';

import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { fullTestResultType } from '@resusio/simlab';

function isNumeric(str: any) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN((str as unknown) as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const LabReport = () => {
  const [results, setResults] = useState<fullTestResultType>({
    categories: [],
    tests: {},
  });
  const [showSettings, setShowSettings] = useState(false);

  const { settings } = useContext(SettingsContext);
  const { simlab } = useContext(SimlabContext);

  useEffect(() => {
    const labResults = simlab.fetchLabReport();

    // TODO: Decide, if simlab has no results in it, generate an initial set or show the settings dialog.
    // Probable should just show results for a healthy generic patient, basic labs

    setResults(labResults);
  }, []);

  return (
    <>
      {showSettings ? (
        <SettingsModal
          onCancel={() => setShowSettings(false)}
          onSave={(newSettings) => setShowSettings(false)}
        />
      ) : null}

      <Row>
        <Col xs={12}>
          <h3 className="d-print-none">Lab Report</h3>
          <h5 className="d-print-none">
            {settings?.patient.name}, MRN: {settings?.patient.mrn}
          </h5>
          <h3 className="d-none d-print-block">{settings?.patient.name}</h3>
          <h5 className="d-none d-print-block mb-4">
            <em>MRN: {settings?.patient.mrn}</em>
          </h5>
        </Col>
      </Row>
      <Row>
        <Col xs={10} sm={8} md={6} lg={5} xl={4}>
          <TestResultTable results={results} setResults={(newResults) => setResults(newResults)} />
        </Col>
        <Col
          xs={{ span: 10, order: 'first' }}
          sm={{ span: 4, order: 'last' }}
          md={3}
          lg={3}
          xl={2}
          className="d-print-none"
        >
          <div>
            <Button
              variant="danger"
              block
              onClick={() => {
                simlab.generateLabReport();
                const labResults = simlab.fetchLabReport();
                setResults(labResults);
              }}
            >
              Generate New Report
            </Button>

            <Button variant="info" block onClick={() => setShowSettings(!showSettings)}>
              Report Settings...
            </Button>
          </div>
          <div>
            <ButtonGroup vertical className="d-print-none mt-4 mb-4" style={{ width: '100%' }}>
              <Button variant="success" disabled block>
                Save Report...
              </Button>
              <Button variant="success" disabled block>
                Load Report...
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default LabReport;
