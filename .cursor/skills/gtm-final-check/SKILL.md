---
name: gtm-final-check
description: Run a final check on a GTM packet before release. Use after the full packet is generated and before launch to catch placeholders, wrong framing, copy issues, and cadence gaps.
---

# GTM Final Check

Run this check on a completed GTM packet (e.g. `research-output/{protocol}/`) before locking content and executing the launch checklist. Apply fixes for any items that fail.

## When to Use

- After running `gtm full-packet` or regenerating GTM assets
- Before "PRE-FLIGHT CHECK" / launch day
- When user says "final check," "pre-release review," or "ready for launch"

## The Final Check (5 Steps)

### 1. Placeholders

Search the packet for and fix or replace:

- `Unknown` (protocol summary, calendar hooks, recap copy)
- `undefined` (PR brief, any generated bullets)
- Unfilled placeholders: `[BLOG LINK]`, `[X THREAD LINK]`, `[LINK]`, `[NAME]`, `[TITLE]`, `[QUOTE]`, `[CITY, DATE]` — ensure instructions exist or replace with real values before publish

**Output:** List files and line references; replace Unknown/undefined with correct copy; note which placeholders stay for last-minute fill.

### 2. Protocol Summary

- If `research/protocol_analysis.json` has empty arrays or "Unknown" / scraped noise (e.g. "ShapeShift You need to enable JavaScript..."), the packet has no single source of product truth.
- Add to `marketing_brief.md` (Protocol Summary section): a one-line product description and 2–3 key features (e.g. FOX-only staking, USDC revenue share, off-chain DAO multisig).
- Set `design/design_brief.md` "Key message" to the approved one-liner (not "Unknown").

### 3. Framing

- Confirm **integration** vs **program/launch**: e.g. rFOX is a ShapeShift program (launch), not a third-party integration. Press release and any "integration with X" language should match (use "launch of rFOX" / "rFOX program is live" for programs).
- Remove any scraped-noise sentences (e.g. "enabling JavaScript," "the protocol's tagline") from press release or briefs.
- Fix dateline if wrong (e.g. old year) — use [CITY, DATE] or current date.

### 4. Copy

- **Banned phrases:** Check blog and long-form for "excited to announce," "thrilled," "game-changer," "revolutionary," "unlock," "seamlessly" and remove or replace.
- **X/Twitter:** Every tweet must be ≤280 characters. Check `drafts/x_post_blog.md`, `x_post_main.md` (each tweet in thread), and any other tweet drafts.
- **Product type:** If the product is staking/yield (e.g. rFOX), not swap: ensure `drafts/infobot_qt.md` says "yield position" / "staking" and "Stake FOX, earn USDC" (not "trade" / "Self-custody trading"). Ensure checklist Day 0 row says "showing staking" or "yield position," not "showing swap."
- **DM targets:** For a live launch, openers should say "X is live" (not "we're exploring X" or "considering X").

### 5. Cadence

- **Calendar vs checklist:** Every channel in the launch-day checklist (e.g. Farcaster) should have a row in `calendar/content_calendar.md` so cadence is one place to look.
- **Unknown hooks:** In the calendar, replace any "What would you try first? Unknown" (or similar) with a protocol-specific hook (e.g. "What would you try first? Stake FOX, get USDC.").
- **Optional:** Vary follow-up themes (e.g. rotate educational hooks) so weeks 2–4 don’t repeat the same line every time.

## Output

After running the check:

1. List **failures** by step (file path + issue).
2. Apply **fixes** (or provide concrete edit instructions) for each failure.
3. Confirm **key message** and **one-liner** match the approved marketing (e.g. earning-first; no custody/KYC as support).

## Integration With Marketing Release Process

This check is step 2 of the marketing release process:

1. **Generate** — Run `gtm full-packet` (or equivalent) for the protocol.
2. **Final check** — Run this skill on the packet; fix all items identified.
3. **Execute** — Run the launch checklist (Day -1 review, Day 0 publish, Days 1–7 follow-up).

See `gtm-coordinator/docs/marketing-release-process.md` and the PRE-FLIGHT CHECK section in each packet’s `checklist.md`.
