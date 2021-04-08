import { CustomMenuOptions } from '@/blockly-container/types';
import { downloadFile, uploadAndReadTextFile } from '@/utils';
import { message } from 'antd';
import { Xml } from 'blockly';

const customMenuOptions: CustomMenuOptions = {
  workspaceMenuItems: [
    {
      displayText: '导出',
      preconditionFn() {
        return 'enabled';
      },
      callback({ workspace }) {
        const xml = Xml.workspaceToDom(workspace);
        const xmlText = Xml.domToPrettyText(xml);
        downloadFile(xmlText, 'rml-blocks.xml');
      },
      id: 'export_workspace',
      weight: 100,
    },
    {
      displayText: '导入',
      preconditionFn() {
        return 'enabled';
      },
      async callback({ workspace }) {
        const content = await uploadAndReadTextFile('.xml');
        if (content === undefined) {
          message.error({ content: '读取文件失败' });
          return;
        }
        try {
          const xml = Xml.textToDom(content);
          Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
        } catch (error) {
          message.error({ content: '解析文件失败，请确认文件内容' });
        }
      },
      id: 'import_workspace',
      weight: 100,
    },
  ],
};

export default customMenuOptions;
