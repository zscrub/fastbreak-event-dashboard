import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEvents, deleteEvent } from '@/actions/events';
import Filters from './filters';
import DeleteButton from './DeleteButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EventWithVenues } from '@/types/event';

type Props = {
  searchParams: { q?: string; sport?: string };
};

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = createClient();

  // 🔒 Auth check
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const userId = session.user.id;

  // Fetch data
  const { data: sports } = await supabase.from('sports').select('name').order('name');
  const events = await getEvents({ q: searchParams.q, sport: searchParams.sport });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Sports Events</h1>
        <Button asChild>
           <Link
            href={'/events/new'}
            className="transition cursor-pointer"
            >
              <div className="font-semibold">Create Event</div>
            </Link>
        </Button>
      </div>

      {/* Search / Filter */}
      <Filters sports={(sports ?? []).map((s) => s.name)} />

      {/* Events */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event: EventWithVenues) => (
            <Card key={event.id}>
                <CardHeader>
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="transition cursor-pointer"
                  >
                    <CardTitle>{event.name}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{event.sport_type}</p>
                  <p className="text-sm">{new Date(event.starts_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">
                    {event.event_venues?.[0]?.venues?.[0]?.name ?? '—'}

                  </p>

                  {event.owner_id === userId && (
                    <div className="mt-3 flex gap-2 items-center">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                         <Link
                          href={`/events/${event.id}/edit`}
                          className="transition cursor-pointer"
                          >
                          <div className="font-semibold">Edit</div>
                      </Link>
                      </Button>

                      <DeleteButton
                        onDelete={async () => {
                          'use server';
                          await deleteEvent(event.id);
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}
