import { List } from 'antd';
import { FC } from 'react';
import './csv-viewer.less';

export interface CSVViewerProps {
  structure: string[];
}

const CSVViewer: FC<CSVViewerProps> = props => {
  return (
    <List
      className="csv-viewer"
      bordered
      dataSource={props.structure}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  );
};

export default CSVViewer;
