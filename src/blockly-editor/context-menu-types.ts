import type { BlockSvg, WorkspaceSvg } from 'blockly';

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
  preconditionFn: (scope: ScopeMap[T]) => string;
  displayText: ((scope: ScopeMap[T]) => string) | string;
}

export type BlockMenuItem = BaseRegistryItem<'block'>;
export type WorkspaceMenuItem = BaseRegistryItem<'workspace'>;

export interface CustomMenuOptions {
  blockMenuItems: BlockMenuItem[];
  workspaceMenuItems: WorkspaceMenuItem[];
}
