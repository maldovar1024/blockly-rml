import {
  Connect,
  connect as _connect,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { combineReducers, createStore } from 'redux';
import results from './results';
import source from './source';
import editorCommand from './editor-command';

const reducers = combineReducers({
  source: source.reducer,
  results: results.reducer,
  editorCommand: editorCommand.reducer,
});

const store = createStore(reducers);

export default store;

export type RootStore = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const connect: Connect<RootStore> = _connect;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStore> = useSelector;

export const { addSource, removeSource } = source.actions;
export const { setMappingCode } = results.actions;
export const { createBlock } = editorCommand.actions;
