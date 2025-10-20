import { z } from 'zod';

export const EventInput = z.object({
  name: z.string().min(2),
  sport_type: z.string().min(1),
  starts_at: z.string().min(1), // ISO string
  description: z.string().optional(),
  venue_ids: z.array(z.string()).default([]),
});

export type EventInputType = z.infer<typeof EventInput>;
