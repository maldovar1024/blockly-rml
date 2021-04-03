import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import source from './source';

const reducers = combineReducers({
  source: source.reducer,
});

const store = createStore(reducers);

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const { addSource, removeSource } = source.actions;
