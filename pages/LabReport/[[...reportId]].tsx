import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import _ from 'underscore';

import { SettingsContext } from '../../contexts/settingsContext';
import { SimlabContext } from '../../contexts/simlabContext';
import { UserContext } from '../../contexts/userContext';

import { useSavedReport, saveNewReport } from '../../utils/apiHooks';

import TestResultTable from '../../components/labReport/TestResultTable';
import SettingsModal from '../../components/labReport/SettingsModal';
import SettingsBox from '../../components/labReport/SettingsBox';
import SaveModal, { SaveSettingsType } from '../../components/labReport/SaveModal';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Share } from 'react-bootstrap-icons';

import { fullTestResultType } from '@resusio/simlab';

import styles from '../../styles/labReport.module.scss';

const LabReport = () => {
  const [results, setResults] = useState<fullTestResultType>({
    categories: [],
    tests: {},
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loadedReportId, setLoadedReportId] = useState<string | null>(null);

  const { user } = useContext(UserContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const { simlab } = useContext(SimlabContext);

  const router = useRouter();

  // Load the report from the API if requested.
  const { loadedReport, isLoading, isError } = useSavedReport(loadedReportId);

  // Effect to load a lab report from the server, and if not then generate one.
  useEffect(() => {
    // Validate route parameter
    if (
      router.query.reportId &&
      Array.isArray(router.query.reportId) &&
      router.query.reportId.length === 1 &&
      typeof router.query.reportId[0] === 'string'
    ) {
      // Valid report Id passed.
      setLoadedReportId(router.query.reportId[0]);
    } else {
      // No report Id, just generate a default lab set.
      let labResults = simlab.fetchLabReport();

      // If simlab has no results in it, generate an initial set and display
      if (_.keys(labResults.tests).length === 0) {
        simlab.generateLabReport();
        labResults = simlab.fetchLabReport();
      }

      setResults(labResults);
    }
  }, [router.query]);

  // Effect to import a loaded report
  useEffect(() => {
    if (loadedReport) {
      // not null
      setSettings({
        patient: loadedReport.patient,
        testIds: loadedReport.testIds,
        orderSetIds: loadedReport.orderSetIds,
        diseaseIds: loadedReport.diseaseIds,
      }); // Load settings

      // Load data into simlab
      simlab.deserializeReport(loadedReport);

      // Fetch the results and load
      setResults(simlab.fetchLabReport());
    }
  }, [loadedReport]);

  // Save report handler
  const saveReport = async (saveSettings: SaveSettingsType) => {
    if (user && user.userId) {
      const serializedReport = simlab.serializeReport();
      const newReport = {
        userId: user.userId,
        authorName: `${user.firstName} ${user.lastName}`,
        isPublic: saveSettings.isPublic,
        reportName: saveSettings.reportName,
        tags: saveSettings.tags,
        ...serializedReport,

        patient: {
          // Add patient details that simlab package is not aware of
          name: settings.patient.name,
          mrn: settings.patient.mrn,
          ...serializedReport.patient,
        },
      };

      return await saveNewReport(newReport);
    }
    return false; // Save failed as no user currently logged in (should not occur)
  };

  // TODO: better formatting
  if (loadedReportId && isLoading) {
    return <div>Loading...</div>;
  }

  if (loadedReportId && isError) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      {showSettings ? (
        <SettingsModal
          onCancel={() => setShowSettings(false)}
          onSave={(newSettings) => setShowSettings(false)}
        />
      ) : null}

      {showSaveModal ? (
        <SaveModal
          onCancel={() => setShowSaveModal(false)}
          onSave={async (saveSettings) => {
            setShowSaveModal(false); // Close the save dialog

            const result = await saveReport(saveSettings);
            console.log(result);
          }}
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
          {/* TODO: Highligh this button if settings have been updated and are out of sync with results */}
          <Button
            variant="danger"
            block
            onClick={() => {
              simlab.generateLabReport();
              const labResults = simlab.fetchLabReport();
              setResults(labResults);

              router.push('/LabReport');
            }}
          >
            Generate New Report
          </Button>
          {/* TODO: Add info to settings box if this is a previously saved report, to allow updating of existing reports? */}
          <SettingsBox settings={settings} diseaseList={simlab.getAllDiseases()} />
          <Button
            variant="info"
            block
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
          >
            Change Report Settings
          </Button>
          <ButtonGroup vertical className="d-print-none mt-4 mb-4 w-100">
            <Button
              variant="success"
              block
              disabled={!user?.userId}
              onClick={() => setShowSaveModal(true)}
            >
              Save Report
            </Button>
            <Button
              variant="success"
              block
              disabled={!user?.userId}
              onClick={() => {
                router.push('/ListSavedReports');
              }}
            >
              Load Report
            </Button>
            <Button
              variant="success"
              block
              onClick={() =>
                setTimeout(function () {
                  window.print();
                }, 0)
              }
            >
              <b>Print Report</b>
            </Button>
          </ButtonGroup>
          <Button variant="light" block disabled>
            <Share />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default LabReport;
