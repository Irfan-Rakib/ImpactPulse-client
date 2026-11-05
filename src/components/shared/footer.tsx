import Link from "next/link";
import { ArrowRight, HeartHandshake, Mail, MapPin, Phone } from "lucide-react";
import CurrentYear from "@/components/shared/current-year";
import { SITE } from "@/lib/constants";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Upcoming Events", href: "/events" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const accountLinks = [
  { name: "Create Event", href: "/dashboard/create-event" },
  { name: "Manage Events", href: "/dashboard/my-events" },
  { name: "Joined Events", href: "/dashboard/joined-events" },
  { name: "My Profile", href: "/dashboard/profile" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.9h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.96.24 2.42.4.61.24 1.04.52 1.5.98.46.46.74.89.98 1.5.16.46.35 1.25.4 2.42.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.96-.4 2.42-.24.61-.52 1.04-.98 1.5-.46.46-.89.74-1.5.98-.46.16-1.25.35-2.42.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.96-.24-2.42-.4a4.1 4.1 0 0 1-1.5-.98 4.1 4.1 0 0 1-.98-1.5c-.16-.46-.35-1.25-.4-2.42C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.96.4-2.42.24-.61.52-1.04.98-1.5.46-.46.89-.74 1.5-.98.46-.16 1.25-.35 2.42-.4C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 8.21a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46Zm6.34-8.4a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <HeartHandshake className="size-6" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              Impact<span className="text-emerald-400">Pulse</span>
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            Connecting people, creating opportunities, and building stronger
            communities through meaningful action.
          </p>

          <div className="mt-5 flex items-center gap-2">
            {[
              { label: "X", icon: XIcon, href: "https://x.com" },
              {
                label: "Facebook",
                icon: FacebookIcon,
                href: "https://facebook.com",
              },
              {
                label: "Instagram",
                icon: InstagramIcon,
                href: "https://instagram.com",
              },
              {
                label: "LinkedIn",
                icon: LinkedinIcon,
                href: "https://linkedin.com",
              },
            ].map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-400/50 hover:bg-emerald-500 hover:text-slate-950"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Explore
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-slate-400 transition-colors hover:text-emerald-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            My Account
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-slate-400 transition-colors hover:text-emerald-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Get in Touch
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-emerald-400" />
              {SITE.email}
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-emerald-400" />
              {SITE.phone}
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-emerald-400" />
              {SITE.address}
            </p>
          </div>

          <Link
            href="/events"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Find your next event
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:px-1 lg:px-3">
          <p>
            © <CurrentYear /> {SITE.name}. All rights reserved.
          </p>
          <p>Built for stronger, kinder communities.</p>
        </div>
      </div>
    </footer>
  );
}
