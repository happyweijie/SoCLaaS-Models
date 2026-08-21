import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.get("api/health", (req, res) => {
  res.status(200)
    .json({ status: "ok" });
})

app.get("/api/models", async (req, res) => {
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

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
