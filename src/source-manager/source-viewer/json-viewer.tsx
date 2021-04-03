import { FC } from 'react';
import ReactJson from 'react-json-view';

export interface JSONViewerProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  structure: object;
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
