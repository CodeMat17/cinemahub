import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CinemaHub - Discover Your Next Favorite Movie",
  description:
    "Explore thousands of movies, discover new favorites, and stay updated with the latest releases. Your ultimate movie discovery platform powered by TMDB.",
  keywords: ["movies", "cinema", "discovery", "TMDB", "entertainment"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "CinemaHub - Discover Your Next Favorite Movie",
    description:
      "Explore thousands of movies, discover new favorites, and stay updated with the latest releases.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CinemaHub - Discover Your Next Favorite Movie",
    description:
      "Explore thousands of movies, discover new favorites, and stay updated with the latest releases.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster richColors position='top-right' />
        </Providers>
      </body>
    </html>
  );
}
