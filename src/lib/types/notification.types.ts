import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  time: z.string(),
  read: z.boolean(),
});
export type Notification = z.infer<typeof NotificationSchema>;
