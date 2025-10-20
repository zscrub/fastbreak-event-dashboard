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

  // 1️⃣ Try to update the event
  const { count: updateCount, error: updErr } = await supabase
    .from('events')
    .update({
      name: input.name,
      sport_type: input.sport_type,
      starts_at: input.starts_at,
      description: input.description ?? null,
    })
    .eq('id', id)
    .select('id', { count: 'exact' });

  if (updErr) throw new Error(updErr.message);
  if (!updateCount || updateCount === 0) {
    throw new Error("You don't have permission to edit this event.");
  }

  // 2️⃣ Refresh event_venues relationships
  const { error: delErr } = await supabase.from('event_venues').delete().eq('event_id', id);
  if (delErr) throw new Error(delErr.message);

  if (input.venue_ids?.length) {
    const rows = input.venue_ids.map((vid) => ({ event_id: id, venue_id: vid }));
    const { error: linkErr } = await supabase.from('event_venues').insert(rows);
    if (linkErr) throw new Error(linkErr.message);
  }

  // 3️⃣ Revalidate dashboard page
  revalidatePath('/dashboard');
  return { ok: true };
}


export async function deleteEvent(id: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .select('id', { count: 'exact' });

  if (error) throw new Error(error.message);

  if (!count || count === 0) {
    throw new Error("You don't have permission to delete this event.");
  }

  revalidatePath('/dashboard');
  return { ok: true };
}
