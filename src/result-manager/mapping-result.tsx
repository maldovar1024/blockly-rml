/** 展示生成的映射代码的组件 */
import { useAppDispatch, useAppSelector } from '@/stores';
import { fetchMappingResult } from '@/stores/results';
import { FailedMappingResult, MappingResultStatus } from '@/stores/types';
import { Button } from 'antd';
import { FC } from 'react';

const MappingResult: FC = () => {
  const mappingResult = useAppSelector(store => store.results.mappingResult);

  let content;
  if (mappingResult.status === MappingResultStatus.initial) {
    content = '点击运行执行映射';
  } else if (mappingResult.status === MappingResultStatus.pending) {
    content = '执行中...';
  } else if (mappingResult.status === MappingResultStatus.successful) {
    content = mappingResult.result;
  } else {
    content = (mappingResult as FailedMappingResult).message;
  }

  const dispatch = useAppDispatch();
  const executeMapping = async () => {
    dispatch(fetchMappingResult());
  };

  return (
    <>
      <Button onClick={executeMapping}>RUN</Button>
      <div className="result">{content}</div>
    </>
  );
};

export default MappingResult;
