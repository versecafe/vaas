import va from "@vercel/analytics";
import { z } from "zod";

const eventSchema = z.object({
  name: z.enum([
    "set_token",
    "get_analytics",
    "copy_data_json",
    "copy_data_csv",
    "copy_data_yaml",
    "copy_data_toml",
    "copy_data_xml",
  ]),
  properties: z
    .record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export type Event = z.infer<typeof eventSchema>;

export function trackEvent(input: Event): void {
  const event = eventSchema.parse(input);
  if (event) {
    va.track(event.name, event.properties);
  }
}

/** Remove sensitive data from URLs used in analytics & speed insights */
export function cleanSensitiveData(url: string): string {
  // Remove all semi sensitive data from the URL
  if (url.includes("/analytics/") || url.includes("/speed/")) {
    const basePath = url.includes("/analytics") ? "analytics" : "speed";
    url = url.replace(
      new RegExp(`${basePath}\/[^\/]+\/[^\/]+\/[^\/]+`),
      `${basePath}/[token]/[teamId]/[projectId]`,
    );
    // remove any query params related to the token
    const tokenClean = new URL(url);
    tokenClean.searchParams.delete("token");
    return tokenClean.toString();
  }
  return url;
}
