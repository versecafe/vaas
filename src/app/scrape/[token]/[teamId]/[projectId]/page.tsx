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
  const [data, setData] = useState<{
    json?: { key: string; total: number; devices: number }[];
    csv?: string;
    yaml?: string;
  }>();

  useEffect(() => {
    if (exportOptions) {
      (async () => {
        const data = await callVaas({
          token: params.token,
          teamId: params.teamId,
          projectId: params.projectId,
          env: exportOptions.environment as "production" | "preview" | "all",
          format: exportOptions.format,
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
      {data?.json != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={JSON.stringify(data.json, null, 2)} />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{JSON.stringify(data.json, null, 2)}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.csv != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.csv} />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.csv}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.yaml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.yaml} />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.yaml}</pre>
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
