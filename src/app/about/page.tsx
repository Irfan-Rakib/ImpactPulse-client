"use client";

import Link from "next/link";
import {
  HeartHandshake,
  Target,
  Eye,
  Users,
  HandHeart,
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: <HeartHandshake className="h-7 w-7" />,
    title: "Kindness",
    description:
      "We believe every small act of kindness can create a meaningful difference.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Community",
    description:
      "We bring volunteers together to build stronger and more supportive communities.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Transparency",
    description:
      "We encourage responsible event management and meaningful participation.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover Events",
    description:
      "Explore social development events and volunteer opportunities in your area.",
  },
  {
    number: "02",
    title: "Join Together",
    description:
      "Connect with organizers and other volunteers who share your passion.",
  },
  {
    number: "03",
    title: "Make an Impact",
    description:
      "Take action, support people in need, and help create positive change.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero */}
      <section className="px-5 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            About ImpactPulse
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Together We Can
            <span className="block text-emerald-600">Make a Difference.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            ImpactPulse is a community-driven platform that connects people with
            social development events and volunteer opportunities. We make it
            easier to turn kindness into action.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/events">
                Discover Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/register">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 md:grid-cols-2">
        <Card className="border-0 bg-emerald-600 text-white shadow-lg">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Target className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="mt-4 leading-8 text-emerald-50">
              Our mission is to connect passionate people with meaningful social
              service opportunities and make community participation simple,
              accessible, and impactful.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-100 bg-white shadow-lg">
          <CardContent className="p-8 sm:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Eye className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            <p className="mt-4 leading-8 text-gray-600">
              We envision communities where people support one another,
              volunteers work together, and everyone has the opportunity to
              contribute to positive social change.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Core Values */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-emerald-600">WHAT WE BELIEVE</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              The principles that guide our community and every action we take.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card
                key={value.title}
                className="border border-gray-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-7 text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-emerald-600">GET INVOLVED</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              How ImpactPulse Works
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm"
              >
                <span className="text-4xl font-extrabold text-emerald-200">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 px-7 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Be Part of Something Meaningful
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-50">
            Your time, effort, and kindness can help make someone's life better.
            Start your journey with ImpactPulse today.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50"
          >
            <Link href="/register">
              Join ImpactPulse <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
