import { useContext } from 'react';
import Link from 'next/link';

import { useReportList } from '../utils/apiHooks';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import Tag from '../components/Tag';

import { UserContext } from '../contexts/userContext';
import { SimlabContext } from '../contexts/simlabContext';

const ListSavedReports = () => {
  const { user } = useContext(UserContext);
  const { simlab } = useContext(SimlabContext);

  const { reportList, isLoading, isError } = useReportList(user?.userId);

  // TODO: format these.
  if (!user?.userId) return <div>Must be Logged In</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const diseaseMasterList = simlab.getAllDiseases();

  if (reportList)
    return (
      <>
        <Row>
          <Col xs={12}>
            <h3 className="d-print-none mb-4">Saved Lab Reports</h3>
          </Col>
        </Row>
        <Row xs={1} sm={2} lg={3} xl={4}>
          {reportList.map((report) => (
            <Col key={report.id} className="mb-4">
              <Card className="h-100">
                <Card.Header as="h5">{report.reportName}</Card.Header>
                <Card.Body>
                  <Card.Title as="h6">{report.patient.name}</Card.Title>
                  <Card.Subtitle as="h6" className="mb-2 text-muted font-weight-light font-italic">
                    {report.patient.age} year old {report.patient.gender}
                  </Card.Subtitle>
                  <div>
                    {report.tags.map((tag) => (
                      <Tag key={tag} value={tag} />
                    ))}
                  </div>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  {report.diseaseIds.map((diseaseId) => {
                    const disease = diseaseMasterList.find((disease) => disease.id === diseaseId);

                    return disease ? (
                      <ListGroupItem className="py-1" key={diseaseId}>
                        {disease.nomenclature.long}
                      </ListGroupItem>
                    ) : null;
                  })}
                </ListGroup>
                <Card.Footer className="text-center">
                  <Link
                    href={{
                      pathname: '/LabReport/[reportId]',
                      query: { reportId: report.id },
                    }}
                    passHref
                  >
                    <Card.Link className="btn btn-primary">Load Report</Card.Link>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );

  return <div>Loading...</div>;
};

export default ListSavedReports;
