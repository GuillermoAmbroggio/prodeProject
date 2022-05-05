import produce from 'immer';
import create, { State, StateCreator } from 'zustand';
import { Actions } from '../particules/clientStore/actions';
import { initialClientStore } from '../particules/clientStore/clientStore';
import {
  ClientDispatch,
  ClientStore,
} from '../particules/clientStore/clientStore.types';
import reducer from '../particules/clientStore/reducers';

const immer =
  <T extends State>(
    config: StateCreator<T, (fn: (draft: T) => void) => void>
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce(fn) as (state: T) => T), get, api);

const useClientStore = create<ClientStore & ClientDispatch>(
  immer((set) => ({
    ...initialClientStore,
    dispatch: (args: Actions) => set((state) => reducer(state, args)),
  }))
);

export default useClientStore;
