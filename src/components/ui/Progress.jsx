import clsx from 'clsx';

export default function Progress({ value = 0, label, className, size = 'md' }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted">{label}</span>
          <span className="font-medium text-ink">{clamped}%</span>
        </div>
      )}
      <div
        className={clsx('w-full bg-cream-dark rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className="h-full bg-teal rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
