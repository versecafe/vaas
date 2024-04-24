import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VAAS",
  description: "The Vercel Analytics API Scraper",
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
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />{" "}
            {children}
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  );
}
