import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EVENT_TYPE_STYLES } from "@/lib/constants";
import { formatEventDate, isPastDate } from "@/lib/date";
import type { EventItem } from "@/types/event";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventItem;
  actions?: React.ReactNode;
  className?: string;
  showStatus?: boolean;
}

export default function EventCard({
  event,
  actions,
  className,
  showStatus = false,
}: EventCardProps) {
  const id = event.eventId || event._id;
  const typeStyle =
    EVENT_TYPE_STYLES[event.category] ?? EVENT_TYPE_STYLES.Other;
  const past = isPastDate(event.eventDate);
  const participantCount = event.participantCount ?? event.participants?.length ?? 0;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:ring-primary/30 hover:shadow-xl",
        className,
      )}
    >
      <Link
        href={`/events/${id}`}
        className="relative block h-52 shrink-0 overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-sky-950/40"
        aria-label={`View ${event.title}`}
      >
        {event.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <HeartHandshake className="size-16 text-emerald-400/80 transition duration-500 group-hover:scale-110" />
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        <Badge className={cn("absolute left-3 top-3 border-0", typeStyle)}>
          {event.category}
        </Badge>

        {showStatus && (
          <Badge
            className={cn(
              "absolute right-3 top-3 border-0",
              past
                ? "bg-slate-900/80 text-white dark:bg-slate-700"
                : "bg-emerald-600 text-white",
            )}
          >
            {past ? "Completed" : "Upcoming"}
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">
            <Link href={`/events/${id}`}>{event.title}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {event.description}
          </p>
        </div>

        <div className="mt-auto space-y-2 border-t border-border/70 pt-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <span>{formatEventDate(event.eventDate)}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" />
            <span className="truncate">{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-primary" />
            <span>
              {participantCount}/{event.volunteersNeeded} volunteers
            </span>
          </p>
        </div>

        <div className="pt-1">
          {actions ?? (
            <Button
              variant="outline"
              className="w-full"
              render={<Link href={`/events/${id}`} />}
            >
              View Event
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
