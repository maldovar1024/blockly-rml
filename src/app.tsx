import { FC } from 'react';
import './app.less';
import BlocklyEditor from './blockly-editor';
import MappingResult from './result-manager';
import SourceManager from './source-manager';

const App: FC = () => {
  return (
    <main className="app">
      <SourceManager />
      <BlocklyEditor />
      <MappingResult />
    </main>
  );
};

export default App;
