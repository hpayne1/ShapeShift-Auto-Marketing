# GTM Final Check: Yield.xyz

**Date:** 2026-02-12  
**Packet:** gtm-coordinator/research-output/yield-xyz

---

## Step 0: Source of Truth

- **Canonical source:** research/yield_assets_chains_summary.md (from yields_response.json) — 13 networks, 29 assets, 18 providers.
- **In packet:** protocol_analysis.json has `sourceOfTruth`; marketing_brief.md and design_brief.md reference it.
- **No contradictions found.** Claims (chains, providers, assets) match the summary.

---

## Step 1: Placeholders

| Placeholder | Location | Action |
|-------------|----------|--------|
| [BLOG LINK] | drafts/x_post_blog.md, calendar | Fill with Strapi blog URL after publish. Noted in PRE-FLIGHT. |
| [X THREAD LINK] | drafts/discord_reminder.md, calendar reminder copy | Fill with main thread URL after posting. Noted in PRE-FLIGHT. |
| [NAME], [TITLE], [QUOTE] | press/press_release.md | Fill if using spokesperson quote; else remove line. Noted in PRE-FLIGHT. |

**Fixed:** [LINK] in discord_post.md and farcaster_post.md → replaced with app.shapeshift.com/#/yields.

No `Unknown` or `undefined` in packet.

---

## Step 2: Protocol Summary

- protocol_analysis.json: No empty arrays or "Unknown"; includes sourceOfTruth.
- marketing_brief.md: Protocol Summary section present with one-liner and key features.
- design_brief.md: Key message set; source-of-truth note present.

---

## Step 3: Framing

- **Campaign type:** Integration (Yield.xyz) — correct. Press and copy use "integration" appropriately.
- No scraped-noise sentences found.
- Dateline: March 3, 2026 in press release; embargo Feb 23, 2026 noted.

---

## Step 4: Copy

- **Banned phrases:** "seamlessly" removed from discord_reminder.md (→ "direct access").
- **Tweet length:** x_post_main.md threads and x_post_blog.md (with [BLOG LINK] replaced by URL) are under 280 chars.
- **Product type:** infobot_qt.md says "yield position" and "Self-custody yield"; checklist Day 0 row updated from "showing swap" to "showing yield position / staking."
- **Metrics table:** "Swap Volume" → "Yield TVL / deposits" in checklist.
- **DM targets:** Openers updated to "Yield.xyz is live on ShapeShift" (live launch framing).

---

## Step 5: Brand Voice

- **3rd person:** "We're here to help" → "The team is here to help" in discord_post.md, discord_reminder.md, farcaster_post.md.
- **Banned words:** No remaining "excited," "thrilled," "game-changer," "revolutionary," "unlock" in publishable copy (gap report and gtm_gap_analysis are reference only).
- **Emojis:** Main-account copy uses at most one fox emoji per post; compliant.

---

## Step 6: Cadence

- Calendar has rows for Blog, X, Medium, Discord, Farcaster aligned to launch (March 3) and follow-ups.
- No "Unknown" hooks in calendar; hooks are protocol-specific (e.g. "Unified API for Web3 yield across 75+ networks").

---

## Fixes Applied

1. **checklist.md** — Day 0: "showing swap" → "showing yield position / staking"; Metrics: "Swap Volume" → "Yield TVL / deposits"; PRE-FLIGHT: added placeholder fill reminder.
2. **drafts/discord_post.md, farcaster_post.md** — [LINK] → app.shapeshift.com/#/yields; "We're here to help" → "The team is here to help."
3. **drafts/discord_reminder.md** — "seamlessly" → "direct"; "We're here to help" → "The team is here to help."
4. **outreach/dm_targets.md** — DM openers to "Yield.xyz is live on ShapeShift" for live-launch framing.

---

## Remaining (Fill at Publish Time)

- **[BLOG LINK]** in x_post_blog.md — insert Strapi URL after blog is live.
- **[X THREAD LINK]** in discord_reminder and calendar — insert main X thread URL after posting.
- **[NAME], [TITLE], [QUOTE]** in press_release.md — insert or remove quote line before sending press.

---

**Result:** Packet passes final check. Ready for PRE-FLIGHT and Day 0 (March 3, 2026) execution.
