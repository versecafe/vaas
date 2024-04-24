"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { cleanSensitiveData } from "@/lib/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function Providers({
  children,
}: {
  children: Readonly<ReactNode>;
}): JSX.Element {
  return (
    <TooltipProvider>
      <Analytics
        beforeSend={(event) => {
          // If the user has disabled analytics, don't send any events
          if (localStorage.getItem("va-disable")) {
            return null;
          }
          // Clean sensitive data from the event URL
          return { ...event, url: cleanSensitiveData(event.url) };
        }}
      />
      <SpeedInsights
        beforeSend={(event) => {
          // If the user has disabled analytics, don't send any events
          if (localStorage.getItem("va-disable")) {
            return null;
          }
          // Clean sensitive data from the event URL
          return { ...event, url: cleanSensitiveData(event.url) };
        }}
      />
      {children}
    </TooltipProvider>
  );
}
