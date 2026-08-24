interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  /** e.g. "yourteam.cloudflareaccess.com". Empty disables /admin entirely. */
  ACCESS_TEAM_DOMAIN: string;
  /** The Access application's Audience (AUD) tag. */
  ACCESS_AUD: string;
}

const INTENTS = new Set(["hiring", "open"]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function signup(request: Request, env: Env) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Malformed request." }, 400);
  }

  // ponytail: hidden field real people never fill in. Silently accept so
  // bots don't learn they were caught.
  if (typeof body.company === "string" && body.company.length > 0) {
    return json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const intent = String(body.intent ?? "");

  if (name.length < 2 || name.length > 120) {
    return json({ error: "Enter your name." }, 400);
  }
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return json({ error: "Enter a valid email address." }, 400);
  }
  if (!INTENTS.has(intent)) {
    return json({ error: "Choose which side you're on." }, 400);
  }

  await env.DB.prepare(
    `insert into waitlist (name, email, intent, country, user_agent)
     values (?, ?, ?, ?, ?)
     on conflict(email) do update set
       name = excluded.name,
       intent = excluded.intent`,
  )
    .bind(
      name,
      email,
      intent,
      request.headers.get("cf-ipcountry"),
      request.headers.get("user-agent")?.slice(0, 300) ?? null,
    )
    .run();

  return json({ ok: true });
}

/**
 * Verify the Cloudflare Access JWT. Access already blocks unauthenticated
 * requests on the custom domain, but workers.dev routes bypass Access, so
 * /admin verifies the token itself rather than trusting the header.
 */
type Jwk = JsonWebKey & { kid: string };
let keyCache: { keys: Map<string, CryptoKey>; expires: number } | null = null;

async function accessKeys(teamDomain: string) {
  if (keyCache && keyCache.expires > Date.now()) return keyCache.keys;

  const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error("Could not fetch Access keys");
  const { keys } = (await response.json()) as { keys: Jwk[] };

  const imported = new Map<string, CryptoKey>();
  for (const jwk of keys) {
    imported.set(
      jwk.kid,
      await crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      ),
    );
  }
  keyCache = { keys: imported, expires: Date.now() + 3_600_000 };
  return imported;
}

function b64url(part: string) {
  return Uint8Array.from(
    atob(part.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
}

async function accessEmail(request: Request, env: Env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;

  const token =
    request.headers.get("cf-access-jwt-assertion") ??
    /CF_Authorization=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const { kid } = JSON.parse(new TextDecoder().decode(b64url(header)));
  const key = (await accessKeys(env.ACCESS_TEAM_DOMAIN)).get(kid);
  if (!key) return null;

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64url(signature),
    new TextEncoder().encode(`${header}.${payload}`),
  );
  if (!valid) return null;

  const claims = JSON.parse(new TextDecoder().decode(b64url(payload))) as {
    aud?: string[] | string;
    iss?: string;
    exp?: number;
    email?: string;
  };

  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audience.includes(env.ACCESS_AUD)) return null;
  if (claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
  if (!claims.exp || claims.exp * 1000 < Date.now()) return null;

  return claims.email ?? "";
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}

async function admin(env: Env) {
  const { results } = await env.DB.prepare(
    `select name, email, intent, country, created_at
       from waitlist order by created_at desc`,
  ).all<{
    name: string;
    email: string;
    intent: string;
    country: string | null;
    created_at: string;
  }>();

  const rows = results
    .map(
      (r) => `<tr>
        <td>${escapeHtml(r.created_at)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td><a href="mailto:${escapeHtml(r.email)}">${escapeHtml(r.email)}</a></td>
        <td>${r.intent === "hiring" ? "Hiring" : "Open"}</td>
        <td>${escapeHtml(r.country ?? "—")}</td>
      </tr>`,
    )
    .join("");

  return new Response(
    `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Waitlist — Unfound</title>
<style>
  :root { color-scheme: light }
  body { margin:0; padding:3rem 1.5rem; background:#f6f6f3; color:#16171a;
         font:16px/1.5 ui-sans-serif,system-ui,sans-serif }
  main { max-width:64rem; margin:0 auto }
  h1 { font-weight:400; font-size:1.5rem; margin:0 0 .25rem }
  p.count { color:#8d8f95; margin:0 0 2.5rem; font-size:.875rem }
  .scroll { overflow-x:auto }
  table { border-collapse:collapse; width:100%; font-size:.9375rem }
  th { text-align:left; font-size:.6875rem; letter-spacing:.14em;
       text-transform:uppercase; color:#8d8f95; font-weight:500;
       padding:0 1.5rem .75rem 0; white-space:nowrap }
  td { padding:.875rem 1.5rem .875rem 0; border-top:1px solid #e2e2dd;
       vertical-align:top }
  a { color:#1c4a44 }
  .empty { color:#8d8f95 }
</style>
<main>
  <h1>Waitlist</h1>
  <p class="count">${results.length} ${results.length === 1 ? "signup" : "signups"}</p>
  ${
    results.length
      ? `<div class="scroll"><table>
      <tr><th>When</th><th>Name</th><th>Email</th><th>Side</th><th>Country</th></tr>
      ${rows}
    </table></div>`
      : `<p class="empty">No signups yet.</p>`
  }
</main>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/waitlist") {
      return request.method === "POST"
        ? signup(request, env)
        : new Response("Method not allowed", { status: 405 });
    }

    if (pathname === "/admin") {
      // Fails closed: no Access config, no token, or a bad token all 404.
      // A 404 rather than 401 keeps the route invisible to scanners.
      const email = await accessEmail(request, env);
      if (email === null) return new Response("Not found", { status: 404 });
      return admin(env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
