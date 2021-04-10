import { BlockSvgInterface } from '@/blockly-container/define-block';
import jsonBlocks from './json-blocks';
import logicalSourceBlock from './logical-source';
import objectMap from './object-map';

export default <BlockSvgInterface[]>[
  ...jsonBlocks,
  logicalSourceBlock,
  objectMap,
];
