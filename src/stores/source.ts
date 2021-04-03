import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SourceRecord } from './types';

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

export default source;
