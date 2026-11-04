"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dashboard has its own sidebar layout.
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
