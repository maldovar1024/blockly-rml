import { BlockSvgInterface } from '@/blockly-container/define-block';
import jsonBlocks from './json-blocks';
import logicalSourceBlock from './logical-source';

export default <BlockSvgInterface[]>[...jsonBlocks, logicalSourceBlock];
