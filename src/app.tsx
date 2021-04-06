import { Button, Col, Row } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';
import './app.less';
import {
  blocklyOptions,
  initialWorkspace,
  mutators,
  rmlBlocks,
  RMLGenerator,
} from './blockly-editor';
import BlocklyContainer from './blockly-container';
import type { WorkspaceChangeCallback } from './blockly-container/types';
import SourceManager from './source-manager';
import { downloadFile, uploadFile } from './utils';

const rmlGenerator = new RMLGenerator();

const App: FC = () => {
  const [code, setCode] = useState('');
  const editor = useRef<BlocklyContainer | null>(null);

  const onWorkspaceChange = useCallback<WorkspaceChangeCallback>(evt => {
    setCode(rmlGenerator.workspaceToCode(evt.getEventWorkspace_()));
  }, []);

  const exportBlocks = useCallback(() => {
    if (editor.current === null) {
      return;
    }
    const xml = editor.current.exportBlocks();
    downloadFile(xml, 'blocks.xml');
  }, []);

  const handleUpload = useCallback(async () => {
    if (editor.current === null) {
      return;
    }
    const file = await uploadFile('.xml');
    if (file === undefined) {
      return;
    }
    const editorElement = editor.current;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      editorElement.importBlocks(content);
    };
    reader.readAsText(file);
  }, []);

  return (
    <Row className="app">
      <Col span="4">
        <SourceManager />
      </Col>
      <Col span="14">
        <BlocklyContainer
          ref={editor}
          blocklyOptions={blocklyOptions}
          customBlocks={rmlBlocks}
          initialWorkspace={initialWorkspace}
          mutators={mutators}
          onWorkspaceChange={onWorkspaceChange}
        />
      </Col>
      <Col span="6">
        <Button type="primary" onClick={exportBlocks}>
          导出
        </Button>
        <Button onClick={handleUpload}>导入</Button>
        <pre className="code">{code}</pre>
      </Col>
    </Row>
  );
};

export default App;
