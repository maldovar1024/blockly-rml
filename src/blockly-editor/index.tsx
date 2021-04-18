import BlocklyContainer from '@/blockly-container';
import {
  CustomMenuOptions,
  WorkspaceChangeCallback,
} from '@/blockly-container/types';
import { connect, setMappingCode } from '@/stores';
import { BlocklyOptions, Events } from 'blockly';
import { Component, createRef } from 'react';
import { ConnectedProps } from 'react-redux';
import initialWorkspace from './initial-workspace.xml';
import {
  staticWorkspaceMenuOptions,
  createImportWorkspaceMenuOption,
} from './menu-options';
import {
  createBlock,
  jsonBlocks,
  LogicalSourceBlock,
  ObjectMapBlock,
} from './rml-blocks';
import names from './rml-blocks/names';
import RMLGenerator from './rml-generator';
import toolbox from './toolbox.xml';

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
    createBlock(workspace, {
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
    new LogicalSourceBlock(),
    new ObjectMapBlock(this.rmlGenerator.getTripleMapNames),
  ];

  /** 自定义右键菜单 */
  private customMenuOptions: CustomMenuOptions = {
    workspaceMenuItems: [
      ...staticWorkspaceMenuOptions,
      createImportWorkspaceMenuOption(this.rmlGenerator.collectInfoFromXml),
    ],
  };

  /** 要注销的默认菜单 */
  private unregisteredMenus = ['workspaceDelete', 'blockInline'];

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
        customMenuOptions={this.customMenuOptions}
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
