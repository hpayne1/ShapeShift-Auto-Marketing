# GTM Review: rFOX Marketing vs. Product (Source of Truth)

**Reviewer:** GTM expert review  
**Source of truth:** [ShapeShift rFOX Wiki (GitHub)](https://github.com/shapeshift/rFOX/wiki/rFOX) — canonical product description.  
**Date:** 2026-02-11

---

## Executive summary

The rFOX GTM packet is **aligned with the product** on the main mechanics: **stake FOX, earn USDC**; rewards **off-chain by DAO multisig**; **monthly** epochs. The [rFOX Wiki](https://github.com/shapeshift/rFOX/wiki/rFOX) confirms USDC distribution (as of February 2026 per SCP-186), off-chain distribution to staker wallets, and epoch-based rewards—so there should be **no RUNE or THORChain** in rFOX messaging. The feedback below focuses on **gaps and improvements** when the Wiki is the source of truth: missing Arbitrum, specific payout date (15th), 28-day cooldown, revenue source (affiliate fees), and verification/transparency.

---

## What the Wiki says (source of truth)

- **Mechanism:** Novel staking ratified by FOX holders (SCP-166); SCP-186 expanded scope and **moved to USDC distribution in February 2026**. Single-sided FOX staking (and previously WETH<>FOX LP, sunset Jan 2026). Stakers lock staking token in contract.
- **Rewards:** Stakers receive a **percentage of the ShapeShift DAO’s total revenue** from **affiliate fees** each epoch. **Distribution is off-chain by the DAO multisig, as USDC to the staker’s wallet** (not part of the rFOX contract). Contract tracks staked balances and reward units; multiplier translates to USDC for off-chain distribution.
- **When:** **15th of each month** for the preceding month (or next business day if 15th is weekend/holiday). Rewards sent directly to the staking address; no claim step.
- **Epochs:** Calendar months from July 1st 2024; each epoch is the full month (midnight UTC).
- **Unstake:** Users can unstake any amount anytime; they stop earning and enter a **28-day cool-down** (configurable) before claiming back staking token. Multiple concurrent unstakes supported.
- **Chain:** FOX must be **bridged to Arbitrum** before staking; mainnet FOX cannot be staked. Bridging back to mainnet via native bridge takes 7 days.
- **Governance:** DAO intends to enable a snapshot strategy so staked FOX can vote.
- **Verification:** End of each epoch, public accounting posted to IPFS and linked on the forum; open source CLI in repo for community to validate.

---

## 1. Add Arbitrum and bridging

**What the packet says:**  
Little or no mention that staking is **on Arbitrum** or that mainnet FOX must be bridged.

**Wiki:**  
“FOX needs to be bridged to Arbitrum prior to staking. This can be done in the ShapeShift UI. Please note that bridging FOX back to mainnet from Arbitrum through the native bridge takes 7 days.”

**Recommendation:**  
- Add to key messages / “How to get started”: “Stake FOX on **Arbitrum**—bridge FOX in the ShapeShift UI if you’re on mainnet.”
- In blog, SEO, and partner kit: one line on “bridge FOX to Arbitrum in the ShapeShift UI, then stake.”
- Avoid implying mainnet FOX can be staked directly.

**Files to update:**  
`marketing_brief.md`, `blog_draft.md`, `medium_post.md`, `seo_article_01.md`, `partner_kit.md`, “Getting started” in drafts.

---

## 2. Be specific about payout date (15th of the month)

**What the packet says:**  
“Rewards paid to your wallet every month” / “monthly” (no date).

**Wiki:**  
“Distributions of rewards will occur on the **15th of each month** for the preceding month. If the 15th falls on a weekend or holiday, the distribution will be completed the following business day.”

**Recommendation:**  
- Where you mention cadence, add: “Rewards are sent to your wallet on the **15th of each month** for the previous month.”
- Use in FAQ-style content (blog, SEO, Discord) to set clear expectations.

**Files to update:**  
`marketing_brief.md`, `seo_article_01.md`, `blog_draft.md`, `discord_post.md`, `content_calendar.md` (if you reference “when” rewards land).

---

## 3. Add 28-day cooldown on unstake

**What the packet says:**  
“Unstake anytime” / “flexibility” without mentioning the lock after unstaking.

**Wiki:**  
When a user unstakes, they “immediately stop earning rewards and enter into a cool-down period. Initially this is set at **28 days**… After the cool down period has ended, the user is able to claim back their stakingToken.”

**Recommendation:**  
- Add one clear line: “When you unstake, you stop earning and enter a **28-day cooldown** before you can claim your FOX back.”
- Keeps “unstake anytime” accurate (you can *initiate* unstake anytime) while setting expectations.

**Files to update:**  
`seo_article_01.md` (you already have epoch/cooldown; align wording to “28 days”), `blog_draft.md`, `medium_post.md`, FAQ or “How it works” sections.

---

## 4. Clarify revenue source (affiliate fees)

**What the packet says:**  
“Revenue share” / “DAO’s total revenue” in some places; elsewhere just “earn USDC.”

**Wiki:**  
“Stakers receive a percentage of the Shapeshift DAO’s total revenue that is accumulated through **affiliate fees** during each epoch.”

**Recommendation:**  
- In longer copy (blog, SEO, partner kit), add: “Rewards come from a share of the DAO’s revenue from **affiliate fees** each month.”
- Differentiates from “protocol fees” or “trading fees” and matches the Wiki.

**Files to update:**  
`marketing_brief.md` (value prop / protocol summary), `blog_draft.md`, `seo_article_01.md`, `partner_kit.md`.

---

## 5. Add verification and transparency (IPFS + CLI)

**What the packet says:**  
Nothing about how rewards are verified.

**Wiki:**  
“At the end of each epoch, we will post a public record of the accounting to **IPFS** and link it on the **forum** for the community to validate before rewards are sent out. Users can verify these amounts by running the **open source CLI tool** included in this repo.”

**Recommendation:**  
- Add a short “Transparency” or “Verify your rewards” line: “Accounting is published to IPFS and the forum each epoch; you can verify with the open source CLI in the [rFOX repo](https://github.com/shapeshift/rFOX).”
- Strong trust signal for power users and fits “no custody” messaging.

**Files to update:**  
`seo_article_01.md`, `blog_draft.md`, `partner_kit.md`, optional FAQ in Discord or support docs.

---

## 6. Optional: Governance (voting with staked FOX)

**Wiki:**  
“The DAO intends to enable a snapshot strategy for the smart contract to enable **voting power** for users who stake their FOX.”

**Recommendation:**  
- If you want a “keep your voice” angle: “Staked FOX may be used for governance (snapshot strategy intended).”
- Only add if the DAO has confirmed this is part of the story.

---

## 7. Op-eds: Keep product-agnostic, fix technical op-ed

**Technical op-ed (`op_ed_technical.md`):**  
- Still overstates rFOX as “blockchain-based ecosystem” with “unique consensus mechanism” and “advanced cryptographic algorithms.” rFOX is a staking program on Arbitrum with off-chain USDC distribution, not its own chain.

**Recommendation:**  
- Rewrite “How rFOX Works” to match the Wiki: FOX staked on Arbitrum → reward units tracked in contract → DAO distributes USDC off-chain each month (15th); 28-day cooldown on unstake.
- Remove claims about consensus, scalability, and throughput for rFOX itself.

**Political op-ed (`op_ed_political.md`):**  
- Generic self-custody/financial sovereignty is fine. Add one accurate line, e.g.: “rFOX lets users stake FOX on Arbitrum and earn a share of DAO revenue in USDC, without handing over custody.”

---

## 8. SEO article: Already aligned; add Wiki details

**`seo_article_01.md`:**  
- Already has USDC, monthly, off-chain DAO multisig, and epoch/cooldown. Good.

**Recommendation:**  
- Align cooldown to “28 days” and add “15th of each month” for distribution.
- Add one sentence on revenue source (affiliate fees) and one on verification (IPFS + forum + CLI).

---

## 9. Wild cards: rFOX “price” and “trading volume”

**`intelligence/wild_cards.md`:**  
- “Price of rFOX” and “trading volume of rFOX” are misleading. In the Wiki, rFOX is a staking mechanism; stakers lock tokens and receive USDC. There is no separate “rFOX” tradeable ticker.

**Recommendation:**  
- Reframe prediction/competition ideas around “FOX staked in rFOX” or “USDC rewards from rFOX,” not “price of rFOX” or “trading volume of rFOX.”

---

## 10. Placeholders and links

- **Press / PR:** Fill [CITY, DATE], [NAME], [TITLE], [Your Name], [Email], [Phone], [established/audited], [ShapeShift Website].
- **Op-eds:** Fill [Your Name], [Your Title/Position], [Organization], [PERSONAL EXPERIENCE], [EXAMPLE].
- **Discord:** Replace [LINK] with real CTA (e.g. `https://app.shapeshift.com/#/fox-ecosystem`).
- **Content calendar:** Replace [BLOG LINK], [X THREAD LINK] before use.

**Recommendation:**  
- Final pass for all `[PLACEHOLDER]` and `[UPPERCASE]` before launch.

---

## 11. Design and AI prompts

**`design_brief.md` and `ai_prompts.txt`:**  
- Current line “stake FOX, earn USDC—rewards in your wallet every month” is **correct** per the Wiki.

**Recommendation:**  
- Optionally add “on the 15th” or “on Arbitrum” if you want the key message to be more precise (e.g. “Stake FOX on Arbitrum, earn USDC—rewards in your wallet on the 15th of each month”).

---

## Summary: Packet vs Wiki (source of truth)

| Topic            | Packet says                 | Wiki (source of truth)                                      |
|------------------|-----------------------------|-------------------------------------------------------------|
| Reward asset     | USDC                        | **USDC** ✓                                                  |
| Cadence          | Every month                 | **Monthly** (epoch = calendar month) ✓                      |
| Payout date      | Not specified               | **15th of each month** (preceding month); add to copy      |
| Distribution     | Off-chain DAO multisig      | **Off-chain by DAO multisig** ✓                              |
| Revenue source   | “Revenue share” (vague)     | **Affiliate fees**; add to long-form copy                   |
| Chain            | Unstated                    | **Arbitrum** (bridge FOX first); add to copy               |
| Unstake / lock   | “Unstake anytime”           | **28-day cooldown** before claim; add to copy               |
| Verification     | Not mentioned               | **IPFS + forum + open source CLI**; add for trust           |
| RUNE / THORChain | Not in packet               | **Not in Wiki** — keep out of rFOX messaging ✓             |

---

## Next steps

1. **Add to key messages / “How to get started”:** Arbitrum, bridge FOX in ShapeShift UI, 15th of the month, 28-day cooldown.
2. **Add to long-form (blog, SEO, partner):** Affiliate-fee revenue source; verification (IPFS, forum, CLI).
3. **Fix technical op-ed** so “How rFOX Works” matches the Wiki (no RUNE/THORChain; no consensus/throughput claims).
4. **Reframe wild cards** away from “price of rFOX” and “trading volume of rFOX.”
5. **Fill all placeholders** and do a final pass before launch.
6. **Keep using the [rFOX Wiki](https://github.com/shapeshift/rFOX/wiki/rFOX)** as the single source of truth for product mechanics—nothing about RUNE or THORChain in rFOX.
