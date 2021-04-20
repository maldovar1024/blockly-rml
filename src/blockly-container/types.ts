import { BlockSvg, Events, WorkspaceSvg } from 'blockly';
import * as Blockly from 'blockly';

/** 工作区变化时的回调函数 */
export interface WorkspaceChangeCallback {
  (evt: Events.Abstract): void;
}

export type RegistryType = Parameters<typeof Blockly.registry.register>;

interface WorkspaceScope {
  workspace: WorkspaceSvg;
}

interface BlockScope {
  block: BlockSvg;
}

interface ScopeMap {
  block: BlockScope;
  workspace: WorkspaceScope;
}

interface BaseRegistryItem<T extends keyof ScopeMap> {
  id: string;
  weight: number;
  callback: (scope: ScopeMap[T]) => void;
  preconditionFn: (scope: ScopeMap[T]) => 'enabled' | 'disabled' | 'hidden';
  displayText: ((scope: ScopeMap[T]) => string) | string;
}

/** 块作用域右键菜单的定义 */
export type BlockMenuItem = BaseRegistryItem<'block'>;
/** 工作区作用域右键菜单的定义 */
export type WorkspaceMenuItem = BaseRegistryItem<'workspace'>;
/** 右键菜单的定义 */
export interface CustomMenuOptions {
  blockMenuItems?: BlockMenuItem[];
  workspaceMenuItems?: WorkspaceMenuItem[];
}

export type ExtensionRegisterType = Parameters<
  typeof Blockly.Extensions.register
>;
