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

/**
 * 默认文本输入域的扩展，支持自动补全功能
 */
class FieldTypeaheadInput extends FieldTextInput {
  static readonly fieldName = 'field-typeahead-input';

  /** 基类定义中没有，但运行时动态生成的属性 */
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

  /** 自动补全内容的生成器 */
  private typeaheadGen_: TypeaheadGenerator = () => [];

  setTypeaheadGenerator(generator: TypeaheadGenerator) {
    this.typeaheadGen_ = generator;
  }

  /** 展示编辑框 */
  showInlineEditor_(quietInput: boolean) {
    WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
    this.htmlInput_ = this.widgetCreate_();
    this.isBeingEdited_ = true;

    if (!quietInput) {
      this.htmlInput_.focus({ preventScroll: true });
      (this.htmlInput_ as HTMLInputElement).select();
    }

    // 创建自动补全
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
