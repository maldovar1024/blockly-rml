import { Tabs } from 'antd';
import { FC } from 'react';
import './index.less';
import MappingCode from './mapping-code';
import MappingResult from './mapping-result';

const { TabPane } = Tabs;

const ResultManager: FC = () => {
  return (
    <Tabs className="results">
      <TabPane tab="映射代码" key="mapping-code">
        <MappingCode />
      </TabPane>
      <TabPane tab="映射结果" key="mapping-result">
        <MappingResult />
      </TabPane>
    </Tabs>
  );
};

export default ResultManager;
