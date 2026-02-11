# Yield.xyz GTM Gap Analysis

**Based on:** discovery_answers_2026-02-19.md  
**Date:** 2026-02-19

---

## Timeline Gaps

| Item | Discovery Answer | Existing Materials | Gap |
|------|------------------|--------------------|-----|
| Launch date | 2026-02-19 | Feb 10, 2026 | All materials reference Feb 10; need update to Feb 19 |
| Embargo | 2026-02-19 | Thu Feb 5 | Embargo = launch day in answers; typically embargo precedes launch |
| Asset approval | 2026-02-18 | Feb 5 | Dates align to new launch (T-1) |
| Scope lock | 2026-02-18 | Feb 2 | Dates align |

**Open question:** Is embargo same-day as launch intentional, or should embargo be earlier (e.g. Feb 18)?

---

## CTA and Conversion Gaps

| Item | Discovery Answer | Existing Materials | Gap |
|------|------------------|--------------------|-----|
| CTA URL | app.shapeshift.com/#/yields | app.shapeshift.com (generic) | All drafts, partner kit, and index need CTA updated to `#/yields` |
| Conversion event | position opened | Not explicitly defined | Good to add to marketing brief and success metrics |

---

## Protocol Roster Gaps

**Discovery answer protocol roster by chain is incomplete:**

| Chain | Discovery Answer | Gap |
|-------|------------------|-----|
| BSC | 4 (count only) | No protocol names (Venus? others?) |
| Avalanche | 2 | No protocol names |
| Gnosis | 1 | No protocol name |
| Cosmos | 1 | No protocol name |
| Sui | 2 | No protocol names |
| Monad | 3 | No protocol names |
| Tron | 1 | No protocol name |
| Hyperevm | 1 | No protocol name |
| NEAR | 1 | No protocol name |
| Plasma | 1 | No protocol name |
| Katana | 1 | No protocol name |

**Existing packet had:** Tron (StakeKit), Katana (Morpho), Solana (Kamino + Drift), Plasma (Fluid). Discovery shifts EVM focus to Lido, Aave, Morpho but leaves many chains without named protocols.

**Action needed:** Either fill in protocol names for all chains from a source of truth, or accept "X protocols" messaging for chains without specifics.

---

## Co-Marketing Gaps

| Item | Discovery Answer | Existing Materials | Gap |
|------|------------------|--------------------|-----|
| Co-marketing protocols | Kamino, Morpho, Katana (?) | Lido, Kamino, Drift, Figment, StakeKit, Morpho, Fluid | Katana marked with (?) — confirm inclusion. Lido, Fluid, Aave not listed as co-marketing despite being lead protocols |
| Lead protocols | Lido, Kamino, Morpho, Fluid, Aave | Lido, Kamino, Drift, Figment, Compound, StakeKit, Morpho, Fluid | Aave added; Drift, Figment, StakeKit dropped; Compound dropped from lead |

---

## Messaging and Positioning Gaps

| Item | Discovery Answer | Existing Materials | Gap |
|------|------------------|--------------------|-----|
| Differentiation | "More breadth of support, native asset staking for many networks coming online at ShapeShift" | Generic "comprehensive integration" | New differentiation is specific — should be added to marketing brief, PR brief, and key messages |
| Primary audience | yield seekers | DeFi power users + yield seekers | Narrower; aligns with existing |
| Lead value prop | earn | "Earn on assets you have" | Aligns |

---

## Materials Requiring Updates (Post-Save)

1. **marketing_brief.md** — Launch date, CTA, protocol roster, featured chains, co-marketing roster, differentiation
2. **partner/partner_kit.md** — Launch date, protocol roster, co-marketing list, CTA
3. **checklist.md** — Timeline dates (if checklist embeds them)
4. **Drafts** (x_post_main, discord_post, blog_draft, etc.) — CTA URL, protocol/chains called out
5. **press/pr_brief.md, press_release.md** — Launch date, embargo, CTA, differentiation

---

## Summary: Priority Gaps to Resolve

1. **Protocol names by chain** — Fill in BSC, Avalanche, Gnosis, Cosmos, Sui, Monad, Tron, Hyperevm, NEAR, Plasma, Katana with actual protocol names, or decide to use count-only messaging. **Use:** [gap_resolution_prompts.md](gap_resolution_prompts.md) — ask ShapeShift repo.
2. **Katana co-marketing** — Confirm whether Katana is in or out (remove the ?).
3. **Embargo timing** — Confirm if embargo = launch day or should be earlier.
4. **Materials refresh** — After saving answers, update all GTM materials with new dates, CTA, roster, and differentiation copy.
