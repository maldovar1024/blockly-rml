import { BlockSvgInterface } from '@/blockly-container/define-block';
import { FieldDropdown, FieldTextInput } from 'blockly';
import names from './names';
import { BlockThis, ObjectMapType } from './types';

const { object_map } = names;

type ObjectMapThis = BlockThis<ObjectMapBlock>;

class ObjectMapBlock implements BlockSvgInterface {
  name = 'object_map';
  json = {
    type: this.name,
    message0: 'Map Type %1',
    args0: [
      {
        type: 'field_dropdown',
        name: names.object_map.typeDrop,
        options: [
          ['constant', 'constant'],
          ['reference', 'reference'],
          ['join', 'join'],
        ],
      },
    ],
    previousStatement: this.name,
    nextStatement: this.name,
    colour: 180,
    tooltip: '定义三元组映射的宾语映射',
  };

  init = function (this: ObjectMapThis) {
    this.constructMapValueDummy();
    const { typeDrop } = object_map;
    const filetypeField = this.getField(typeDrop) as FieldDropdown;
    filetypeField.setValidator((newValue: ObjectMapType) => {
      const oldValue = filetypeField.getValue() as ObjectMapType;
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
    const filetype = (element.getAttribute(typeDrop) ??
      'constant') as ObjectMapType;
    this.updateShape(filetype);
  };

  updateShape = function (this: ObjectMapThis, newValue: ObjectMapType) {
    const {
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
      if (this.getInput(mapValueDummy) === null) {
        this.constructMapValueDummy();
      }
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
      this.appendDummyInput(parentMapDummy)
        .appendField(`${parentMapLabel} <#`)
        .appendField(new FieldTextInput(''), parentMapValue)
        .appendField('>');
      this.appendStatementInput(joinConditionStat)
        .setCheck('join_condition')
        .appendField(joinConditionLabel);
    }
  };

  constructMapValueDummy = function (this: ObjectMapThis) {
    const { mapValue, mapValueDummy, mapValueLabel } = object_map;
    this.appendDummyInput(mapValueDummy)
      .appendField(mapValueLabel)
      .appendField(new FieldTextInput(''), mapValue);
  };
}

export default new ObjectMapBlock();
