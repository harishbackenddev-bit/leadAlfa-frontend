export const config = {
  matcher: ["/wp-json/:path*", "/wp-content/:path*"],
};

export default async function middleware(request) {
  const wpSiteUrl = process.env.VITE_WP_SITE_URL?.replace(/\/$/, "");

  if (!wpSiteUrl) {
    return new Response(
      JSON.stringify({
        error: "WordPress proxy is not configured. Set VITE_WP_SITE_URL.",
      }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  }

  const incomingUrl = new URL(request.url);
  const targetUrl = `${wpSiteUrl}${incomingUrl.pathname}${incomingUrl.search}`;

  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
  });
}
