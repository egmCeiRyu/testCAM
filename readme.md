# Notion Head Tracker (Demo)

Tracks up to 5 heads in the browser (MediaPipe FaceMesh) and shows Notion task data as floating balloons.

## Setup (local)

1. Clone files into a folder (structure above).
2. Copy `.env.sample` to `.env` and fill:
   - `NOTION_TOKEN` — your Notion integration token
   - `NOTION_DATABASE_ID` — the ID of your Notion database (open DB and copy ID from URL)
3. Install:
   ```bash
   npm install
