export function FullScreenLoader() {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--page)',
      }}
    >
      <div
        aria-label="Loading"
        role="status"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '3px solid var(--accent-soft)',
          borderTopColor: 'var(--accent)',
          animation: 'gritSpin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes gritSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
