/** 展示生成的映射代码的组件 */
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchMappingResult } from '@/stores/results';
import { MappingResultStatus } from '@/stores/types';
import { CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Quad } from 'n3';
import { FC, useCallback } from 'react';
import './index.less';

interface RDFValue {
  /** 完整的 uri */
  uri: string;
  /** uri 的简写 */
  abbr: string;
}

/**
 * 拆分出 URI 最后一个 `/` 或 `#` 后的部分
 */
function makeRDFValue(uri: string): RDFValue {
  for (let i = uri.length - 1; i >= 0; i--) {
    if (uri[i] === '/' || uri[i] === '#') {
      return {
        uri,
        abbr: uri.slice(i + 1),
      };
    }
  }
  return {
    uri,
    abbr: uri,
  };
}

interface RDFTripleData {
  key: number;
  subject: RDFValue;
  predicate: RDFValue;
  object: RDFValue;
}

/** 将 Quad 数据转换为表格需要的格式 */
function rdfTripleProcessor(quad: Quad, idx: number): RDFTripleData {
  const subject = makeRDFValue(quad.subject.value);
  const predicate = makeRDFValue(quad.predicate.value);

  let object: RDFValue;
  if (quad.object.termType === 'Literal') {
    // 字面值按 `值^^类型` 的格式表示
    const termType = makeRDFValue(quad.object.datatype.value);
    const { value } = quad.object;
    object = {
      uri: `${value}^^${termType.uri}`,
      abbr: `${value}^^${termType.abbr}`,
    };
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
  return <span title={value.uri}>{value.abbr}</span>;
}

interface RDFViewerProps {
  /** 四元组的数组，`graph` 属性不会被处理 */
  quads: Quad[];
}

const { Column } = Table;

/**
 * 以表格的形式展示三元组
 */
const RDFViewer: FC<RDFViewerProps> = ({ quads }) => {
  const data = quads.map(rdfTripleProcessor);

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

/**
 * 展示映射结果的组件
 */
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
      // failed
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
      <div className="controller">
        <Button
          className="execute-btn"
          disabled={status === MappingResultStatus.pending}
          icon={<CaretRightOutlined />}
          onClick={executeMapping}
        />
      </div>
      <div className={viewerClass}>{content}</div>
    </>
  );
};

export default MappingResult;
