"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Save,
  Loader2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Community Service",
  "Education",
  "Environment",
  "Health",
  "Food Distribution",
  "Other",
];

function getLocalDate() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function toDateInputValue(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  // Use local calendar date instead of UTC date.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Community Service",
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    volunteersNeeded: "20",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function loadEvent() {
      try {
        setError("");

        const data = await apiRequest<EventResponse>(`/api/events/${id}`);
        const event: EventItem = data.event;

        if (!event) {
          throw new Error("Event information was not found.");
        }

        if (!cancelled) {
          setForm({
            title: event.title || "",
            description: event.description || "",
            category: event.category || "Community Service",
            location: event.location || "",
            eventDate: event.eventDate ? toDateInputValue(event.eventDate) : "",
            startTime: event.startTime || "",
            endTime: event.endTime || "",
            volunteersNeeded: String(event.volunteersNeeded || 20),
            imageUrl: event.imageUrl || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load this event.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  function validateForm() {
    if (form.title.trim().length < 5) {
      return "Event title must contain at least 5 characters.";
    }

    if (form.description.trim().length < 20) {
      return "Description must contain at least 20 characters.";
    }

    if (!form.eventDate || form.eventDate < getLocalDate()) {
      return "Event date must be today or a future date.";
    }

    const volunteers = Number(form.volunteersNeeded);

    if (!Number.isInteger(volunteers) || volunteers < 1 || volunteers > 10000) {
      return "Volunteer capacity must be between 1 and 10000.";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      return "End time must be later than start time.";
    }

    if (form.imageUrl) {
      try {
        const url = new URL(form.imageUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          return "Image URL must use HTTP or HTTPS.";
        }
      } catch {
        return "Please provide a valid image URL.";
      }
    }

    return "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = await apiRequest<EventResponse>(
        `/api/events/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            location: form.location.trim(),
            volunteersNeeded: Number(form.volunteersNeeded),
          }),
        },
        true,
      );

      const updatedId = data.event?.eventId || data.event?._id || id;

      router.replace(`/events/${updatedId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this event.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm text-muted-foreground">
          Loading event information...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-4">
          <Link href="/dashboard/my-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Events
          </Link>
        </Button>

        <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-100">
          Event Management
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Edit Your Event
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Update your event information and keep your volunteers informed.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 px-6 py-5">
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-emerald-600" />
            Update Event Information
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Event title *
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={120}
                required
                disabled={saving}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold">
                Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                maxLength={3000}
                required
                disabled={saving}
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={saving}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold">
                <MapPin className="mr-1 inline h-4 w-4 text-emerald-600" />
                Location *
              </label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength={250}
                required
                disabled={saving}
                className="h-11"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="eventDate" className="text-sm font-semibold">
                  <CalendarDays className="mr-1 inline h-4 w-4 text-emerald-600" />
                  Event date *
                </label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  min={getLocalDate()}
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="volunteersNeeded"
                  className="text-sm font-semibold"
                >
                  <Users className="mr-1 inline h-4 w-4 text-emerald-600" />
                  Volunteer capacity *
                </label>
                <Input
                  id="volunteersNeeded"
                  name="volunteersNeeded"
                  type="number"
                  min="1"
                  max="10000"
                  value={form.volunteersNeeded}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startTime" className="text-sm font-semibold">
                  <Clock className="mr-1 inline h-4 w-4 text-emerald-600" />
                  Start time
                </label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  disabled={saving}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-semibold">
                  <Clock className="mr-1 inline h-4 w-4 text-emerald-600" />
                  End time
                </label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  disabled={saving}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-semibold">
                Event image URL
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                disabled={saving}
                placeholder="https://example.com/event-image.jpg"
                className="h-11"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button variant="outline" type="button" asChild disabled={saving}>
                <Link href="/dashboard/my-events">Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
