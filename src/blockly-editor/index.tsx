import BlocklyContainer from '@/blockly-container';
import { WorkspaceChangeCallback } from '@/blockly-container/types';
import { connect, setMappingCode } from '@/stores';
import { BlocklyOptions, Events } from 'blockly';
import { Component, createRef } from 'react';
import { ConnectedProps } from 'react-redux';
import initialWorkspace from './initial-workspace.xml';
import customMenuOptions from './menu-options';
import rmlBlocks from './rml-blocks';
import { createBlock } from './rml-blocks/block-creator';
import names from './rml-blocks/names';
import RMLGenerator from './rml-generator';
import toolbox from './toolbox.xml';

const rmlGenerator = new RMLGenerator();

class BlocklyEditor extends Component<BlocklyEditorProps> {
  private ref = createRef<BlocklyContainer>();

  componentDidUpdate(prevProps: BlocklyEditorProps) {
    if (prevProps.newBlockParam.id !== this.props.newBlockParam.id) {
      this.createMap();
    }
  }

  private createMap() {
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
        [predicate_object_maps.ObjMapsStat]: {
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
    comments: true,
    collapse: true,
    grid: {
      spacing: 20,
      length: 1,
      colour: '#888',
      snap: true,
    },
    move: {
      scrollbars: true,
    },
    sounds: false,
    trashcan: true,
    toolbox,
  };

  private unregisteredMenus = ['workspaceDelete'];

  private onWorkspaceChange: WorkspaceChangeCallback = evt => {
    this.props.setMappingCode(
      rmlGenerator.workspaceToCode(evt.getEventWorkspace_())
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
        customBlocks={rmlBlocks}
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
