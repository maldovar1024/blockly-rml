import { Col, Row } from 'antd';
import { FC } from 'react';
import './app.less';
import BlocklyEditor from './blockly-editor';
import { MappingCode } from './result-manager';
import SourceManager from './source-manager';

const App: FC = () => {
  return (
    <Row className="app">
      <Col span="4">
        <SourceManager />
      </Col>
      <Col span="15">
        <BlocklyEditor />
      </Col>
      <Col span="5">
        <MappingCode />
      </Col>
    </Row>
  );
};

export default App;
