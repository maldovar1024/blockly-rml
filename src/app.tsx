import { Col, Row } from 'antd';
import { FC } from 'react';
import SourceManager from './source-manager';

const App: FC = () => {
  return (
    <Row className="app">
      <Col span="4">
        <SourceManager />
      </Col>
      <Col span="14">2</Col>
      <Col span="6">3</Col>
    </Row>
  );
};

export default App;
