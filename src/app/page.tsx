"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  Search,
  Leaf,
  GraduationCap,
  HeartPulse,
  HandHeart,
  Menu,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

const categories = [
  { name: "All Events", icon: Sparkles },
  { name: "Community Service", icon: HandHeart },
  { name: "Education", icon: GraduationCap },
  { name: "Environment", icon: Leaf },
  { name: "Health", icon: HeartPulse },
  { name: "Food Distribution", icon: HeartHandshake },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "Community Service": "bg-blue-100 text-blue-700",
    Education: "bg-purple-100 text-purple-700",
    Environment: "bg-green-100 text-green-700",
    Health: "bg-red-100 text-red-700",
    "Food Distribution": "bg-orange-100 text-orange-700",
  };

  return colors[category] || "bg-gray-100 text-gray-700";
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All Events");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.set("limit", "6");

      if (category !== "All Events") {
        params.set("category", category);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const result = await apiRequest<EventsResponse>(
        `/api/events?${params.toString()}`,
      );

      setEvents(result.events || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchText);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-green-50">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge className="mb-6 border-0 bg-green-100 px-4 py-2 text-green-700 hover:bg-green-100">
              <HeartHandshake className="mr-2 h-4 w-4" />
              Together, We Create Impact
            </Badge>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Small Actions.
              <span className="block text-green-600">Big Changes.</span>
              Better Communities.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover meaningful volunteer opportunities, join community
              events, and make a real difference in the lives of people around
              you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                asChild
                className="bg-green-600 px-7 hover:bg-green-700"
              >
                <Link href="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Become a Volunteer</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-extrabold text-gray-900">100%</p>
                <p className="mt-1 text-sm text-gray-500">Community Driven</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900">One</p>
                <p className="mt-1 text-sm text-gray-500">Shared Mission</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900">∞</p>
                <p className="mt-1 text-sm text-gray-500">Possibilities</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] bg-green-200 p-4 shadow-xl">
              <div className="flex min-h-[360px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-8 text-white sm:min-h-[420px]">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Make Every Action Count
                  </span>

                  <h2 className="mt-8 max-w-sm text-4xl font-extrabold leading-tight">
                    Be the reason someone smiles today.
                  </h2>

                  <p className="mt-4 max-w-sm text-green-50">
                    Your time, kindness, and effort can transform a community.
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-white/15 p-5 backdrop-blur">
                  <div>
                    <p className="text-sm text-green-50">Your next step</p>
                    <p className="mt-1 text-xl font-bold">Join a local event</p>
                  </div>
                  <HeartHandshake size={45} />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 rounded-2xl bg-white p-4 shadow-lg sm:-left-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3 text-green-700">
                  <Users size={22} />
                </div>
                <div>
                  <p className="font-bold">Stronger Together</p>
                  <p className="text-xs text-gray-500">
                    Every volunteer matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="relative z-10 mx-auto -mt-1 max-w-5xl px-5">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Find an opportunity to make a difference
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search for events by name, category, or location.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search events or locations..."
                  className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-12 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <Button
                type="submit"
                className="h-12 bg-green-600 px-8 hover:bg-green-700"
              >
                Search Events
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* EVENTS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Badge className="border-0 bg-green-100 text-green-700 hover:bg-green-100">
              Make a Difference
            </Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Explore Community Events
            </h2>
            <p className="mt-3 max-w-xl text-gray-500">
              Find an opportunity that matches your passion and start creating
              positive change.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/events">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = category === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setCategory(item.name)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:text-green-700"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* EVENT LIST */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Loading events...</span>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <Button onClick={loadEvents} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed p-12 text-center">
            <HeartHandshake className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-xl font-bold">No events found</h3>
            <p className="mt-2 text-gray-500">
              Try another category or search for something different.
            </p>
            <Button
              className="mt-5 bg-green-600 hover:bg-green-700"
              onClick={() => {
                setCategory("All Events");
                setSearch("");
                setSearchText("");
              }}
            >
              Show All Events
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.eventId || event._id}
                className="group overflow-hidden border-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <HeartHandshake
                      size={65}
                      className="text-green-300 transition duration-500 group-hover:scale-110"
                    />
                  )}

                  <Badge
                    className={`absolute left-4 top-4 border-0 ${getCategoryColor(
                      event.category,
                    )}`}
                  >
                    {event.category}
                  </Badge>
                </div>

                <CardContent className="p-5">
                  <h3 className="line-clamp-2 min-h-14 text-lg font-bold transition group-hover:text-green-700">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={17}
                        className="shrink-0 text-green-600"
                      />
                      {formatDate(event.eventDate)}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="shrink-0 text-green-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={17} className="shrink-0 text-green-600" />
                      {event.participantCount || 0} / {event.volunteersNeeded}{" "}
                      volunteers
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-4">
                    <Button
                      asChild
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Link href={`/events/${event.eventId || event._id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-green-700 px-5 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <HeartHandshake className="mx-auto h-14 w-14 text-green-200" />

          <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
            Your Community Needs You.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-green-100">
            Whether you have an hour or a whole day, your contribution can help
            build a stronger, kinder, and more caring society.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-green-800 hover:bg-green-50"
            >
              <Link href="/register">Join Our Community</Link>
            </Button>

            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-white text-green-800"
            >
              <Link href="/events">Discover Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
