import { Col, Row } from 'antd';
import { FC, useCallback, useState } from 'react';
import './app.less';
import {
  blocklyOptions,
  initialWorkspace,
  rmlBlocks,
  RMLGenerator,
} from './blockly-configs';
import BlocklyContainer, { WorkspaceChangeCallback } from './blockly-editor';
import SourceManager from './source-manager';

const rmlGenerator = new RMLGenerator();

const App: FC = () => {
  const [code, setCode] = useState('');

  const onWorkspaceChange = useCallback<WorkspaceChangeCallback>(evt => {
    setCode(rmlGenerator.workspaceToCode(evt.getEventWorkspace_()));
  }, []);

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
          onWorkspaceChange={onWorkspaceChange}
        />
      </Col>
      <Col span="6">
        <pre className="code">{code}</pre>
      </Col>
    </Row>
  );
};

export default App;
