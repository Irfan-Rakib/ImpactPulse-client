"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";

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
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiRequest<EventResponse>(
        "/api/events",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            volunteersNeeded: Number(form.volunteersNeeded),
          }),
        },
        true,
      );

      setSuccess(data.message || "Your event has been created!");

      const eventId = data.event?.eventId || data.event?._id;

      if (eventId) {
        router.push(`/events/${eventId}`);
      } else {
        router.push("/dashboard/my-events");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create the event.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" asChild className="mb-5">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-7">
          <Badge className="mb-3">ImpactPulse Community</Badge>
          <h1 className="text-3xl font-bold sm:text-4xl">Create an Event</h1>
          <p className="mt-2 text-muted-foreground">
            Organize a community activity and invite people to make a
            difference.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Event Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Event title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Winter Clothes Distribution"
                  maxLength={120}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain the purpose of this event and how volunteers can help..."
                  rows={6}
                  maxLength={3000}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                <label htmlFor="location" className="text-sm font-medium">
                  Event location *
                </label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Mirpur 10, Dhaka"
                  maxLength={250}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="eventDate" className="text-sm font-medium">
                    Event date *
                  </label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.eventDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="volunteersNeeded"
                    className="text-sm font-medium"
                  >
                    Volunteers needed *
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
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium">
                    Start time
                  </label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium">
                    End time
                  </label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Event image URL (optional)
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/event-image.jpg"
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
                  {success}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {loading ? "Creating Event..." : "Publish Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
