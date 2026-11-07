"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Pencil,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import EventCard from "@/components/shared/event-card";
import EventCardSkeleton from "@/components/shared/event-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useApiData } from "@/hooks/use-api-data";
import { apiRequest } from "@/lib/api";
import type { EventsResponse } from "@/types/event";

export default function MyEventsPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const fetchEvents = useCallback(
    () => apiRequest<EventsResponse>("/api/my/events", {}, true),
    [],
  );
  const { data, loading, error, reload } = useApiData(fetchEvents);
  const events = data?.events ?? [];

  function reloadEvents() {
    void reload();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      const result = await apiRequest<{ message?: string }>(
        `/api/events/${id}`,
        { method: "DELETE" },
        true,
      );

      await reload();
      setConfirmId(null);
      toast.add({
        title: "Event deleted",
        description: result.message || "The event has been removed.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete this event.";
      toast.add({
        title: "Delete failed",
        description: message,
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="mb-3 border-0 bg-primary/10 text-primary hover:bg-primary/10">
            Event organizer
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Manage events
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Edit or remove the events you created. Only you can change your own
            events.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={reloadEvents} disabled={loading}>
            <RefreshCw
              className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button render={<Link href="/dashboard/create-event" />}>
            <PlusCircle className="mr-2 size-4" />
            Create event
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={reloadEvents}>
            Try again
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {loading
          ? "Loading your events..."
          : `${events.length} event${events.length === 1 ? "" : "s"} created by you`}
      </p>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <CalendarDays className="mx-auto size-12 text-muted-foreground/40" />
          <h2 className="mt-4 text-xl font-bold">No events yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first event and invite the community to join.
          </p>
          <Button
            className="mt-5"
            render={<Link href="/dashboard/create-event" />}
          >
            Create an event
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const id = event.eventId || event._id;
            const isConfirming = confirmId === id;
            const isDeleting = deletingId === id;

            return (
              <div key={id} className="flex flex-col gap-3">
                <EventCard event={event} showStatus />

                {isConfirming ? (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
                    <p className="text-sm font-medium text-destructive">
                      Delete this event permanently?
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setConfirmId(null)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      render={<Link href={`/dashboard/edit-event/${id}`} />}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setConfirmId(id)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
