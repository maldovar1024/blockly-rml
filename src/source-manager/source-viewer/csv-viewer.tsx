import { createBlock, useAppDispatch } from '@/stores';
import { CSVSource } from '@stores/types';
import { List } from 'antd';
import { FC, MouseEventHandler, useCallback } from 'react';
import './csv-viewer.less';

export interface CSVViewerProps {
  structure: CSVSource['structure'];
}

/**
 * 展示 CSV 文件内容的组件
 */
const CSVViewer: FC<CSVViewerProps> = props => {
  const dispatch = useAppDispatch();

  // 点击列名时自动添加相应的`谓语-宾语映射`
  const handleClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    evt => {
      const item = evt.target as HTMLDivElement;
      dispatch(
        createBlock({
          reference: item.textContent ?? '',
        })
      );
    },
    [dispatch]
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
