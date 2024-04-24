/** Remove sensitive data from URLs used in analytics & speed insights */
export function cleanSensitiveData(url: string): string {
  // Remove the token from the URL and replace it with [token] & remove the query params related to the token
  if (url.includes("/scrape")) {
    // filter out the token from the URL path and replace it with [token]
    url = url.replace(/(\/scrape\/)[^\/]+(\/[^\/]+\/[^\/]+)/, "$1[token]$2");
    // remove any query params related to the token
    const temp = new URL(url);
    temp.searchParams.delete("token");
    return temp.toString();
  }
  return url;
}
