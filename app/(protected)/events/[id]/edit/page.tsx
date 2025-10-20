import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventForm from '@/components/event-form';
import { updateEvent } from '@/actions/events';

type Props = { params: { id: string } };

export default async function EditEventPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const [{ data: event }, { data: venues }, { data: sports }] = await Promise.all([
    supabase
      .from('events')
      .select(
        'id, name, sport_type, starts_at, description, event_venues(venue_id)'
      )
      .eq('id', params.id)
      .single(),
    supabase.from('venues').select('id, name, city').order('name'),
    supabase.from('sports').select('name').order('name'),
  ]);

  if (!event) return notFound();

  const initial = {
    name: event.name,
    sport_type: event.sport_type,
    starts_at: event.starts_at,
    description: event.description ?? '',
    venue_ids: (event.event_venues ?? []).map((ev: any) => ev.venue_id),
  };

  async function onUpdate(values: any) {
    'use server';
    await updateEvent(params.id, values);
    return { ok: true };
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <EventForm
        action={onUpdate}
        venues={venues ?? []}
        sports={(sports ?? []).map((s) => s.name)}
        initialValues={initial}
        mode="edit"
      />
    </div>
  );
}
