import { useAppSelector } from '@/stores';
import { downloadFile } from '@/utils';
import { Button } from 'antd';
import { FC } from 'react';

/**
 * 展示映射代码的组件
 */
const MappingCode: FC = () => {
  const code = useAppSelector(store => store.results.code);
  const handleClick = () => {
    downloadFile(code, 'rml-mapping.ttl');
  };

  return (
    <>
      <div className="controller">
        <Button onClick={handleClick}>导出</Button>
      </div>
      <pre className="mapping-code">
        <code>{code}</code>
      </pre>
    </>
  );
};

export default MappingCode;
