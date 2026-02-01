export async function onRequest(context) {
  const { request, env } = context;

  // Example: pass through query params like ?type=posts
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "posts";

  // TODO: replace with your actual Base44 endpoint
  // Common pattern: env.BASE44_API_URL might be like:
  // https://<your-workspace>.base44.app/api/content
  const upstream = `${env.BASE44_API_URL}?type=${encodeURIComponent(type)}`;

  const res = await fetch(upstream, {
    headers: {
      "Accept": "application/json",
      // If Base44 needs auth, keep it here (server-side only)
      ...(env.BASE44_API_KEY ? { "Authorization": `Bearer ${env.BASE44_API_KEY}` } : {}),
    },
  });

  // Bubble up errors cleanly
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: "Upstream Base44 error", status: res.status, details: text.slice(0, 500) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Return Base44 JSON as-is
  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Optional: cache at edge for speed/cost
      "Cache-Control": "public, max-age=60",
    },
  });
}
