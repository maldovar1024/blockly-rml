import Blockly, { BlockSvg } from 'blockly';

type BlockSvgInterface_ = Omit<Partial<BlockSvg>, 'init'>;

/**
 * 定义 Block 的接口
 *
 * **注意**：函数要使用 `variable = function () {}` 的形式定义
 */
export interface BlockSvgInterface extends BlockSvgInterface_ {
  name: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  json: object;
  init?: () => void;
  mutationToDom?: () => Element;
  domToMutation?: (element: Element) => void;
}

export default function defineBlock(blockDefinition: BlockSvgInterface) {
  const { name, json, init, ...rest } = blockDefinition;
  Blockly.Blocks[name] = <BlockSvg>{
    init() {
      this.jsonInit(json);
      init?.apply(this);
    },
    ...rest,
  };
}
