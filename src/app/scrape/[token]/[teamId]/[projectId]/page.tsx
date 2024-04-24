"use client";

import { useEffect, useState } from "react";
import { AnalyticsOptionsForm, AnalyticsOptionsFormValues } from "./form";
import { callVaas } from "./actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BlockCopyButton } from "@/components/copy-button";
import { useToast } from "@/components/ui/use-toast";

export default function ExportPage({
  params,
}: {
  params: {
    token: string;
    teamId: string;
    projectId: string;
  };
}): JSX.Element {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] =
    useState<AnalyticsOptionsFormValues | null>(null);
  const [data, setData] = useState<{
    json?: { key: string; total: number; devices: number }[];
    csv?: string;
    yaml?: string;
    xml?: string;
    toml?: string;
  } | null>(null);

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
          toast({
            title: `Data exported as ${exportOptions.format.toUpperCase()}`,
            description: `from ${exportOptions.range.from.toLocaleDateString()} to ${exportOptions.range.to.toLocaleDateString()}`,
          });
          setData(data.value);
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
      {data?.json != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton
              code={JSON.stringify(data.json, null, 2)}
              event="copy_data_json"
            />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{JSON.stringify(data.json, null, 2)}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.csv != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.csv} event="copy_data_csv" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.csv}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.yaml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data?.yaml} event="copy_data_yaml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data?.yaml}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.xml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.xml} event="copy_data_xml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.xml}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.toml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.toml} event="copy_data_toml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.toml}</pre>
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
