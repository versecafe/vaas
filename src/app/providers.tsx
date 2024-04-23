import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({
  children,
}: {
  children: Readonly<ReactNode>;
}): JSX.Element {
  return <TooltipProvider>{children}</TooltipProvider>;
}
