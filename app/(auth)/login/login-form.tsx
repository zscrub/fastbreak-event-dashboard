'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { signInWithPasswordAction, signInWithGoogleAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // if missing: npx shadcn@latest add label

export default function LoginForm() {
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    start(async () => {
      const res = await signInWithPasswordAction(formData);
      if (res && !res.ok) toast.error(res.message);
      // success path redirects server-side to /dashboard
    });
  };

  const onGoogle = () => {
    start(async () => {
      const res = await signInWithGoogleAction();
      if (res?.ok && res.url) window.location.href = res.url;
      else toast.error(res?.message ?? 'Failed to start Google sign-in');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Email login coming soon!</h1>

        {/* Disabled email/password section */}
        <div className="relative opacity-50 pointer-events-none">
          <div className="space-y-2">
            <div className="text-left">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="you@example.com"
                disabled
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm"
                disabled
              />
            </div>
            <Button disabled className="w-full">
              Sign in
            </Button>
          </div>

          {/* Overlay “Coming soon” banner */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-md">
            <span className="text-gray-700 text-sm font-medium">
            </span>
          </div>
        </div>

        {/* Google login (active) */}
        <form
          action={async () => {
            const { url } = await signInWithGoogleAction();
            if (url) globalThis.location.href = url;

          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="w-full font-medium"
          >
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
