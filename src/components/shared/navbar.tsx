"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarPlus,
  ChevronDown,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/lib/api";
import { useSession, signOut } from "@/lib/auth-client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { toast } from "@/components/ui/toast";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Upcoming Events", href: "/events" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const accountLinks = [
  { title: "Create Event", href: "/dashboard/create-event", icon: CalendarPlus },
  { title: "Manage Events", href: "/dashboard/my-events", icon: Settings },
  { title: "Joined Events", href: "/dashboard/joined-events", icon: Ticket },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Profile", href: "/dashboard/profile", icon: UserRound },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;
  const userName = user?.name || "ImpactPulse User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      clearAuthToken();
      toast.add({
        title: "Logged out",
        description: "You have been signed out safely.",
        type: "success",
      });
      router.replace("/");
      router.refresh();
    } catch {
      toast.add({
        title: "Logout failed",
        description: "Please try again.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <HeartHandshake className="size-6" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Impact<span className="text-primary">Pulse</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((previous) => !previous)}
                className="group/profile flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 transition hover:border-primary/40 hover:bg-accent"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                <span className="relative">
                  <Avatar size="default">
                    {userImage ? (
                      <AvatarImage src={userImage} alt={userName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-40 -translate-x-1/2 truncate rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover/profile:opacity-100">
                    {userName}
                  </span>
                </span>

                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl">
                    <div className="flex items-center gap-3 border-b border-border px-3 pb-3 pt-2">
                      <Avatar size="lg">
                        {userImage ? (
                          <AvatarImage src={userImage} alt={userName} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 font-bold text-primary">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{userName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      {accountLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
                          >
                            <Icon className="size-4 text-muted-foreground" />
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-lg border-t border-border px-3 py-2.5 text-left text-sm text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <LogOut className="size-4" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button render={<Link href="/login" />}>Login</Button>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="rounded-lg p-2 text-foreground hover:bg-muted"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.title}
              </Link>
            ))}

            <div className="my-2 border-t border-border" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3">
                  <Avatar size="lg">
                    {userImage ? (
                      <AvatarImage src={userImage} alt={userName} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{userName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </div>

                {accountLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {item.title}
                    </Link>
                  );
                })}

                <Button
                  type="button"
                  variant="destructive"
                  className="mt-2 w-full"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="mr-2 size-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <Button
                className="mt-2 w-full"
                render={<Link href="/login" />}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
