"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

function SiteShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <>
      <Navbar />

      <main className="flex-1">{children}</main>

      {!isAuthPage && <Footer />}
    </>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex-1 min-h-screen" />}>
      <SiteShellContent>{children}</SiteShellContent>
    </Suspense>
  );
}
