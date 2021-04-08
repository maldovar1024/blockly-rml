/** 只需要 json 定义的 block */

import { BlockSvgInterface } from '@/blockly-container/define-block';

export default <BlockSvgInterface[]>[
  {
    name: 'triple_maps',
    json: {
      type: 'triple_maps',
      message0: 'Prefixes %1 Triple Maps %2',
      args0: [
        {
          type: 'input_statement',
          name: 'prefixes',
          check: 'prefix',
        },
        {
          type: 'input_statement',
          name: 'triple_maps',
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
          name: 'prefix',
          text: '',
        },
        {
          type: 'field_input',
          name: 'value',
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
          name: 'map_name',
          text: '',
        },
      ],
      message1: 'Logical Source %1',
      args1: [
        {
          type: 'input_value',
          name: 'source',
          check: 'logical_source',
        },
      ],
      message2: 'Subject Map %1',
      args2: [
        {
          type: 'input_value',
          name: 'subject_map',
          check: 'subject_map',
        },
      ],
      message3: 'Predicate Object Maps %1',
      args3: [
        {
          type: 'input_statement',
          name: 'predicate_object_maps',
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
          name: 'template',
          text: ' ',
        },
        {
          type: 'input_statement',
          name: 'classes',
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
          name: 'class',
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
          name: 'predicate_maps',
          check: 'predicate_map',
        },
        {
          type: 'input_statement',
          name: 'object_maps',
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
          name: 'type',
          options: [
            ['constant', 'constant'],
            ['template', 'template'],
          ],
        },
        {
          type: 'field_input',
          name: 'value',
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
    name: 'object_map',
    json: {
      type: 'object_map',
      message0: '%1 %2',
      args0: [
        {
          type: 'field_dropdown',
          name: 'type',
          options: [
            ['constant', 'constant'],
            ['reference', 'reference'],
          ],
        },
        {
          type: 'field_input',
          name: 'value',
          text: '',
        },
      ],
      previousStatement: 'object_map',
      nextStatement: 'object_map',
      colour: 180,
      tooltip: '定义三元组映射的宾语映射',
    },
  },
];