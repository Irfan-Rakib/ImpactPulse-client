"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus,
  LayoutDashboard,
  Settings,
  Ticket,
} from "lucide-react";

const tabs = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Create Event", href: "/dashboard/create-event", icon: CalendarPlus },
  { title: "Manage Events", href: "/dashboard/my-events", icon: Settings },
  { title: "Joined Events", href: "/dashboard/joined-events", icon: Ticket },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b border-border bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive(tab.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {tab.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {children}
      </div>
    </div>
  );
}
