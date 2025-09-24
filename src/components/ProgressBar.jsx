import React from 'react';

const ProgressBar = ({ 
  current = 0, 
  total = 0, 
  label = '',
  showNumbers = true,
  className = '',
  color = 'blue'
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and Numbers */}
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showNumbers && (
            <span className="text-sm text-gray-500">
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className={`w-full ${bgColorClasses[color]} rounded-full h-2.5`}>
        <div 
          className={`${colorClasses[color]} h-2.5 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;