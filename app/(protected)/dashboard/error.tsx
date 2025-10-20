'use client';
export default function Error({ error }: { error: Error }) {
  return <div className="p-6 text-red-600">Failed to load events: {error.message}</div>;
}
