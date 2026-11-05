"use client";

import Link from "next/link";
import { ArrowLeft, CalendarPlus, Sparkles } from "lucide-react";

import EventForm from "@/components/shared/event-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button
          variant="ghost"
          className="-ml-3 mb-4"
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to dashboard
        </Button>

        <Badge className="mb-3 border-0 bg-primary/10 text-primary hover:bg-primary/10">
          <Sparkles className="mr-1.5 size-3.5" />
          Community initiative
        </Badge>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Create a new event
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Bring people together around a cause you care about. Your event will
          appear on the Upcoming Events page as soon as you publish it.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground sm:p-5">
        <CalendarPlus className="mr-2 inline size-4 text-primary" />
        Tip: choose a clear title, an accurate location, and a realistic
        volunteer capacity so people know exactly what to expect.
      </div>

      <EventForm mode="create" />
    </div>
  );
}
