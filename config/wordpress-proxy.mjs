export function normalizeWpSiteUrl(url) {
  if (!url || typeof url !== "string") {
    throw new Error(
      "VITE_WP_SITE_URL is required. Add it to your .env file (e.g. VITE_WP_SITE_URL=https://blogs.creatrend.co.za)."
    );
  }

  return url.replace(/\/$/, "");
}

export function getViteProxyConfig(wpSiteUrl) {
  const target = normalizeWpSiteUrl(wpSiteUrl);

  return {
    "/wp-json": {
      target,
      changeOrigin: true,
    },
    "/wp-content": {
      target,
      changeOrigin: true,
    },
  };
}

export function getNetlifyRedirects(wpSiteUrl) {
  const site = normalizeWpSiteUrl(wpSiteUrl);

  return [
    `/wp-json/*  ${site}/wp-json/:splat  200!`,
    `/wp-content/*  ${site}/wp-content/:splat  200!`,
  ];
}
