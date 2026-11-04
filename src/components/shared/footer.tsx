import Link from "next/link";
import { HeartHandshake, ArrowRight } from "lucide-react";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 px-5 py-12 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <HeartHandshake className="h-8 w-8 text-green-400" />

            <span className="text-2xl font-extrabold">
              Impact<span className="text-green-400">Pulse</span>
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
            Connecting people, creating opportunities, and building better
            communities through meaningful action.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-white">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-green-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Get Involved */}
        <div>
          <h3 className="font-bold text-white">Get Involved</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link
              href="/register"
              className="transition-colors hover:text-green-400"
            >
              Become a Volunteer
            </Link>

            <Link
              href="/login"
              className="transition-colors hover:text-green-400"
            >
              Log In
            </Link>

            <Link
              href="/dashboard/create-event"
              className="transition-colors hover:text-green-400"
            >
              Create an Event
            </Link>
          </div>
        </div>

        {/* Mission */}
        <div>
          <h3 className="font-bold text-white">Our Mission</h3>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            We believe meaningful change begins when ordinary people come
            together for an extraordinary purpose.
          </p>

          <Link
            href="/events"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
          >
            Explore Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ImpactPulse. All rights reserved. Made for
        a better community.
      </div>
    </footer>
  );
}
