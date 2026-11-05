import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import SiteShell from "@/components/shared/site-shell";
import { ThemeProvider, themeInitScript } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ImpactPulse | Turn kindness into action",
    template: "%s | ImpactPulse",
  },
  description:
    "ImpactPulse connects volunteers with meaningful community events. Discover, create, and join initiatives that make a real difference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
