import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResultStore } from './types';

const initialState: ResultStore = {
  code: '',
};

const results = createSlice({
  name: 'results',
  initialState,
  reducers: {
    /** 设置生成的映射代码 */
    setMappingCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
  },
});

export default results;
