"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useApiData } from "@/hooks/use-api-data";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { EVENT_TYPE_STYLES } from "@/lib/constants";
import { formatEventDate, isPastDate } from "@/lib/date";
import type { EventResponse } from "@/types/event";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchEvent = useCallback(
    () => apiRequest<EventResponse>(`/api/events/${id}`),
    [id],
  );
  const { data, loading, error, reload } = useApiData(fetchEvent);
  const event = data?.event ?? null;

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  async function handleJoin() {
    if (!event) return;
    setActionLoading(true);
    setActionError("");

    try {
      await apiRequest<EventResponse>(
        `/api/events/${id}/join`,
        { method: "POST", body: JSON.stringify({}) },
        true,
      );

      await reload();
      toast.add({
        title: "You're in!",
        description: "You joined this event successfully.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to join this event.";
      setActionError(message);
      toast.add({ title: "Could not join", description: message, type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLeave() {
    if (!event) return;
    setActionLoading(true);
    setActionError("");

    try {
      await apiRequest<{ message?: string }>(
        `/api/events/${id}/leave`,
        { method: "DELETE" },
        true,
      );
      await reload();
      toast.add({
        title: "You left the event",
        description: "Your volunteer spot was released.",
        type: "info",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to leave this event.";
      setActionError(message);
      toast.add({ title: "Could not leave", description: message, type: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading && !event) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-9 w-36" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-destructive" />
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button className="mt-6" render={<Link href="/events" />}>
          Back to events
        </Button>
      </main>
    );
  }

  if (!event) return null;

  const participantCount =
    event.participantCount ?? event.participants?.length ?? 0;
  const remainingSpots = Math.max(0, event.volunteersNeeded - participantCount);
  const isJoined =
    !!userId && event.participants?.some((person) => person.userId === userId);
  const isCreator = !!userId && event.createdBy === userId;
  const isFull = remainingSpots <= 0;
  const isPast = isPastDate(event.eventDate);
  const typeStyle =
    EVENT_TYPE_STYLES[event.category] ?? EVENT_TYPE_STYLES.Other;
  const percent = Math.min(
    100,
    Math.round((participantCount / Math.max(1, event.volunteersNeeded)) * 100),
  );

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Button variant="ghost" className="mb-6 -ml-3" render={<Link href="/events" />}>
          <ArrowLeft className="mr-2 size-4" />
          Back to events
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden p-0">
              {event.imageUrl ? (
                <div className="h-64 w-full overflow-hidden bg-muted sm:h-96">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-sky-950/40 sm:h-96">
                  <HeartHandshake className="size-20 text-primary/50" />
                </div>
              )}

              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`border-0 ${typeStyle}`}>
                    {event.category}
                  </Badge>
                  {isPast && <Badge variant="secondary">Event completed</Badge>}
                  {!isPast && isFull && (
                    <Badge variant="destructive">Volunteers full</Badge>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {event.title}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Organized by{" "}
                    <span className="font-semibold text-foreground">
                      {event.createdByName || "ImpactPulse Community"}
                    </span>
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                    <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Event date</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatEventDate(event.eventDate, true)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Location</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {(event.startTime || event.endTime) && (
                    <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                      <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Time</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.startTime || "TBA"}
                          {event.endTime ? ` – ${event.endTime}` : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                    <Users className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Volunteers</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {participantCount} of {event.volunteersNeeded} spots filled
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-bold">About this event</h2>
                  <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
                    {event.description}
                  </p>
                </div>

                {event.participants?.length > 0 && (
                  <div className="border-t border-border pt-6">
                    <h2 className="text-lg font-bold">Who&apos;s joining</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.participants.slice(0, 8).map((person) => (
                        <div
                          key={person.userId + person.joinedAt}
                          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3"
                        >
                          <Avatar size="sm">
                            {person.image ? (
                              <AvatarImage src={person.image} alt={person.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                              {person.name?.charAt(0).toUpperCase() || "V"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="max-w-32 truncate text-xs font-medium">
                            {person.name}
                          </span>
                        </div>
                      ))}
                      {event.participants.length > 8 && (
                        <span className="self-center text-xs text-muted-foreground">
                          +{event.participants.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <aside>
            <Card className="sticky top-24">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h2 className="text-xl font-bold">Volunteer for this event</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your participation can make a real difference.
                  </p>
                </div>

                <div className="rounded-xl bg-muted/60 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Volunteer spots</span>
                    <span className="font-semibold">
                      {participantCount}/{event.volunteersNeeded}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {remainingSpots} spot{remainingSpots === 1 ? "" : "s"} remaining
                  </p>
                </div>

                {!session && !isPast ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Please log in to join this event.
                    </p>
                    <Button
                      className="w-full"
                      render={<Link href={`/login?redirect=/events/${id}`} />}
                    >
                      Log in to join
                    </Button>
                  </div>
                ) : isCreator ? (
                  <div className="rounded-xl border border-border p-4 text-center">
                    <CheckCircle2 className="mx-auto mb-2 size-6 text-primary" />
                    <p className="font-semibold">You organize this event</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Manage details and volunteers from your dashboard.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      render={<Link href={`/dashboard/edit-event/${id}`} />}
                    >
                      Edit event
                    </Button>
                  </div>
                ) : isJoined ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-emerald-600/30 bg-emerald-50 p-3 text-center text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <CheckCircle2 className="mx-auto mb-1 size-5" />
                      <p className="font-medium">You joined this event!</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLeave}
                      disabled={actionLoading || isPast}
                    >
                      {actionLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Leave event
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleJoin}
                    disabled={actionLoading || isFull || isPast}
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <HeartHandshake className="mr-2 size-4" />
                    )}
                    {isPast
                      ? "Event completed"
                      : isFull
                        ? "No spots available"
                        : "Join this event"}
                  </Button>
                )}

                {(error || actionError) && event && (
                  <p className="text-sm text-destructive">
                    {actionError || error}
                  </p>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  Together, we can create positive change in our community.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
