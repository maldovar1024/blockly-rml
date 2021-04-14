import { JSONSource } from '@stores/types';
import { FC } from 'react';
import ReactJson from 'react-json-view';
import './json-viewer.less';

export interface JSONViewerProps {
  structure: JSONSource['structure'];
}

const JSONViewer: FC<JSONViewerProps> = props => {
  return (
    <ReactJson
      src={props.structure}
      name={null}
      theme="bright:inverted"
      indentWidth={2}
      displayDataTypes={false}
      displayObjectSize={false}
      enableClipboard={false}
      quotesOnKeys={false}
      // @ts-expect-error 类型定义中缺少此项
      displayArrayKey={false}
    />
  );
};

export default JSONViewer;
