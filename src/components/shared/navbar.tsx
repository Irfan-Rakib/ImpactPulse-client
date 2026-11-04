"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  HeartHandshake,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Events", href: "/events" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const user = session?.user;
  const userName = user?.name || "ImpactPulse User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");

    try {
      await signOut();
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <HeartHandshake className="h-6 w-6" />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Impact<span className="text-emerald-600">Pulse</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-emerald-700"
                  : "text-slate-600 hover:text-emerald-700"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Desktop authentication area */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((previous) => !previous)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-50"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {userInitial}
                </span>

                <span className="max-w-32 truncate text-sm font-semibold text-slate-700">
                  {userName}
                </span>

                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b px-3 py-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {userEmail}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/my-events"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <UserRound className="h-4 w-4" />
                      My Events
                    </Link>

                    {logoutError && (
                      <p className="px-3 py-2 text-xs text-red-600">
                        {logoutError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Join Us</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.title}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                    {userInitial}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/my-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                >
                  My Events
                </Link>

                {logoutError && (
                  <p className="px-4 py-2 text-xs text-red-600">
                    {logoutError}
                  </p>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  className="mt-2 w-full"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>

                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Us
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
