import { BlockSvgInterface } from '@/blockly-container';
import { FieldDropdown, FieldTextInput } from 'blockly';
import FieldTypeaheadInput, {
  TypeaheadGenerator,
} from './field-typeahead-input';
import names from './names';
import { BlockThis, LogicalSourceType } from './types';

const { logical_source } = names;

type LogicalSourceThis = BlockThis<LogicalSourceBlock>;

class LogicalSourceBlock implements BlockSvgInterface {
  constructor(private filenameTypeaheadGen: TypeaheadGenerator) {}

  name = logical_source.name;
  json = {
    type: logical_source.name,
    message0: 'source %1 . %2',
    args0: [
      {
        type: FieldTypeaheadInput.fieldName,
        name: logical_source.filenameValue,
        text: '',
      },
      {
        type: 'field_dropdown',
        name: logical_source.filetypeDrop,
        options: [
          ['csv', 'csv'],
          ['json', 'json'],
        ],
      },
    ],
    output: logical_source.name,
    colour: 30,
    tooltip: '定义三元组映射的逻辑源',
  };

  init = function (this: LogicalSourceThis) {
    const { filetypeDrop, filenameValue } = logical_source;

    const filenameField = this.getField(filenameValue) as FieldTypeaheadInput;
    filenameField.setTypeaheadGenerator(this.filenameTypeaheadGen);

    const filetypeField = this.getField(filetypeDrop) as FieldDropdown;
    this.updateShape(filetypeField.getValue());
    filetypeField.setValidator((newValue: LogicalSourceType) => {
      const oldValue = filetypeField.getValue() as LogicalSourceType;
      if (oldValue !== newValue) {
        this.updateShape(newValue);
      }
    });
  };

  mutationToDom = function (this: LogicalSourceThis) {
    const { filetypeDrop } = logical_source;
    const mutation = document.createElement('mutation');
    mutation.setAttribute(filetypeDrop, this.getFieldValue(filetypeDrop));
    return mutation;
  };

  domToMutation = function (this: LogicalSourceThis, element: Element) {
    const { filetypeDrop } = logical_source;
    const filetype = (element.getAttribute(filetypeDrop) ??
      'csv') as LogicalSourceType;
    if (filetype !== this.getFieldValue(filetypeDrop)) {
      this.updateShape(filetype);
    }
  };

  updateShape = function (
    this: LogicalSourceThis,
    newValue: LogicalSourceType
  ) {
    const { iteratorDummy, iteratorValue } = logical_source;
    if (newValue === 'csv') {
      this.removeInput(iteratorDummy, true);
    } else if (this.getInput(iteratorDummy) === null) {
      this.appendDummyInput(iteratorDummy)
        .appendField(iteratorValue)
        .appendField(new FieldTextInput(''), iteratorValue);
    }
  };
}

export default LogicalSourceBlock;
