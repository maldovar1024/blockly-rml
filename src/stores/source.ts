import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SourceRecord {
  /** 文件名 */
  filename: string;
  /** 文件内容 */
  content: string;
  /**
   * 文件结构
   *
   * 用于向用户展示文件结构，目前只支持 CSV 文件
   */
  structure: string[];
}

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
