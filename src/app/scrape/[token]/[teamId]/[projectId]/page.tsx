"use client";

import { useEffect, useState } from "react";
import { AnalyticsOptionsForm, AnalyticsOptionsFormValues } from "./form";
import { callVaas } from "./actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BlockCopyButton } from "@/components/copy-button";

export default function ExportPage({
  params,
}: {
  params: {
    token: string;
    teamId: string;
    projectId: string;
  };
}): JSX.Element {
  const [exportOptions, setExportOptions] =
    useState<AnalyticsOptionsFormValues | null>(null);
  const [data, setData] = useState<
    { key: string; views: number; visitors: number }[]
  >([]);

  useEffect(() => {
    if (exportOptions) {
      (async () => {
        const data = await callVaas({
          token: params.token,
          teamId: params.teamId,
          projectId: params.projectId,
          env: exportOptions.environment as "production" | "preview" | "all",
          from: exportOptions.range.from,
          to: exportOptions.range.to,
          tz: exportOptions.timeZone,
          filter: exportOptions.filters,
        });

        if (data.ok) {
          setData(data.ok);
        }
      })();
    }
  }, [exportOptions, params]);

  return (
    <>
      {data[0] != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={JSON.stringify(data, null, 2)} />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{JSON.stringify(data, null, 2)}</pre>
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
