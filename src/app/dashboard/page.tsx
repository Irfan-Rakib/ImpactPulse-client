"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  PlusCircle,
  Users,
  HeartHandshake,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EventsListResponse {
  success: boolean;
  total: number;
  events: EventItem[];
}

export default function DashboardPage() {
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [created, joined] = await Promise.all([
          apiRequest<EventsListResponse>("/api/my/events"),
          apiRequest<EventsListResponse>("/api/my/joined-events"),
        ]);

        setMyEvents(created.events || []);
        setJoinedEvents(joined.events || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-primary">ImpactPulse</p>
            <h1 className="mt-1 text-3xl font-bold">My Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your community activities and volunteering.
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/create-event">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {error && (
          <p className="mt-6 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Events Created</p>
                <p className="text-3xl font-bold">{myEvents.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Events Joined</p>
                <p className="text-3xl font-bold">{joinedEvents.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Community Impact
                </p>
                <p className="text-3xl font-bold">
                  {myEvents.reduce(
                    (total, event) => total + (event.participantCount || 0),
                    0,
                  ) + joinedEvents.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">My Created Events</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Events you have organized.
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/dashboard/my-events" aria-label="View my events">
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {myEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You have not created any events yet.
                  </p>
                ) : (
                  myEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.eventId || event._id}
                      href={`/events/${event.eventId || event._id}`}
                      className="block rounded-lg border p-3 transition hover:bg-muted"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <Button variant="outline" className="mt-5 w-full" asChild>
                <Link href="/dashboard/my-events">Manage My Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Joined Events</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Activities where you are volunteering.
                  </p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="/dashboard/joined-events"
                    aria-label="View joined events"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {joinedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    You have not joined any events yet.
                  </p>
                ) : (
                  joinedEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.eventId || event._id}
                      href={`/events/${event.eventId || event._id}`}
                      className="block rounded-lg border p-3 transition hover:bg-muted"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </Link>
                  ))
                )}
              </div>

              <Button variant="outline" className="mt-5 w-full" asChild>
                <Link href="/dashboard/joined-events">View Joined Events</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
