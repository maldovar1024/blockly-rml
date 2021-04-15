import { configureStore } from '@reduxjs/toolkit';
import {
  Connect,
  connect as _connect,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { combineReducers } from 'redux';
import editorCommand from './editor-command';
import results from './results';
import source from './source';

const rootReducer = combineReducers({
  source: source.reducer,
  results: results.reducer,
  editorCommand: editorCommand.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootStore = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const connect: Connect<RootStore> = _connect;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStore> = useSelector;

export const { addSource, removeSource } = source.actions;
export const { setMappingCode } = results.actions;
export const { createBlock } = editorCommand.actions;
