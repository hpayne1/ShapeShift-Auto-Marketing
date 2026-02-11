# rFOX GTM Packet

Go-to-market packet for the rFOX launch. **Single place** to review copy, preview how it looks on each platform, fill in placeholders, and copy content for posting.

## How to run

The packet is HTML + markdown. To use **previews** (X, Discord, blog mockups) and **Copy to clipboard**, serve this folder over HTTP. Opening `index.html` directly from disk (`file://`) will not load draft content in the viewer.

**Option 1 — npx (Node):**
```bash
cd gtm-coordinator/research-output/rfox
npx -y serve .
```
Then open **http://localhost:3000** (or the URL shown).

**Option 2 — Python:**
```bash
cd gtm-coordinator/research-output/rfox
python -m http.server 8080
```
Then open **http://localhost:8080**.

## Using the packet

1. **Start here** — The top bar on every page links to **README**, **Packet** (index), and **Checklist**. Open **index.html** first (or follow the links).
2. **index.html** — Main hub. Use "Start Checklist" for the launch checklist, or click any **Content Drafts** or other doc link. All markdown and text files open in **view.html** (rendered as HTML).
3. **Content Drafts** — Clicking a draft (e.g. "x_post_blog.md", "discord_post.md") opens **view.html** with a **platform preview**:
   - **X/Twitter** — Tweet or thread as it would look on X.
   - **Discord** — Announcement as a Discord-style message.
   - **Blog** — Article in a generic blog layout.
3. **Fill placeholders** — For blog promo tweet, metrics thread, and Discord reminder, use the form above the preview; values are saved in your browser (localStorage).
4. **Copy to clipboard** — Use the button to copy the final text (with placeholders filled) and paste into X, Discord, or your CMS.
5. **checklist.html** — Day 0–7 tasks. The **Metrics (Day 7)** table has editable "Actual" fields; values are saved in your browser.

Markdown files in `drafts/`, `press/`, etc. remain the source of truth; the viewer reads them when you open a preview.

## After launch

Fill in **SHIPPED.md** with the launch date, links to what went live (X thread, blog, Discord, etc.), and any notes so the team can see what shipped and reuse copy later.
