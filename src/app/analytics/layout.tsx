import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VAAS - Analytics",
  description: "Pull your Vercel Analytics data with VAAS",
  metadataBase: new URL("https://vaas-brown.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://vaas-brown.vercel.app/analytics",
    title: "VAAS",
    description: "Pull your Vercel Analytics data with VAAS",
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

// Used to add metadata since page is fully client side
export default function AnalyticsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return <>{children}</>;
}
