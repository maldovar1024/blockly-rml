import Blockly, { BlocklyOptions, WorkspaceSvg } from 'blockly';
import { Component, createRef, CSSProperties } from 'react';
import defineBlock, { BlockSvgInterface } from './define-block';
import './msg-zh-hans';
import {
  CustomMenuOptions,
  ExtensionRegisterType,
  RegistryType,
  WorkspaceChangeCallback,
} from './types';

export type { BlockSvgInterface } from './define-block';

export interface BlocklyContainerProps {
  /** 注入 Blockly 时的配置，只在初始化时生效 */
  blocklyOptions: BlocklyOptions;
  /** 自定义 block 的定义 */
  customBlocks?: BlockSvgInterface[];
  /** 自定义右键菜单 */
  customMenuOptions?: CustomMenuOptions;
  /** 要注销的右键菜单的 id */
  unregisteredMenuItems?: string[];
  initialWorkspace?: string;
  registryItems?: RegistryType[];
  extensions?: ExtensionRegisterType[];
  /** 工作区发生改变时的回调函数 */
  workspaceChangeCallbacks?: WorkspaceChangeCallback[];
  className?: string;
}

const style: CSSProperties = {
  height: '100%',
  userSelect: 'none',
};

class BlocklyContainer extends Component<BlocklyContainerProps> {
  private container = createRef<HTMLDivElement>();
  private _mainWorkspace!: WorkspaceSvg;

  get mainWorkspace() {
    return this._mainWorkspace;
  }

  componentDidMount() {
    const blocklyDiv = this.container.current;
    if (!blocklyDiv) {
      return;
    }

    const {
      blocklyOptions,
      customBlocks,
      extensions,
      initialWorkspace,
      unregisteredMenuItems,
      workspaceChangeCallbacks,
      registryItems,
    } = this.props;

    this.registerCustomMenuOptions();
    unregisteredMenuItems?.forEach(id => {
      try {
        Blockly.ContextMenuRegistry.registry.unregister(id);
      } catch {
        console.warn(`尝试注销不存在的右键菜单项 ${id}`);
      }
    });

    registryItems?.forEach(item => Blockly.registry.register(...item));

    customBlocks?.forEach(defineBlock);

    extensions?.forEach(ext => {
      Blockly.Extensions.register(...ext);
    });

    this._mainWorkspace = Blockly.inject(blocklyDiv, blocklyOptions);
    if (initialWorkspace) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom(initialWorkspace),
        this._mainWorkspace
      );
    }
    workspaceChangeCallbacks?.forEach(callback =>
      this._mainWorkspace.addChangeListener(callback)
    );
  }

  exportBlocks() {
    const { Xml } = Blockly;
    const xml = Xml.workspaceToDom(this._mainWorkspace);
    return Xml.domToPrettyText(xml);
  }

  importBlocks(xmlText: string): Error | undefined {
    const { Xml } = Blockly;
    try {
      const xml = Xml.textToDom(xmlText);
      Xml.clearWorkspaceAndLoadFromXml(xml, this._mainWorkspace);
    } catch (/*Error*/ error) {
      return error;
    }
  }

  private registerCustomMenuOptions() {
    const { customMenuOptions } = this.props;
    if (!customMenuOptions) {
      return;
    }

    const { blockMenuItems, workspaceMenuItems } = customMenuOptions;
    const { ScopeType, registry } = Blockly.ContextMenuRegistry;

    blockMenuItems?.forEach(item =>
      registry.register({ ...item, scopeType: ScopeType.BLOCK })
    );
    workspaceMenuItems?.forEach(item => {
      registry.register({ ...item, scopeType: ScopeType.WORKSPACE });
    });
  }

  render() {
    const { className } = this.props;
    return <div className={className} style={style} ref={this.container}></div>;
  }
}

export default BlocklyContainer;
