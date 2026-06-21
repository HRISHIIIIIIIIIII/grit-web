import type { HabitCategory } from '@/api/types';

export interface SuggestedHabit {
  name: string;
  category: HabitCategory;
  xp_value: number;
}

/* Starter habit suggestions per focus area (used to pre-fill onboarding). */
export const SUGGESTED: Record<string, SuggestedHabit[]> = {
  Fitness: [
    { name: 'Morning run · 5km', category: 'Fitness', xp_value: 30 },
    { name: 'Strength training', category: 'Fitness', xp_value: 30 },
    { name: '10k steps', category: 'Fitness', xp_value: 20 },
  ],
  Discipline: [
    { name: 'Cold shower', category: 'Discipline', xp_value: 15 },
    { name: 'No phone before 9', category: 'Discipline', xp_value: 20 },
    { name: 'Make the bed', category: 'Discipline', xp_value: 10 },
  ],
  Learning: [
    { name: 'Read 20 pages', category: 'Learning', xp_value: 20 },
    { name: 'Solve a DSA topic', category: 'Learning', xp_value: 25 },
    { name: 'Study 30 min', category: 'Learning', xp_value: 20 },
  ],
  Focus: [
    { name: 'Deep work · 90 min', category: 'Focus', xp_value: 40 },
    { name: 'Single-task block', category: 'Focus', xp_value: 25 },
  ],
  Mind: [
    { name: 'Meditate · 10 min', category: 'Mind', xp_value: 15 },
    { name: 'Journal', category: 'Mind', xp_value: 15 },
  ],
  Health: [
    { name: 'Drink 2L water', category: 'Health', xp_value: 10 },
    { name: 'Sleep by 11pm', category: 'Health', xp_value: 20 },
  ],
  Finance: [{ name: 'Track expenses', category: 'Finance', xp_value: 15 }],
  Creativity: [{ name: 'Create for 30 min', category: 'Creativity', xp_value: 20 }],
};

export const IDENTITY_WORDS = ['Disciplined', 'Consistent', 'Focused', 'Relentless', 'Unstoppable'];

export const PACT_TEXT =
  'I will show up for myself every day. Not because it is easy, but because I said I would. ' +
  'Small reps, repeated, become who I am.';
