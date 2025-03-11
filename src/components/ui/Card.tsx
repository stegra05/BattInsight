import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  borderless?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  contentClassName = '',
  headerClassName = '',
  borderless = false,
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 
        ${borderless ? '' : 'border border-gray-200 dark:border-gray-700'}
        rounded-xl overflow-hidden
        shadow-sm hover:shadow-md transition-shadow duration-300
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`px-6 py-4 ${headerClassName} ${borderless ? '' : 'border-b border-gray-200 dark:border-gray-700'}`}>
          {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className={`${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card; 