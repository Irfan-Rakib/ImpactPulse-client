"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // Frontend demo only: no message is sent to a server yet.
    setSuccess(
      "Thank you for contacting ImpactPulse! The form is currently a demo and your message has not been sent.",
    );

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero */}
      <section className="px-5 pb-14 pt-20 text-center sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            <MessageCircle className="h-4 w-4" />
            Get in Touch
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            We&apos;d Love to
            <span className="block text-emerald-600">Hear From You.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Have a question, suggestion, or want to work together? Get in touch
            with the ImpactPulse community.
          </p>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-5">
        {/* Left Information */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Information
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              We&apos;re happy to hear from volunteers, event organizers, and
              anyone interested in making a positive difference.
            </p>
          </div>

          <Card className="border-0 bg-emerald-600 text-white shadow-lg">
            <CardContent className="space-y-7 p-7">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <Mail className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-50">
                    Have a question? Send us a message through the contact form.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-50">
                    Connecting volunteers and organizers across local
                    communities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <Clock className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold">Support</h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-50">
                    Share your questions or feedback using the form.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Extra Message */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <HeartHandshake className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Let&apos;s Create an Impact
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-600">
              Every idea matters. Your feedback can help us make community
              volunteering better and more accessible.
            </p>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 sm:p-9">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">
                  Send Us a Message
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Fill out the form below and share your thoughts with us.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>

                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>

                  <Input
                    id="subject"
                    placeholder="What is your message about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    maxLength={150}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>

                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    maxLength={2000}
                    className="resize-none"
                  />

                  <p className="text-right text-xs text-gray-400">
                    {message.length}/2000
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700 sm:w-auto"
                >
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 px-7 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">Ready to Make a Difference?</h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-50">
            Explore upcoming social service events and become part of a
            community that cares.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-7 bg-white text-emerald-700 hover:bg-emerald-50"
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
