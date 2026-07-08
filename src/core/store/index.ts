import { useSyncExternalStore } from 'react';

export interface Store<T> {
  getState: () => T;
  setState: (nextState: Partial<T> | ((s: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (nextState) => {
      state = {
        ...state,
        ...(typeof nextState === 'function' ? nextState(state) : nextState)
      };
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}

export function useStore<T, V>(store: Store<T>, selector: (s: T) => V): V {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}
