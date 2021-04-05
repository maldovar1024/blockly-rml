import { uploadFile } from '@/utils';
import { addSource, connect, removeSource } from '@stores';
import { Filetype, mimeTypes } from '@stores/types';
import { Tabs, TabsProps } from 'antd';
import { Component } from 'react';
import { ConnectedProps } from 'react-redux';
import './index.less';
import { CSVViewer, JSONViewer } from './source-viewer';

const { TabPane } = Tabs;

type TabEditEvent = Exclude<TabsProps['onEdit'], undefined>;

const mimeTypeString = mimeTypes.join(',');

interface SourceManagerState {
  activeKey?: string;
}

class SourceManager extends Component<SourceManagerProps, SourceManagerState> {
  state: Readonly<SourceManagerState> = {};

  private setActiveKey = (activeKey: string) => {
    this.setState({ activeKey });
  };

  private handleUpload = (file: File) => {
    const { addSource } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (file.type === Filetype.CSV) {
        const structure = content.split('\n')[0].split(',');
        addSource({
          filename: file.name,
          content,
          filetype: file.type,
          structure,
        });
      } else if (file.type === Filetype.JSON) {
        addSource({
          filename: file.name,
          content,
          filetype: file.type,
          structure: JSON.parse(content),
        });
      }
    };
    reader.readAsText(file);
  };

  private onEdit: TabEditEvent = async (target, action) => {
    const { removeSource } = this.props;
    if (action === 'add') {
      const file = await uploadFile(mimeTypeString);
      if (file !== undefined) {
        this.handleUpload(file);
      }
    } else if (typeof target === 'string') {
      removeSource(target);
    }
  };

  render() {
    const { activeKey } = this.state;
    const { files } = this.props;
    return (
      <Tabs
        className="source-manager"
        type="editable-card"
        activeKey={activeKey}
        onChange={this.setActiveKey}
        onEdit={this.onEdit}
      >
        {files.map(file => (
          <TabPane key={file.filename} tab={file.filename}>
            {file.filetype === Filetype.CSV ? (
              <CSVViewer structure={file.structure} />
            ) : (
              <JSONViewer structure={file.structure} />
            )}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

const sourceManagerWrapper = connect(
  store => ({
    files: store.source,
  }),
  {
    addSource,
    removeSource,
  }
);

type SourceManagerProps = ConnectedProps<typeof sourceManagerWrapper>;

export default sourceManagerWrapper(SourceManager);
