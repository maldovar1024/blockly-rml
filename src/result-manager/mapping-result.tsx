/** 展示生成的映射代码的组件 */
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchMappingResult } from '@/stores/results';
import { FailedMappingResult, MappingResultStatus } from '@/stores/types';
import { CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useCallback } from 'react';

const MappingResult: FC = () => {
  const mappingResult = useAppSelector(store => store.results.mappingResult);

  let content;
  if (mappingResult.status === MappingResultStatus.initial) {
    content = '点击 ▶ 执行映射';
  } else if (mappingResult.status === MappingResultStatus.pending) {
    content = <LoadingOutlined />;
  } else if (mappingResult.status === MappingResultStatus.successful) {
    content = mappingResult.result;
  } else {
    content = (mappingResult as FailedMappingResult).message;
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
