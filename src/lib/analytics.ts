/** Remove sensitive data from URLs used in analytics & speed insights */
export function cleanSensitiveData(url: string): string {
  // RRemove all semi sensitive data from the URL
  if (url.includes("/scrape")) {
    url = url.replace(
      /scrape\/[^\/]+\/[^\/]+\/[^\/]+/,
      "scrape/[token]/[teamId]/[projectId]",
    );
    // remove any query params related to the token
    const temp = new URL(url);
    temp.searchParams.delete("token");
    return temp.toString();
  }
  return url;
}
