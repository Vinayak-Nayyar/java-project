import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'yellow' | 'lilac' | 'red' | 'blue' | 'dark';
  className?: string;
  icon?: string;
  style?: React.CSSProperties;
}

/**
 * Standardized reusable Capsule / Badge component.
 * Guaranteed to display on one single line with no text wrapping,
 * vertically and horizontally centered, expanding horizontally to fit content.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lilac',
  className = '',
  icon,
  style
}) => {
  const variantClass = `badge-pill-${variant}`;
  return (
    <span className={`${variantClass} ${className}`.trim()} style={style}>
      {icon && <span className="me-1">{icon}</span>}
      {children}
    </span>
  );
};
