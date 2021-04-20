import { CustomMenuOptions } from '@/blockly-container/types';
import { downloadFile, uploadAndReadTextFile } from '@/utils';
import { message } from 'antd';
import { Xml } from 'blockly';
import initialWorkspace from './initial-workspace.xml';
import { createBlock, names } from './rml-blocks';

const unCollapsibleBlock = new Set<string>([
  names.triple_maps.name,
  names.prefix.name,
  names.base_prefix.name,
]);

const customMenuOptions: CustomMenuOptions = {
  workspaceMenuItems: [
    {
      displayText: '添加三元组映射',
      preconditionFn() {
        return 'enabled';
      },
      callback({ workspace }) {
        const {
          triple_maps,
          triple_map,
          logical_source,
          subject_map,
          rr_class,
          predicate_object_maps,
          predicate_map,
          object_map,
        } = names;

        const predicateObjectMapBlock = createBlock(workspace, {
          type: triple_map.name,
          inputs: {
            [triple_map.sourceInput]: {
              type: logical_source.name,
            },
            [triple_map.subjectMapInput]: {
              type: subject_map.name,
              statements: {
                [subject_map.classesStat]: {
                  type: rr_class.name,
                },
              },
            },
          },
          statements: {
            [triple_map.predObjMapsStat]: {
              type: predicate_object_maps.name,
              statements: {
                [predicate_object_maps.predMapsStat]: {
                  type: predicate_map.name,
                },
                [predicate_object_maps.objMapsStat]: {
                  type: object_map.name,
                  fields: {
                    [object_map.typeDrop]: 'reference',
                    [object_map.mapValue]: '',
                  },
                },
              },
            },
          },
        });

        const tripleMapBlocks = workspace.getBlocksByType(
          triple_map.name,
          true
        );
        const lastTripleMapBlock = tripleMapBlocks[tripleMapBlocks.length - 1];
        if (lastTripleMapBlock) {
          lastTripleMapBlock.nextConnection.connect(
            predicateObjectMapBlock.previousConnection
          );
        } else {
          const topBlock = workspace.getBlocksByType(triple_maps.name, true)[0];
          topBlock
            ?.getInput(triple_maps.tripleMapsStat)
            .connection.connect(predicateObjectMapBlock.previousConnection);
        }
      },
      id: 'add_triple_map',
      weight: 100,
    },
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
          const result = Xml.clearWorkspaceAndLoadFromXml(xml, workspace);
          if (result.length === 0) {
            Xml.domToWorkspace(Xml.textToDom(initialWorkspace), workspace);
            throw new Error();
          }
        } catch (error) {
          message.error({ content: '解析文件失败，请确认文件内容' });
        }
      },
      id: 'import_workspace',
      weight: 100,
    },
  ],
  blockMenuItems: [
    {
      displayText({ block }) {
        return block.isCollapsed() ? '展开块' : '折叠块';
      },
      preconditionFn({ block }) {
        if (!block.isInFlyout && !unCollapsibleBlock.has(block.type)) {
          return 'enabled';
        }
        return 'hidden';
      },
      callback({ block }) {
        block.setCollapsed(!block.isCollapsed());
      },
      id: 'collapse-expand-block',
      weight: 4,
    },
  ],
};

export default customMenuOptions;
