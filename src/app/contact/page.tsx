"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      const text = "Please fill in all fields.";
      setError(text);
      toast.add({ title: "Missing information", description: text, type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      const text = "Please enter a valid email address.";
      setError(text);
      toast.add({ title: "Invalid email", description: text, type: "error" });
      return;
    }

    // Frontend demo only: no message is sent to a server yet.
    const text =
      "Thank you for contacting ImpactPulse! This form is a demo, so your message has not been sent.";
    setSuccess(text);
    toast.add({ title: "Message ready", description: text, type: "success" });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-br from-emerald-50 via-background to-teal-50 px-5 pb-14 pt-20 text-center dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <Badge className="mb-5 border-0 bg-primary/10 text-primary hover:bg-primary/10">
            <MessageCircle className="mr-1.5 size-3.5" />
            Get in touch
          </Badge>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            We&apos;d love to
            <span className="block text-primary">hear from you.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Have a question, suggestion, or want to work together? Reach out to
            the ImpactPulse community.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-2xl font-bold">Contact information</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              We&apos;re happy to hear from volunteers, event organizers, and
              anyone interested in making a positive difference.
            </p>
          </div>

          <Card className="border-0 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg">
            <CardContent className="space-y-7 p-7">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  text: "Have a question? Send us a message through the contact form.",
                },
                {
                  icon: MapPin,
                  title: "Community",
                  text: "Connecting volunteers and organizers across local communities.",
                },
                {
                  icon: Clock,
                  title: "Support",
                  text: "Share your questions or feedback using the form.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="rounded-xl bg-white/15 p-3">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-emerald-50">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-7">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HeartHandshake className="size-6" />
              </div>
              <h3 className="text-lg font-bold">Let&apos;s create an impact</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Every idea matters. Your feedback can help us make community
                volunteering better and more accessible.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="shadow-xl">
            <CardContent className="p-6 sm:p-9">
              <div className="mb-7">
                <h2 className="text-2xl font-bold">Send us a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and share your thoughts with us.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What is your message about?"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    required
                    maxLength={150}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={6}
                    maxLength={2000}
                    className="resize-none"
                  />
                  <p className="text-right text-xs text-muted-foreground">
                    {message.length}/2000
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send message
                  <Send className="ml-2 size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-600 px-7 py-12 text-center text-white shadow-xl sm:px-12">
          <h2 className="text-3xl font-bold">Ready to make a difference?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-50">
            Explore upcoming social service events and become part of a
            community that cares.
          </p>
          <Button
            size="lg"
            className="mt-7 bg-white text-emerald-700 hover:bg-emerald-50"
            render={<Link href="/events" />}
          >
            Explore events
          </Button>
        </div>
      </section>
    </main>
  );
}
