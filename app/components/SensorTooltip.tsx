import React, { ReactNode, CSSProperties } from 'react';

interface SensorTooltipProps {
  title: string;
  statusText: string;
  statusType: 'normal' | 'warning' | 'error';
  additionalInfo: string;
  children: ReactNode;
  style?: CSSProperties;
}

export default function SensorTooltip({ 
  title, 
  statusText, 
  statusType, 
  additionalInfo, 
  children,
  style
}: SensorTooltipProps) {
  const getStatusColor = () => {
    switch (statusType) {
      case 'normal':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="absolute group" style={style}>
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black bg-opacity-75 text-white p-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <p className="font-bold">{title}</p>
        <p className={getStatusColor()}>{statusText}</p>
        <p>{additionalInfo}</p>
      </div>
    </div>
  );
} 