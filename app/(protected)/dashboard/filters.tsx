'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

export default function Filters({ sports }: { sports: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');
  const [sport, setSport] = useState(sp.get('sport') ?? 'all');

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp);
      q ? params.set('q', q) : params.delete('q');
      sport ? params.set('sport', sport) : params.delete('sport');
      router.replace(`/dashboard?${params.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [q, sport]);

  return (
    <div className="flex gap-2">
      <Input placeholder="Search by name..." value={q} onChange={(e) => setQ(e.target.value)} />
      <Select value={sport} onValueChange={setSport}>
        <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {sports.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
