import { Col, Row } from 'antd';
import { FC } from 'react';
import './app.less';
import { blocklyOptions, initialWorkspace, rmlBlocks } from './blockly-configs';
import BlocklyContainer from './blockly-editor';
import SourceManager from './source-manager';

const App: FC = () => {
  return (
    <Row className="app">
      <Col span="4">
        <SourceManager />
      </Col>
      <Col span="14">
        <BlocklyContainer
          blocklyOptions={blocklyOptions}
          customBlocks={rmlBlocks}
          initialWorkspace={initialWorkspace}
        />
      </Col>
      <Col span="6">3</Col>
    </Row>
  );
};

export default App;
