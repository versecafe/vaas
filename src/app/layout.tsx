import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VAAS",
  description: "The Vercel Analytics API Scraper",
  metadataBase: new URL("https://vaas-brown.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://vaas-brown.vercel.app",
    title: "VAAS",
    description: "The Vercel Analytics API Scraper",
    images: [
      {
        url: "https://vaas-brown.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VAAS",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "text-white")}>
        <Providers>
          <div className="min-h-screen w-full bg-black bg-grid-gray/[0.2] bg-grid-gray-600/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <TailwindIndicator />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
