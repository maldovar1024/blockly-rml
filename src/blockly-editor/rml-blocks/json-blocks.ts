/** 只需要 json 定义的 block */
import { BlockSvgInterface } from '@/blockly-container/define-block';
import names from './names';

export default <BlockSvgInterface[]>[
  {
    name: names.triple_maps.name,
    json: {
      type: names.triple_maps.name,
      message0: 'Prefixes %1 Triple Maps %2',
      args0: [
        {
          type: 'input_statement',
          name: names.triple_maps.prefixesStat,
          check: names.prefix.name,
        },
        {
          type: 'input_statement',
          name: names.triple_maps.tripleMapsStat,
          check: names.triple_map.name,
        },
      ],
      colour: 0,
      tooltip: '定义三元组映射',
    },
  },
  {
    name: names.prefix.name,
    json: {
      type: names.prefix.name,
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
      previousStatement: names.prefix.name,
      nextStatement: names.prefix.name,
      colour: 230,
      tooltip: '定义映射中用到的前缀',
    },
  },
  {
    name: names.triple_map.name,
    json: {
      type: names.triple_map.name,
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
          check: names.logical_source.name,
        },
      ],
      message2: 'Subject Map %1',
      args2: [
        {
          type: 'input_value',
          name: names.triple_map.subjectMapInput,
          check: names.subject_map.name,
        },
      ],
      message3: 'Predicate Object Maps %1',
      args3: [
        {
          type: 'input_statement',
          name: names.triple_map.predObjMapsStat,
          check: names.predicate_object_maps.name,
        },
      ],
      previousStatement: names.triple_map.name,
      nextStatement: names.triple_map.name,
      colour: 210,
      tooltip: '定义一个三元组映射',
    },
  },
  {
    name: names.subject_map.name,
    json: {
      type: names.subject_map.name,
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
          check: names.rr_class.name,
        },
      ],
      output: names.subject_map.name,
      colour: 60,
      tooltip: '定义三元组映射的主语映射',
    },
  },
  {
    name: names.rr_class.name,
    json: {
      type: names.rr_class.name,
      message0: 'class %1',
      args0: [
        {
          type: 'field_input',
          name: names.rr_class.classValue,
          text: ' ',
        },
      ],
      previousStatement: names.rr_class.name,
      nextStatement: names.rr_class.name,
      colour: 90,
      tooltip: '定义主语映射的 rr:class 属性',
    },
  },
  {
    name: names.predicate_object_maps.name,
    json: {
      type: names.predicate_object_maps.name,
      message0: 'Predicate Maps %1 Object Maps %2',
      args0: [
        {
          type: 'input_statement',
          name: names.predicate_object_maps.predMapsStat,
          check: names.predicate_map.name,
        },
        {
          type: 'input_statement',
          name: names.predicate_object_maps.ObjMapsStat,
          check: names.object_map.name,
        },
      ],
      previousStatement: names.predicate_object_maps.name,
      nextStatement: names.predicate_object_maps.name,
      colour: 120,
      tooltip: '定义三元组映射的谓语-宾语映射',
    },
  },
  {
    name: names.predicate_map.name,
    json: {
      type: names.predicate_map.name,
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
      previousStatement: names.predicate_map.name,
      nextStatement: names.predicate_map.name,
      colour: 150,
      tooltip: '定义三元组映射的谓语映射',
    },
  },
  {
    name: names.join_condition.name,
    json: {
      type: names.join_condition.name,
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
      previousStatement: names.join_condition.name,
      nextStatement: names.join_condition.name,
      colour: 270,
      tooltip: '定义连接条件',
    },
  },
];
