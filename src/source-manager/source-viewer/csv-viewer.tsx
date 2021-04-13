import { createBlock, useAppDispatch } from '@/stores';
import { CSVSource } from '@stores/types';
import { List } from 'antd';
import { FC, MouseEventHandler, useCallback } from 'react';
import './csv-viewer.less';

export interface CSVViewerProps {
  filename: string;
  structure: CSVSource['structure'];
}

const CSVViewer: FC<CSVViewerProps> = props => {
  const dispatch = useAppDispatch();
  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    evt => {
      const item = evt.target as HTMLDivElement;
      dispatch(
        createBlock({
          filename: props.filename,
          reference: item.textContent ?? '',
        })
      );
    },
    [dispatch, props.filename]
  );
  return (
    <List
      className="csv-viewer"
      bordered
      dataSource={props.structure}
      renderItem={item => <List.Item onClick={handleClick}>{item}</List.Item>}
    />
  );
};

export default CSVViewer;
