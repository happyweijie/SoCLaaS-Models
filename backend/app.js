import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve .env next to this file rather than from the working directory, so
// the server behaves the same whether it is started from the repo root or
// from backend/. On Vercel there is no .env and this is a no-op.
dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env")
});

const app = express();

// The API is read-only and returns no secrets, so any origin may read it —
// this is what lets other people's browser apps use the catalogue directly.
app.use(cors());

app.get("/api/health", (_req, res) => {
  res.status(200)
    .json({ status: "ok" });
})

app.get("/api/models", async (_req, res) => {
  try {
    const response = await fetch(
      "https://soclaas-api.comp.nus.edu.sg/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.SOCLAAS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();

      return res.status(response.status)
        .send(text);
    }

    const data = await response.json();

    // The catalogue changes rarely, so let Vercel's CDN serve repeat traffic
    // instead of hitting the upstream API once per visitor. Only the success
    // path sets this: a transient upstream failure must not get pinned here
    res.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

export default app;