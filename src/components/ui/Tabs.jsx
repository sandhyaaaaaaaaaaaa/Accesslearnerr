import clsx from 'clsx';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div role="tablist" aria-label="Content formats" className="flex flex-wrap gap-1 p-1 bg-cream-dark rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200',
            activeTab === tab.id
              ? 'bg-surface text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          )}
        >
          {tab.icon && <tab.icon className="w-4 h-4" aria-hidden="true" />}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal/10 text-teal">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
