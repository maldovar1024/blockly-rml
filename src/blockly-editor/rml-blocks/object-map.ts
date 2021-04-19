import { BlockSvgInterface } from '@/blockly-container';
import { FieldDropdown, FieldTextInput } from 'blockly';
import names from './names';
import { BlockThis, ObjectMapType } from './types';

const { object_map } = names;

type ObjectMapThis = BlockThis<ObjectMapBlock>;

class ObjectMapBlock implements BlockSvgInterface {
  name = object_map.name;
  json = {
    type: object_map.name,
    message0: 'Map Type %1',
    args0: [
      {
        type: 'field_dropdown',
        name: object_map.typeDrop,
        options: [
          ['reference', 'reference'],
          ['constant', 'constant'],
          ['join', 'join'],
        ],
      },
    ],
    previousStatement: object_map.name,
    nextStatement: object_map.name,
    colour: 180,
    tooltip: '定义三元组映射的宾语映射',
  };

  init = function (this: ObjectMapThis) {
    const { typeDrop } = object_map;
    const mapTypeField = this.getField(typeDrop) as FieldDropdown;
    this.updateShape(mapTypeField.getValue());
    mapTypeField.setValidator((newValue: ObjectMapType) => {
      const oldValue = mapTypeField.getValue() as ObjectMapType;
      if (oldValue !== newValue) {
        this.updateShape(newValue);
      }
    });
  };

  mutationToDom = function (this: ObjectMapThis) {
    const { typeDrop } = object_map;
    const mutation = document.createElement('mutation');
    mutation.setAttribute(typeDrop, this.getFieldValue(typeDrop));
    return mutation;
  };

  domToMutation = function (this: ObjectMapThis, element: Element) {
    const { typeDrop } = object_map;
    const mapType = (element.getAttribute(typeDrop) ??
      'constant') as ObjectMapType;
    if (mapType !== this.getFieldValue(typeDrop)) {
      this.updateShape(mapType);
    }
  };

  updateShape = function (this: ObjectMapThis, newValue: ObjectMapType) {
    const {
      mapValue,
      mapValueDummy,
      datatypeDummy,
      datatypeLabel,
      datatypeValue,
      parentMapDummy,
      parentMapLabel,
      parentMapValue,
      joinConditionLabel,
      joinConditionStat,
    } = object_map;

    if (newValue !== 'join') {
      this.removeInput(parentMapDummy, true);
      this.removeInput(joinConditionStat, true);
      this.removeInput(mapValueDummy, true);

      type Label = `${typeof newValue}Label`;
      this.appendDummyInput(mapValueDummy)
        .appendField(object_map[`${newValue}Label` as Label])
        .appendField(new FieldTextInput(''), mapValue);

      // 处理 datatype 输入
      if (newValue === 'constant') {
        this.removeInput(datatypeDummy, true);
      } else if (
        newValue === 'reference' &&
        this.getInput(datatypeDummy) === null
      ) {
        this.appendDummyInput(datatypeDummy)
          .appendField(datatypeLabel)
          .appendField(new FieldTextInput(''), datatypeValue);
      }
    } else if (this.getInput(parentMapDummy) === null) {
      this.removeInput(mapValueDummy, true);
      this.removeInput(datatypeDummy, true);
      // 创建 parent_map 和 join_conditions 输入
      this.appendDummyInput(parentMapDummy)
        .appendField(`${parentMapLabel} <#`)
        .appendField(new FieldTextInput(''), parentMapValue)
        .appendField('>');
      this.appendStatementInput(joinConditionStat)
        .setCheck('join_condition')
        .appendField(joinConditionLabel);
    }
  };
}

export default ObjectMapBlock;
