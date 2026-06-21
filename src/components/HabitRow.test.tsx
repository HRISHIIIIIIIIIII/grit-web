import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HabitRow } from './HabitRow';
import type { HabitRead } from '@/api/types';

const habit: HabitRead = {
  id: 1,
  name: 'Morning run',
  category: 'Fitness',
  icon: null,
  xp_value: 30,
  schedule: 'daily',
  archived: false,
  linked_roadmap_id: null,
  created_at: new Date().toISOString(),
  current_streak: 4,
  checked_in_today: false,
};

describe('HabitRow', () => {
  it('shows the habit, its XP and streak, and toggles via the checkbox', async () => {
    const onToggle = vi.fn();
    render(<HabitRow habit={habit} onToggle={onToggle} />);

    expect(screen.getByText('Morning run')).toBeInTheDocument();
    expect(screen.getByText('+30 XP')).toBeInTheDocument();
    expect(screen.getByText(/4d/)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /Check in Morning run/ });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(habit);
  });

  it('renders a checked, struck-through state when already checked in', () => {
    render(<HabitRow habit={{ ...habit, checked_in_today: true }} onToggle={() => {}} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
});
