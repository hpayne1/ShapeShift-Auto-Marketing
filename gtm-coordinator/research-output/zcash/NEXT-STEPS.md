# Zcash GTM — Next Steps Before Launch

**Packet location:** `gtm-coordinator/research-output/zcash/`  
**Committed:** 2026-02-12  
**Status:** Full packet generated; timeline and a few placeholders need human input before launch.

---

## 1. Fill the discovery questionnaire (required)

**What:** A product or launch owner needs to supply dates and decisions that are still TBD.

**How:**
1. Open **`research/gtm_discovery_questionnaire.html`** in a browser.
2. Fill in:
   - **Launch date** (and optionally embargo, asset approval, scope lock)
   - **Co-marketing partner** (who at ECC/Zcash Foundation is coordinating?)
   - **Conversion event** (e.g. "First ZEC wallet activation" or "First swap into ZEC")
   - **Press quote** — name, title, quote for the press release
   - **Contact info** — your Discord/Telegram and media contact
3. Click **Save as File** to download the JSON, or **Copy to Clipboard** to paste elsewhere.
4. Provide the saved JSON (or pasted text) back to the agent and say: *"Merge this questionnaire into the Zcash packet."*

**Skill to use:** `gtm-questionnaire-merger` — it will update `checklist.md`, `marketing_brief.md`, `partner/partner_kit.md`, `press/press_release.md`, drafts, and calendar with the answers.

---

## 2. Confirm product is live (required)

Before any public announcement:

- [ ] **ZEC send** works on app.shapeshift.com  
- [ ] **ZEC receive** works (transparent t-address generation)  
- [ ] **ZEC swap** works (e.g. BTC→ZEC, ETH→ZEC)  
- [ ] CTA **app.shapeshift.com** is correct and tested  

Use the **PRE-FLIGHT CHECK** section in `checklist.md` and tick each item on launch day.

---

## 3. Fill last-minute placeholders (Day 0)

Right before posting:

- [ ] **`[BLOG LINK]`** — Replace in `drafts/x_post_blog.md`, `calendar/content_calendar.md`, and Discord reminder copy with the live Strapi blog URL after you publish.
- [ ] **`[X THREAD LINK]`** — Replace in Discord reminder and calendar with the main announcement thread URL after you post.
- [ ] **`[NAME]`, `[TITLE]`, `[QUOTE]`** — Replace in `press/press_release.md` if you use a quote (or remove the quote line).
- [ ] **`[CITY, DATE]`** — Replace in the press release dateline with your city and launch date.

Search the packet for `[` to find any other placeholders.

---

## 4. Optional: Partner coordination

- Send **`partner/partner_kit.md`** to the Zcash ecosystem (Electric Coin Company, Zcash Foundation) at least 5 days before launch.
- Ask for a **Quote Tweet** of the main announcement on Day 0 (within ~30 min of your post).
- Identify a single contact for launch-day coordination.

---

## 5. Execute the launch

- Follow **`checklist.md`** from **PRE-LAUNCH PHASE** (Day -7 to -1) through **LAUNCH PHASE** (Day 0) and **Days 1–7**.
- Minimum viable launch: tweet thread + Discord announcement + personal QT (~30 min).
- Full launch: follow the timed Day 0 table (blog, Medium, Farcaster, DMs per `outreach/dm_targets.md`).

---

## 6. After launch (optional)

- **SEO:** Run `gtm seo-batch --packet research-output/zcash` to generate articles from `research/seo_topics.md` (if the CLI is set up).
- **Metrics:** On Day 7, fill the metrics table in `checklist.md` and run `gtm metrics --launch zcash` if available.
- **SHIPPED.md:** Record what actually went out (channels, links, dates) for reuse and post-mortem.

---

## Quick reference

| Need to… | File or action |
|----------|-----------------|
| See what’s missing | `research/gtm_gap_report.md` |
| Fill dates & decisions | `research/gtm_discovery_questionnaire.html` → then run gtm-questionnaire-merger |
| Run pre-launch QA again | Run **gtm-final-check** skill on this packet |
| Day-of checklist | `checklist.md` (PRE-FLIGHT CHECK + Launch Day table) |
| DM targets | `outreach/dm_targets.md` |
| Partner copy | `partner/partner_kit.md` |
| Press talking points | `press/pr_brief.md` |

---

**Questions?** See `checklist.md` — ping Apotheosis on Discord for handoff or questions.
