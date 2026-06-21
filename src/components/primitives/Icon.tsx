import type { SVGProps } from 'react';

/* Inline line-icon set — 24px grid, stroke 1.75, round caps, currentColor.
   Matches the icon spec in GRIT Design System.dc.html. */

export type IconName =
  | 'home'
  | 'habit'
  | 'check'
  | 'goal'
  | 'calendar'
  | 'trend'
  | 'xp'
  | 'achieve'
  | 'notify'
  | 'award'
  | 'time'
  | 'profile'
  | 'milestone'
  | 'add'
  | 'roadmap'
  | 'fire'
  | 'community'
  | 'analytics'
  | 'settings'
  | 'search'
  | 'chevronDown'
  | 'chevronRight'
  | 'arrowLeft'
  | 'trash'
  | 'archive'
  | 'shield'
  | 'close'
  | 'sparkle'
  | 'lock'
  | 'logout'
  | 'export'
  | 'edit';

const P: Record<IconName, JSX.Element> = {
  home: (
    <>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
    </>
  ),
  habit: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </>
  ),
  check: <path d="M5 12.5l4 4 10-10.5" />,
  goal: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  trend: <path d="M4 15.5l4.5-4.5 3.5 3.5L20 7m0 0h-4.5M20 7v4.5" />,
  xp: <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />,
  achieve: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 22l-5.2-2.4 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  notify: (
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4s2-1.5 2-6.5Z" />
      <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
  time: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
  milestone: (
    <>
      <path d="M6 3.5v17" />
      <path d="M6 5.5h11l-2.2 2.7L17 11H6" />
    </>
  ),
  add: <path d="M12 5v14M5 12h14" />,
  roadmap: (
    <>
      <path d="M9 4.5 4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2Z" />
      <path d="M9 4.5v15M15 6.5v15" />
    </>
  ),
  fire: (
    <path d="M12 3s4 3.5 4 8a4 4 0 0 1-8 0c0-1.3.5-2.3 1-3 0 1.4 1 2 1.7 2 .9 0 1.3-.7 1.3-1.6C12 6.5 12 3 12 3Z" />
  ),
  community: (
    <>
      <circle cx="8.5" cy="9" r="3" />
      <circle cx="16" cy="9.5" r="2.6" />
      <path d="M3.5 19c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8M14.5 18.8c0-2.3 1.6-4 3.8-4 1.4 0 2.7.7 3.4 1.9" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-3M12 16v-7M16 16v-5M20 16V8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.7-3.7" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  trash: (
    <>
      <path d="M4.5 7h15M9 7V5.2A1.7 1.7 0 0 1 10.7 3.5h2.6A1.7 1.7 0 0 1 15 5.2V7" />
      <path d="M6.5 7l1 12.2A1.8 1.8 0 0 0 9.3 21h5.4a1.8 1.8 0 0 0 1.8-1.8L17.5 7" />
    </>
  ),
  archive: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1.5" />
      <path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5M9.5 12.5h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v6c0 4.5 3.2 7 7 8.5 3.8-1.5 7-4 7-8.5V6l-7-2.5Z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  logout: <path d="M14 8V5.5A1.5 1.5 0 0 0 12.5 4h-7A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h7a1.5 1.5 0 0 0 1.5-1.5V16M9.5 12h11m0 0-3-3m3 3-3 3" />,
  export: <path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 14v4.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V14" />,
  edit: <path d="M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3" />,
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, strokeWidth = 1.75, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {P[name]}
    </svg>
  );
}
