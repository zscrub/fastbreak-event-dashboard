import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventForm from '@/components/event-form';
import { createEvent } from '@/actions/events';

export default async function NewEventPage() {
  // auth gate
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // fetch venues + sports on the server
  const [{ data: venues }, { data: sports }] = await Promise.all([
    supabase.from('venues').select('id, name, city').order('name'),
    supabase.from('sports').select('name').order('name'),
  ]);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <EventForm action={createEvent} venues={venues ?? []} sports={(sports ?? []).map(s => s.name)} />
    </div>
  );
}
