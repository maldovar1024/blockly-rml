import BlocklyContainer from '@/blockly-container';
import { WorkspaceChangeCallback } from '@/blockly-container/types';
import { connect, setMappingCode } from '@/stores';
import { Component } from 'react';
import { ConnectedProps } from 'react-redux';
import blocklyOptions from './blockly-options';
import initialWorkspace from './initial-workspace.xml';
import mutators from './mutators';
import rmlBlocks from './rml-blocks.json';
import RMLGenerator from './rml-generator';

const rmlGenerator = new RMLGenerator();

class BlocklyEditor extends Component<BlocklyEditorProps> {
  private onWorkspaceChange: WorkspaceChangeCallback = evt => {
    this.props.setMappingCode(
      rmlGenerator.workspaceToCode(evt.getEventWorkspace_())
    );
  };

  render() {
    return (
      <BlocklyContainer
        blocklyOptions={blocklyOptions}
        customBlocks={rmlBlocks}
        initialWorkspace={initialWorkspace}
        mutators={mutators}
        onWorkspaceChange={this.onWorkspaceChange}
      />
    );
  }
}

const blocklyEditorWrapper = connect(null, {
  setMappingCode,
});

type BlocklyEditorProps = ConnectedProps<typeof blocklyEditorWrapper>;

export default blocklyEditorWrapper(BlocklyEditor);
