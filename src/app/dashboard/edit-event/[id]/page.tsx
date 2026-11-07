"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import EventForm from "@/components/shared/event-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/use-api-data";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { EventResponse } from "@/types/event";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  const fetchEvent = useCallback(
    () => apiRequest<EventResponse>(`/api/events/${id}`),
    [id],
  );
  const { data, loading, error } = useApiData(fetchEvent);
  const event = data?.event ?? null;

  const isOwner = Boolean(userId && event && event.createdBy === userId);

  if (loading || isPending) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">
          {error || "This event does not exist or was deleted."}
        </p>
        <Button className="mt-6" render={<Link href="/dashboard/my-events" />}>
          Back to manage events
        </Button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
        <h1 className="text-2xl font-bold">You can&apos;t edit this event</h1>
        <p className="mt-2 text-muted-foreground">
          Only the organizer can update or delete an event.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" render={<Link href="/events" />}>
            Browse events
          </Button>
          <Button render={<Link href="/dashboard/my-events" />}>
            Manage my events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button
          variant="ghost"
          className="-ml-3 mb-4"
          render={<Link href="/dashboard/my-events" />}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to manage events
        </Button>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Edit event
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Update the details of <span className="font-semibold">{event.title}</span>.
          Changes are visible immediately.
        </p>
      </div>

      <EventForm
        key={event.eventId || event._id}
        mode="edit"
        eventId={event.eventId || event._id}
        initialEvent={event}
      />

      <Card>
        <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 shrink-0 text-primary" />
          Tip: if you change the date to a past date the event will stop
          appearing on the Upcoming Events page.
        </CardContent>
      </Card>
    </div>
  );
}
