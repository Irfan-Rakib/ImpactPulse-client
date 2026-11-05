"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Globe,
  HandHeart,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: <HeartHandshake className="size-7" />,
    title: "Kindness",
    description:
      "We believe every small act of kindness can create a meaningful difference.",
  },
  {
    icon: <Users className="size-7" />,
    title: "Community",
    description:
      "We bring volunteers together to build stronger and more supportive communities.",
  },
  {
    icon: <ShieldCheck className="size-7" />,
    title: "Transparency",
    description:
      "We encourage responsible event management and meaningful participation.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover events",
    description:
      "Explore social development events and volunteer opportunities in your area.",
  },
  {
    number: "02",
    title: "Join together",
    description:
      "Connect with organizers and other volunteers who share your passion.",
  },
  {
    number: "03",
    title: "Make an impact",
    description:
      "Take action, support people in need, and help create positive change.",
  },
];

const highlights = [
  { icon: Globe, label: "Community first" },
  { icon: HandHeart, label: "Volunteer powered" },
  { icon: Sparkles, label: "Built for impact" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20">
        <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />

        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center sm:px-6 sm:py-24">
          <Badge className="mb-5 border-0 bg-primary/10 text-primary hover:bg-primary/10">
            <Sparkles className="mr-1.5 size-3.5" />
            About ImpactPulse
          </Badge>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Together we can
            <span className="block text-primary">make a difference.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            ImpactPulse is a community-driven platform that connects people with
            social development events and volunteer opportunities. We make it
            easier to turn kindness into action.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" render={<Link href="/events" />}>
              Discover events
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/register" />}>
              Become a volunteer
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur"
                >
                  <Icon className="size-4 text-primary" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <Card className="border-0 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-xl">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/15">
              <Target className="size-7" />
            </div>
            <h2 className="text-2xl font-bold">Our mission</h2>
            <p className="mt-4 leading-8 text-emerald-50">
              To connect passionate people with meaningful social service
              opportunities and make community participation simple, accessible,
              and impactful.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 sm:p-10">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Eye className="size-7" />
            </div>
            <h2 className="text-2xl font-bold">Our vision</h2>
            <p className="mt-4 leading-8 text-muted-foreground">
              Communities where people support one another, volunteers work
              together, and everyone has the opportunity to contribute to
              positive social change.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-border bg-muted/30 px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              What we believe
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our core values
            </h2>
            <p className="mt-3 text-muted-foreground">
              The principles that guide our community and every action we take.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card
                key={value.title}
                className="transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-8">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Get involved
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              How ImpactPulse works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition hover:border-primary/30"
              >
                <span className="text-4xl font-extrabold text-primary/25">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 px-7 py-14 text-center text-white shadow-xl sm:px-12">
          <HeartHandshake className="mx-auto size-12 opacity-80" />
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Be part of something meaningful
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-50">
            Your time, effort, and kindness can help make someone&apos;s life
            better. Start your journey with ImpactPulse today.
          </p>
          <Button
            size="lg"
            className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50"
            render={<Link href="/register" />}
          >
            Join ImpactPulse
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
