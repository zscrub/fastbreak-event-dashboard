import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteButton from '../../dashboard/DeleteButton';
import { deleteEvent } from '@/actions/events';

type Props = { params: { id: string } };

export default async function EventDetailsPage({ params }: Props) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: event, error } = await supabase
    .from('events')
    .select(
      'id, name, description, sport_type, starts_at, event_venues(venues(name, city))'
    )
    .eq('id', params.id)
    .single();

  if (error || !event) return notFound();

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <span className="font-medium">Sport:</span> {event.sport_type}
          </p>
          <p>
            <span className="font-medium">Date:</span>{' '}
            {new Date(event.starts_at).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Description:</span>{' '}
            {event.description || '—'}
          </p>
          <div>
            <span className="font-medium">Venues:</span>
            <ul className="list-disc list-inside">
              {event.event_venues.map((ev: any) => (
                <li key={ev.venues.name}>
                  {ev.venues.name}
                  {ev.venues.city ? ` – ${ev.venues.city}` : ''}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild variant="outline" size="sm">
              <a href={`/events/${event.id}/edit`}>Edit</a>
            </Button>
            <DeleteButton
              onDelete={async () => {
                'use server';
                await deleteEvent(event.id);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
