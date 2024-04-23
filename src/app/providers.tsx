"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

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
          // Remove the token from the URL and replace it with [token] & remove the query params related to the token
          if (event.url.includes("/scrape")) {
            event.url = event.url.replace(
              /(\/scrape\/)[^\/]+(\/[^\/]+\/[^\/]+)/,
              "$1[token]$2",
            );
            const url = new URL(event.url);
            url.searchParams.delete("token");
            return {
              ...event,
              url: url.toString(),
            };
          }
          return event;
        }}
      />
      {children}
    </TooltipProvider>
  );
}
