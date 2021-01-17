import { FC } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export interface PageHeaderProps {
  title: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title }) => (
  <Row>
    <Col xs={12}>
      <h3 className="d-print-none">{title}</h3>
    </Col>
  </Row>
);

export default PageHeader;
