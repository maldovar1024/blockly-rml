import type { BlockSvg, Events, WorkspaceSvg } from 'blockly';
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

/** 定义 mutator 时 `this` 的类型 */
export type MutatorThis<T> = BlockSvg & {
  updateShape(param: T): void;
  extraInfo: Record<string, string>;
};

/** mutator 对象 */
export interface MutatorObject<T> {
  mutationToDom: (this: MutatorThis<T>) => Element;
  domToMutation: (this: MutatorThis<T>, element: Element) => void;
  updateShape: (this: MutatorThis<T>, param: T) => void;
  extraInfo: Record<string, string>;
}

/**
 * 带泛型的 mutator 的定义的类型 \
 * 定义 mutator 时使用，以获得更好的类型支持
 */
export type MutatorType<T> = [
  name: string,
  mixinObj: MutatorObject<T>,
  opt_helperFn?: (this: MutatorThis<T>) => void,
  opt_blockList?: string[]
];

/**
 * 一般的 mutator 的定义的类型 \
 * 用于声明参数类型
 */
export type GeneralMutatorType = Parameters<
  typeof Blockly.Extensions.registerMutator
>;
