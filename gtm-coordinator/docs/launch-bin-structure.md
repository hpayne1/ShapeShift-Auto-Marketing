# Launch bin structure

Each **launch** (product feature, integration, or program) has its own **marketing bin**: a single folder under `research-output/<launch-slug>/` that holds everything for that launch.

## ShapeShift marketing program

- **Root:** This repo (ShapeShift Auto-marketing) — shared brand, skills, templates, and process.
- **Per launch:** One folder per launch, e.g. `gtm-coordinator/research-output/rfox/`, `research-output/yield-xyz/`.

Each launch bin reuses the same **knowledge and tooling** (GTM skills, brand voice, checklist flow, packet generator) but keeps **launch-specific** content and recap in its own folder.

## What’s in a launch bin

| Item | Purpose |
|------|--------|
| **index.html** | Main hub: brief, drafts, partner/press, design, outreach. |
| **checklist.html** / **checklist.md** | Day 0–7 tasks; start here for execution. |
| **view.html** | Preview drafts (X, Discord, blog) and copy to clipboard; use with a local server. |
| **drafts/** | All copy: X threads, Discord, blog, follow-ups, SEO, etc. |
| **partner/, press/, design/, outreach/** | Partner kit, press release, design brief, DM targets. |
| **research/, intelligence/, seo/, calendar/** | Protocol analysis, wild cards, SEO articles, content calendar. |
| **marketing_brief.md** | One-pager: audience, message, tweet-ready line. |
| **README.md** | How to run the packet (e.g. `npx serve .` in this folder). |
| **SHIPPED.md** | Post-launch: what went out, links, notes — so people can see what shipped and reuse copy. |

## Why it matters

- **One folder per launch** — no mixing; easy to find “everything for rFOX” or “everything for Yield.xyz.”
- **Checklist per launch** — clear tasks and order; can revisit later to see what was done.
- **SHIPPED.md** — record what actually went live (tweets, blog, Discord, etc.) and lessons learned; makes it easy to copy/paste and improve next time.

## Creating a new launch bin

Run the full-packet generator for the new protocol/feature (e.g. `gtm full-packet --protocol "New Protocol" ...`). It will create a new folder under `research-output/<slug>/` with index.html, checklist, view.html, drafts, and all subfolders. After launch, fill in **SHIPPED.md** in that folder.

## Serving the packet (fixing “Failed to fetch”)

Opening `index.html` or `view.html` directly from disk (`file://`) will not load draft content in the viewer. Serve the **launch folder** over HTTP from that folder, e.g.:

```bash
cd gtm-coordinator/research-output/<launch-slug>
npx -y serve .
```

Then open the URL shown (e.g. http://localhost:3000) and use the packet and checklist from there.
