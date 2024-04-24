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
    ok?: {
      json?: { key: string; total: number; devices: number }[];
      csv?: string;
      yaml?: string;
      xml?: string;
      toml?: string;
    };
    error?: string;
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
          toast({
            title: `Data exported as ${exportOptions.format.toUpperCase()}`,
            description: `from ${exportOptions.range.from.toLocaleDateString()} to ${exportOptions.range.to.toLocaleDateString()}`,
          });
        }

        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
          });
        }

        setData(data);
      })();
    }
  }, [exportOptions, params, toast]);

  return (
    <>
      {data?.ok?.json != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton
              code={JSON.stringify(data.ok.json, null, 2)}
              event="copy_data_json"
            />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{JSON.stringify(data.ok.json, null, 2)}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.ok?.csv != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.ok.csv} event="copy_data_csv" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.ok.csv}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.ok?.yaml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data?.ok.yaml} event="copy_data_yaml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data?.ok.yaml}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.ok?.xml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.ok.xml} event="copy_data_xml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.ok.xml}</pre>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      ) : data?.ok?.toml != undefined ? (
        <ScrollArea className="h-[600px] w-[400px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
          <div className="p-2 absolute right-0">
            <BlockCopyButton code={data.ok.toml} event="copy_data_toml" />
          </div>
          <div className="flex text-gray-200 w-max space-x-4 p-4">
            <pre>{data.ok.toml}</pre>
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
