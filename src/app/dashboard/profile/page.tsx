"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ImagePlus,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  // Null means "use the value from the session". This keeps the form in sync
  // when the session loads or refreshes without copying props into state.
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [imageOverride, setImageOverride] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const name = nameOverride ?? user?.name ?? "";
  const image = imageOverride ?? user?.image ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      const message = "Name must contain at least 2 characters.";
      setError(message);
      toast.add({ title: "Invalid name", description: message, type: "error" });
      return;
    }

    if (image.trim()) {
      try {
        const url = new URL(image.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        const message = "Please provide a valid image URL.";
        setError(message);
        toast.add({ title: "Invalid image URL", description: message, type: "error" });
        return;
      }
    }

    setSaving(true);

    try {
      const result = await fetch("/api/auth/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || null,
        }),
      });

      const data = await result.json().catch(() => null);

      if (!result.ok) {
        throw new Error(
          data?.message || data?.error?.message || "Unable to update profile.",
        );
      }

      await refetch?.();
      setNameOverride(null);
      setImageOverride(null);
      toast.add({
        title: "Profile updated",
        description: "Your name and photo have been saved.",
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile.";
      setError(message);
      toast.add({ title: "Update failed", description: message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <UserRound className="mx-auto mb-4 size-12 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="mt-2 text-muted-foreground">
          You need an account to view your profile.
        </p>
        <Button className="mt-6" render={<Link href="/login" />}>
          Go to login
        </Button>
      </div>
    );
  }

  const initial = (name || user.email || "U").charAt(0).toUpperCase();
  const previewImage = image.trim() || user.image || "";

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <Badge className="mb-3 border-0 bg-primary/10 text-primary hover:bg-primary/10">
          <UserRound className="mr-1.5 size-3.5" />
          Your account
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          My profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update how your name and photo appear across ImpactPulse.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
          <Avatar size="lg" className="size-20">
            {previewImage ? (
              <AvatarImage src={previewImage} alt={name || "Profile"} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-center sm:text-left">
            <p className="truncate text-lg font-bold">{name || "ImpactPulse User"}</p>
            <p className="flex items-center justify-center gap-1.5 truncate text-sm text-muted-foreground sm:justify-start">
              <Mail className="size-3.5" />
              {user.email}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
              <CalendarDays className="size-3.5" />
              Member since{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                    month: "long",
                    year: "numeric",
                  })
                : "recently"}
            </p>
          </div>

          <Badge variant="secondary" className="sm:ml-auto">
            <ShieldCheck className="mr-1.5 size-3.5 text-primary" />
            Verified account
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Edit profile</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your email address cannot be changed here.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setNameOverride(event.target.value)}
                  className="h-11 pl-10"
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  className="h-11 pl-10"
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile image URL</Label>
              <div className="relative">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(event) => setImageOverride(event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="h-11 pl-10"
                  disabled={saving}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to remove your profile photo.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                render={<Link href="/dashboard" />}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
