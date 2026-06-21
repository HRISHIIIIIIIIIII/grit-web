import { createBrowserRouter } from 'react-router-dom';

// Placeholder router — replaced with the full route table in the routing step.
export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100%',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 52,
          letterSpacing: '-0.03em',
          color: 'var(--ink-900)',
        }}
      >
        GRIT
      </div>
    ),
  },
]);
