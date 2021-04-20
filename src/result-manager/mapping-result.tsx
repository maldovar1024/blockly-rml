/** 展示生成的映射代码的组件 */
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchMappingResult } from '@/stores/results';
import { MappingResultStatus } from '@/stores/types';
import { CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Quad } from 'n3';
import { FC, useCallback } from 'react';
import './mapping-result.less';

interface RDFViewerProps {
  quads: Quad[];
}

type RDFValue = [value: string, abbr: string];

interface RDFTripleData {
  key: number;
  subject: RDFValue;
  predicate: RDFValue;
  object: RDFValue;
}

const { Column } = Table;

/**
 * 拆分出 URI 最后一个 `/` 或 `#` 后的部分
 * @returns [完整的 `uri`, 拆分出的部分]
 */
function makeRDFValue(uri: string): RDFValue {
  for (let i = uri.length - 1; i >= 0; i--) {
    if (uri[i] === '/' || uri[i] === '#') {
      return [uri, uri.slice(i + 1)];
    }
  }
  return [uri, uri];
}

/** 将 Quad 数据转换为表格需要的格式 */
function rdfTripleProcessor(quad: Quad, idx: number): RDFTripleData {
  const subject = makeRDFValue(quad.subject.value);
  const predicate = makeRDFValue(quad.predicate.value);

  let object: RDFValue;
  if (quad.object.termType === 'Literal') {
    const termType = makeRDFValue(quad.object.datatype.value);
    const { value } = quad.object;
    object = [`${value}^^${termType[0]}`, `${value}^^${termType[1]}`];
  } else {
    object = makeRDFValue(quad.object.value);
  }
  return {
    key: idx,
    subject,
    predicate,
    object,
  };
}

function renderColumn(value: RDFValue) {
  return <span title={value[0]}>{value[1]}</span>;
}

const RDFViewer: FC<RDFViewerProps> = ({ quads }) => {
  const data = quads.map<RDFTripleData>(rdfTripleProcessor);

  return (
    <Table<RDFTripleData>
      dataSource={data}
      pagination={false}
      size="small"
      sticky
      bordered
    >
      <Column
        title="Subject"
        dataIndex="subject"
        ellipsis
        render={renderColumn}
      />
      <Column
        title="Predicate"
        dataIndex="predicate"
        ellipsis
        render={renderColumn}
      />
      <Column
        title="Object"
        dataIndex="object"
        ellipsis
        render={renderColumn}
      />
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
