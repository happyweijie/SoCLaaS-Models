# SoCLaaS Models

A public listing of the models available from **SoCLaaS** (SoC LLM-as-a-Service), the LLM service run by the NUS School of Computing. SoCLaaS publishes its catalogue at an authenticated endpoint reachable from the NUS intranet and from the public internet alike, but only with an API key. This site keeps a key server-side and serves the result to everyone.

**Live:** https://soclaas-models.vercel.app

> Not affiliated with or endorsed by NUS School of Computing.

## Public API

The endpoint behind the table is open, and you're welcome to use it.

```bash
curl https://soclaas-models.vercel.app/api/models
```

No API key required. CORS is open to all origins, so you can call it straight from a browser app. Responses are cached at the edge for an hour.

There's also `GET /api/health`, which returns `{"status":"ok"}`.

### Response

```jsonc
{
  "object": "list",
  "data": [
    {
      "id": "advanced-vision",
      "object": "model",
      "created": 0,
      "owned_by": "soclaas",
      "context_length": 80000,
      "context_window": 80000,
      "max_context_length": 80000,
      "max_model_len": 80000,
      "soclaas": {
        "display_name": "Qwen 3 VL 32B",
        "description": "Vision-capable model",
        "capabilities": ["chat"],
        "input_microdollars_per_million_tokens": 387416,
        "output_microdollars_per_million_tokens": 2464930,
        "audio_microdollars_per_minute": 0,
        "alias_of": "qwen3-vl:32b"   // absent unless the model is an alias
      }
    }
  ]
}
```

This is SoCLaaS's own payload, passed through unmodified. A few notes on reading it:

- **Prices are in microdollars.** Divide by 1,000,000 for dollars — the example above is `$0.387` per 1M input tokens and `$2.465` per 1M output tokens.
- **The four context fields usually agree.** They come from different upstream conventions; take the first positive one if you need a single number.
- **`alias_of` marks a pointer, not a distinct model.** Skip those entries to get the real catalogue.

### Scope

This returns the model **catalogue only** — it is not an inference proxy, and there is no endpoint here for completions. To actually run a model, go to SoCLaaS directly. Offered as-is with no uptime guarantee; if you depend on this data, cache it on your side.

## Local development

```bash
git clone https://github.com/happyweijie/SoCLaaS-Models.git
cd SoCLaaS-Models
npm install
cd frontend && npm install && cd ..

cp backend/.env.example backend/.env   # then set SOCLAAS_API_KEY
```

Run the two halves in separate terminals:

```bash
npm run dev:api   # Express on :3000
npm run dev:web   # Vite on :5173
```

Open http://localhost:5173. Vite proxies `/api` to the backend (`frontend/vite.config.ts`), which is why the frontend only ever uses same-origin relative paths — the same code works unchanged in production.

## Deploying your own

Import the repo as a Vercel project and set `SOCLAAS_API_KEY` for both Production and Preview. Everything else is already in `vercel.json`: the frontend builds to `frontend/dist`, and `/api/*` rewrites to `api/index.js`, which re-exports the very same Express app that `npm run dev:api` runs locally. One codebase, no build-time branching.

## Layout

```
api/index.js      Vercel entrypoint — re-exports the Express app
backend/app.js    the app itself: routes, CORS, upstream fetch
backend/index.js  local dev server (app.listen)
frontend/         React + TypeScript + Vite
```
