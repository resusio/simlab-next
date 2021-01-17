import { FC } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export interface PatientHeaderProps {
  name: string;
  mrn: string;
  age: number;
}

const PatientHeader: FC<PatientHeaderProps> = ({ name, mrn, age }) => (
  <Row className="mb-4">
    <Col xs={12}>
      <h5 className="d-print-none">
        {name}, MRN: {mrn}
      </h5>
      <h3 className="d-none d-print-block">{name}</h3>
      <h5 className="d-none d-print-block mb-4">
        <em>
          MRN: {mrn}, Age: {age} years
        </em>
      </h5>
    </Col>
  </Row>
);

export default PatientHeader;
