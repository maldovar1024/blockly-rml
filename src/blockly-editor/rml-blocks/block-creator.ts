import { BlockSvg, WorkspaceSvg } from 'blockly';

/** 块的描述 */
export interface BlockShape {
  /** 块的类型 */
  type: string;
  /** 块的所有 `field_input` 的名字和值 */
  fields?: Record<string, unknown>;
  /** 块的所有 `input_value` 的名字和值 */
  inputs?: Record<string, BlockShape>;
  /** 块的所有 `input_statement` 的名字和值 */
  statements?: Record<string, BlockShape>;
}

/**
 * 根据块的描述在工作区中创建一个新的块
 * @param workspace 要创建块的工作区
 * @param block 块的描述
 * @returns 创建的块
 */
export default function createBlock(
  workspace: WorkspaceSvg,
  block: BlockShape
): BlockSvg {
  const { type, fields = {}, inputs = {}, statements = {} } = block;
  const root = workspace.newBlock(type) as BlockSvg;
  Object.keys(fields).forEach(name => {
    root.setFieldValue(fields[name], name);
  });
  Object.keys(inputs).forEach(name => {
    const input = createBlock(workspace, inputs[name]);
    root.getInput(name).connection.connect(input.outputConnection);
  });
  Object.keys(statements).forEach(name => {
    const statement = createBlock(workspace, statements[name]);
    root.getInput(name).connection.connect(statement.previousConnection);
  });
  root.initSvg();
  root.render();
  return root;
}
