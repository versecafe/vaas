"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "@radix-ui/react-icons";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event, trackEvent } from "@/lib/events";

export function BlockCopyButton({
  code,
  event,
  ...props
}: {
  event: Event["name"];
  code: string;
} & ButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5"
          onClick={() => {
            navigator.clipboard.writeText(code);
            trackEvent({
              name: event,
            });
            setHasCopied(true);
          }}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy code</TooltipContent>
    </Tooltip>
  );
}
