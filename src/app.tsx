import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import { useToggle } from 'react-use';
import './app.less';
import BlocklyEditor from './blockly-editor';
import MappingResult from './result-manager';
import SourceManager from './source-manager';

const App: FC = () => {
  const [collapsed, toggle] = useToggle(false);

  return (
    <main className={`app${collapsed ? ' collapsed' : ''}`}>
      <Button
        className="source-controller"
        onClick={toggle}
        icon={<ArrowLeftOutlined />}
      />
      <SourceManager />
      <BlocklyEditor />
      <MappingResult />
    </main>
  );
};

export default App;
