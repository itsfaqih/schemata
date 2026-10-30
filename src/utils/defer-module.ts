import { useSyncExternalStore } from 'react';

function whenIdleAfterLoad(task: () => void) {
  const scheduleWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(task);
    } else {
      setTimeout(task, 0);
    }
  };

  if (document.readyState === 'complete') {
    scheduleWhenIdle();
  } else {
    window.addEventListener('load', scheduleWhenIdle, { once: true });
  }
}

// Keeps code that only an interaction reaches out of the first load, then fetches it once the page
// has loaded and gone idle, so the interaction finds it already in memory
export function deferModule<Module>(importModule: () => Promise<Module>) {
  let loaded: Module | undefined;
  let loading: Promise<Module> | undefined;
  const listeners = new Set<() => void>();

  const load = () => {
    loading ??= importModule().then(
      (module) => {
        loaded = module;
        listeners.forEach((listener) => listener());

        return module;
      },
      (error: Error) => {
        loading = undefined;

        throw error;
      },
    );

    return loading;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    void load();

    return () => {
      listeners.delete(listener);
    };
  };

  whenIdleAfterLoad(() => void load());

  return {
    load,
    // Undefined until the module arrives, then the module, rendered in the same pass once loaded
    useModule: () => useSyncExternalStore(subscribe, () => loaded),
  };
}
