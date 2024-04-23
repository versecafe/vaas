import { vaas } from "@/lib/vaas/core";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export async function VAAS({
  token,
  projectId,
  teamId,
}: {
  token: string;
  projectId: string;
  teamId: string;
}): Promise<JSX.Element> {
  const data = await vaas({
    env: "production",
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    to: new Date(),
    // tz: "America%2FNew_York",
    tz: encodeURI(process.env.TZ ?? ""),
    filter: {},
    token,
    teamId,
    projectId,
  });

  return (
    <ScrollArea className="h-64 w-[500px] whitespace-nowrap rounded-md border border-gray-400 backdrop-blur-sm">
      <div className="flex w-max space-x-4 p-4">
        <pre>{JSON.stringify(data.ok, null, 2)}</pre>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
