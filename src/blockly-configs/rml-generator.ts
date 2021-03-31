import { Block, BlockSvg, Generator } from 'blockly';

interface StatementGenerator {
  (block: BlockSvg): string;
}

type PredicateMapType = 'constant' | 'template';
type ObjectMapType = 'constant' | 'reference';

// TODO: 支持其它文件类型
class RMLGenerator extends Generator {
  constructor() {
    super('RML');
  }

  /** 实际使用的缩进 */
  private readonly indent = '  ';
  /** 清除默认的缩进 */
  readonly INDENT = '';

  /** 生成整个代码文件 */
  triple_maps: StatementGenerator = block => {
    const prefixes = this.statementToCode(block, 'prefixes');
    const triple_maps = this.statementToCode(block, 'triple_maps');
    return `${prefixes}\n${triple_maps}`;
  };

  /** 生成一个前缀 */
  prefix: StatementGenerator = block => {
    const prefix = block.getFieldValue('prefix');
    const value = block.getFieldValue('value');
    return `@prefix ${prefix}: ${value}.\n`;
  };

  /** 生成一个三元组映射 */
  triple_map: StatementGenerator = block => {
    const name = block.getFieldValue('map_name');
    const source = this.statementToCode(block, 'source');
    const subjectMap = this.statementToCode(block, 'subject_map');
    const predicateObjectMaps = this.statementToCode(
      block,
      'predicate_object_maps'
    );
    const content = this.prefixLines(
      `${source};\n${subjectMap};\n${predicateObjectMaps}.`,
      this.indent
    );
    return `<#${name}>\n${content}`;
  };

  /** 生成逻辑源 */
  logical_source: StatementGenerator = block => {
    const filename = block.getFieldValue('filename');
    return (
      `rml:logicalSource [\n` +
      `  rml:source "${filename}";\n` +
      `  rml:referenceFormulation ql:CSV\n` +
      `]`
    );
  };

  /** 生成一个主语映射 */
  subject_map: StatementGenerator = block => {
    const template = block.getFieldValue('template');
    const rr_class = this.statementToCode(block, 'classes');
    return (
      `rr:subjectMap [\n` +
      `  rr:template "${template}";\n` +
      `  ${rr_class}\n` +
      `]`
    );
  };

  /** 生成主语的类型 */
  rr_class: StatementGenerator = block => {
    const rr_class = block.getFieldValue('class');
    return `rr:class ${rr_class}`;
  };

  /** 生成谓语-宾语映射 */
  predicate_object_maps: StatementGenerator = block => {
    const predicate_maps = this.statementToCode(block, 'predicate_maps');
    const object_maps = this.statementToCode(block, 'object_maps');
    const content = this.prefixLines(
      `${predicate_maps};\n${object_maps}\n`,
      this.indent
    );
    return `rr:predicateObjectMap [\n${content}]`;
  };

  /** 生成一个谓语映射 */
  predicate_map: StatementGenerator = block => {
    const type = block.getFieldValue('type') as PredicateMapType;
    const value = block.getFieldValue('value');
    if (type === 'constant') {
      return `rr:predicate ${value}`;
    }
    return `rr:predicateMap [\n  rr:template "${value}"\n]`;
  };

  /** 生成一个宾语映射 */
  object_map: StatementGenerator = block => {
    const type = block.getFieldValue('type') as ObjectMapType;
    const value = block.getFieldValue('value');
    if (type === 'constant') {
      return `rr:object ${value}`;
    }
    return `rr:objectMap [\n  rml:reference "${value}"\n]`;
  };

  scrub_(block: Block, code: string, opt_thisOnly?: boolean) {
    const nextBlock = block.nextConnection?.targetBlock();
    if (!nextBlock || opt_thisOnly) {
      return code;
    }

    const nextCode = this.blockToCode(nextBlock);
    const { type } = block;
    let delimiter: string;
    switch (type) {
      case 'prefix':
        delimiter = '';
        break;
      case 'triple_map':
        delimiter = '\n\n';
        break;
      case 'rr_class':
        delimiter = ';\n  ';
        break;
      default:
        delimiter = ':\n';
        break;
    }
    return code + delimiter + nextCode;
  }
}

export default RMLGenerator;
