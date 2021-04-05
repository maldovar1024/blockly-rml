import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SourceRecord } from './types';

const initialState: SourceRecord[] = [];

const source = createSlice({
  name: 'source',
  initialState,
  reducers: {
    /** 如果文件已存在，则替换原文件；否则在列表末尾添加新文件 */
    addSource(state, action: PayloadAction<SourceRecord>) {
      const newFile = action.payload;
      const idx = state.findIndex(file => file.filename === newFile.filename);
      if (idx === -1) {
        state.push(newFile);
      } else {
        state[idx] = newFile;
      }
    },
    /** 如果文件存在，则删除文件；否则什么都不做 */
    removeSource(state, action: PayloadAction<string>) {
      const idx = state.findIndex(record => record.filename === action.payload);
      if (idx !== -1) {
        state.splice(idx, 1);
      }
    },
  },
});

export default source;
