'use client';

import { useEffect, useState } from 'react';
import Notification from '../components/notification';
import React from 'react';

interface NotificationType {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning';
}

export default function Home(): JSX.Element {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications'); // Appel API pour récupérer les notifications
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.messages || []);
        } else {
          console.error('[!] Erreur lors de la récupération des notifications.');
        }
      } catch (error) {
        console.error('[!] Erreur réseau lors de la récupération des notifications :', error);
      }
    };

    // Mettre à jour les notifications toutes les 5 secondes
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-700 p-4">
      <h1 className="text-white text-3xl font-bold mb-4">TP RabbitMQ - Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            id={notif.id}
            title={notif.title}
            message={notif.message}
            type={notif.type}
          />
        ))}
      </div>
    </div>
  );
}
