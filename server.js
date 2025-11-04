// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.warn("WARNING: NOTION_TOKEN or NOTION_DATABASE_ID missing. Use .env to set them.");
}

const notion = new Client({ auth: NOTION_TOKEN });

// Helper: convert Notion page to simple object
function parseNotionPage(page) {
  const props = page.properties || {};
  const personName = (props.PersonName?.title?.[0]?.plain_text) || (props.Name?.title?.[0]?.plain_text) || "Unknown";
  const task = (props.Task?.rich_text?.[0]?.plain_text) || (props.Description?.rich_text?.[0]?.plain_text) || "";
  const status = (props.Status?.select?.name) || "";
  return {
    id: page.id,
    name: personName,
    task,
    status
  };
}

app.get("/tasks", async (req, res) => {
  try {
    if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
      return res.json({ error: "Notion token or DB not configured", items: [] });
    }
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      page_size: 100
    });

    const items = (response.results || []).map(parseNotionPage);
    res.json({ items, timestamp: Date.now() });
  } catch (err) {
    console.error("Notion fetch error:", err.message || err);
    res.status(500).json({ error: "Failed to fetch Notion", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
