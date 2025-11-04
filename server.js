// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DB;

app.get("/tasks", async (req, res) => {
  const r = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    }
  });
  const data = await r.json();
  const items = data.results.map(page => ({
    id: page.id,
    name: page.properties.PersonName?.title[0]?.plain_text || "Unknown",
    task: page.properties.Task?.rich_text[0]?.plain_text || "",
    status: page.properties.Status?.select?.name || ""
  }));
  res.json(items);
});

app.listen(3000, () => console.log("Server running on port 3000"));
