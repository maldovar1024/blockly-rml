import type { GeneralMutatorType, MutatorType } from '@/blockly-editor/types';
import { FieldDropdown, FieldTextInput } from 'blockly';
import { LogicalSourceType } from './types';

const logicalSourceMutator: MutatorType<LogicalSourceType> = [
  'logical_source_mutator',
  {
    mutationToDom() {
      const { filetypeFieldName } = this.extraInfo;
      const mutation = document.createElement('mutation');
      mutation.setAttribute(
        filetypeFieldName,
        this.getFieldValue(filetypeFieldName)
      );
      return mutation;
    },
    domToMutation(element) {
      const { filetypeFieldName } = this.extraInfo;
      const filetype = (element.getAttribute(filetypeFieldName) ??
        'csv') as LogicalSourceType;
      this.updateShape(filetype);
    },
    updateShape(newValue) {
      const { iteratorInputName, iteratorFieldName } = this.extraInfo;
      if (newValue === 'csv') {
        this.removeInput(iteratorInputName, true);
      } else if (this.getInput(iteratorInputName) === null) {
        this.appendDummyInput(iteratorInputName)
          .appendField(iteratorFieldName)
          .appendField(new FieldTextInput(''), iteratorFieldName);
      }
    },
    extraInfo: {
      iteratorInputName: 'iterator_input',
      iteratorFieldName: 'iterator',
      filetypeFieldName: 'filetype',
    },
  },
  function () {
    const { filetypeFieldName } = this.extraInfo;
    const filetypeField = this.getField(filetypeFieldName) as FieldDropdown;
    filetypeField.setValidator((newValue: LogicalSourceType) => {
      const oldValue = filetypeField.getValue() as LogicalSourceType;
      if (oldValue !== newValue) {
        this.updateShape(newValue);
      }
    });
  },
];

const mutators: GeneralMutatorType[] = [logicalSourceMutator];

export default mutators;
