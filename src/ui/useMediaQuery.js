import { useCallback, useMemo, useSyncExternalStore } from 'react';

export function useMediaQuery(query) {
  const media = useMemo(
    () => (typeof window === 'undefined' ? null : window.matchMedia(query)),
    [query],
  );
  const subscribe = useCallback(
    (callback) => {
      media?.addEventListener('change', callback);
      return () => media?.removeEventListener('change', callback);
    },
    [media],
  );
  return useSyncExternalStore(
    subscribe,
    () => media?.matches ?? false,
    () => false,
  );
}
