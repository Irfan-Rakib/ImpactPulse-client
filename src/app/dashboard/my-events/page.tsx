"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Trash2,
  Eye,
  Pencil,
  Loader2,
  Users,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function isEventPast(eventDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(eventDate);
  date.setHours(0, 0, 0, 0);

  return date < today;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<EventsResponse>("/api/my/events");
      setEvents(data.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function handleDelete(eventId: string) {
    setDeletingId(eventId);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest<{ message?: string }>(
        `/api/events/${eventId}`,
        { method: "DELETE" },
        true,
      );

      setEvents((previous) =>
        previous.filter(
          (event) => event.eventId !== eventId && event._id !== eventId,
        ),
      );

      setMessage(result.message || "Event deleted successfully.");
      setConfirmId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this event.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalVolunteers = events.reduce(
    (total, event) => total + (event.participantCount || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="mb-3 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Event Organizer
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              My Events
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Manage the community activities you have created.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadEvents} disabled={loading}>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard/create-event">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-red-700">{error}</p>
          <Button size="sm" variant="outline" onClick={loadEvents}>
            Try Again
          </Button>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}

      {/* Statistics */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Events Created
                </p>
                <p className="text-2xl font-extrabold">{events.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Volunteers
                </p>
                <p className="text-2xl font-extrabold">{totalVolunteers}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event list */}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
          <span className="text-sm text-muted-foreground">
            Loading your events...
          </span>
        </div>
      ) : events.length === 0 ? (
        <Card className="rounded-2xl border-dashed shadow-none">
          <CardContent className="flex flex-col items-center p-10 text-center sm:p-14">
            <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-700">
              <CalendarDays className="h-10 w-10" />
            </div>
            <h2 className="mt-5 text-xl font-bold">No events created yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Start making a difference by organizing your first community
              event. Invite volunteers and create positive change.
            </p>
            <Button
              asChild
              className="mt-6 bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/dashboard/create-event">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const id = event.eventId || event._id;
            const past = isEventPast(event.eventDate);
            const isConfirming = confirmId === id;
            const isDeleting = deletingId === id;

            return (
              <Card
                key={id}
                className="group overflow-hidden rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden bg-emerald-50">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CalendarDays className="h-16 w-16 text-emerald-300" />
                    </div>
                  )}

                  <Badge
                    className={`absolute right-3 top-3 ${
                      past
                        ? "bg-slate-800 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {past ? "Completed" : "Upcoming"}
                  </Badge>
                </div>

                <CardContent className="space-y-4 p-5">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {event.category}
                    </Badge>
                    <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                      {event.title}
                    </h2>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="truncate">{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-emerald-600" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0 text-emerald-600" />
                      {event.participantCount || 0} / {event.volunteersNeeded}{" "}
                      volunteers
                    </p>
                  </div>

                  {isConfirming ? (
                    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-800">
                        Delete this event permanently?
                      </p>
                      <p className="text-xs leading-5 text-red-700">
                        This action cannot be undone.
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          disabled={isDeleting}
                          onClick={() => handleDelete(id)}
                        >
                          {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={isDeleting}
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 border-t pt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Link>
                      </Button>

                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/dashboard/edit-event/${id}`}>
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label={`Delete ${event.title}`}
                        onClick={() => setConfirmId(id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
