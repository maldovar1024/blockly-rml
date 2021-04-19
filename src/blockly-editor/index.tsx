import BlocklyContainer from '@/blockly-container';
import { WorkspaceChangeCallback } from '@/blockly-container/types';
import store, { connect, setMappingCode } from '@/stores';
import { BlocklyOptions, BlockSvg, Events } from 'blockly';
import { Component, createRef } from 'react';
import { ConnectedProps } from 'react-redux';
import initialWorkspace from './initial-workspace.xml';
import customMenuOptions from './menu-options';
import {
  createBlock,
  jsonBlocks,
  LogicalSourceBlock,
  names,
  ObjectMapBlock,
} from './rml-blocks';
import RMLGenerator from './rml-generator';
import toolbox from './toolbox.xml';

function getFilenames() {
  return store.getState().source.map(({ filename }) => {
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

  private blocklyOptions: BlocklyOptions = {
    collapse: true,
    move: {
      scrollbars: true,
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
  ];

  private onWorkspaceChange: WorkspaceChangeCallback = evt => {
    this.props.setMappingCode(
      this.rmlGenerator.workspaceToCode(evt.getEventWorkspace_())
    );
  };

  private workspaceChangeCallbacks = [
    this.onWorkspaceChange,
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
