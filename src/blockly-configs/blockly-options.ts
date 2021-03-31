import { BlocklyOptions } from 'blockly';
import toolbox from './toolbox.xml';

const blocklyOptions: BlocklyOptions = {
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

export default blocklyOptions;
