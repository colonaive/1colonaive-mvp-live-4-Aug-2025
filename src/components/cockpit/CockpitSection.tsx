import React from 'react';

interface CockpitSectionProps {
  title?: string;
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

const colsClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
};

const CockpitSection: React.FC<CockpitSectionProps> = ({
  title,
  columns = 3,
  children,
}) => (
  <section className="mb-8">
    {title && (
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
    )}
    <div className={`grid ${colsClass[columns]} gap-6`}>
      {children}
    </div>
  </section>
);

export default CockpitSection;
