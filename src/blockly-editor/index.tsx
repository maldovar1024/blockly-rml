import BlocklyContainer, { WorkspaceChangeCallback } from '@/blockly-container';
import store, { connect, setMappingCode } from '@/stores';
import { Filetype } from '@/stores/types';
import { BlocklyOptions, BlockSvg, Events } from 'blockly';
import { Component, createRef } from 'react';
import { ConnectedProps } from 'react-redux';
import initialWorkspace from './initial-workspace.xml';
import customMenuOptions from './menu-options';
import {
  createBlock,
  jsonBlocks,
  LogicalSourceBlock,
  LogicalSourceType,
  names,
  ObjectMapBlock,
} from './rml-blocks';
import RMLGenerator from './rml-generator';
import toolbox from './toolbox.xml';

/**
 * 根据 `LogicalSourceBlock` 的选项筛选出相符的源文件名
 * @param block `LogicalSourceBlock`
 * @returns 筛选出的文件名组成的数组，不包括文件扩展名
 */
function getFilenames(block: BlockSvg) {
  const filetype = block.getFieldValue(
    names.logical_source.filetypeDrop
  ) as LogicalSourceType;
  return store
    .getState()
    .source.filter(
      file =>
        (filetype === 'csv' && file.filetype === Filetype.CSV) ||
        (filetype === 'json' && file.filetype === Filetype.JSON)
    )
    .map(({ filename }) => {
      const idx = filename.lastIndexOf('.');
      return idx === -1 ? filename : filename.slice(0, idx);
    });
}

class BlocklyEditor extends Component<BlocklyEditorProps> {
  private ref = createRef<BlocklyContainer>();

  componentDidUpdate(prevProps: BlocklyEditorProps) {
    if (prevProps.newBlockParam.id !== this.props.newBlockParam.id) {
      this.createPredicateObjectMap();
    }
  }

  /**
   * 根据 `props` 中的 `newBlockParam`，创建一个新的`谓语-宾语映射`
   * 并将它放在顶层块的正下方
   */
  private createPredicateObjectMap() {
    const editor = this.ref.current;
    if (!editor) {
      return;
    }

    const { predicate_object_maps, predicate_map, object_map } = names;
    const workspace = editor.mainWorkspace;
    const predicateObjectMapBlock = createBlock(workspace, {
      type: predicate_object_maps.name,
      statements: {
        [predicate_object_maps.predMapsStat]: {
          type: predicate_map.name,
        },
        [predicate_object_maps.objMapsStat]: {
          type: object_map.name,
          fields: {
            [object_map.typeDrop]: 'reference',
            [object_map.mapValue]: this.props.newBlockParam.reference,
          },
        },
      },
    });

    const topBlock = workspace.getBlocksByType(
      names.triple_maps.name,
      true
    )[0] as BlockSvg | undefined;
    if (topBlock) {
      const position = topBlock.getRelativeToSurfaceXY();
      const { height } = topBlock.getHeightWidth();
      predicateObjectMapBlock.moveTo(position.translate(0, height));
    }
  }

  /** 注入 Blockly 的配置 */
  private blocklyOptions: BlocklyOptions = {
    collapse: true,
    move: {
      scrollbars: true,
    },
    zoom: {
      wheel: true,
      maxScale: 1,
      minScale: 0.7,
    },
    sounds: false,
    toolbox,
  };

  /** 代码生成器 */
  private rmlGenerator = new RMLGenerator();

  /** 自定义块 */
  private rmlBlocks = [
    ...jsonBlocks,
    new LogicalSourceBlock(getFilenames),
    new ObjectMapBlock(this.rmlGenerator.getTripleMapNames),
  ];

  /** 要注销的默认菜单 */
  private unregisteredMenus = [
    'workspaceDelete',
    'blockInline',
    'blockCollapseExpand',
    'cleanWorkspace',
    'collapseWorkspace',
    'expandWorkspace',
  ];

  /** 生成代码的回调函数 */
  private generateCode: WorkspaceChangeCallback = evt => {
    this.props.setMappingCode(
      this.rmlGenerator.workspaceToCode(evt.getEventWorkspace_())
    );
  };

  /** 工作区变化时的回调函数 */
  private workspaceChangeCallbacks: WorkspaceChangeCallback[] = [
    this.generateCode,
    Events.disableOrphans,
  ];

  render() {
    return (
      <BlocklyContainer
        ref={this.ref}
        blocklyOptions={this.blocklyOptions}
        customBlocks={this.rmlBlocks}
        customMenuOptions={customMenuOptions}
        unregisteredMenuItems={this.unregisteredMenus}
        initialWorkspace={initialWorkspace}
        workspaceChangeCallbacks={this.workspaceChangeCallbacks}
      />
    );
  }
}

const blocklyEditorWrapper = connect(
  store => ({
    newBlockParam: store.editorCommand,
  }),
  {
    setMappingCode,
  }
);

type BlocklyEditorProps = ConnectedProps<typeof blocklyEditorWrapper>;

export default blocklyEditorWrapper(BlocklyEditor);
