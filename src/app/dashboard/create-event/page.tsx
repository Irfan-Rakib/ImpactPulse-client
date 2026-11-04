"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ImagePlus,
  Loader2,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventResponse } from "@/types/event";

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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateEventPage() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      return "Please write a description with at least 20 characters.";
    }

    if (form.eventDate < getLocalDate()) {
      return "Please choose today or a future date.";
    }

    const volunteers = Number(form.volunteersNeeded);

    if (!Number.isInteger(volunteers) || volunteers < 1 || volunteers > 10000) {
      return "Volunteers needed must be between 1 and 10000.";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      return "End time must be later than start time.";
    }

    if (form.imageUrl) {
      try {
        const url = new URL(form.imageUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          return "Please provide a valid HTTP or HTTPS image URL.";
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

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<EventResponse>(
        "/api/events",
        {
          method: "POST",
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

      const eventId = data.event?.eventId || data.event?._id;

      if (eventId) {
        router.replace(`/events/${eventId}`);
      } else {
        router.replace("/dashboard/my-events");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create the event.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Badge className="mb-3 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          <PlusCircle className="mr-1 h-3 w-3" />
          Community Initiative
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Create a New Event
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Bring people together around a meaningful cause. Share your idea and
          invite volunteers to make a difference.
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
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-emerald-600" />
            Event Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete the details below to publish your event.
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Event title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Winter Clothes Distribution"
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
                Event description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the purpose of this event, who it will help, and what volunteers will do..."
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

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold">
                Event category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold">
                <MapPin className="mr-1 inline h-4 w-4 text-emerald-600" />
                Event location <span className="text-red-500">*</span>
              </label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Mirpur 10, Dhaka"
                maxLength={250}
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            {/* Date and volunteer count */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="eventDate" className="text-sm font-semibold">
                  <CalendarDays className="mr-1 inline h-4 w-4 text-emerald-600" />
                  Event date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  min={getLocalDate()}
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="volunteersNeeded"
                  className="text-sm font-semibold"
                >
                  <Users className="mr-1 inline h-4 w-4 text-emerald-600" />
                  Volunteer capacity <span className="text-red-500">*</span>
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
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            {/* Time */}
            <div className="grid gap-5 sm:grid-cols-2">
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
                  disabled={loading}
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
                  disabled={loading}
                  className="h-11"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-semibold">
                <ImagePlus className="mr-1 inline h-4 w-4 text-emerald-600" />
                Event image URL
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (Optional)
                </span>
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/event-image.jpg"
                disabled={loading}
                className="h-11"
              />

              {form.imageUrl && (
                <div className="overflow-hidden rounded-xl border">
                  <img
                    src={form.imageUrl}
                    alt="Event preview"
                    className="h-52 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              <CheckCircle2 className="mr-2 inline h-4 w-4" />
              Please review your event details before publishing. Your event
              will become visible to the ImpactPulse community.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={loading}
              >
                <Link href="/dashboard">Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {loading ? "Publishing..." : "Publish Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
