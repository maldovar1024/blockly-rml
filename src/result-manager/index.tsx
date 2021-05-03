import { LoadingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { FC, lazy, Suspense } from 'react';
import './index.less';
import MappingCode from './mapping-code';
import NetworkErrorBoundary from './network-error-boundary';

const { TabPane } = Tabs;

const noResult = process.env.REACT_APP_WITHOUT_BACKEND !== undefined;

const MappingResult = lazy(() => import('./mapping-result'));

const ResultManager: FC = () => {
  return (
    <Tabs className="results">
      <TabPane tab="映射代码" key="mapping-code">
        <MappingCode />
      </TabPane>
      {noResult || (
        <TabPane tab="映射结果" key="mapping-result">
          <NetworkErrorBoundary>
            <Suspense
              fallback={
                <div className="message">
                  <LoadingOutlined />
                </div>
              }
            >
              <MappingResult />
            </Suspense>
          </NetworkErrorBoundary>
        </TabPane>
      )}
    </Tabs>
  );
};

export default ResultManager;
