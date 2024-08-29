import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface WarningAlertProps {
  title?: string | undefined;
  message?: string | undefined;
  className?: string;
}

export const WarningAlert: React.FC<WarningAlertProps> = ({
  title,
  message,
}) => {
  return (
    <div className="sticky top-16 z-10 pt-4 rounded-md bg-yellow-50 px-4 py-3 animate-in fade-in">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
