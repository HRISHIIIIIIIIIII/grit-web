/* Maps the backend's stored accent hex to the CSS [data-accent] theme key,
   and applies theme/accent to :root for live re-theming (Settings + Onboarding). */

export const ACCENTS = [
  { key: 'emerald', hex: '#0EA47F', label: 'Emerald' },
  { key: 'amber', hex: '#E8920C', label: 'Amber' },
  { key: 'indigo', hex: '#4F46E5', label: 'Indigo' },
  { key: 'crimson', hex: '#E03E52', label: 'Crimson' },
] as const;

export type AccentKey = (typeof ACCENTS)[number]['key'];

export function accentKeyFromHex(hex: string | null | undefined): AccentKey {
  const match = ACCENTS.find((a) => a.hex.toLowerCase() === (hex ?? '').toLowerCase());
  return match?.key ?? 'emerald';
}

export function hexFromAccentKey(key: AccentKey): string {
  return ACCENTS.find((a) => a.key === key)?.hex ?? '#0EA47F';
}

export function applyAccent(key: AccentKey): void {
  const root = document.documentElement;
  if (key === 'emerald') root.removeAttribute('data-accent');
  else root.setAttribute('data-accent', key);
}

export function applyTheme(theme: string): void {
  document.documentElement.setAttribute('data-theme', theme);
}
