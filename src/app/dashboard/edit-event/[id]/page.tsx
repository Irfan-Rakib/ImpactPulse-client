"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventResponse } from "@/types/event";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Community Service",
  "Education",
  "Environment",
  "Health",
  "Food Distribution",
  "Other",
];

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
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
    async function loadEvent() {
      try {
        const data = await apiRequest<EventResponse>(`/api/events/${id}`);
        const event: EventItem = data.event;

        setForm({
          title: event.title || "",
          description: event.description || "",
          category: event.category || "Community Service",
          location: event.location || "",
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().split("T")[0]
            : "",
          startTime: event.startTime || "",
          endTime: event.endTime || "",
          volunteersNeeded: String(event.volunteersNeeded || 20),
          imageUrl: event.imageUrl || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load this event.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

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
    setSaving(true);
    setError("");

    try {
      await apiRequest<EventResponse>(
        `/api/events/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...form,
            volunteersNeeded: Number(form.volunteersNeeded),
          }),
        },
        true,
      );

      router.push(`/events/${id}`);
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
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading event...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" asChild className="mb-5">
          <Link href="/dashboard/my-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Events
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <p className="mb-5 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

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
                  Location *
                </label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
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
                  Image URL
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
