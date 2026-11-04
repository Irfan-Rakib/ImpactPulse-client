import Link from "next/link";
import {
  HeartHandshake,
  Users,
  Target,
  HandHeart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: HeartHandshake,
    title: "Compassion",
    description:
      "We believe small acts of kindness can create meaningful change in people's lives.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We bring volunteers, organizers, and local communities together around shared goals.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "We encourage clear event information and responsible community participation.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-primary px-4 py-20 text-primary-foreground">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-semibold tracking-wider">ABOUT IMPACTPULSE</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
            Small Actions. <br className="hidden sm:block" />
            Lasting Impact.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            ImpactPulse is a community-driven platform that connects people with
            social service opportunities and helps turn good intentions into
            real action.
          </p>
          <Button asChild variant="secondary" className="mt-8">
            <Link href="/events">
              Explore Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-semibold text-primary">OUR PURPOSE</p>
          <h2 className="mt-3 text-3xl font-bold">
            Making community service easier to organize and join.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Finding opportunities to help should not be difficult. ImpactPulse
            gives community organizers a place to publish social service events
            and gives volunteers a simple way to discover activities where their
            time and effort can make a difference.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            From distributing warm clothes to supporting education and
            protecting the environment, every community activity can be a step
            toward a better future.
          </p>
        </div>

        <div className="rounded-2xl bg-primary/5 p-8">
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl bg-background p-6 shadow-sm">
              <Target className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-bold">Our Mission</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Connect people with meaningful opportunities to serve.
              </p>
            </div>
            <div className="rounded-xl bg-background p-6 shadow-sm">
              <HandHeart className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-bold">Our Vision</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Build stronger communities through collective action.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-semibold text-primary">WHAT GUIDES US</p>
            <h2 className="mt-3 text-3xl font-bold">Our Core Values</h2>
            <p className="mt-3 text-muted-foreground">
              The principles behind every connection and community activity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <Card key={value.title}>
                  <CardContent className="p-7">
                    <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{value.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to make a difference?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Discover a local event, join a cause, or organize an activity for your
          community.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/events">Find an Event</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/create-event">Create an Event</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
