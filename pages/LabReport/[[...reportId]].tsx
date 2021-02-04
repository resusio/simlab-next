import { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import _ from 'underscore';

import { SettingsContext } from '../../contexts/settingsContext';
import { SimlabContext } from '../../contexts/simlabContext';

import useSavedReport from '../../api-lib/client/useSavedReport';
import { saveNewReport, saveUpdateReport } from '../../api-lib/client/saveReport';
import useAlertQueue from '../../utils/hooks/useAlertQueue';

import PageHeader from '../../components/PageHeader';
import PatientHeader from '../../components/labReport/PatientHeader';
import TestResultTable from '../../components/labReport/TestResultTable';
import SettingsModal from '../../components/labReport/SettingsModal';
import SettingsBox from '../../components/labReport/SettingsBox';
import SaveModal, { SaveSettingsType } from '../../components/labReport/SaveModal';

import { asSimlabUser } from '../../utils/authTypes';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';
import { Share } from 'react-bootstrap-icons';

import { fullTestResultType } from '@resusio/simlab';

import styles from '../../styles/labReport.module.scss';

const LabReport = () => {
  const router = useRouter();
  const loadedReportId = router?.query?.reportId?.[0] ?? null;

  const auth0 = useAuth0();
  const currentUser = asSimlabUser(auth0.user);

  const [results, setResults] = useState<fullTestResultType>({
    categories: [],
    tests: {},
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showUpdateSaveModal, setShowUpdateSaveModal] = useState(false);
  const [isSettingsUpdated, setIsSettingsUpdated] = useState(false);
  const { pushAlert, AlertsList } = useAlertQueue(4000);

  const { settings, setSettings } = useContext(SettingsContext);
  const { simlab } = useContext(SimlabContext);

  // Load the report from the API if requested.
  const { loadedReport, loading, error, mutateReportLocal } = useSavedReport(loadedReportId);

  // Flag indicating if there is currently a report loaded
  const isReportLoaded = loadedReportId && loadedReport && !loading && !error;
  // Flag indicating if the currently loaded report belongs to this user
  const isMyReport = loadedReport?.userId === currentUser?.userId;

  // Effect to import a loaded report, or generate a new report
  useEffect(() => {
    if (router.isReady) {
      if (loadedReport) {
        // Load data into simlab
        simlab.deserializeReport(loadedReport);

        setSettings({
          patient: loadedReport.patient,
          testIds: loadedReport.testIds,
          orderSetIds: loadedReport.orderSetIds,
          diseaseIds: loadedReport.diseaseIds,
        }); // Load settings

        // Fetch the results and load
        setResults(simlab.fetchLabReport());
      } else if (!loadedReportId && !(loadedReport || loading)) {
        let labResults = simlab.fetchLabReport();

        // If simlab has no results in it, generate an initial set and display
        if (_.keys(labResults.tests).length === 0) {
          simlab.generateLabReport();
          labResults = simlab.fetchLabReport();
        }

        setResults(labResults);
      }
    }
  }, [loadedReport, router.isReady, loadedReportId, loading]);

  // Save report handler
  const saveReport = async (saveSettings: SaveSettingsType) => {
    if (currentUser && currentUser.userId) {
      const serializedReport = simlab.serializeReport();
      const newReport = {
        userId: currentUser.userId,
        authorName: currentUser.fullName,
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

      return await saveNewReport(newReport, auth0).catch(() => false); // return null if failed
    }

    return false; // Save failed as no user currently logged in (should not occur)
  };

  // Save report handler
  const updateReport = async (updateSaveSettings: SaveSettingsType) => {
    if (currentUser && currentUser.userId && loadedReportId && isMyReport) {
      const serializedReport = simlab.serializeReport();
      const newReport = {
        userId: currentUser.userId,
        authorName: currentUser.fullName,
        isPublic: updateSaveSettings.isPublic,
        reportName: updateSaveSettings.reportName,
        tags: updateSaveSettings.tags,
        ...serializedReport,

        patient: {
          // Add patient details that simlab package is not aware of
          name: settings.patient.name,
          mrn: settings.patient.mrn,
          ...serializedReport.patient,
        },
      };

      return await saveUpdateReport(loadedReportId, newReport, auth0).catch(() => false); // return null if failed
    }

    return false; // Save failed as no user currently logged in (should not occur)
  };

  if ((loadedReportId && loading) || !router.isReady) {
    return (
      <>
        <PageHeader title="Lab Report" />
        <Row>
          <Col xs={12}>
            <Spinner animation="border" />
          </Col>
        </Row>
      </>
    );
  }

  if (loadedReportId && error) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      {showSettingsModal ? (
        <SettingsModal
          onCancel={() => setShowSettingsModal(false)}
          onSave={(newSettings) => {
            if (!_.isMatch(settings, newSettings)) {
              setIsSettingsUpdated(true);
              setSettings(newSettings);
            }
            setShowSettingsModal(false);
          }}
        />
      ) : null}

      {showSaveModal ? (
        <SaveModal
          onCancel={() => setShowSaveModal(false)}
          onSave={async (saveSettings) => {
            setShowSaveModal(false); // Close the save dialog

            const newReportId = await saveReport(saveSettings);

            if (newReportId) {
              router.push(
                {
                  pathname: '/LabReport/[reportId]',
                  query: { reportId: newReportId },
                },
                undefined,
                { shallow: true }
              );
              pushAlert(
                `Your lab report has been saved as '${saveSettings.reportName}'!`,
                'success'
              );
            } else
              pushAlert(
                `We were unable to save report '${saveSettings.reportName}', please try again later.`
              );
          }}
        />
      ) : null}

      {showUpdateSaveModal ? (
        <SaveModal
          onCancel={() => setShowUpdateSaveModal(false)}
          onSave={async (saveSettings) => {
            setShowUpdateSaveModal(false); // Close the save dialog

            const updatedReportId = await updateReport(saveSettings);

            if (updatedReportId) {
              router.push(
                {
                  pathname: '/LabReport/[reportId]',
                  query: { reportId: updatedReportId },
                },
                undefined,
                { shallow: true }
              );
              pushAlert(
                `Your lab report named '${saveSettings.reportName}' has been updated!`,
                'success'
              );
            } else
              pushAlert(
                `We were unable to update report '${saveSettings.reportName}', please try again later.`
              );
          }}
          existingSettings={loadedReport ?? undefined}
        />
      ) : null}

      {AlertsList}

      <PageHeader title="Lab Report" />
      {settings?.patient ? <PatientHeader {...settings.patient} /> : null}
      <Row>
        <Col xs={12} sm={8} md={6} lg={5} xl={4}>
          <TestResultTable
            results={results}
            setResults={(newResults) => {
              setResults(newResults); // Set the local state results

              // Mutate the SWR store with new results
              mutateReportLocal(simlab.serializeReport());
            }}
          />
        </Col>
        <Col
          xs={{ span: 12, order: 'first' }}
          sm={{ span: 4, order: 'last' }}
          md={3}
          lg={3}
          xl={2}
          className="d-print-none"
        >
          <Button
            variant="danger"
            className={isSettingsUpdated ? styles.pulsing : undefined}
            block
            onClick={() => {
              simlab.generateLabReport();
              const labResults = simlab.fetchLabReport();
              setResults(labResults);

              setIsSettingsUpdated(false); // Clear flag now that new results were generated

              //router.push('/LabReport');
            }}
          >
            Generate New Report
          </Button>

          {loading ? (
            <Spinner animation="border" />
          ) : (
            <SettingsBox settings={settings} diseaseList={simlab.getAllDiseases()} />
          )}
          <Button
            variant="info"
            block
            className={styles.settingsButton}
            onClick={() => setShowSettingsModal(!showSettingsModal)}
          >
            Change Report Settings
          </Button>
          <ButtonGroup vertical className="d-print-none mt-4 w-100">
            <Button
              variant="success"
              block
              disabled={!(isReportLoaded && isMyReport)}
              onClick={() => setShowUpdateSaveModal(true)}
            >
              Update Saved Report
            </Button>
            <Button
              variant="success"
              block
              disabled={!currentUser?.userId}
              onClick={() => setShowSaveModal(true)}
            >
              Save Report As...
            </Button>
            <Button
              variant="success"
              className={styles.sepAbove}
              block
              disabled={!currentUser?.userId}
              onClick={() => {
                router.push('/ListSavedReports');
              }}
            >
              Load Report
            </Button>
          </ButtonGroup>
          <ButtonGroup vertical className="d-print-none mt-4 mb-4 w-100">
            <Button
              variant="primary"
              block
              onClick={() =>
                setTimeout(function () {
                  window.print();
                }, 0)
              }
            >
              <b>Print Report</b>
            </Button>
            <Button variant="primary" block>
              <span className="mr-3">
                <Share />
              </span>
              <span>Share</span>
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  );
};

export default LabReport;
