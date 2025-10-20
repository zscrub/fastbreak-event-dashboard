'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signInWithPasswordAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // You can throw and catch in client, or return an object:
    return { ok: false, message: error.message };
  }

  redirect('/dashboard'); // sets cookies and navigates
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
    //   redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:3000'}/callback`,
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,

    },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, url: data.url };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
