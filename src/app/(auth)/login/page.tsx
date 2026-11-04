"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Email and Password Login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error?.message || "Invalid email or password.",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const response = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          callbackURL: "/dashboard",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error?.message || "Google login failed.",
        );
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Google authorization URL was not returned.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to login with Google.",
      );
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left Section */}
        <section className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-2">
            <div className="rounded-xl bg-emerald-600 p-3 text-white">
              <HeartHandshake className="h-7 w-7" />
            </div>

            <span className="text-3xl font-bold text-gray-900">
              Impact<span className="text-emerald-600">Pulse</span>
            </span>
          </Link>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-gray-900">
            Welcome
            <br />
            Back to
            <br />
            <span className="text-emerald-600">ImpactPulse.</span>
          </h1>

          <p className="max-w-lg text-lg leading-8 text-gray-600">
            Your contribution matters. Sign in to discover social development
            events, connect with volunteers, and continue making a positive
            impact in your community.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              Help Your Community
            </span>

            <span className="rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700">
              Join Events
            </span>

            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
              Make a Difference
            </span>
          </div>
        </section>

        {/* Login Form */}
        <section className="w-full">
          <div className="mb-6 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="rounded-xl bg-emerald-600 p-2 text-white">
                <HeartHandshake className="h-6 w-6" />
              </div>

              <span className="text-2xl font-bold text-gray-900">
                Impact<span className="text-emerald-600">Pulse</span>
              </span>
            </Link>
          </div>

          <Card className="mx-auto w-full max-w-xl border-0 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">
                Welcome Back!
              </CardTitle>

              <CardDescription>
                Login to your ImpactPulse account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Email Login */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-400">
                  OR CONTINUE WITH GOOGLE
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full py-6"
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.24 5.48-4.7 7.18l7.22 5.6c4.22-3.9 6.65-9.65 6.65-17.25Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.53 2.56 10.78l7.97-6.19Z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.22-5.6c-2 1.34-4.55 2.13-8.68 2.13-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Register Link */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-emerald-600 hover:underline"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-5 text-center">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-emerald-600"
                >
                  ← Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
