import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum FileType {
  CSV = 'application/vnd.ms-excel',
  JSON = 'application/json',
}

export interface BaseSourceRecord {
  /** 文件名 */
  filename: string;
  /** 文件类型 */
  filetype: FileType;
  /** 文件内容 */
  content: string;
}

export interface CSVSourceRecord extends BaseSourceRecord {
  filetype: FileType.CSV;
  structure: string[];
}

export interface JSONSourceRecord extends BaseSourceRecord {
  filetype: FileType.JSON;
  // eslint-disable-next-line @typescript-eslint/ban-types
  structure: object;
}

export type SourceRecord = CSVSourceRecord | JSONSourceRecord;

const initialState: SourceRecord[] = [];

const source = createSlice({
  name: 'source',
  initialState,
  reducers: {
    addSource(state, action: PayloadAction<SourceRecord>) {
      state.push(action.payload);
    },
    removeSource(state, action: PayloadAction<string>) {
      const idx = state.findIndex(record => record.filename === action.payload);
      state.splice(idx, 1);
    },
  },
});

export const { addSource, removeSource } = source.actions;

export default source.reducer;
