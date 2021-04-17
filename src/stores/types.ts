import type { Quad } from 'n3';

/** 与文件源相关的类型定义 */
export enum Filetype {
  CSV = 'application/vnd.ms-excel',
  JSON = 'application/json',
}

export const mimeTypes = ['.csv', Filetype.JSON];

export interface BaseSource {
  /** 文件名 */
  filename: string;
  /** 文件类型 */
  filetype: Filetype;
  /** 文件内容 */
  content: string;
}

export interface CSVSource extends BaseSource {
  filetype: Filetype.CSV;
  structure: string[];
}

export interface JSONSource extends BaseSource {
  filetype: Filetype.JSON;
  // eslint-disable-next-line @typescript-eslint/ban-types
  structure: object;
}

export type SourceRecord = CSVSource | JSONSource;

export enum MappingResultStatus {
  initial,
  pending,
  successful,
  connectionFailed,
  executionFailed,
}

interface BasicMappingResult {
  status: MappingResultStatus.initial | MappingResultStatus.pending;
}

export interface SuccessfulMappingResult {
  status: MappingResultStatus.successful;
  result: Quad[];
}

export interface FailedMappingResult {
  status:
    | MappingResultStatus.connectionFailed
    | MappingResultStatus.executionFailed;
  message: string;
}

/** 与生成的映射代码、映射的执行结果相关的类型定义 */
export interface ResultStore {
  /** 生成的映射代码 */
  code: string;
  /** 映射执行的结果 */
  mappingResult:
    | BasicMappingResult
    | SuccessfulMappingResult
    | FailedMappingResult;
}

/** 传递给 BlocklyEditor 的命令参数 */
export interface CreateBlockPayload {
  filename: string;
  reference: string;
}

export interface EditorCommandStore extends CreateBlockPayload {
  id: string;
}
