"use client";

import { useEffect, useState } from "react";
import { AnalyticsOptionsForm, AnalyticsOptionsFormValues } from "./form";
import { callVsas } from "./actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BlockCopyButton } from "@/components/copy-button";
import { useToast } from "@/components/ui/use-toast";
import { VsasFormats } from "@/lib/vaas/speed-insights";

export default function ExportPageClient({
  params,
}: {
  params: {
    token: string;
    team: string;
    project: string;
  };
}): JSX.Element {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] =
    useState<AnalyticsOptionsFormValues | null>(null);
  const [content, setContent] = useState<{
    data: string;
    type: VsasFormats;
  } | null>(null);

  useEffect(() => {
    if (exportOptions) {
      (async () => {
        const data = await callVsas({
          token: params.token,
          team: params.team,
          project: params.project,
          env: exportOptions.environment,
          device: exportOptions.device,
          format: exportOptions.format,
          from: exportOptions.range.from,
          to: exportOptions.range.to,
          country: exportOptions.country,
          route: exportOptions.route,
          tz: exportOptions.timeZone,
        });

        if (data.ok) {
          toast({
            title: `Data exported as ${exportOptions.format.toUpperCase()}`,
            description: `from ${exportOptions.range.from.toLocaleDateString()} to ${exportOptions.range.to.toLocaleDateString()}`,
          });
          setContent(data.value);
        }

        if (!data.ok) {
          toast({
            title: "Error",
            description: data.error,
          });
        }
      })();
    }
  }, [exportOptions, params, toast]);

  return (
    <>
      {content?.data != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton
              code={content.data}
              onClick={() => {
                toast({
                  title: "Copied",
                  description: `${content.data.split("\n").length} lines of ${content.type.toUpperCase()} data copied to clipboard`,
                });
              }}
              // @ts-ignore -- explicity known as safe type inference just can't work on computed values
              event={"copy_data_" + content.type}
            />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{content.data}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : (
        <div className="max-w-96">
          <AnalyticsOptionsForm onFormSubmit={setExportOptions} />
        </div>
      )}
    </>
  );
}
