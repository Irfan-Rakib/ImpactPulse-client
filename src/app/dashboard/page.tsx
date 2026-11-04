"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  PlusCircle,
  Users,
  HeartHandshake,
  ArrowRight,
  MapPin,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [created, joined] = await Promise.all([
        apiRequest<EventsResponse>("/api/my/events"),
        apiRequest<EventsResponse>("/api/my/joined-events"),
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
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalParticipants = myEvents.reduce(
    (total, event) => total + (event.participantCount || 0),
    0,
  );

  const stats = [
    {
      label: "Events Created",
      value: myEvents.length,
      description: "Community activities you organized",
      icon: CalendarDays,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Events Joined",
      value: joinedEvents.length,
      description: "Activities you are supporting",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Volunteers Reached",
      value: totalParticipants,
      description: "People participating in your events",
      icon: HeartHandshake,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-lg sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <Badge className="border border-white/20 bg-white/15 text-white hover:bg-white/20">
            <Sparkles className="mr-1 h-3 w-3" />
            Make a Difference
          </Badge>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome to Your Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
            Every action matters. Organize meaningful events, connect with
            volunteers, and make your community stronger.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Link href="/dashboard/create-event">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create an Event
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/events">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <HeartHandshake className="absolute -bottom-12 -right-8 h-64 w-64 text-white/10" />
      </section>

      {/* Error state */}
      {error && (
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-red-700">{error}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              An overview of your ImpactPulse journey.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="rounded-2xl border-slate-200 shadow-sm"
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`rounded-2xl p-4 ${stat.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-extrabold text-slate-900">
                      {loading ? "—" : stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/my-events">
          <Card className="group h-full rounded-2xl border-slate-200 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Manage My Events</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Edit, view or delete your events.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/joined-events">
          <Card className="group h-full rounded-2xl border-slate-200 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">My Volunteer Activities</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Track the events you joined.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Event previews */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Created events */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">My Created Events</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Activities you organized.
                </p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="/dashboard/my-events"
                  aria-label="View created events"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading your events...
                </p>
              ) : myEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">
                    No events created yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Start by organizing your first community activity.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/dashboard/create-event">Create Event</Link>
                  </Button>
                </div>
              ) : (
                myEvents.slice(0, 4).map((event) => {
                  const id = event.eventId || event._id;

                  return (
                    <Link
                      key={id}
                      href={`/events/${id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border p-4 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {event.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {event.location}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {event.participantCount || 0} joined
                      </Badge>
                    </Link>
                  );
                })
              )}
            </div>

            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href="/dashboard/my-events">Manage My Events</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Joined events */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Joined Events</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Activities where you volunteer.
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
              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Loading joined events...
                </p>
              ) : joinedEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <HeartHandshake className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium">
                    No joined events yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Find a cause and become part of the change.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/events">Explore Events</Link>
                  </Button>
                </div>
              ) : (
                joinedEvents.slice(0, 4).map((event) => {
                  const id = event.eventId || event._id;

                  return (
                    <Link
                      key={id}
                      href={`/events/${id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border p-4 transition hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {event.title}
                        </p>
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {event.location}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        Joined
                      </Badge>
                    </Link>
                  );
                })
              )}
            </div>

            <Button asChild variant="outline" className="mt-5 w-full">
              <Link href="/dashboard/joined-events">View Joined Events</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Impact message */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white p-3 text-emerald-700 shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-950">
              Small actions create big change
            </h3>
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              Thank you for being part of ImpactPulse. Keep creating
              opportunities and supporting your community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
