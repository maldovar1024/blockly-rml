import { BlockSvgInterface } from '@/blockly-container/define-block';
import { FieldDropdown, FieldTextInput } from 'blockly';
import { BlockThis, LogicalSourceType } from './types';

type LogicalSourceThis = BlockThis<LogicalSourceBlock>;

class LogicalSourceBlock implements BlockSvgInterface {
  name = 'logical_source';
  json = {
    type: 'logical_source',
    message0: 'source %1 . %2',
    args0: [
      {
        type: 'field_input',
        name: 'filename',
        text: '',
      },
      {
        type: 'field_dropdown',
        name: 'filetype',
        options: [
          ['csv', 'csv'],
          ['json', 'json'],
        ],
      },
    ],
    output: 'logical_source',
    colour: 30,
    tooltip: '定义三元组映射的逻辑源',
  };

  iteratorInputName = 'iterator_input';
  iteratorFieldName = 'iterator';
  filetypeFieldName = 'filetype';

  init = function (this: LogicalSourceThis) {
    const { filetypeFieldName } = this;
    const filetypeField = this.getField(filetypeFieldName) as FieldDropdown;
    filetypeField.setValidator((newValue: LogicalSourceType) => {
      const oldValue = filetypeField.getValue() as LogicalSourceType;
      if (oldValue !== newValue) {
        this.updateShape(newValue);
      }
    });
  };

  mutationToDom = function (this: LogicalSourceThis) {
    const { filetypeFieldName } = this;
    const mutation = document.createElement('mutation');
    mutation.setAttribute(
      filetypeFieldName,
      this.getFieldValue(filetypeFieldName)
    );
    return mutation;
  };

  domToMutation = function (this: LogicalSourceThis, element: Element) {
    const { filetypeFieldName } = this;
    const filetype = (element.getAttribute(filetypeFieldName) ??
      'csv') as LogicalSourceType;
    this.updateShape(filetype);
  };

  updateShape = function (
    this: LogicalSourceThis,
    newValue: LogicalSourceType
  ) {
    const { iteratorInputName, iteratorFieldName } = this;
    if (newValue === 'csv') {
      this.removeInput(iteratorInputName, true);
    } else if (this.getInput(iteratorInputName) === null) {
      this.appendDummyInput(iteratorInputName)
        .appendField(iteratorFieldName)
        .appendField(new FieldTextInput(''), iteratorFieldName);
    }
  };
}

export default new LogicalSourceBlock();
