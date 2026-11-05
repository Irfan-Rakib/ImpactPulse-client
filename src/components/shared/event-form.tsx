"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ImagePlus,
  Loader2,
  MapPin,
  PlusCircle,
  Save,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import { getLocalDateInputValue, toDateInputValue } from "@/lib/date";
import type { EventItem, EventResponse } from "@/types/event";
import { toast } from "@/components/ui/toast";

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  initialEvent?: EventItem;
}

const emptyForm = {
  title: "",
  description: "",
  category: "Cleanup",
  location: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  volunteersNeeded: "20",
  imageUrl: "",
};

export default function EventForm({
  mode,
  eventId,
  initialEvent,
}: EventFormProps) {
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [today, setToday] = useState("");

  // Get today's date after the component mounts.
  useEffect(() => {
    setToday(getLocalDateInputValue(new Date()));
  }, []);

  // Load existing event information in edit mode.
  useEffect(() => {
    if (!initialEvent) return;

    setForm({
      title: initialEvent.title || "",
      description: initialEvent.description || "",
      category: initialEvent.category || "Cleanup",
      location: initialEvent.location || "",
      eventDate: initialEvent.eventDate
        ? toDateInputValue(initialEvent.eventDate)
        : "",
      startTime: initialEvent.startTime || "",
      endTime: initialEvent.endTime || "",
      volunteersNeeded: String(initialEvent.volunteersNeeded || 20),
      imageUrl: initialEvent.imageUrl || "",
    });
  }, [initialEvent]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function validateForm() {
    if (!today) {
      return "Please wait while the date is being prepared.";
    }

    if (form.title.trim().length < 5) {
      return "Event title must contain at least 5 characters.";
    }

    if (form.description.trim().length < 20) {
      return "Description must contain at least 20 characters.";
    }

    if (form.location.trim().length < 3) {
      return "Please provide a valid event location.";
    }

    if (!form.eventDate || form.eventDate < today) {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      toast.add({
        title: "Check the form",
        description: validationError,
        type: "error",
      });

      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint =
        mode === "create" ? "/api/events" : `/api/events/${eventId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const data = await apiRequest<EventResponse>(
        endpoint,
        {
          method,
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

      toast.add({
        title: mode === "create" ? "Event published!" : "Event updated!",
        description:
          mode === "create"
            ? "Your event is now visible on the upcoming events page."
            : data.message || "Your changes have been saved.",
        type: "success",
      });

      router.push(mode === "create" ? "/events" : "/dashboard/my-events");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save this event.";

      setError(message);

      toast.add({
        title: "Could not save event",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/40">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="size-5 text-primary" />
          Event details
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Fields marked with an asterisk are required.
        </p>
      </CardHeader>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold">
              Event title <span className="text-destructive">*</span>
            </label>

            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Community clean-up at the riverside"
              maxLength={120}
              required
              disabled={loading}
              className="h-11"
            />

            <p className="text-right text-xs text-muted-foreground">
              {form.title.length}/120
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold">
              Description <span className="text-destructive">*</span>
            </label>

            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the purpose of the event, who it helps, and what volunteers will do..."
              rows={6}
              maxLength={3000}
              required
              disabled={loading}
              className="resize-y"
            />

            <p className="text-right text-xs text-muted-foreground">
              {form.description.length}/3000
            </p>
          </div>

          {/* Category and Volunteer Capacity */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold">
                Event type <span className="text-destructive">*</span>
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                required
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="volunteersNeeded"
                className="text-sm font-semibold"
              >
                Volunteer capacity <span className="text-destructive">*</span>
              </label>

              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="volunteersNeeded"
                  name="volunteersNeeded"
                  type="number"
                  min="1"
                  max="10000"
                  value={form.volunteersNeeded}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Event Date and Location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="eventDate" className="text-sm font-semibold">
                Event date <span className="text-destructive">*</span>
              </label>

              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                min={today || undefined}
                value={form.eventDate}
                onChange={handleChange}
                required
                disabled={loading || !today}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold">
                Location <span className="text-destructive">*</span>
              </label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Mirpur 10, Dhaka"
                  maxLength={250}
                  required
                  disabled={loading}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Event Time */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-semibold">
                Start time{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-semibold">
                End time{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-semibold">
              Thumbnail image URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>

            <div className="relative">
              <ImagePlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/event-image.jpg"
                disabled={loading}
                className="h-11 pl-10"
              />
            </div>

            {form.imageUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Event preview"
                  className="h-52 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Information */}
          <div className="rounded-xl bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            <CheckCircle2 className="mr-2 inline size-4 text-primary" />
            Your event will be visible to the ImpactPulse community immediately
            after publishing. You can edit or delete it from Manage Events.
          </div>

          {/* Error Message */}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              render={
                <Link
                  href={
                    mode === "create" ? "/dashboard" : "/dashboard/my-events"
                  }
                />
              }
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !today}>
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : mode === "create" ? (
                <PlusCircle className="mr-2 size-4" />
              ) : (
                <Save className="mr-2 size-4" />
              )}

              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Publish event"
                  : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
