import { connectionErrorMsg, getMappingResult } from '@/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootStore } from '.';
import {
  FailedMappingResult,
  MappingResultStatus,
  ResultStore,
  SuccessfulMappingResult,
} from './types';

interface ThunkApiType {
  state: RootStore;
  rejectValue: FailedMappingResult;
}

/** 获取映射结果的中间件 */
export const fetchMappingResult = createAsyncThunk<
  SuccessfulMappingResult,
  void,
  ThunkApiType
>('results/mapping-result', async (_, { getState, rejectWithValue }) => {
  const rml = getState().results.code;
  const sources: Record<string, string> = {};
  for (const { filename, content } of getState().source) {
    sources[filename] = content;
  }

  const response = await getMappingResult({
    rml,
    sources,
    asQuads: true,
  });
  if (response.status === MappingResultStatus.successful) {
    return response;
  }

  return rejectWithValue(response);
});

const results = createSlice({
  name: 'results',
  initialState: <ResultStore>{
    code: '',
    mappingResult: {
      status: MappingResultStatus.initial,
    },
  },
  reducers: {
    /** 设置生成的映射代码 */
    setMappingCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMappingResult.pending, state => {
      state.mappingResult = {
        status: MappingResultStatus.pending,
      };
    });
    builder.addCase(fetchMappingResult.fulfilled, (state, { payload }) => {
      state.mappingResult = payload;
    });
    builder.addCase(fetchMappingResult.rejected, (state, { payload }) => {
      state.mappingResult = {
        status: MappingResultStatus.connectionFailed,
        message: connectionErrorMsg,
        ...payload,
      };
    });
  },
});

export default results;
