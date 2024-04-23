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
