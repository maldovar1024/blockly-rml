/** 与文件源相关的类型定义 */
export enum Filetype {
  CSV = 'application/vnd.ms-excel',
  JSON = 'application/json',
}

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
