import type { MentorTone } from '@/api/types';
import atlas from '@/assets/coaches/atlas.jpeg';
import raze from '@/assets/coaches/raze.jpeg';
import nova from '@/assets/coaches/nova.jpeg';
import sage from '@/assets/coaches/sage.jpeg';
import vesper from '@/assets/coaches/vesper.jpeg';

export type CoachId = 'atlas' | 'raze' | 'nova' | 'sage' | 'vesper';

export interface Coach {
  id: CoachId;
  name: string;
  archetype: string;
  tagline: string;
  bio: string;
  traits: string[];
  accent: string;
  bright: string;
  gradient: string;
  shadow: string;
  intensity: number; // 1–5
  tone: MentorTone;
  image: string;
  voice: { win: string; missed: string; milestone: string };
}

export const COACHES: Coach[] = [
  {
    id: 'atlas',
    name: 'ATLAS',
    archetype: 'The Relentless',
    tagline: 'Discipline over feelings. Shows up, holds the line, never blinks.',
    bio: "Built from raw discipline and mental toughness. ATLAS doesn't care how you feel — only whether you moved. Direct, unshakeable, and impossible to disappoint into quitting.",
    traits: ['Disciplined', 'Direct', 'Unshakeable'],
    accent: '#0B7A5E',
    bright: '#2DD4BF',
    gradient: 'linear-gradient(135deg, #0EA47F, #2DD4BF)',
    shadow: 'rgba(14,164,127,.4)',
    intensity: 4,
    tone: 'hard',
    image: atlas,
    voice: {
      win: "You're becoming harder to stop.",
      missed: "The goal doesn't care how you feel today. Show up.",
      milestone: "Most people quit before this point. You didn't.",
    },
  },
  {
    id: 'raze',
    name: 'RAZE',
    archetype: 'The Drill Sergeant',
    tagline: "No excuses, no comfort. Loud, hard, and allergic to the word 'tomorrow.'",
    bio: "Forged in the field. RAZE runs on zero tolerance for excuses and treats comfort as the enemy. The loudest voice in your corner — and the one you'll hate at 5am and thank by noon.",
    traits: ['Intense', 'Loud', 'Unforgiving'],
    accent: '#E11D48',
    bright: '#FB7185',
    gradient: 'linear-gradient(135deg, #FF6A3D, #E11D48)',
    shadow: 'rgba(225,29,72,.4)',
    intensity: 5,
    tone: 'relentless',
    image: raze,
    voice: {
      win: "That's what I'm talking about. Again tomorrow.",
      missed: 'No excuses, no explanations. Get back in line.',
      milestone: 'You earned this the hard way. The only way.',
    },
  },
  {
    id: 'nova',
    name: 'NOVA',
    archetype: 'The Hype',
    tagline: 'Pure momentum and celebration. Turns every rep into a personal record.',
    bio: 'High-voltage energy and relentless positivity. NOVA treats every check-in like a podium finish and every comeback like a highlight reel. If you respond to encouragement over pressure, this is your coach.',
    traits: ['Energetic', 'Positive', 'Celebratory'],
    accent: '#B8710A',
    bright: '#FBBF24',
    gradient: 'linear-gradient(135deg, #FFC53D, #FF8A3D)',
    shadow: 'rgba(245,179,1,.4)',
    intensity: 3,
    tone: 'gentle',
    image: nova,
    voice: {
      win: "LET'S GO. That's a personal record and you know it.",
      missed: "One miss isn't a streak-killer. Bounce back swinging.",
      milestone: "Look how far you've climbed. This is your highlight reel.",
    },
  },
  {
    id: 'sage',
    name: 'SAGE',
    archetype: 'The Stoic',
    tagline: 'Calm, patient, philosophical. Plays the long game and never panics.',
    bio: 'Grounded in stoic calm and the long view. SAGE never raises a voice and never lets a single bad day become the story. Quiet accountability for people who burn out on intensity.',
    traits: ['Calm', 'Patient', 'Philosophical'],
    accent: '#6366F1',
    bright: '#A5B4FC',
    gradient: 'linear-gradient(135deg, #6366F1, #A855F7)',
    shadow: 'rgba(99,102,241,.4)',
    intensity: 2,
    tone: 'gentle',
    image: sage,
    voice: {
      win: 'Master the moment and the day takes care of itself.',
      missed: 'A single missed step is not the fall. Keep walking.',
      milestone: 'Slow is smooth. Smooth is fast. You understood this.',
    },
  },
  {
    id: 'vesper',
    name: 'VESPER',
    archetype: 'The Tactician',
    tagline: 'Cool, precise, strategic. Treats your goals like a system to engineer.',
    bio: 'Ice-cool and analytical. VESPER sees your habits as a system to optimize — adjusting the plan, never the goal. For the data-minded who trust strategy over hype.',
    traits: ['Strategic', 'Precise', 'Analytical'],
    accent: '#0E7490',
    bright: '#38BDF8',
    gradient: 'linear-gradient(135deg, #0891B2, #38BDF8)',
    shadow: 'rgba(8,145,178,.4)',
    intensity: 3,
    tone: 'hard',
    image: vesper,
    voice: {
      win: 'Executed. Consistency is just strategy repeated.',
      missed: 'Recalculate. Adjust the plan, not the goal.',
      milestone: 'Every system you built led here. Precisely as planned.',
    },
  },
];

export function getCoach(id: string | null | undefined): Coach {
  return COACHES.find((c) => c.id === id) ?? COACHES[0];
}
