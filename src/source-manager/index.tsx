import { uploadFile } from '@/utils';
import {
  addSource,
  removeSource,
  useAppDispatch,
  useAppSelector,
} from '@stores';
import { Filetype, mimeTypes } from '@stores/types';
import { Tabs, TabsProps } from 'antd';
import { FC, useState } from 'react';
import './index.less';
import { CSVViewer, JSONViewer } from './source-viewer';

const { TabPane } = Tabs;

type TabEditEvent = Exclude<TabsProps['onEdit'], undefined>;

const mimeTypeString = mimeTypes.join(',');

const SourceManager: FC = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const files = useAppSelector(state => state.source);
  const dispatch = useAppDispatch();

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (file.type === Filetype.CSV) {
        const structure = content.split('\n')[0].split(',');
        dispatch(
          addSource({
            filename: file.name,
            content,
            filetype: file.type,
            structure,
          })
        );
      } else if (file.type === Filetype.JSON) {
        dispatch(
          addSource({
            filename: file.name,
            content,
            filetype: file.type,
            structure: JSON.parse(content),
          })
        );
      }
    };
    reader.readAsText(file);
  };

  const onEdit: TabEditEvent = async (target, action) => {
    if (action === 'add') {
      const file = await uploadFile(mimeTypeString);
      if (file !== undefined) {
        handleUpload(file);
      }
    } else if (typeof target === 'string') {
      dispatch(removeSource(target));
    }
  };

  return (
    <Tabs
      className="source-manager"
      type="editable-card"
      activeKey={activeKey}
      onChange={setActiveKey}
      onEdit={onEdit}
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
};

export default SourceManager;
