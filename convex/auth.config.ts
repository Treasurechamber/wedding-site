// For local dev, CONVEX_SITE_URL may be unset; fallback to local backend URL so auth works.
const siteUrl = process.env.CONVEX_SITE_URL ?? "http://127.0.0.1:3210";

export default {
  providers: [
    {
      domain: siteUrl,
      applicationID: "convex",
    },
  ],
};
