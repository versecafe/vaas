import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://vaas-brown.vercel.app",
      lastModified: new Date("2024-04-24"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://vaas-brown.vercel.app/analytics",
      lastModified: new Date("2024-04-24"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://vaas-brown.vercel.app/speed",
      lastModified: new Date("2024-04-24"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
