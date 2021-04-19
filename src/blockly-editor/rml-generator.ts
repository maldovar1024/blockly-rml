import { Block, BlockSvg, Generator, Workspace } from 'blockly';
import {
  LogicalSourceType,
  names,
  ObjectMapType,
  PredicateMapType,
} from './rml-blocks';

interface ExpressionGenerator {
  (block: BlockSvg): [string | number, number];
}

interface StatementGenerator {
  (block: BlockSvg): string;
}

class RMLGenerator extends Generator {
  constructor() {
    super('RML');
  }

  /** 映射中所有三元组的名字 */
  private _tripleMapNames = new Set<string>();

  getTripleMapNames = () => {
    return [...this._tripleMapNames];
  };

  /** 表达式的优先级 */
  private static PRECEDENCE = 0;
  /** 实际使用的缩进 */
  private readonly indent = '  ';
  /** 清除默认的缩进 */
  readonly INDENT = '';

  workspaceToCode(workspace: Workspace) {
    // 每次生成代码时重置
    this._tripleMapNames = new Set();
    return super.workspaceToCode(workspace);
  }

  valueToCode(block: Block, name: string): string {
    return super.valueToCode(block, name, RMLGenerator.PRECEDENCE);
  }

  private expression(code: string): ReturnType<ExpressionGenerator> {
    return [code, RMLGenerator.PRECEDENCE];
  }

  private indentLines(text: string): string {
    return this.prefixLines(text, this.indent);
  }

  /** 生成整个代码文件 */
  triple_maps: StatementGenerator = block => {
    const { prefixesStat, tripleMapsStat } = names.triple_maps;
    const prefixes = this.statementToCode(block, prefixesStat);
    const triple_maps = this.statementToCode(block, tripleMapsStat);
    return `${prefixes}\n${triple_maps}`;
  };

  /** 生成一个前缀 */
  prefix: StatementGenerator = block => {
    const { prefixValue, fullValueValue } = names.prefix;
    const prefix = block.getFieldValue(prefixValue);
    const fullValue = block.getFieldValue(fullValueValue);
    return `@prefix ${prefix}: ${fullValue}.\n`;
  };

  base_prefix: StatementGenerator = block => {
    const { uriValue } = names.base_prefix;
    const uri = block.getFieldValue(uriValue);
    return `@base ${uri}.\n`;
  };

  /** 生成一个三元组映射 */
  triple_map: StatementGenerator = block => {
    const {
      nameValue,
      sourceInput,
      subjectMapInput,
      predObjMapsStat,
    } = names.triple_map;
    const name = block.getFieldValue(nameValue);
    const source = this.valueToCode(block, sourceInput);
    const subjectMap = this.valueToCode(block, subjectMapInput);
    const predicateObjectMaps = this.statementToCode(block, predObjMapsStat);
    const content = this.indentLines(
      `${source};\n${subjectMap};\n${predicateObjectMaps}.`
    );
    this._tripleMapNames.add(name);
    return `<#${name}> a rr:TriplesMap;\n${content}`;
  };

  private static logicalSourceMap: Record<
    LogicalSourceType,
    (...rest: string[]) => string
  > = {
    csv: () => 'rml:referenceFormulation ql:CSV',
    json: (iterator: string) =>
      'rml:referenceFormulation ql:JSONPath;\n' +
      `  rml:iterator "${iterator}"`,
  };

  /** 生成逻辑源 */
  logical_source: ExpressionGenerator = block => {
    const { filenameValue, filetypeDrop, iteratorValue } = names.logical_source;
    const filename = block.getFieldValue(filenameValue);
    const filetype = block.getFieldValue(filetypeDrop) as LogicalSourceType;
    const iterator = block.getFieldValue(iteratorValue);
    const reference = RMLGenerator.logicalSourceMap[filetype](iterator);
    const code =
      `rml:logicalSource [\n` +
      `  rml:source "${filename}.${filetype}";\n` +
      `  ${reference}\n` +
      `]`;
    return this.expression(code);
  };

  /** 生成一个主语映射 */
  subject_map: ExpressionGenerator = block => {
    const { templateValue, classesStat } = names.subject_map;
    const template = block.getFieldValue(templateValue);
    const rr_class = this.indentLines(this.statementToCode(block, classesStat));
    const code =
      `rr:subjectMap [\n` +
      `  rr:template "${template}";\n` +
      `${rr_class}\n` +
      `]`;
    return [code, RMLGenerator.PRECEDENCE];
  };

  /** 生成主语的类型 */
  rr_class: StatementGenerator = block => {
    const { classValue } = names.rr_class;
    const rr_class = block.getFieldValue(classValue);
    return `rr:class ${rr_class}`;
  };

  /** 生成谓语-宾语映射 */
  predicate_object_maps: StatementGenerator = block => {
    const { predMapsStat, objMapsStat } = names.predicate_object_maps;
    const predicate_maps = this.statementToCode(block, predMapsStat);
    const object_maps = this.statementToCode(block, objMapsStat);
    const content = this.indentLines(`${predicate_maps};\n${object_maps}\n`);
    return `rr:predicateObjectMap [\n${content}]`;
  };

  /** 生成一个谓语映射 */
  predicate_map: StatementGenerator = block => {
    const { typeDrop, mapValue } = names.predicate_map;
    const type = block.getFieldValue(typeDrop) as PredicateMapType;
    const value = block.getFieldValue(mapValue);
    if (type === 'constant') {
      return `rr:predicate ${value}`;
    }
    return `rr:predicateMap [\n  rr:template "${value}"\n]`;
  };

  /** 生成一个宾语映射 */
  object_map: StatementGenerator = block => {
    const {
      typeDrop,
      datatypeValue,
      mapValue,
      parentMapValue,
      joinConditionStat,
    } = names.object_map;
    const type = block.getFieldValue(typeDrop) as ObjectMapType;
    const value = block.getFieldValue(mapValue);
    switch (type) {
      case 'constant':
        return `rr:object ${value}`;
      case 'reference': {
        const datatype = block.getFieldValue(datatypeValue);
        const datatypeMap = datatype ? `;\n  rr:datatype ${datatype}\n` : '\n';
        return `rr:objectMap [\n  rml:reference "${value}"${datatypeMap}]`;
      }
      case 'join': {
        const parentMap = block.getFieldValue(parentMapValue);
        const joinCondition = this.statementToCode(block, joinConditionStat);
        const content = this.indentLines(
          `rr:parentTriplesMap <#${parentMap}>;\n${
            joinCondition === '' ? '' : `${joinCondition}\n`
          }`
        );
        return `rr:objectMap [\n${content}]`;
      }
      default:
        return '';
    }
  };

  /** 生成一个连接条件 */
  join_condition: StatementGenerator = block => {
    const { childRefValue, parentRefValue } = names.join_condition;
    const childRef = block.getFieldValue(childRefValue);
    const parentRef = block.getFieldValue(parentRefValue);
    return (
      'rr:joinCondition [\n' +
      `  rr:child "${childRef}"\n` +
      `  rr:parent "${parentRef}"\n` +
      ']'
    );
  };

  private static delimiterMap: Record<string, string | undefined> = {
    prefix: '',
    base_prefix: '',
    triple_map: '\n\n',
  };

  private static defaultDelimiter = ';\n';

  scrub_(block: Block, code: string, opt_thisOnly?: boolean) {
    const nextBlock = block.nextConnection?.targetBlock();
    if (!nextBlock || opt_thisOnly) {
      return code;
    }

    const nextCode = this.blockToCode(nextBlock);
    const delimiter =
      RMLGenerator.delimiterMap[block.type] ?? RMLGenerator.defaultDelimiter;
    return code + delimiter + nextCode;
  }
}

export default RMLGenerator;
