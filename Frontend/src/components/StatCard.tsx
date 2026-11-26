import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'yellow' | 'lilac' | 'green' | 'white';
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'white',
  icon
}) => {
  let cardClass = 'nexus-card p-4 h-100';
  if (variant === 'yellow') cardClass = 'nexus-card-yellow p-4 h-100';
  if (variant === 'lilac') cardClass = 'nexus-card-lilac p-4 h-100';
  if (variant === 'green') cardClass = 'nexus-card-green p-4 h-100';

  return (
    <div className="col-sm-6 col-lg-3 mb-4" style={{ minWidth: 0 }}>
      <div className={cardClass} style={{ minWidth: 0 }}>
        <div className="d-flex justify-content-between align-items-center mb-2 gap-2 flex-wrap">
          <span className={`fw-bold small text-uppercase text-truncate ${variant === 'green' ? 'text-white-50' : 'text-muted'}`}>
            {title}
          </span>
          {icon && <span className="fs-4 flex-shrink-0">{icon}</span>}
        </div>
        <div className="d-flex align-items-baseline gap-2">
          <h2
            className={`fw-bolder mb-0 ${variant === 'green' ? 'text-white' : 'text-dark'}`}
            style={{
              fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)',
              lineHeight: 1.2,
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}
          >
            {value}
          </h2>
        </div>
        {subtitle && (
          <p
            className={`small mb-0 mt-2 ${variant === 'green' ? 'text-white-50' : 'text-muted'}`}
            style={{ overflowWrap: 'break-word', lineHeight: 1.4 }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
