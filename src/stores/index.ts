import {
  Connect,
  connect as _connect,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { createStore, combineReducers } from 'redux';
import source from './source';

const reducers = combineReducers({
  source: source.reducer,
});

const store = createStore(reducers);

export default store;

export type RootStore = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const connect: Connect<RootStore> = _connect;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootStore> = useSelector;

export const { addSource, removeSource } = source.actions;
