import BlocklyContainer from '@/blockly-container';
import { WorkspaceChangeCallback } from '@/blockly-container/types';
import { connect, setMappingCode } from '@/stores';
import { BlocklyOptions, Events } from 'blockly';
import { Component } from 'react';
import { ConnectedProps } from 'react-redux';
import initialWorkspace from './initial-workspace.xml';
import customMenuOptions from './menu-options';
import rmlBlocks from './rml-blocks';
import RMLGenerator from './rml-generator';
import toolbox from './toolbox.xml';

const rmlGenerator = new RMLGenerator();

class BlocklyEditor extends Component<BlocklyEditorProps> {
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
        blocklyOptions={this.blocklyOptions}
        customBlocks={rmlBlocks}
        customMenuOptions={customMenuOptions}
        initialWorkspace={initialWorkspace}
        workspaceChangeCallbacks={this.workspaceChangeCallbacks}
      />
    );
  }
}

const blocklyEditorWrapper = connect(null, {
  setMappingCode,
});

type BlocklyEditorProps = ConnectedProps<typeof blocklyEditorWrapper>;

export default blocklyEditorWrapper(BlocklyEditor);
