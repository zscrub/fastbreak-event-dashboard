'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EventInput, type EventInputType } from '@/lib/validators/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  action: (input: EventInputType) => Promise<any>; // 🔹 can be create or update
  venues: { id: string; name: string; city: string | null }[];
  sports: string[];
  initialValues?: Partial<EventInputType>;
  mode?: 'create' | 'edit'; // 🔹 new prop
};

export default function EventForm({
  action,
  venues,
  sports,
  initialValues = {},
  mode = 'create',
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(EventInput),
    defaultValues: {
      name: '',
      sport_type: sports[0] ?? '',
      starts_at: '',
      description: '',
      venue_ids: [],
      ...initialValues,
    },
  });

  const onSubmit = (values: EventInputType) => {
    startTransition(async () => {
      try {
        const res = await action(values);
        if (res?.ok) {
          toast.success(
            mode === 'edit' ? 'Event updated successfully' : 'Event created successfully'
          );
          router.push('/dashboard');
        }
      } catch (e: any) {
        toast.error(e.message ?? 'Failed to submit event');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields identical to before */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Championship Game" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="starts_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? field.value.substring(0, 16) : ''}
                  onChange={(e) =>
                    field.onChange(new Date(e.target.value).toISOString())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue_ids"
          render={() => (
            <FormItem>
              <FormLabel>Venues</FormLabel>
              <div className="grid gap-2">
                {venues.map((v) => {
                  const checked = (form.watch('venue_ids') ?? []).includes(v.id);
                  return (
                    <label key={v.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={(e) => {
                          const current = form.getValues('venue_ids') ?? [];
                          form.setValue(
                            'venue_ids',
                            e.target.checked
                              ? [...current, v.id]
                              : current.filter((id) => id !== v.id),
                            { shouldValidate: true }
                          );
                        }}
                      />
                      <span>
                        {v.name}
                        {v.city ? ` – ${v.city}` : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? mode === 'edit'
                ? 'Updating…'
                : 'Creating…'
              : mode === 'edit'
              ? 'Update Event'
              : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
