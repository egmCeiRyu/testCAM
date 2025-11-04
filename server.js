import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Serve frontend files
app.use(express.static("public"));

app.get("/tasks", async (req, res) => {
  // Mock mode if Notion info is missing
  if (!NOTION_TOKEN || !DATABASE_ID) {
    console.log("🧩 No Notion credentials found — using mock task data.");
    return res.json([
      { id: "1", name: "Alice", task: "Design homepage", status: "In Progress" },
      { id: "2", name: "Bob", task: "Fix login bug", status: "Todo" },
      { id: "3", name: "Clara", task: "Write docs", status: "Done" },
      { id: "4", name: "David", task: "Review PR", status: "In Review" },
      { id: "5", name: "Eve", task: "Prepare presentation", status: "Todo" }
    ]);
  }

  try {
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
  } catch (err) {
    console.error("❌ Notion fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
