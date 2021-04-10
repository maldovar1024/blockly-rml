import { BlockSvg } from 'blockly';

/** 使用类定义块时用到的 `this` 类型 */
export type BlockThis<This> = This & BlockSvg;
/** logical_source 块下拉框的类型 */
export type LogicalSourceType = 'csv' | 'json';
/** predicate_map 块下拉框的类型 */
export type PredicateMapType = 'constant' | 'template';
/** object_map 块下拉框的类型 */
export type ObjectMapType = 'constant' | 'reference' | 'join';
