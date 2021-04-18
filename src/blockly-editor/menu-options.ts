import { WorkspaceMenuItem } from '@/blockly-container/types';
import { downloadFile, uploadAndReadTextFile } from '@/utils';
import { message } from 'antd';
import { Xml } from 'blockly';
import initialWorkspace from './initial-workspace.xml';
import RMLGenerator from './rml-generator';

export interface MenuOptionCreatorOptions {
  rmlGenerator: RMLGenerator;
}

export const staticWorkspaceMenuOptions: WorkspaceMenuItem[] = [
  {
    displayText: '重置工作区',
    preconditionFn() {
      return 'enabled';
    },
    callback({ workspace }) {
      const xml = Xml.textToDom(initialWorkspace);
      Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
    },
    id: 'reset_workspace',
    weight: 100,
  },
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
];

export function createImportWorkspaceMenuOption(
  callback: (xml: Element) => void
): WorkspaceMenuItem {
  return {
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
        callback(xml);
        Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
      } catch (error) {
        message.error({ content: '解析文件失败，请确认文件内容' });
      }
    },
    id: 'import_workspace',
    weight: 100,
  };
}
