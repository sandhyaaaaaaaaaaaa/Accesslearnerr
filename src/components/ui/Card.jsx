import clsx from 'clsx';

export default function Card({ children, className, hover, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'glass-card rounded-2xl',
        padding && 'p-6',
        hover && 'hover:shadow-md hover:border-teal/20 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
