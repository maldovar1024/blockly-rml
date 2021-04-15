import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { RootStore } from '.';
import {
  FailedMappingResult,
  MappingResultStatus,
  ResultStore,
  SuccessfulMappingResult,
} from './types';

const initialState: ResultStore = {
  code: '',
  mappingResult: {
    status: MappingResultStatus.initial,
  },
};

interface ThunkApiType {
  state: RootStore;
  rejectValue: FailedMappingResult;
}

interface ExecuteResponseBody {
  output: string;
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

  try {
    const response = await axios.post<ExecuteResponseBody>('/api/execute', {
      rml,
      sources,
    });
    return {
      status: MappingResultStatus.successful,
      result: response.data.output,
    };
  } catch (error) {
    const err = error as AxiosError;
    if (!err.response || err.response.statusText.search('Proxy error')) {
      return rejectWithValue({
        status: MappingResultStatus.connectionFailed,
        message: '无法连接到服务器',
      });
    }
    return rejectWithValue({
      status: MappingResultStatus.executionFailed,
      message: '执行出错，请检查映射代码是否正确，以及代码与导入的文件是否对应',
    });
  }
});

const results = createSlice({
  name: 'results',
  initialState,
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
        message: '无法连接到服务器',
        ...payload,
      };
    });
  },
});

export default results;
