import type { Notification } from "@/lib/types/notification.types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Flight Confirmed",
    body: "Your booking to Dubai (DBX) has been confirmed.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    title: "New Quote Available",
    body: "We have prepared the quote for your group trip to Bali.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Welcome to Thrive!",
    body: "Your account has been successfully created.",
    time: "1 day ago",
    read: true,
  },
];
