"use client";

import { useState, useCallback, useEffect } from "react";
import type { Notification } from "@/lib/types/notification.types";
import { useSocket } from "@/lib/socket-provider";

export function useNotifications(initial: Notification[] = []) {
  const [notifications, setNotifications] = useState<Notification[]>(initial);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleNotification);
    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("new_notification", handleNotification);
    };
  }, [socket]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    markRead,
    markAllRead,
    deleteNotification,
  };
}
