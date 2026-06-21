export interface HeatmapCell {
  date: string;
  count: number;
}

export interface ContributionHeatmapProps {
  cells: HeatmapCell[];
  cellSize?: number;
  gap?: number;
}

function level(count: number): string {
  if (count <= 0) return '#EBEDEF';
  if (count === 1) return 'rgba(var(--accent-rgb), 0.28)';
  if (count === 2) return 'rgba(var(--accent-rgb), 0.5)';
  if (count === 3) return 'rgba(var(--accent-rgb), 0.72)';
  return 'rgba(var(--accent-rgb), 1)';
}

/* Contribution graph — columns of 7 days, 3px gaps, 5-step accent opacity.
   Matches the heatmap in GRIT Dashboard.dc.html / GRIT Profile.dc.html. */
export function ContributionHeatmap({ cells, cellSize = 12, gap = 3 }: ContributionHeatmapProps) {
  // Chunk into week-columns of 7 days.
  const weeks: HeatmapCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div style={{ display: 'flex', gap, overflowX: 'auto' }} role="img" aria-label="Contribution heatmap">
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
          {week.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.count}`}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 3,
                background: level(cell.count),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
