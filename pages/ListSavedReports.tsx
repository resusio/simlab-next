import { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import ErrorPage from 'next/error';
import { useAuth0 } from '@auth0/auth0-react';
import useFuse from '../utils/hooks/useFuse';

import useReportList from '../api/client/useReportList';
import { deleteReport } from '../api/client/deleteReport';

import useConfirmation from '../utils/hooks/useConfirmation';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { Trash } from 'react-bootstrap-icons';

import PageHeader from '../components/PageHeader';
import Tag from '../components/Tag';

import { SimlabContext } from '../contexts/simlabContext';
import { asSimlabUser } from '../utils/authTypes';
import type { ReportListItem } from '../models/reportList.model';
import useAlertQueue from '../utils/hooks/useAlertQueue';

const ListSavedReports = () => {
  const auth0 = useAuth0();
  const currentUser = asSimlabUser(auth0.user);

  const [searchTerm, setSearchTerm] = useState('');

  const { simlab } = useContext(SimlabContext);

  // Fetch the report list with SWR
  const { reportList, loading, error, mutateCache } = useReportList();

  // Hook for confirm delete dialog
  const [openConfirmDelete, ConfirmDeleteDialog] = useConfirmation();

  // Hook for alert queue
  const { pushAlert, AlertsList } = useAlertQueue(4000);

  const diseaseMasterList = useMemo(() => [...simlab.getAllDiseases()], [simlab]);
  const reportListWithDiseaseNames = useMemo(
    () =>
      reportList?.map((report) => {
        const updatedReport: ReportListItem & { diseaseNames: string[] } = {
          ...report,
          diseaseNames: report.diseaseIds.map(
            (diseaseId) =>
              diseaseMasterList.find((disease) => disease.id === diseaseId)?.nomenclature?.long ??
              ''
          ),
        };

        return updatedReport;
      }),
    [reportList, diseaseMasterList]
  );
  const fuse = useFuse(reportListWithDiseaseNames ?? [], [
    'reportName',
    'tags',
    'diseaseNames',
    'diseaseIds',
    'patient.name',
    'patient.mrn',
  ]);

  if (error) {
    return <ErrorPage statusCode={500} />;
  }

  if (auth0.isLoading || loading) {
    return (
      <>
        <PageHeader title="Saved Lab Reports" />
        <Row>
          <Col xs={12}>
            <Spinner animation="border" />
          </Col>
        </Row>
      </>
    );
  }

  if (reportListWithDiseaseNames) {
    const results = fuse.search(searchTerm).filter((item) => item.score && item.score <= 0.3);
    const resultsWithDefault =
      results && results?.length > 0
        ? results
        : reportListWithDiseaseNames.map((report) => ({ item: report, refIndex: 0 })); // Reformat to the fuse result format so it can be rendered by the same code.

    return (
      <>
        <PageHeader title="Saved Lab Reports" />

        <ConfirmDeleteDialog />

        {AlertsList}

        <Form.Control
          type="text"
          value={searchTerm}
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Row xs={1} sm={2} lg={3} xl={4}>
          {resultsWithDefault.map(({ item }) => (
            <Col key={item.id} className="mb-4">
              <Card className="h-100">
                <Card.Header as="h5">
                  {item.reportName}
                  {item.isPublic ? (
                    <small className="text-success d-block">Public</small>
                  ) : (
                    <small className="text-danger d-block">Private</small>
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Title as="h6">{item.patient.name}</Card.Title>
                  <Card.Subtitle as="h6" className="mb-2 text-muted font-weight-light font-italic">
                    {item.patient.age} year old {item.patient.gender}
                  </Card.Subtitle>
                  <div>
                    {item.tags.map((tag) => (
                      <Tag key={tag} value={tag} />
                    ))}
                  </div>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  {item.diseaseNames.map((diseaseName, index) => {
                    return diseaseName ? (
                      <ListGroupItem className="py-1" key={item.diseaseIds[index]}>
                        {diseaseName}
                      </ListGroupItem>
                    ) : null;
                  })}
                </ListGroup>
                <Card.Footer>
                  <Link
                    href={{
                      pathname: '/LabReport/[reportId]',
                      query: { reportId: item.id },
                    }}
                    passHref
                  >
                    <Card.Link className="btn btn-primary">Load Report</Card.Link>
                  </Link>
                  <Card.Link
                    className="btn btn-danger"
                    style={{ float: 'right' }}
                    onClick={() =>
                      openConfirmDelete({
                        message: (
                          <span>
                            Are you sure that you want to delete <strong>{item.reportName}</strong>{' '}
                            for patient{' '}
                            <em>
                              {item.patient.name} (MRN: {item.patient.mrn})
                            </em>
                            ?
                          </span>
                        ),
                        doAction: async () => {
                          const result = await deleteReport(item.id, auth0);
                          if (result) {
                            mutateCache(); // update swr list with deleted item.
                            return true;
                          } else {
                            pushAlert(
                              `We were unable to delete the lab report named '${item.reportName}', please try again later.`
                            );
                            return false;
                          }
                        },
                      })
                    }
                  >
                    <Trash />
                  </Card.Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  }

  return <div>Loading...</div>;
};

export default ListSavedReports;
