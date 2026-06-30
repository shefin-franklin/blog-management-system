export function Card({ children, className = '' }) {
  return <section className={`glass rounded-2xl p-5 shadow-glow ${className}`}>{children}</section>;
}

export function EmptyState({ title = 'No data yet', text = 'Create content to see it here.' }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}

export function Skeleton({ className = 'h-24' }) {
  return <div className={`skeleton ${className}`} />;
}
