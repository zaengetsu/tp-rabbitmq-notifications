'use client';

import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface NotificationProps {
  id: number;
  title: string;
  message: string;
  type?: 'info' | 'warning' ;
  onClose?: () => void;
}

export default function Notification({
  id,
  title,
  message,
  type = 'info',
  onClose,
}: NotificationProps): JSX.Element {
  const [show, setShow] = useState(true);

  const handleClose = (): void => {
    setShow(false);
    if (onClose) onClose();
  };

  const colors = {
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-900',
      icon: <CheckCircleIcon className="h-6 w-6 text-blue-500" />,
      numberColor: 'text-black', // Noir pour les notifications info
    },
    warning: {
      bg: 'bg-red-100',
      text: 'text-red-900',
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-purple-500" />,
      numberColor: 'text-red-500', // Rouge pour les notifications warning
    },

  };

  const notificationStyle = colors[type] || colors.info;

  return (
    <Transition show={show}>
      <div
        className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 ${notificationStyle.bg}`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="shrink-0">{notificationStyle.icon}</div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${notificationStyle.text}`}>
                <span className={`font-bold ${notificationStyle.numberColor}`}>#{id}</span> - {title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
