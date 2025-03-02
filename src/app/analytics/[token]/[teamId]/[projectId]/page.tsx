import ExportPageClient from "./page.client";

export default async function ExportPage({
  params,
}: {
  params: Promise<{
    token: string;
    teamId: string;
    projectId: string;
  }>;
}): Promise<React.JSX.Element> {
  return <ExportPageClient params={await params} />;
}
