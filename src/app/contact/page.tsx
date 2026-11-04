"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    // Frontend-only demonstration. No email is sent yet.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSuccess(
      "Your message has been validated. Message delivery will be available after the contact API is connected.",
    );

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="font-semibold text-primary">GET IN TOUCH</p>
          <h1 className="mt-3 text-4xl font-bold">Contact ImpactPulse</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Have a question, suggestion, or partnership idea? We would love to
            hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="space-y-5 md:col-span-2">
            <Card>
              <CardContent className="flex gap-4 p-6">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Email</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the contact form to send your message.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4 p-6">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Community</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supporting local communities and volunteers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex gap-4 p-6">
                <MessageCircle className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-semibold">Feedback</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share your ideas to help improve ImpactPulse.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Your name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows={6}
                    required
                  />
                </div>

                {success && (
                  <p className="rounded-md bg-green-100 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
                    {success}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Processing..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
