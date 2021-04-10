/** 只需要 json 定义的 block */
import { BlockSvgInterface } from '@/blockly-container/define-block';
import names from './names';

export default <BlockSvgInterface[]>[
  {
    name: 'triple_maps',
    json: {
      type: 'triple_maps',
      message0: 'Prefixes %1 Triple Maps %2',
      args0: [
        {
          type: 'input_statement',
          name: names.triple_maps.prefixesStat,
          check: 'prefix',
        },
        {
          type: 'input_statement',
          name: names.triple_maps.tripleMapsStat,
          check: 'triple_map',
        },
      ],
      colour: 0,
      tooltip: '定义三元组映射',
    },
  },
  {
    name: 'prefix',
    json: {
      type: 'prefix',
      message0: '%1 : %2',
      args0: [
        {
          type: 'field_input',
          name: names.prefix.prefixValue,
          text: '',
        },
        {
          type: 'field_input',
          name: names.prefix.fullValueValue,
          text: '',
        },
      ],
      previousStatement: 'prefix',
      nextStatement: 'prefix',
      colour: 230,
      tooltip: '定义映射中用到的前缀',
    },
  },
  {
    name: 'triple_map',
    json: {
      type: 'triple_map',
      message0: '<# %1 >',
      args0: [
        {
          type: 'field_input',
          name: names.triple_map.nameValue,
          text: '',
        },
      ],
      message1: 'Logical Source %1',
      args1: [
        {
          type: 'input_value',
          name: names.triple_map.sourceInput,
          check: 'logical_source',
        },
      ],
      message2: 'Subject Map %1',
      args2: [
        {
          type: 'input_value',
          name: names.triple_map.subjectMapInput,
          check: 'subject_map',
        },
      ],
      message3: 'Predicate Object Maps %1',
      args3: [
        {
          type: 'input_statement',
          name: names.triple_map.predObjMapsStat,
          check: 'predicate_object_maps',
        },
      ],
      previousStatement: 'triple_map',
      nextStatement: 'triple_map',
      colour: 210,
      tooltip: '定义一个三元组映射',
    },
  },
  {
    name: 'subject_map',
    json: {
      type: 'subject_map',
      message0: 'template %1 class %2',
      args0: [
        {
          type: 'field_input',
          name: names.subject_map.templateValue,
          text: ' ',
        },
        {
          type: 'input_statement',
          name: names.subject_map.classesStat,
          check: 'rr_class',
        },
      ],
      output: 'subject_map',
      colour: 60,
      tooltip: '定义三元组映射的主语映射',
    },
  },
  {
    name: 'rr_class',
    json: {
      type: 'rr_class',
      message0: 'class %1',
      args0: [
        {
          type: 'field_input',
          name: names.rr_class.classValue,
          text: ' ',
        },
      ],
      previousStatement: 'rr_class',
      nextStatement: 'rr_class',
      colour: 90,
      tooltip: '定义主语映射的 rr:class 属性',
    },
  },
  {
    name: 'predicate_object_maps',
    json: {
      type: 'predicate_object_maps',
      message0: 'Predicate Maps %1 Object Maps %2',
      args0: [
        {
          type: 'input_statement',
          name: names.predicate_object_maps.predMapsStat,
          check: 'predicate_map',
        },
        {
          type: 'input_statement',
          name: names.predicate_object_maps.ObjMapsStat,
          check: 'object_map',
        },
      ],
      previousStatement: 'predicate_object_maps',
      nextStatement: 'predicate_object_maps',
      colour: 120,
      tooltip: '定义三元组映射的谓语-宾语映射',
    },
  },
  {
    name: 'predicate_map',
    json: {
      type: 'predicate_map',
      message0: '%1 %2',
      args0: [
        {
          type: 'field_dropdown',
          name: names.predicate_map.typeDrop,
          options: [
            ['constant', 'constant'],
            ['template', 'template'],
          ],
        },
        {
          type: 'field_input',
          name: names.predicate_map.mapValue,
          text: ' ',
        },
      ],
      previousStatement: 'predicate_map',
      nextStatement: 'predicate_map',
      colour: 150,
      tooltip: '定义三元组映射的谓语映射',
    },
  },
  {
    name: 'join_condition',
    json: {
      type: 'join_condition',
      message0: 'Child %1',
      args0: [
        {
          type: 'field_input',
          name: names.join_condition.childRefValue,
          text: '',
        },
      ],
      message1: 'Parent %1',
      args1: [
        {
          type: 'field_input',
          name: names.join_condition.parentRefValue,
          text: '',
        },
      ],
      previousStatement: 'join_condition',
      nextStatement: 'join_condition',
      colour: 270,
      tooltip: '定义连接条件',
    },
  },
];
