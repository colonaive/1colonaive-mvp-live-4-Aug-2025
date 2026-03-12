import React from 'react';

type CardStatus = 'active' | 'pending' | 'placeholder';

interface CockpitCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  status?: CardStatus;
  lastUpdated?: string;
  children: React.ReactNode;
  className?: string;
}

const statusConfig: Record<CardStatus, { dot: string; label: string }> = {
  active: { dot: 'bg-emerald-500', label: 'Active' },
  pending: { dot: 'bg-amber-500', label: 'Pending' },
  placeholder: { dot: 'bg-gray-400', label: 'Coming Soon' },
};

const CockpitCard: React.FC<CockpitCardProps> = ({
  title,
  subtitle,
  icon,
  status = 'active',
  lastUpdated,
  children,
  className = '',
}) => {
  const { dot, label } = statusConfig[status];
  const isPlaceholder = status === 'placeholder';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${
        isPlaceholder ? 'border-2 border-dashed border-gray-300 dark:border-gray-600' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#0A385A] to-[#0F766E]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white/80">{icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <span className="text-[10px] text-white/70 uppercase tracking-wider">{label}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>

      {/* Footer */}
      {lastUpdated && (
        <div className="px-5 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-[11px] text-gray-400">Last updated: {lastUpdated}</span>
        </div>
      )}
    </div>
  );
};

export default CockpitCard;
