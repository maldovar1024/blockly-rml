import { RootStore, useAppSelector } from '@/stores';
import { downloadFile } from '@/utils';
import { createSelector } from '@reduxjs/toolkit';
import { Button } from 'antd';
import { FC, useEffect, useRef } from 'react';
import './mapping-code.less';

/** 生成代码行号 */
const lineNumbersSelector = createSelector<RootStore, string, string>(
  store => store.results.code,
  code => {
    if (code.length === 0) {
      return '';
    }

    let lines = 1;
    for (const ch of code) {
      if (ch === '\n') {
        lines++;
      }
    }
    return (
      Array.from({ length: lines })
        .map((_, i) => `${i + 1}`)
        .join('\n') + '\n\n' // 换行符用于占水平滚动条的位置
    );
  }
);

/**
 * 展示映射代码的组件
 */
const MappingCode: FC = () => {
  const code = useAppSelector(store => store.results.code);
  const lineNumbers = useAppSelector(lineNumbersSelector);

  const handleClick = () => {
    downloadFile(code, 'rml-mapping.ttl');
  };

  const lineNumberRef = useRef<HTMLDivElement>(null);

  // 同步行数与代码的滚动位置
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lineNumberDiv = lineNumberRef.current!;
    const pre = lineNumberDiv.nextElementSibling as HTMLPreElement;
    function scrollLineNumbers() {
      lineNumberDiv.scrollTop = pre.scrollTop;
    }
    pre.addEventListener('scroll', scrollLineNumbers, { passive: true });
    return () => {
      pre.removeEventListener('scroll', scrollLineNumbers);
    };
  }, []);

  return (
    <>
      <div className="controller">
        <Button onClick={handleClick}>导出</Button>
      </div>
      <div className="line-numbers" ref={lineNumberRef}>
        {lineNumbers}
      </div>
      <pre className="mapping-code">
        <code>{code}</code>
      </pre>
    </>
  );
};

export default MappingCode;
