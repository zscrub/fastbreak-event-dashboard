'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [pending, start] = useTransition();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-gray-700 hover:bg-gray-100 cursor-pointer" variant="outline" size="sm">
          Cancel Event
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Event?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to cancel this event?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <DialogTrigger>Cancel</DialogTrigger>
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() =>
              start(async () => {
                try {
                  await onDelete();
                  toast.success('Event cancelled');
                }   
                catch (e: unknown) {
                  if (e instanceof Error) {
                    toast.error(e.message ?? 'Failed to cancel event');
                  } else {
                    toast.error('Failed to cancel event');
                  }
                }
              })
            }
          >
            {pending ? 'Cancelling…' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
