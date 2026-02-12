# Zcash GTM Gap Report

**Based on:** packet at gtm-coordinator/research-output/zcash
**Date:** 2026-02-12

---

## Timeline Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Launch date | `[TBD]` (checklist.md, partner_kit.md, content_calendar.md) | Specific date (e.g. 2026-03-05) | **Ask product person** — all content scheduling depends on this |
| Embargo date | `[TBD]` (checklist.md) | Date or "None" | **Ask product person** — needed for press coordination |
| Asset approval date | `[TBD]` (checklist.md) | Date or "N/A" | **Ask product person** — when was ZEC integration approved? |
| Scope lock date | `[TBD]` (checklist.md) | Date or "N/A" | **Ask product person** — when is feature scope finalized? |
| Checklist owner | `[YOUR NAME]` (checklist.md) | Actual name/handle | **Ask product person** — who owns this launch? |
| Partner kit launch date | `[TBD]` (partner_kit.md line 5) | Same as launch date | Will auto-fill once launch date is set |
| Content calendar launch date | `[TBD]` (content_calendar.md line 3) | Same as launch date | Will auto-fill once launch date is set |
| Press release date | `[CITY, DATE]` (press_release.md line 7) | City + launch date | Will auto-fill once launch date is set |
| Timeline consistency | All TBD — consistent in being unset | All dates matching across files | OK once launch date is set — run merger to propagate |

---

## CTA and Conversion Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| CTA URL | `app.shapeshift.com` | Confirmed URL | **OK** — consistent across all 13 drafts, calendar, partner kit, and checklist |
| Conversion event | "ZEC wallet activations and first swaps into ZEC" (marketing_brief.md) | Specific metric definition (e.g. "first ZEC receive or first swap into ZEC within 7 days of launch") | **Ask product person** — current definition is directional, not measurable |
| Blog link placeholder | `[BLOG LINK]` (x_post_blog.md, content_calendar.md) | Strapi URL after publish | **Expected** — fill at launch time, not a gap |
| X thread link placeholder | `[X THREAD LINK]` (discord_reminder.md, content_calendar.md) | Main thread URL after posting | **Expected** — fill at launch time, not a gap |

---

## Protocol / Asset Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Asset name | ZEC | ZEC | **OK** — consistent across all files |
| Chain name | Zcash | Zcash | **OK** — consistent across all files |
| Chain type | UTXO-based (like Bitcoin) | UTXO | **OK** — consistent |
| Address type supported | Transparent t-addresses | Transparent t-addresses | **OK** — correctly noted in all drafts, blog, partner kit, and PR brief |
| Shielded support caveat | "Not supported at this time" / "future opportunity" | Clear caveat | **OK** — consistently noted as not supported |
| Protocol name consistency | "Zcash" / "ZEC" throughout | No placeholder protocol names | **OK** — no stale placeholders found |
| Campaign type | "Integration (new chain/asset support)" (checklist.md) | Integration | **OK** — correctly categorized |

---

## Messaging Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Primary audience | "Privacy-conscious crypto users" + 3 sub-segments (marketing_brief.md, protocol_analysis.json) | Defined audience | **OK** — well-defined and consistent |
| Lead value prop | "Send, receive, and swap ZEC on ShapeShift" | One-liner value prop | **OK** — consistent across all files |
| Differentiation | No KYC, no custody, multichain, UTXO management, DAO-governed (marketing_brief.md) | Clear differentiators | **OK** — consistent and well-articulated |
| Key message / one-liner | "ShapeShift now supports Zcash — send, receive, and swap ZEC alongside BTC, ETH, and 100+ assets in one self-custody wallet, no exchange account needed." (marketing_brief.md) | One-liner | **OK** — present and used consistently |
| Positioning statement | Present in marketing_brief.md | Clear positioning | **OK** |
| Tweet-ready copy | Present in marketing_brief.md and pr_brief.md | Consistent tweet copy | **OK** — matches across both files |
| "Available now" phrasing | press_release.md and pr_brief.md say "Available now at app.shapeshift.com" | Should say "Available [launch date]" or be updated at launch | **Minor** — update press materials when launch date is set |

---

## Co-Marketing Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Co-marketing partners | References to "Zcash / Electric Coin Company / Zcash Foundation" but no confirmed contact | Confirmed partner contact(s) with names | **Ask product person** — who is the contact at ECC/Zcash Foundation? |
| Partner contact info | `[YOUR DISCORD/TELEGRAM]` (partner_kit.md) | Actual handle | **Ask product person** — who should partner reach out to? |
| Partner confirmation status | Unknown — checklist mentions contacting but no confirmation | "Confirmed" or "Proceeding without" | **Ask product person** — has ECC/Foundation been contacted? |
| Wallet partner criteria | Not defined anywhere | Criteria for wallet partnerships (if applicable) | **Ask product person** — or mark N/A for single-asset integration |
| Twitter Space / co-event | Listed as "optional" in partner_kit.md | Confirmed or declined | **Ask product person** — is a joint Twitter Space planned? |

---

## Press / PR Gaps

| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Quote in press release | `[NAME], [TITLE], [QUOTE]` (press_release.md line 15) | Actual quote from ShapeShift or Zcash representative | **Ask product person** — who provides the quote? |
| Media contact name | `[Name]` (press_release.md line 47) | Actual name | **Ask product person** |
| Media contact title | `[Title]` (press_release.md line 48) | Actual title | **Ask product person** |
| Media contact email | `[Email Address]` (press_release.md line 50) | Actual email | **Ask product person** |
| Press release city | `[CITY, DATE]` (press_release.md line 7) | City (or "Decentralized" / DAO convention) | **Ask product person** — what city/dateline convention does ShapeShift use? |
| Design contact (Hoff) | `[contact]` (checklist.md) | Actual contact info | **Ask product person** |
| Design contact (Atlin) | `[contact]` (checklist.md) | Actual contact info | **Ask product person** |

---

## Materials Requiring Updates (Post-Questionnaire)

Once the questionnaire is filled, the following files need updates via the **gtm-questionnaire-merger**:

1. **checklist.md** — Launch date, embargo date, asset approval date, scope lock date, owner name, design contacts (Hoff, Atlin)
2. **partner/partner_kit.md** — Launch date, partner contact info (Discord/Telegram handle)
3. **press/press_release.md** — Launch date, city/dateline, quote (name, title, quote text), media contact (name, title, email)
4. **calendar/content_calendar.md** — Launch date (shifts all Day N references to real dates)
5. **marketing_brief.md** — Conversion event definition (refine from directional to measurable)
6. **press/pr_brief.md** — Update "Available now" to reflect launch timing (if launching in future)
7. **drafts/x_post_blog.md** — `[BLOG LINK]` placeholder (fill at publish time)
8. **drafts/discord_reminder.md** — `[X THREAD LINK]` placeholder (fill at post time)

---

## Summary

| Category | Status | Gaps |
|----------|--------|------|
| Timeline | **RED** — All dates TBD | 4 dates missing, owner missing |
| CTA / Conversion | **YELLOW** — CTA OK, conversion event vague | 1 gap (conversion event definition) |
| Protocol / Asset | **GREEN** — All consistent | 0 gaps |
| Messaging | **GREEN** — Well-defined and consistent | 0 gaps |
| Co-Marketing | **RED** — No confirmed contacts | 3-4 gaps (partner contact, confirmation, wallet criteria) |
| Press / PR | **RED** — Multiple placeholders | 6 placeholders (quote, contact info, city) |

**Next step:** Generate discovery questionnaire → send to product person → run questionnaire merger on responses.
