"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HandHeart,
  HeartHandshake,
  Leaf,
  Loader2,
  MapPin,
  Megaphone,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import EventCard from "@/components/shared/event-card";
import EventCardSkeleton from "@/components/shared/event-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { apiRequest } from "@/lib/api";
import { SITE } from "@/lib/constants";
import type { EventsResponse, EventItem } from "@/types/event";

const features = [
  {
    icon: CalendarDays,
    title: "Create with purpose",
    description:
      "Publish a community event in minutes with a clear date, location, and volunteer target.",
  },
  {
    icon: Users,
    title: "Volunteer together",
    description:
      "Join events that match your values and meet people who want to make a difference too.",
  },
  {
    icon: ShieldCheck,
    title: "Organizer control",
    description:
      "Only you can edit or delete the events you create, with protected routes and JWT-backed APIs.",
  },
  {
    icon: Megaphone,
    title: "Real community impact",
    description:
      "Track participation and keep your volunteers informed from one simple dashboard.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
    title: "Community clean-up",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    title: "Food distribution",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
    title: "Team volunteering",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    title: "Plantation drive",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80",
    title: "Neighbourhood care",
  },
  {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80",
    title: "Learning together",
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest<EventsResponse>("/api/events?limit=6");
      setEvents(result.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load upcoming events.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.add({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    toast.add({
      title: "You're on the list!",
      description: "Thank you for subscribing to the ImpactPulse newsletter.",
      type: "success",
    });
    setEmail("");
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/40 dark:via-background dark:to-teal-950/20">
        <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-96 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div>
            <Badge className="mb-6 border-0 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">
              <Sparkles className="mr-2 size-4" />
              Together, we create impact
            </Badge>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Small actions.
              <span className="block text-primary">Big changes.</span>
              Better communities.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              ImpactPulse connects people and ideas to social development
              events. Discover a cause, join a team, or create your own
              opportunity to give back.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/events" />}>
                Explore events
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/register" />}
              >
                Become a volunteer
              </Button>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { value: "100%", label: "Community driven" },
                { value: "6+", label: "Ways to help" },
                { value: "∞", label: "Possibilities" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card p-3 shadow-2xl shadow-emerald-950/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85"
                alt="Volunteers working together in the community"
                className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[430px]"
              />
            </div>

            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HandHeart className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">Stronger together</p>
                <p className="text-xs text-muted-foreground">
                  Every volunteer matters
                </p>
              </div>
            </div>

            <div className="absolute -right-3 top-5 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:-right-6">
              <p className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="size-4 text-primary" />
                Make it count
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-4">
            Why ImpactPulse
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Everything you need to turn kindness into action
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A focused toolkit for volunteers and organizers — no noise, just
            meaningful community work.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-4 border-0 bg-primary/10 text-primary hover:bg-primary/10">
                <CalendarDays className="mr-1.5 size-3.5" />
                Upcoming near you
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Recent upcoming events
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                The next six opportunities to show up for your community.
              </p>
            </div>

            <Button variant="outline" render={<Link href="/events" />}>
              View all events
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="font-semibold text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={loadEvents}>
                Try again
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
              <HeartHandshake className="mx-auto size-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-xl font-bold">No upcoming events yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to create an opportunity for your community.
              </p>
              <Button
                className="mt-5"
                render={<Link href="/dashboard/create-event" />}
              >
                Create an event
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.eventId || event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              <Leaf className="mr-1.5 size-3.5" />
              Moments that matter
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Real people. Real community work.
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              A glimpse of the energy volunteers bring to neighbourhoods every
              week.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((photo, index) => (
            <div
              key={photo.src}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                {photo.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-2xl sm:px-10 lg:px-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge className="border-0 bg-white/10 text-emerald-300 hover:bg-white/10">
                <Send className="mr-1.5 size-3.5" />
                Stay in the loop
              </Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Good news, delivered with purpose.
              </h2>
              <p className="mt-3 max-w-lg leading-7 text-slate-400">
                Get a short monthly note about new events, volunteer stories,
                and ways to help near you. No spam, ever.
              </p>
            </div>

            <form
              onSubmit={handleNewsletter}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                aria-label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 border-white/15 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-emerald-400"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="shrink-0 bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              >
                Subscribe
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-secondary px-5 py-16 text-primary-foreground sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <HeartHandshake className="mx-auto size-14 opacity-80" />
          <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
            Your community needs you.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 opacity-80">
            Whether you have an hour or a whole day, your contribution helps
            build a stronger, kinder, and more caring society.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              render={<Link href="/register" />}
            >
              Join the community
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              render={<Link href="/events" />}
            >
              Discover events
            </Button>
          </div>
        </div>
      </section>

      <div className="sr-only">
        <p>
          {SITE.name}: {SITE.tagline}
        </p>
      </div>
    </main>
  );
}
