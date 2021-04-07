import BlocklyContainer from '@/blockly-container';
import { Component } from 'react';
import blocklyOptions from './blockly-options';
import initialWorkspace from './initial-workspace.xml';
import mutators from './mutators';
import rmlBlocks from './rml-blocks.json';

class BlocklyEditor extends Component {
  render() {
    return (
      <BlocklyContainer
        blocklyOptions={blocklyOptions}
        customBlocks={rmlBlocks}
        initialWorkspace={initialWorkspace}
        mutators={mutators}
      />
    );
  }
}

export default BlocklyEditor;
