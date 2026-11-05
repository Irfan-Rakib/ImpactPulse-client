"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  HeartHandshake,
  Image as ImageIcon,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

function getRedirectPath() {
  if (typeof window === "undefined") return "/dashboard";
  const target = new URLSearchParams(window.location.search).get("redirect");
  return target && target.startsWith("/") ? target : "/dashboard";
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      const message = "Please enter your full name.";
      setError(message);
      toast.add({ title: "Name required", description: message, type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      const message = "Please enter a valid email address.";
      setError(message);
      toast.add({ title: "Invalid email", description: message, type: "error" });
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase) {
      const message =
        "Password must be at least 6 characters and include an uppercase and a lowercase letter.";
      setError(message);
      toast.add({ title: "Weak password", description: message, type: "error" });
      return;
    }

    if (!passwordsMatch) {
      const message = "Passwords do not match.";
      setError(message);
      toast.add({ title: "Passwords do not match", description: message, type: "error" });
      return;
    }

    if (image.trim()) {
      try {
        const imageUrl = new URL(image.trim());
        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        const message = "Please provide a valid profile image URL.";
        setError(message);
        toast.add({ title: "Invalid image URL", description: message, type: "error" });
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          image: image.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error?.message || "Registration failed.",
        );
      }

      toast.add({
        title: "Account created!",
        description: "Welcome to ImpactPulse. Your journey starts now.",
        type: "success",
      });

      router.push(getRedirectPath());
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.add({ title: "Registration failed", description: message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          callbackURL: getRedirectPath(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error?.message || "Google sign-up failed.",
        );
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Google sign-up URL was not returned.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-up failed.";
      setError(message);
      toast.add({ title: "Google sign-up failed", description: message, type: "error" });
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-background to-teal-50 px-4 py-12 dark:from-emerald-950/30 dark:via-background dark:to-teal-950/20 sm:py-16">
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <section className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-2.5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <HeartHandshake className="size-7" />
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              Impact<span className="text-primary">Pulse</span>
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Join us.
            <span className="mt-2 block text-primary">Create a better tomorrow.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            Become part of a community that believes in kindness, teamwork, and
            positive social change. Create events, volunteer, and make a real
            difference.
          </p>

          <div className="mt-8 grid max-w-md gap-3 text-sm">
            {[
              { icon: Sparkles, text: "Organize events for causes you care about" },
              { icon: Users, text: "Meet volunteers and grow your community" },
              { icon: ShieldCheck, text: "Secure account with email or Google" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 px-4 py-3 backdrop-blur"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full">
          <div className="mb-6 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HeartHandshake className="size-6" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight">
                Impact<span className="text-primary">Pulse</span>
              </span>
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-emerald-950/5 sm:p-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Create account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Register and start making a positive impact.
              </p>
            </div>

            <form onSubmit={handleRegister} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your full name"
                    className="h-11 pl-10"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 pl-10"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">
                  Profile image URL{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <div className="relative">
                  <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="h-11 pl-10"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                  />
                </div>
                {image.trim() && (
                  <div className="flex items-center gap-3 pt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Profile preview"
                      className="size-12 rounded-full border border-border object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      onLoad={(event) => {
                        event.currentTarget.style.display = "block";
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Profile preview
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    className="h-11 pl-10 pr-11"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-3">
                  {[
                    { ok: hasMinLength, label: "6+ characters" },
                    { ok: hasUppercase, label: "Uppercase" },
                    { ok: hasLowercase, label: "Lowercase" },
                  ].map((rule) => (
                    <span
                      key={rule.label}
                      className={`flex items-center gap-1.5 ${
                        rule.ok ? "text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    >
                      <Check className={`size-3.5 ${rule.ok ? "opacity-100" : "opacity-30"}`} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className="h-11 pl-10 pr-11"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive">Passwords do not match.</p>
                )}
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                or continue with
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <svg className="mr-2 size-5" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.24 5.48-4.7 7.18l7.22 5.6c4.22-3.9 6.65-9.65 6.65-17.25Z" />
                  <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.53 2.56 10.78l7.97-6.19Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.22-5.6c-2 1.34-4.55 2.13-8.68 2.13-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
                </svg>
              )}
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
