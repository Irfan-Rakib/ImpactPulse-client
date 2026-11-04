"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  MapPin,
  Users,
  HeartHandshake,
  Loader2,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import type { EventItem, EventsResponse } from "@/types/event";

const categories = [
  "All Events",
  "Community Service",
  "Education",
  "Environment",
  "Health",
  "Food Distribution",
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function categoryStyle(category: string) {
  const styles: Record<string, string> = {
    "Community Service": "bg-blue-100 text-blue-700",
    Education: "bg-purple-100 text-purple-700",
    Environment: "bg-green-100 text-green-700",
    Health: "bg-red-100 text-red-700",
    "Food Distribution": "bg-orange-100 text-orange-700",
  };

  return styles[category] || "bg-gray-100 text-gray-700";
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Events");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "9",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "All Events") {
        params.set("category", category);
      }

      const result = await apiRequest<EventsResponse>(
        `/api/events?${params.toString()}`,
      );

      setEvents(result.events || []);
      setTotal(result.total || 0);
      setTotalPages(Math.max(1, result.totalPages || 1));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setCategory("All Events");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-green-600 p-2 text-white">
              <HeartHandshake size={24} />
            </div>
            <span className="text-2xl font-extrabold">
              Impact<span className="text-green-600">Pulse</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-green-600">
              Home
            </Link>
            <Link
              href="/events"
              className="text-sm font-semibold text-green-700"
            >
              Explore Events
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-green-600"
            >
              About Us
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-green-600"
            >
              Log In
            </Link>
          </nav>

          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/register">Join Us</Link>
          </Button>
        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="bg-green-700 px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Badge className="border-0 bg-white/15 text-white hover:bg-white/15">
            Discover Opportunities
          </Badge>

          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
            Explore Community Events
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-green-100">
            Find meaningful opportunities, meet people who share your passion,
            and become part of positive change in your community.
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTER */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 sm:p-7">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by event name, description, or location..."
                  className="h-12 w-full rounded-lg border bg-gray-50 pl-12 pr-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <Button
                type="submit"
                className="h-12 bg-green-600 px-8 hover:bg-green-700"
              >
                Search
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <SlidersHorizontal size={17} />
              Filter by category
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleCategoryChange(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    category === item
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-500 hover:text-green-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {(search || category !== "All Events") && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>

                {search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {search}
                    <button
                      type="button"
                      aria-label="Remove search filter"
                      onClick={() => {
                        setSearch("");
                        setSearchInput("");
                        setPage(1);
                      }}
                    >
                      <X size={13} />
                    </button>
                  </Badge>
                )}

                {category !== "All Events" && (
                  <Badge variant="secondary" className="gap-1">
                    {category}
                    <button
                      type="button"
                      aria-label="Remove category filter"
                      onClick={() => handleCategoryChange("All Events")}
                    >
                      <X size={13} />
                    </button>
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* EVENTS */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Available Events</h2>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Finding opportunities..."
                : `${total} event${total === 1 ? "" : "s"} found`}
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/dashboard/create-event">
              <HeartHandshake className="mr-2 h-4 w-4" />
              Create an Event
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Loading events...</span>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <Button onClick={loadEvents} variant="outline" className="mt-5">
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white px-5 py-16 text-center">
            <HeartHandshake className="mx-auto h-14 w-14 text-gray-300" />
            <h3 className="mt-5 text-xl font-bold">No events found</h3>
            <p className="mt-2 text-gray-500">
              Try a different search or category to find opportunities.
            </p>
            <Button
              onClick={clearFilters}
              className="mt-6 bg-green-600 hover:bg-green-700"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const eventId = event.eventId || event._id;
                const participantCount =
                  event.participantCount ?? event.participants?.length ?? 0;
                const remaining = Math.max(
                  0,
                  event.volunteersNeeded - participantCount,
                );

                return (
                  <Card
                    key={eventId}
                    className="group overflow-hidden border-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 to-emerald-50">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <HeartHandshake size={65} className="text-green-300" />
                      )}

                      <Badge
                        className={`absolute left-4 top-4 border-0 ${categoryStyle(
                          event.category,
                        )}`}
                      >
                        {event.category}
                      </Badge>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="line-clamp-2 min-h-14 text-lg font-bold group-hover:text-green-700">
                        {event.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-gray-500">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 shrink-0 text-green-600" />
                          {formatDate(event.eventDate)}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-green-600" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 shrink-0 text-green-600" />
                          {participantCount} / {event.volunteersNeeded}{" "}
                          volunteers joined
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t pt-4">
                        <span className="text-xs font-semibold text-green-700">
                          {remaining > 0
                            ? `${remaining} spots remaining`
                            : "Fully booked"}
                        </span>

                        <Button
                          asChild
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Link href={`/events/${eventId}`}>
                            Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (pageNumber) =>
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - page) <= 1,
                  )
                  .map((pageNumber, index, visiblePages) => (
                    <span key={pageNumber} className="contents">
                      {index > 0 &&
                        pageNumber - visiblePages[index - 1] > 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}

                      <Button
                        variant={page === pageNumber ? "default" : "outline"}
                        className={
                          page === pageNumber
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    </span>
                  ))}

                <Button
                  variant="outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 px-5 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="text-xl font-extrabold text-white">
          Impact<span className="text-green-400">Pulse</span>
        </Link>
        <p className="mt-3">
          Connecting people. Creating impact. Building better communities.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} ImpactPulse. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
