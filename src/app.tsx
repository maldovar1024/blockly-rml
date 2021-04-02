import { Button, Col, Row, Upload } from 'antd';
import { FC, useCallback, useRef, useState } from 'react';
import './app.less';
import {
  blocklyOptions,
  initialWorkspace,
  mutators,
  rmlBlocks,
  RMLGenerator,
} from './blockly-configs';
import BlocklyContainer from './blockly-editor';
import type { WorkspaceChangeCallback } from './blockly-editor/types';
import SourceManager from './source-manager';

const rmlGenerator = new RMLGenerator();

function download(content: string, filename: string) {
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}

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
    download(xml, 'blocks.xml');
  }, []);

  const handleUpload = useCallback((file: File) => {
    if (editor.current === null) {
      return false;
    }
    const realEditor = editor.current;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      realEditor.importBlocks(content);
    };
    reader.readAsText(file);
    return false;
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
        <Upload
          accept=".xml"
          beforeUpload={handleUpload}
          showUploadList={false}
        >
          <Button>导入</Button>
        </Upload>
        <pre className="code">{code}</pre>
      </Col>
    </Row>
  );
};

export default App;
