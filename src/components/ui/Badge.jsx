import clsx from 'clsx';

const statusStyles = {
  ready: 'bg-teal/10 text-teal border-teal/20',
  processing: 'bg-coral/10 text-coral border-coral/20',
  pending: 'bg-muted/10 text-muted border-muted/20',
  failed: 'bg-red-50 text-red-700 border-red-200',
  complete: 'bg-teal/10 text-teal border-teal/20',
};

export default function Badge({ status, children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border',
        statusStyles[status] || statusStyles.pending,
        className
      )}
    >
      {status === 'processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse-soft" aria-hidden="true" />
      )}
      {children || status}
    </span>
  );
}
