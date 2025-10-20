import { getEvents } from '@/actions/events';

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

export default async function DebugPage() {
  const events = await getEvents();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Events</h1>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}

