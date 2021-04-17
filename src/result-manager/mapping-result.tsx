/** 展示生成的映射代码的组件 */
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchMappingResult } from '@/stores/results';
import { MappingResultStatus } from '@/stores/types';
import { CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Quad } from 'n3';
import { FC, useCallback } from 'react';

interface RDFViewerProps {
  quads: Quad[];
}

interface RDFTripleData {
  key: number;
  subject: string;
  predicate: string;
  object: string;
}

const { Column } = Table;

const RDFViewer: FC<RDFViewerProps> = ({ quads }) => {
  const data = quads.map<RDFTripleData>((quad, idx) => ({
    key: idx,
    subject: quad.subject.value,
    predicate: quad.predicate.value,
    object: quad.object.value,
  }));

  return (
    <Table<RDFTripleData>
      dataSource={data}
      pagination={false}
      size="small"
      sticky
      bordered
    >
      <Column title="Subject" dataIndex="subject" key="subject" />
      <Column title="Predicate" dataIndex="predicate" key="predicate" />
      <Column title="Object" dataIndex="object" key="object" />
    </Table>
  );
};

const MappingResult: FC = () => {
  const mappingResult = useAppSelector(store => store.results.mappingResult);

  let content;
  switch (mappingResult.status) {
    case MappingResultStatus.initial:
      content = '点击 ▶ 执行映射';
      break;
    case MappingResultStatus.pending:
      content = <LoadingOutlined />;
      break;
    case MappingResultStatus.successful:
      content = <RDFViewer quads={mappingResult.result} />;
      break;
    default:
      content = mappingResult.message;
      break;
  }

  const { status } = mappingResult;

  const dispatch = useAppDispatch();
  const executeMapping = useCallback(() => {
    dispatch(fetchMappingResult());
  }, [dispatch]);

  const viewerClass =
    status === MappingResultStatus.successful ? 'result-viewer' : 'message';

  return (
    <>
      <Button
        className="execute-btn"
        disabled={status === MappingResultStatus.pending}
        icon={<CaretRightOutlined />}
        onClick={executeMapping}
      ></Button>
      <div className={viewerClass}>{content}</div>
    </>
  );
};

export default MappingResult;
