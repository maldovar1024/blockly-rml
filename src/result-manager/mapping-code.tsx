/** 展示生成的映射代码的组件 */
import { useAppSelector } from '@/stores';
import { FC } from 'react';

const MappingCode: FC = () => {
  const code = useAppSelector(store => store.results.code);
  return (
    <pre className="mapping-code">
      <code>{code}</code>
    </pre>
  );
};

export default MappingCode;
