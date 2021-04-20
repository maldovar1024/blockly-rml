import { Col, Row } from 'antd';
import { FC } from 'react';
import './app.less';
import BlocklyEditor from './blockly-editor';
import MappingResult from './result-manager';
import SourceManager from './source-manager';

const App: FC = () => {
  return (
    <Row className="app">
      <Col span="4">
        <SourceManager />
      </Col>
      <Col span="14">
        <BlocklyEditor />
      </Col>
      <Col span="6">
        <MappingResult />
      </Col>
    </Row>
  );
};

export default App;
