import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

import useReportList from '../utils/api/useReportList';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import PageHeader from '../components/PageHeader';
import Tag from '../components/Tag';

import { SimlabContext } from '../contexts/simlabContext';
import { asSimlabUser } from '../utils/authTypes';

const ListSavedReports = () => {
  const auth0 = useAuth0();
  const currentUser = asSimlabUser(auth0.user);

  const { simlab } = useContext(SimlabContext);

  // Fetch the report list with SWR
  const { reportList, loading, error } = useReportList();

  // TODO: format these.
  if (!currentUser?.userId) return <div>Must be Logged In</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const diseaseMasterList = simlab.getAllDiseases();

  if (reportList)
    return (
      <>
        <PageHeader title="Saved Lab Reports" />
        <Row xs={1} sm={2} lg={3} xl={4}>
          {reportList.map((report) => (
            <Col key={report.id} className="mb-4">
              <Card className="h-100">
                <Card.Header as="h5">
                  {report.reportName}
                  {report.isPublic ? (
                    <small className="text-success d-block">Public</small>
                  ) : (
                    <small className="text-danger d-block">Private</small>
                  )}
                </Card.Header>
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
