import type { HabitCategory } from '@/api/types';

/* Habit category colors — from the GRIT design files. */
export const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Fitness: { color: '#0B7A5E', bg: '#E7F6F1' },
  Discipline: { color: '#B8710A', bg: '#FCF1DE' },
  Learning: { color: '#2563EB', bg: '#E8F0FE' },
  Focus: { color: '#7C3AED', bg: '#EDE9FE' },
  Mind: { color: '#0E7490', bg: '#E0F4F8' },
  Health: { color: '#16A34A', bg: '#E8F6EC' },
  Finance: { color: '#0F766E', bg: '#DCFCE7' },
  Creativity: { color: '#DB2777', bg: '#FCE7F3' },
};

export const ALL_CATEGORIES: HabitCategory[] = [
  'Fitness',
  'Discipline',
  'Learning',
  'Focus',
  'Mind',
  'Health',
  'Finance',
  'Creativity',
];

export function categoryStyle(cat: string): { color: string; bg: string } {
  return CATEGORY_COLORS[cat] ?? { color: 'var(--ink-600)', bg: 'var(--surface)' };
}

const ICONS: Record<string, string> = {
  Fitness: '🏃',
  Discipline: '🧊',
  Learning: '📚',
  Focus: '🎯',
  Mind: '🧘',
  Health: '🌿',
  Finance: '💰',
  Creativity: '🎨',
};

export function categoryIcon(cat: string): string {
  return ICONS[cat] ?? '⚡';
}
