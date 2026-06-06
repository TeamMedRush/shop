type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
const PROXY_URL = "https://proxy.attachment-aditya.workers.dev/";

interface ApiCallerConfig {
  baseApiUrl: string;
  defaultHeaders?: { [key: string]: string };
  referrer?: string;
  mode?: "cors" | "no-cors" | "same-origin";
  credentials?: "omit" | "same-origin" | "include";
  proxied?: boolean;
  lsCacheTTL?: number | null;
  lsCached?: boolean;
}

export class ApiCaller {
  private baseApiUrl: string;
  private defaultHeaders: { [key: string]: string };
  private referrer?: string;
  private mode?: "cors" | "no-cors" | "same-origin";
  private credentials?: "omit" | "same-origin" | "include";
  private proxied: boolean;
  private lsCacheTTL: number | null;
  private lsCached: boolean;

  constructor({
    baseApiUrl,
    defaultHeaders = {},
    referrer,
    mode = "cors",
    credentials = "same-origin",
    proxied=false,
    lsCacheTTL = null,
    lsCached = false,
  }: ApiCallerConfig) {
    this.baseApiUrl = baseApiUrl;
    this.defaultHeaders = defaultHeaders;
    this.referrer = referrer;
    this.mode = mode;
    this.credentials = credentials;
    this.proxied = proxied;
    this.lsCacheTTL = lsCacheTTL;
    this.lsCached = lsCached;
  }

  async callApi(
    endpoint: string,
    method: Method = "GET",
    body: string | undefined = undefined,
    extraOptions: Partial<{
      headers: { [key: string]: string };
      referrer: string;
      mode: "cors" | "no-cors" | "same-origin";
      credentials: "omit" | "same-origin" | "include";
    }> = {}
  ) {
    const keyStatic = `${this.baseApiUrl}:${endpoint}`
    const keyDynamic = `${method}:${body}`;
    const lsCacheKey = `apiCache::${keyStatic}:${keyDynamic}`;
    const lsCachedData = localStorage.getItem(lsCacheKey);

    if (lsCachedData) {
      const { timestamp, data } = JSON.parse(lsCachedData);
      const alive = this.lsCacheTTL
        ? (Date.now() - timestamp < this.lsCacheTTL)
        : true;

      if (!alive) {
        localStorage.removeItem(lsCacheKey);
      } else {
        return data;
      }
    }

    const finalUrl = this.baseApiUrl + endpoint;

    const finalHeaders = {
      method,
      body,
      headers: this.defaultHeaders,
      referrer: this.referrer,
      mode: this.mode,
      credentials: this.credentials,
      ...extraOptions,
    }

    let response: Response;

    if (!this.proxied) {
      response = await fetch(finalUrl, finalHeaders);
    } else {
      response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: finalUrl,
          options: finalHeaders,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const responseData = await response.json();

    if (this.lsCached) {
      localStorage.setItem(lsCacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: responseData,
      }));
    }

    return responseData;
  }
}

