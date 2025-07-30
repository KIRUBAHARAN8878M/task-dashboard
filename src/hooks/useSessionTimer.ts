import { useEffect } from 'react';
import { useAppSelector } from '../utils/reduxHooks';

export function useSessionTimer(onExpire: () => void) {
  const exp = useAppSelector(s => s.auth.expiresAt);
  useEffect(() => {
    if (!exp) return;
    const ms = Math.max(0, exp - Date.now());
    const id = setTimeout(onExpire, ms);
    return () => clearTimeout(id);
  }, [exp, onExpire]);
}
