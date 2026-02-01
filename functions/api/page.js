export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || "home";

    const res = await fetch(
      `${env.BASE44_ENDPOINT}?slug=${slug}`,
      {
        headers: {
          "Authorization": `Bearer ${env.BASE44_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: "Base44 request failed",
          status: res.status
        }),
        { status: 500 }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

