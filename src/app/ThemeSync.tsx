import { useEffect } from 'react';
import { useSettings } from '@/api/hooks/misc';
import { accentKeyFromHex, applyAccent } from '@/lib/theme';

/* Applies the user's stored accent to :root whenever settings load/change. */
export function ThemeSync() {
  const { data } = useSettings();
  useEffect(() => {
    if (data?.accent_color) applyAccent(accentKeyFromHex(data.accent_color));
  }, [data?.accent_color]);
  return null;
}
