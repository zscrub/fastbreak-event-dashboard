import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/actions/auth';
import Link from 'next/link';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-dvh">
      <header className="border-b p-4 flex items-center justify-between">
        <Link
            href={'/dashboard'}
            className="transition cursor-pointer"
            >
            <div className="font-semibold">Sports Events</div>
        </Link>
        <form action={signOutAction}>
          <Button variant="outline" type="submit">Sign out</Button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}
