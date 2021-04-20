import {
  BlockSvg,
  fieldRegistry,
  FieldTextInput,
  utils,
  WidgetDiv,
} from 'blockly';

export interface TypeaheadGenerator {
  (block: BlockSvg): string[];
}

class FieldTypeaheadInput extends FieldTextInput {
  static readonly fieldName = 'field-typeahead-input';

  isBeingEdited_!: boolean;

  constructor(typeaheadGenerator: TypeaheadGenerator);
  constructor(
    value?: string,
    validator?: (newValue: string | null) => string | null,
    config?: Record<string, string>
  );
  constructor(
    value?: string | TypeaheadGenerator,
    validator?: (newValue: string | null) => string | null,
    config?: Record<string, string>
  ) {
    super(typeof value === 'function' ? '' : value, validator, config);
    if (typeof value === 'function') {
      this.setTypeaheadGenerator(value);
    }
  }

  private typeaheadGen_: TypeaheadGenerator = () => [];

  setTypeaheadGenerator(generator: TypeaheadGenerator) {
    this.typeaheadGen_ = generator;
  }

  showInlineEditor_(quietInput: boolean) {
    WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
    this.htmlInput_ = this.widgetCreate_();
    this.isBeingEdited_ = true;

    if (!quietInput) {
      this.htmlInput_.focus({ preventScroll: true });
      (this.htmlInput_ as HTMLInputElement).select();
    }

    const datalist = document.createElement('datalist');
    const typeaheadValues = this.typeaheadGen_(<BlockSvg>this.sourceBlock_).map(
      value => {
        const option = document.createElement('option');
        option.setAttribute('value', value);
        return option;
      }
    );
    datalist.append(...typeaheadValues);
    datalist.id = 'field-typeahead-input-datalist';
    this.htmlInput_.setAttribute('list', datalist.id);
    WidgetDiv.DIV.appendChild(datalist);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJson(options: any) {
    const text = utils.replaceMessageReferences(options['text']);
    return new FieldTypeaheadInput(text, undefined, options);
  }
}

fieldRegistry.register(FieldTypeaheadInput.fieldName, FieldTypeaheadInput);

export default FieldTypeaheadInput;
