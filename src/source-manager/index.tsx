import { Tabs, TabsProps, Upload } from 'antd';
import { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores';
import { addSource, removeSource } from '../stores/source';

const { TabPane } = Tabs;

type TabEditEvent = TabsProps['onEdit'];

const SourceManager: FC = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const files = useAppSelector(state => state.source);
  const dispatch = useAppDispatch();

  const handleUpload = (file: File) => {
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const structure = content.split('\n')[0].split(',');
      dispatch(addSource({ filename: file.name, content, structure }));
    };
    reader.readAsText(file);
    return false;
  };

  const onEdit: TabEditEvent = (target, action) => {
    if (action === 'add') {
      return;
    }
    if (typeof target !== 'string') {
      console.warn(target);
      return;
    }
    dispatch(removeSource(target));
  };

  const addFile = (
    <Upload accept=".csv" beforeUpload={handleUpload} showUploadList={false}>
      +
    </Upload>
  );

  return (
    <Tabs
      addIcon={addFile}
      type="editable-card"
      activeKey={activeKey}
      onChange={setActiveKey}
      onEdit={onEdit}
    >
      {files.length === 0
        ? '点击加号导入文件'
        : files.map(file => (
            <TabPane key={file.filename} tab={file.filename}>
              {file.structure.toString()}
            </TabPane>
          ))}
    </Tabs>
  );
};

export default SourceManager;
