"use client";

import { useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  HeartHandshake,
  PlusCircle,
  Settings,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";

import EventCard from "@/components/shared/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiData } from "@/hooks/use-api-data";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { EventsResponse } from "@/types/event";

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const fetchDashboard = useCallback(async () => {
    const [created, joined] = await Promise.all([
      apiRequest<EventsResponse>("/api/my/events", {}, true),
      apiRequest<EventsResponse>("/api/my/joined-events", {}, true),
    ]);

    return { created, joined };
  }, []);

  const { data, loading, error, reload } = useApiData(fetchDashboard);
  const myEvents = data?.created.events ?? [];
  const joinedEvents = data?.joined.events ?? [];

  function reloadDashboard() {
    void reload();
  }

  const totalParticipants = myEvents.reduce(
    (total, event) => total + (event.participantCount || 0),
    0,
  );

  const stats = [
    {
      label: "Events created",
      value: myEvents.length,
      icon: CalendarDays,
    },
    {
      label: "Events joined",
      value: joinedEvents.length,
      icon: Users,
    },
    {
      label: "Volunteers reached",
      value: totalParticipants,
      icon: HeartHandshake,
    },
  ];

  const recentCreated = myEvents.slice(0, 3);
  const recentJoined = joinedEvents.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl shadow-emerald-950/20 sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 max-w-2xl">
          <Badge className="border border-white/20 bg-white/15 text-white hover:bg-white/20">
            <Sparkles className="mr-1.5 size-3.5" />
            Your impact hub
          </Badge>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {firstName}.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
            Organize meaningful events, track volunteers, and keep the
            momentum going. Every action adds up.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              className="bg-white text-emerald-700 hover:bg-emerald-50"
              render={<Link href="/dashboard/create-event" />}
            >
              <PlusCircle className="mr-2 size-4" />
              Create an event
            </Button>
            <Button
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/events" />}
            >
              Browse events
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={reloadDashboard}>
            Try again
          </Button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  {loading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <p className="text-2xl font-extrabold tracking-tight">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Create Event",
            description: "Publish a new opportunity for volunteers.",
            href: "/dashboard/create-event",
            icon: CalendarPlus,
          },
          {
            title: "Manage Events",
            description: "Edit or delete the events you organize.",
            href: "/dashboard/my-events",
            icon: Settings,
          },
          {
            title: "Joined Events",
            description: "See every event you have signed up for.",
            href: "/dashboard/joined-events",
            icon: Ticket,
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 font-bold">{action.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {action.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Your latest events
            </h2>
            <p className="text-sm text-muted-foreground">
              Events you created most recently.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/dashboard/my-events" />}
          >
            View all
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : recentCreated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <CalendarDays className="mx-auto size-10 text-muted-foreground/40" />
            <h3 className="mt-3 font-bold">No events created yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start by creating your first community event.
            </p>
            <Button className="mt-4" render={<Link href="/dashboard/create-event" />}>
              Create an event
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentCreated.map((event) => (
              <EventCard
                key={event.eventId || event._id}
                event={event}
                showStatus
              />
            ))}
          </div>
        )}
      </section>

      {recentJoined.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Events you joined
              </h2>
              <p className="text-sm text-muted-foreground">
                Your upcoming volunteer commitments.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/dashboard/joined-events" />}
            >
              View all
              <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentJoined.map((event) => (
              <EventCard
                key={event.eventId || event._id}
                event={event}
                showStatus
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
