import { z } from "zod";

export const EventInput = z.object({
  name: z.string().min(1, "Event name is required"),
  sport_type: z.string().min(1, "Sport type is required"),
  starts_at: z.string().min(1, "Start date/time is required"),
  description: z.string().optional(),
  venue_ids: z.array(z.string()).default([]).transform((val) => val ?? []),

});

export type EventInputType = z.infer<typeof EventInput>;
