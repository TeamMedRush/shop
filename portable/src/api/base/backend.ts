import { ApiCaller } from "@api/base/api-caller";

export const backendCaller = new ApiCaller({
  proxied: false,
  lsCached: true,
  lsCacheTTL: 1000 * 60 * 15,
  baseApiUrl: "https://server.medrush.qzz.io/api/v1",
})

