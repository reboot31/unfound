# Unfound

Pre-launch landing page. Static Next.js export, deployed to Cloudflare Workers static assets.

Positioning: a private introduction service for VP / Director / Head-of roles in India,
engineering and non-engineering. Curated in both directions — nothing is posted, no profile
is listed, nobody can browse you.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
```

## Deploy

Build command `npm run build`, output directory `out`.

## TODO

- Wire the waitlist form to Tally or Formspree (`src/components/waitlist-form.tsx`, `handleSubmit`).
- Point `hello@unfoundhq.com` at a real inbox.
