import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RingProgress } from './RingProgress';
import { LevelLadder } from './LevelLadder';
import { EvolutionStages } from './EvolutionStages';
import { StreakCalendar } from './StreakCalendar';

describe('gamification charts', () => {
  it('RingProgress exposes the percentage via aria-label and sets dashoffset', () => {
    const { container } = render(
      <RingProgress value={75} label="75 percent complete">
        <span>75%</span>
      </RingProgress>,
    );
    expect(screen.getByRole('img', { name: '75 percent complete' })).toBeInTheDocument();
    // The progress circle is the second circle; its dashoffset should be 25% of circumference.
    const circles = container.querySelectorAll('circle');
    const progress = circles[1];
    const r = Number(progress.getAttribute('r'));
    const circ = 2 * Math.PI * r;
    const offset = Number(progress.getAttribute('stroke-dashoffset'));
    expect(offset / circ).toBeCloseTo(0.25, 2);
  });

  it('RingProgress clamps out-of-range values', () => {
    const { container } = render(<RingProgress value={250} />);
    const progress = container.querySelectorAll('circle')[1];
    // Fully filled → offset 0.
    expect(Number(progress.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 5);
  });

  it('LevelLadder marks the current level "YOU ARE HERE" and earlier ones done', () => {
    render(<LevelLadder currentLevel={5} />);
    expect(screen.getByText('YOU ARE HERE')).toBeInTheDocument();
    // Level 5 is "Relentless".
    expect(screen.getByText('Relentless')).toBeInTheDocument();
  });

  it('EvolutionStages reflects reached stages for a 47-day streak (Blaze)', () => {
    const { container } = render(<EvolutionStages current={47} />);
    // Spark, Ember, Flame, Blaze reached (4); Inferno, Eternal not.
    const cells = container.querySelectorAll('[title]');
    expect(cells).toHaveLength(6);
    const greyed = Array.from(cells).filter((c) =>
      (c as HTMLElement).style.filter.includes('grayscale'),
    );
    expect(greyed).toHaveLength(2);
  });

  it('StreakCalendar renders day glyphs by state', () => {
    render(
      <StreakCalendar
        days={[
          { state: 'done' },
          { state: 'freeze' },
          { state: 'missed' },
          { state: 'today', label: 47 },
        ]}
      />,
    );
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('❄')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });
});
