'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { EventInputType } from '@/lib/validators/event';

export async function getEvents(filters?: { q?: string; sport?: string }) {
  const supabase = createClient();

  let query = supabase
    .from('events')
    .select('id, name, sport_type, starts_at, description, owner_id, event_venues(venues(name, city))')
    .order('starts_at', { ascending: true });

  if (filters?.q) query = query.ilike('name', `%${filters.q}%`);
  if (filters?.sport && filters.sport !== 'all') query = query.eq('sport_type', filters.sport);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createEvent(input: EventInputType) {
  const supabase = createClient();

  const { data: event, error: eventErr } = await supabase
    .from('events')
    .insert({
      name: input.name,
      sport_type: input.sport_type,
      starts_at: input.starts_at,
      description: input.description ?? null,
    })
    .select('id')
    .single();

  if (eventErr) throw new Error(eventErr.message);

  if (input.venue_ids?.length) {
    const rows = input.venue_ids.map((vid) => ({ event_id: event!.id, venue_id: vid }));
    const { error: linkErr } = await supabase.from('event_venues').insert(rows);
    if (linkErr) throw new Error(linkErr.message);
  }

  revalidatePath('/dashboard');
  return { ok: true, id: event!.id };
}

export async function updateEvent(id: string, input: EventInputType) {
  const supabase = createClient();

  // 1️⃣ Update the main event
  const { data, error } = await supabase
    .from('events')
    .update({
      name: input.name,
      sport_type: input.sport_type,
      starts_at: input.starts_at,
      description: input.description ?? null,
    })
    .eq('id', id)
    .select('*'); // ✅ Return updated row(s) for verification

  // 2️⃣ Handle any Supabase error
  if (error) {
    console.error('Supabase update error:', error.message);
    throw new Error(error.message);
  }

  // 3️⃣ RLS check — no rows returned means permission denied
  if (!data || data.length === 0) {
    throw new Error("You don't have permission to edit this event.");
  }

  // 4️⃣ Delete existing event_venue links
  const { error: delError } = await supabase.from('event_venues').delete().eq('event_id', id);
  if (delError) {
    console.error('Failed to delete existing event_venues:', delError.message);
    throw new Error(delError.message);
  }

  // 5️⃣ Insert updated venue relationships
  if (input.venue_ids?.length) {
    const rows = input.venue_ids.map((venue_id) => ({ event_id: id, venue_id }));
    const { error: linkError } = await supabase.from('event_venues').insert(rows);
    if (linkError) {
      console.error('Failed to insert new event_venues:', linkError.message);
      throw new Error(linkError.message);
    }
  }

  // 6️⃣ Revalidate the dashboard cache
  revalidatePath('/dashboard');

  return { ok: true };
}

export async function deleteEvent(id: string) {
  const supabase = createClient();

  // 1️⃣ Attempt to delete the event
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .select('id, name, sport_type, starts_at, description, owner_id, event_venues(venue_id, venues(name, city))')

  // 2️⃣ Handle Supabase errors
  if (error) {
    console.error('Supabase delete error:', error.message);
    throw new Error(error.message);
  }

  // 3️⃣ RLS check — if no rows were deleted, permission was denied
  if (!data || data.length === 0) {
    throw new Error("You don't have permission to delete this event.");
  }

  // 4️⃣ Revalidate dashboard cache
  revalidatePath('/dashboard');

  return { ok: true };
}