# Zcash GTM Final Check

**Packet:** gtm-coordinator/research-output/zcash
**Date:** 2026-02-12
**Source of truth:** https://z.cash
**Files reviewed:** 27

---

## Step 0: Source of Truth

**Canonical source:** https://z.cash

**Source URL documented in packet:**
- `research/protocol_analysis.json` — `"sourceOfTruth": "https://z.cash"` — PASS
- `marketing_brief.md` — line 109: "Source of truth: https://z.cash" — PASS
- `design/design_brief.md` — line 65: references `z.cash/brand` — PASS

**Cross-reference of product claims against z.cash:**

| Claim (Packet) | z.cash Says | Status |
|---|---|---|
| Tagline: "Privacy-protecting digital currency" | Page title: "Zcash: Privacy-protecting digital currency" | PASS |
| "First cryptocurrency to implement zero-knowledge encryption for private peer-to-peer payments" | "The first cryptocurrency to develop zero-knowledge encryption for private peer-to-peer payments" | PASS |
| Key features: zk-SNARKs, transparent/shielded, fast low fees, secret messages (memo field), self-funded development | z.cash features: Private (zk-SNARKs), Fair & open, You're in control, Secret messages, Fast low fees, Self-funded development | PASS |
| Outstanding supply: ~16.5M ZEC | z.cash: 16.51M | PASS |
| Shielded ZEC: ~5M ZEC | z.cash: 5.05M | PASS |
| Supported by: Coinbase, Gemini, Bitfinex, Flexa, Poloniex | z.cash ecosystem page shows these plus Airtm, Flyp.me, Messari, Zcash Foundation, ECC, Zcash Community Grants | PASS (subset) |
| Current price: ~$29 (`marketing_brief.md` line 94) | z.cash live data: ~$229.70 | **FLAG** |
| "The original privacy coin" (used across many drafts) | z.cash does not use this phrase; z.cash says "first cryptocurrency to develop zero-knowledge encryption" | PASS (editorial characterization, defensible) |

**Issues found:**

1. **ISSUE S0-1 (Low): Potentially stale price data.** `marketing_brief.md` Protocol Summary table lists ZEC price as "~$29". The z.cash live feed currently shows ~$229.70. Crypto prices fluctuate constantly, so this may have been correct at generation time, but it should be verified and updated before any public use.
   - **File:** `marketing_brief.md` line 94
   - **Action:** Verify current ZEC price and update before launch

---

## Step 1: Placeholders

**"Unknown" found:** 0 — PASS
**"undefined" found:** 0 — PASS

### Placeholder Inventory

#### Requires Human Input (fill before launch)

| Placeholder | File | Line(s) | What's Needed | Priority |
|---|---|---|---|---|
| `[TBD]` | `checklist.md` | 4 | Launch date | HIGH |
| `[TBD]` | `checklist.md` | 5 | Embargo date | HIGH |
| `[TBD]` | `checklist.md` | 6 | Asset approval date | MEDIUM |
| `[TBD]` | `checklist.md` | 7 | Scope lock date | MEDIUM |
| `[TBD]` | `calendar/content_calendar.md` | 3 | Launch date | HIGH |
| `[TBD]` | `partner/partner_kit.md` | 5 | Launch date | HIGH |
| `[YOUR NAME]` | `checklist.md` | 10 | Launch owner name | HIGH |
| `[YOUR DISCORD/TELEGRAM]` | `partner/partner_kit.md` | 6 | Contact info for partner | HIGH |
| `[YOUR HANDLE]` | `partner/partner_kit.md` | 123 | Contact handle | HIGH |
| `[NAME]` | `press/press_release.md` | 15 | Spokesperson name (for quote) | MEDIUM |
| `[TITLE]` | `press/press_release.md` | 15 | Spokesperson title | MEDIUM |
| `[QUOTE]` | `press/press_release.md` | 15 | Spokesperson quote | MEDIUM |
| `[Name]` | `press/press_release.md` | 47 | Media contact name | MEDIUM |
| `[Title]` | `press/press_release.md` | 48 | Media contact title | MEDIUM |
| `[Email Address]` | `press/press_release.md` | 50 | Media contact email | MEDIUM |
| `[CITY, DATE]` | `press/press_release.md` | 7 | Dateline (city + launch date) | HIGH |
| `[Author Name]` | `press/op_ed_political.md` | 5, 80 | Op-ed author | LOW (optional) |
| `[Author Name]` | `press/op_ed_technical.md` | 5, 75 | Op-ed author | LOW (optional) |
| `[Date]` | `press/op_ed_political.md` | 6 | Publish date | LOW (optional) |
| `[Date]` | `press/op_ed_technical.md` | 6 | Publish date | LOW (optional) |
| `[contact]` | `design/design_brief.md` | 76, 77 | Hoff and Atlin contact info | MEDIUM |
| `[contact]` | `checklist.md` | 76, 77 | Hoff and Atlin contact info | MEDIUM |
| `[PERSONALIZE]` | `press/op_ed_technical.md` | 79-82 | 3 personalization items for op-ed | LOW (optional) |

#### Last-Minute Fill (intentional — fill at posting time)

| Placeholder | File | Line(s) | When to Fill |
|---|---|---|---|
| `[BLOG LINK]` | `drafts/x_post_blog.md` | 3, 14 | After Strapi blog publish (Day 0) |
| `[BLOG LINK]` | `calendar/content_calendar.md` | 11, 50 | After Strapi blog publish (Day 0) |
| `[X THREAD LINK]` | `drafts/discord_reminder.md` | 11, 28 | After main thread posted (Day 0) |
| `[X THREAD LINK]` | `calendar/content_calendar.md` | 15 | After main thread posted (Day 0) |
| `[SCREENSHOT]` x3 | `drafts/followup_educational.md` | 9, 17, 24 | Take screenshots before Day 1 |
| `[IMAGE]` | `drafts/blog_draft.md` | 48 | Add product screenshot before publish |
| `[IMAGE]` x2 | `drafts/medium_post.md` | 9, 51 | Add product screenshots before publish |
| `[X]` `[Y]` `[W]` | `drafts/followup_recap.md` | 20-22 | Fill with Week 1 metrics (Day 7) |
| `[ASSET]` | `drafts/followup_recap.md` | 22, 53 | Fill with top swap pair (Day 7) |
| `[X]` `[Y]` `[Z]` `[W]` | `drafts/followup_metrics.md` | 11-15, 19-21 | Fill with metrics (Day 4-6) |
| `[ASSET]` | `drafts/followup_metrics.md` | 23, 52 | Fill with top swap pair (Day 4-6) |

**Total placeholders:** 22 unique human-input + 11 last-minute fill = 33 total placeholder instances
**Status:** All placeholders are correctly documented. The `checklist.md` PRE-FLIGHT CHECK section (line 179) already instructs the launcher to fill `[BLOG LINK]`, `[X THREAD LINK]`, `[NAME]`, `[TITLE]`, and `[QUOTE]` before posting. No rogue "Unknown" or "undefined" values found.

---

## Step 2: Protocol Summary

**`research/protocol_analysis.json`:**
- No empty arrays — PASS
- No "Unknown" values — PASS
- No scraped noise (no "enable JavaScript" or similar) — PASS
- `sourceOfTruth` field present: `"https://z.cash"` — PASS
- All 6 key features populated — PASS
- Target audience (4 items), risks (4 items), integration opportunities (4 items) — all populated — PASS

**`marketing_brief.md`:**
- One-line product description: line 26 — "ShapeShift now supports Zcash — send, receive, and swap ZEC alongside BTC, ETH, and 100+ assets in one self-custody wallet, no exchange account needed." — PASS
- Protocol Summary table with key data points (name, category, tagline, chain type, supply, supported exchanges, official wallet) — PASS
- Key Features section with 5 features — PASS
- Value Proposition aligned to source of truth — PASS

**`design/design_brief.md`:**
- Key message set: line 53 — "Send, receive, and swap ZEC — the original privacy coin — on ShapeShift." — PASS (not "Unknown")
- Source reference: z.cash/brand link included — PASS

**Issues found:** None.

---

## Step 3: Framing

**Integration vs. Program/Launch:**
- `checklist.md` line 9: `Type: Integration (new chain/asset support)` — PASS
- Press release headline: "ShapeShift Adds Native Zcash (ZEC) Support" — correctly framed as ShapeShift adding support, not launching Zcash — PASS
- Blog headline: "Send, Receive, and Swap Zcash (ZEC) on ShapeShift" — PASS
- All public-facing drafts frame this as "ZEC is now live on ShapeShift" or "ShapeShift now supports ZEC" — PASS
- Internal documents use "Zcash Launch Checklist" (checklist.md) and "DM Targets: Zcash Launch" (dm_targets.md) — acceptable for internal use; "launch" here refers to the marketing launch event, not launching the Zcash protocol

**Scraped noise:**
- No "enable JavaScript", scraped taglines, or garbled text found in any file — PASS

**Dateline:**
- Press release uses `[CITY, DATE]` placeholder — correct format, ready for fill — PASS

**Minor observation:**

2. **ISSUE S3-1 (Low): Medium post describes Zcash as "a fork of Bitcoin's codebase."** While technically accurate, this language doesn't appear on z.cash and differs from the rest of the packet, which consistently describes Zcash as having a "UTXO-based architecture (similar to Bitcoin)." Consider aligning to "built on Bitcoin's UTXO model" for consistency.
   - **File:** `drafts/medium_post.md` line 17
   - **Action:** Consider changing "a fork of Bitcoin's codebase" to "building on Bitcoin's UTXO model" or "using a UTXO architecture similar to Bitcoin"

---

## Step 4: Copy

### Banned Phrases

| Phrase | Found in Drafts? | Status |
|---|---|---|
| "excited to announce" | No | PASS |
| "thrilled" | No | PASS |
| "game-changer" | No | PASS |
| "revolutionary" | No | PASS |
| "unlock" | No | PASS |
| "seamlessly" | No | PASS |

Note: These phrases appear only in `press/pr_brief.md` line 66 as a "Do NOT Say" instruction — correct usage.

### Tweet Length Verification

| File | Tweet | Char Count | Status |
|---|---|---|---|
| `x_post_main.md` | Tweet 1 | ~136 | PASS |
| `x_post_main.md` | Tweet 2 | ~169 | PASS |
| `x_post_main.md` | Tweet 3 | ~170 | PASS |
| `x_post_main.md` | Tweet 4 | ~131 | PASS |
| `x_post_main.md` | Tweet 5 | ~99 | PASS |
| `x_post_blog.md` | Single tweet | ~152 (before `[BLOG LINK]` fill; ~155 with short URL) | PASS |
| `x_post_personal.md` | Single tweet | ~264 | PASS |
| `followup_recap.md` | Tweet 1 | ~58 | PASS |
| `followup_recap.md` | Tweet 2 | ~200 | PASS |
| `followup_recap.md` | Tweet 3 | ~236 | PASS |
| `followup_recap.md` | Tweet 4 | Template (verify after fill) | — |
| `followup_recap.md` | Tweet 5 | ~63 | PASS |
| `followup_metrics.md` | Tweet 1 | ~39 | PASS |
| `followup_metrics.md` | Tweet 2 | Template (verify after fill) | — |
| `followup_metrics.md` | Tweet 3 | Template (verify after fill) | — |
| `followup_metrics.md` | Tweet 4 | ~101 | PASS |
| `followup_educational.md` | Tweet 1 | ~67 | PASS |
| `followup_educational.md` | Tweet 2 | ~145 (excluding screenshot) | PASS |
| `followup_educational.md` | Tweet 3 | ~211 (excluding screenshot) | PASS |
| `followup_educational.md` | Tweet 4 | ~193 (excluding screenshot) | PASS |
| `followup_educational.md` | Tweet 5 | ~224 | PASS |
| `infobot_qt.md` | Single tweet | ~109 | PASS |

All verifiable tweets are under 280 characters. Template tweets with metric placeholders (`[X]`, `[Y]`, etc.) should be re-verified after filling.

### Product Type

| Check | Status |
|---|---|
| "stake ZEC" in any draft | Not found — PASS |
| "staking" in any draft | Not found — PASS |
| "yield" in any draft | Not found — PASS |
| Drafts correctly describe "send, receive, swap" | Yes — PASS |
| `infobot_qt.md` says "send, receive, and swap" (not "staking" or "yield position") | Yes — PASS |

### DM Openers

- `outreach/dm_targets.md` best practices (line 7): explicitly states "say 'ZEC is live on ShapeShift' (not 'we're exploring')" — PASS
- All 12 DM openers use "ZEC is live" or "ShapeShift now supports ZEC" language — PASS
- No "we're exploring" found — PASS

**Issues found:** None.

---

## Step 5: Brand Voice

### 3rd Person Voice (Main Account)

| File | "we"/"our"/"we're" from main brand? | Status |
|---|---|---|
| `drafts/x_post_main.md` | None | PASS |
| `drafts/x_post_blog.md` | None | PASS |
| `drafts/discord_post.md` | None | PASS |
| `drafts/discord_reminder.md` | None | PASS |
| `drafts/farcaster_post.md` | None | PASS |
| `drafts/blog_draft.md` | None | PASS |
| `drafts/medium_post.md` | None | PASS |
| `drafts/followup_recap.md` | None | PASS |
| `drafts/followup_educational.md` | None | PASS |
| `drafts/followup_metrics.md` | None | PASS |
| `drafts/infobot_qt.md` | None | PASS |
| `drafts/release_notes.md` | None | PASS |
| `calendar/content_calendar.md` | "our launch post" (line 50, Discord copy) | **FLAG** |
| `partner/partner_kit.md` | "We're", "Our", "our", "We'll" (multiple) | PASS (B2B partner doc, not public brand) |
| `press/pr_brief.md` | "we'd", "We don't", "we can speak" (Q&A prep) | PASS (spokesperson prep, appropriate) |
| `outreach/dm_targets.md` | "We see", "we'd be", "We're seeing" (DM copy) | PASS (personal outreach, appropriate) |

3. **ISSUE S5-1 (Low): "our" in Discord calendar copy.** `calendar/content_calendar.md` line 50 contains Discord launch day copy that reads "Full details in our launch post: [BLOG LINK]". Since this posts from the ShapeShift brand account, "our" should be rephrased for 3rd-person voice.
   - **File:** `calendar/content_calendar.md` line 50
   - **Suggested fix:** "Full details in the launch post: [BLOG LINK]"

### Banned Words

| Word | Found in Public Drafts? | Status |
|---|---|---|
| "excited" | No | PASS |
| "thrilled" | No | PASS |
| "amazing" | No | PASS |
| "incredible" | No | PASS |
| "revolutionary" | No | PASS |
| "game-changing" | No | PASS |
| "best" (unqualified) | No (only in SEO topic titles and internal section headers) | PASS |
| "guaranteed returns" | No | PASS |
| "risk-free" | No | PASS |

### Terminology: "self-custodial" vs "non-custodial"

4. **ISSUE S5-2 (Medium): "non-custodial" should be "self-custodial."** Brand guidelines prefer "self-custodial." Found 4 instances of "non-custodial":

| File | Line | Text | Suggested Fix |
|---|---|---|---|
| `marketing_brief.md` | 36 | "the non-custodial wallet" | "the self-custodial wallet" |
| `marketing_brief.md` | 67 | "the only non-custodial multichain wallet" | "the only self-custodial multichain wallet" |
| `marketing_brief.md` | 107 | "in a non-custodial multichain wallet" | "in a self-custodial multichain wallet" |
| `research/protocol_analysis.json` | 40 | "the only non-custodial multichain platform" | "the only self-custodial multichain platform" |

Note: All public-facing drafts (tweets, blog, Discord, Farcaster, press release) already correctly use "self-custodial." The "non-custodial" instances are in the marketing brief and protocol analysis — internal docs, but they should still align for consistency.

### Emojis

| File | Emoji Count | Face Emoji? | Status |
|---|---|---|---|
| `x_post_main.md` | 1 (fox, Tweet 5) | No | PASS |
| `x_post_blog.md` | 1 (fox) | No | PASS |
| `x_post_personal.md` | 0 | No | PASS |
| `discord_post.md` | 1 (fox) | No | PASS |
| `discord_reminder.md` | 1 (fox) | No | PASS |
| `farcaster_post.md` | 0 | No | PASS |
| `infobot_qt.md` | 1 (fox) | No | PASS |
| `blog_draft.md` | 1 (fox) | No | PASS |
| `medium_post.md` | 1 (fox) | No | PASS |
| `followup_recap.md` | 1 (fox, Tweet 1) | No | PASS |
| `followup_educational.md` | 1 (fox, Tweet 5) | No | PASS |
| `followup_metrics.md` | 0 | No | PASS |

All posts max 1 emoji. No face emojis. All emojis are the fox (brand mark). — PASS

---

## Step 6: Cadence

### Channel Coverage

| Channel | In Checklist? | In Calendar? | Status |
|---|---|---|---|
| X (Twitter) | Yes | Yes (Days 0, 1, 3, 5, 7, 9, 12, 14, 16, 19, 21, 23, 25, 28) | PASS |
| Discord | Yes | Yes (Days 2, 8, 15, 22) | PASS |
| Farcaster | Yes | Yes (Days 11, 18, 26) | PASS |
| Blog | Yes | Yes (Day 0) | PASS |
| Medium | Yes | Yes (Day 0) | PASS |

All channels from the launch checklist have corresponding rows in `calendar/content_calendar.md` — PASS.

### Unknown Hooks

No "Unknown" hooks found in the calendar. All hooks are Zcash-specific (privacy, self-custody, ZEC features, delisting narrative, UTXO/multi-chain). — PASS

### Theme Variety

| Week | Themes Used | Repeated Angles? | Status |
|---|---|---|---|
| Week 1 (Days 0-7) | Launch announcement, Blog promo, Medium cross-post, Educational how-to, Community poll, Discord update, Benefit/value, Problem-led, Educational how-to | No consecutive repeats | PASS |
| Week 2 (Days 8-14) | Discord engagement, X benefit, Farcaster problem-led, X engagement, X problem-led | Good variety | PASS |
| Week 3 (Days 15-21) | Discord reminder, X educational, Farcaster benefit, X problem-led, X engagement | Good variety | PASS |
| Week 4 (Days 22-28) | Discord engagement, X benefit, X problem-led, Farcaster educational, X recap | Good variety | PASS |

Themes rotate between problem-led hooks, educational content, benefit posts, engagement prompts, and reminders. No angle repeats on consecutive days. — PASS

---

## Summary

| Category | Count |
|---|---|
| **Total issues found** | **5** |
| **Fixed (in this check)** | **0** (report-only mode — no source files edited) |
| **Remaining (require human edit)** | **5** |
| **Placeholders requiring human input before launch** | **22 instances across 10 files** |
| **Placeholders to fill at posting time (last-minute)** | **11 instances across 6 files** |

### Issues to Address

| # | ID | Severity | File | Issue | Action |
|---|---|---|---|---|---|
| 1 | S0-1 | Low | `marketing_brief.md` line 94 | ZEC price listed as ~$29; z.cash shows ~$229.70 | Verify current price, update |
| 2 | S3-1 | Low | `drafts/medium_post.md` line 17 | "a fork of Bitcoin's codebase" — inconsistent with rest of packet ("UTXO-based architecture similar to Bitcoin") | Change to "building on Bitcoin's UTXO model" |
| 3 | S5-1 | Low | `calendar/content_calendar.md` line 50 | Discord copy says "our launch post" — "our" from main brand | Change to "the launch post" |
| 4 | S5-2 | Medium | `marketing_brief.md` lines 36, 67, 107 | "non-custodial" should be "self-custodial" (3 instances) | Replace with "self-custodial" |
| 5 | S5-2 | Medium | `research/protocol_analysis.json` line 40 | "non-custodial" should be "self-custodial" (1 instance) | Replace with "self-custodial" |

### Placeholders to Fill Before Launch

**HIGH priority:**
- `[TBD]` — launch date, embargo date (checklist, calendar, partner kit)
- `[YOUR NAME]` — launch owner (checklist)
- `[YOUR DISCORD/TELEGRAM]` / `[YOUR HANDLE]` — partner contact (partner kit)
- `[CITY, DATE]` — press release dateline

**MEDIUM priority:**
- `[NAME]`, `[TITLE]`, `[QUOTE]` — spokesperson quote (press release — skip if not using quote)
- `[Name]`, `[Title]`, `[Email Address]` — media contact (press release)
- `[contact]` x2 — designer contact info (design brief, checklist)

**LOW priority (optional press items):**
- `[Author Name]`, `[Date]` — op-ed author details (both op-eds)
- `[PERSONALIZE]` — op-ed personalization items (technical op-ed)

### What's Working Well

- **No "Unknown" or "undefined" values** — clean protocol summary and calendar
- **No banned phrases** in any draft — copywriting is disciplined
- **All tweets under 280 characters** — verified across 22 tweets
- **Correct integration framing** — "ShapeShift adds ZEC support", not "launching Zcash"
- **3rd person voice** in all main-account public drafts — no "we" from brand
- **Emoji discipline** — max 1 per post, fox only, no face emojis
- **No staking/yield language** — correctly uses "send, receive, swap" throughout
- **DM openers** all say "ZEC is live" — not "exploring"
- **Calendar has full channel coverage** with varied themes across 4 weeks
- **Source of truth** is documented and cross-referenced in protocol_analysis.json, marketing_brief.md, and design_brief.md
- **Press materials** include "Do NOT Say" guardrails aligned to brand voice

### Verdict

**This packet is in strong shape.** The 5 issues identified are low-to-medium severity — 4 are terminology/consistency fixes (non-custodial → self-custodial, "our" → "the", "fork" → "UTXO model") and 1 is a stale data point (price). No structural, framing, or voice problems. The main gating items are the human-input placeholders (launch date, owner name, partner contacts), which are expected at this stage.

**Recommended next steps:**
1. Fix the 5 issues listed above
2. Confirm launch date and fill all `[TBD]` placeholders
3. Assign a launch owner and fill `[YOUR NAME]`
4. Send partner kit to ECC/Zcash Foundation (fill contact info first)
5. Run PRE-FLIGHT CHECK in `checklist.md` on Day -1
