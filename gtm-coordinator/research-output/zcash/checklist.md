# Zcash Launch Checklist

**Generated:** 2026-02-12
**Launch date:** [TBD]
**Embargo date:** [TBD]
**Asset approval date:** [TBD]
**Scope lock date:** [TBD]
**Tier:** 1
**Type:** Integration (new chain/asset support)
**Owner:** [YOUR NAME]

---

# You Shipped Code. Now Tell People About It.

You merged a PR. A feature is live. This packet helps you announce it.

At ShapeShift, engineers own their launches. There's no marketing team.
Things don't blow up on their own. If you don't market it, no one will use it.

This isn't busywork. It's intentional storytelling for the tech you built.

---

## What Kind of Launch Is This?

**Your launch: TIER 1**

| Tier | What It Is | Time Required |
|------|------------|---------------|
| **0** | Small update, bug fix | 30 min |
| **1** | New feature, integration | 2-3 hours over 7 days |
| **2** | Major launch, press-worthy | 4-5 hours over 14 days |

---

## Is This Mandatory?

**Yes.** If you want people to use what you built.

The minimum is 30 minutes. You can do that.

---

## Can I Bail?

**No.** But you can hand off.

Message **Apotheosis** (Head of Engineering): "Need to hand off Zcash launch"

---

## Quick Paths

- **[I'M BUSY]** → Jump to "Minimum Viable Launch" below
- **[I'VE GOT TIME]** → Follow the full checklist
- **[I CAN'T DO THIS]** → Hand off to Apotheosis

---

# Operational Quick Start

## How to Post

| Platform | Access |
|----------|--------|
| **Blog (Strapi)** | cms.shapeshift.com - [Loom walkthrough by Fabio] |
| **Twitter/X** | @ShapeShift credentials in DAO 1Password |
| **Discord** | #announcements channel |

## Graphic Design Help

| Option | Contact |
|--------|---------|
| **Midjourney** | Use prompts in design/ai_prompts.txt |
| **Hoff** | [contact] |
| **Atlin** | [contact] |

## If Something Goes Wrong

- Tweet ratioed? → Don't delete. Respond or let it ride.
- Blog error? → Fix in Strapi, updates live.
- Major issue? → Ping Apotheosis

---

# PRE-LAUNCH PHASE

## Day -7 to -5: Partner Coordination — 30 min
- [ ] Send partner kit to Zcash / Electric Coin Company team (partner/partner_kit.md)
- [ ] Request feedback by Day -3
- [ ] Identify partner contact for launch day
- [ ] Reach out to Zcash community channels (forums, Discord, Twitter)

## Day -3: Feedback Integration — 20 min
- [ ] Review partner feedback (if received)
- [ ] Confirm launch timing with partner
- [ ] If no response: ping again, then proceed without

## Day -1: Final Review — 30 min
- [ ] Review blog draft (drafts/blog_draft.md)
- [ ] Review tweet thread (drafts/x_post_main.md)
- [ ] Review blog promo tweet (drafts/x_post_blog.md)
- [ ] Review personal tweet (drafts/x_post_personal.md)
- [ ] Review Discord announcement + reminder (drafts/discord_post.md, drafts/discord_reminder.md)
- [ ] Review Medium post (drafts/medium_post.md)
- [ ] Generate images if needed (design/ai_prompts.txt)
- [ ] Confirm partner is ready to QT
- [ ] Verify ZEC send/receive/swap is working on app.shapeshift.com

---

# LAUNCH PHASE

## Launch Day (Day 0) — 60 min

| Time | Task | File |
|------|------|------|
| 09:00 | Post main tweet thread (@ShapeShift) | drafts/x_post_main.md |
| 09:05 | QT from your personal account | drafts/x_post_personal.md |
| 09:10 | Post Discord announcement | drafts/discord_post.md |
| 09:20 | Publish blog to Strapi | drafts/blog_draft.md |
| 09:30 | Post blog promo tweet (add the Strapi link) | drafts/x_post_blog.md |
| 09:35 | Cross-post to Medium | drafts/medium_post.md |
| 09:12 | DM partner: "We're live!" | — |
| 09:40 | Confirm partner QT'd | — |
| 09:50 | Start sending DMs to Zcash community members / influencers | outreach/dm_targets.md |
| 10:15 | Cross-post to Farcaster | drafts/farcaster_post.md |
| 12:00 | Check replies, respond | — |
| 15:00 | QT @ShapeShiftInfoBot showing ZEC balance / swap | drafts/infobot_qt.md |

## Press (Optional, Tier 2-ish) — 20 min
- [ ] Skim press release (press/press_release.md) and fix anything inaccurate
- [ ] Skim PR brief (press/pr_brief.md) so you can answer questions
- [ ] Pick ONE op-ed angle and personalize it (press/op_ed_political.md or press/op_ed_technical.md)
- [ ] If sending pitches: include the press release + PR brief, and offer an interview

## Day 1 — 20 min
- [ ] Post educational thread (@ShapeShift) — drafts/followup_educational.md
- [ ] Reply to overnight comments
- [ ] DM anyone who engaged positively
- [ ] Engage with Zcash community responses

## Day 2-3 — 15 min
- [ ] QT user testimonials (if any)
- [ ] Share partner cross-posts
- [ ] Continue engaging with Zcash and privacy communities

## Day 4-6 — 10 min
- [ ] Post metrics thread if numbers look good — drafts/followup_metrics.md
- [ ] Continue engaging

## Day 7 — 30 min
- [ ] Post recap thread — drafts/followup_recap.md
- [ ] Collect metrics (see below)
- [ ] Run: `gtm metrics --launch zcash`

---

# ⚡ MINIMUM VIABLE LAUNCH (If You're Slammed)

**30 minutes total:**

- [ ] Post tweet thread from @ShapeShift — 5 min
- [ ] Post Discord announcement — 2 min
- [ ] QT from your personal account — 3 min

**That's it. You shipped.**

Everything else is bonus. A shipped launch beats a perfect plan.

---

# ✅ PRE-FLIGHT CHECK

Run through before launching:

**CONTENT READY**
- [ ] Fill placeholders before posting: [BLOG LINK] in x_post_blog.md (use Strapi URL after publish); [X THREAD LINK] in discord_reminder + calendar (use main thread URL after posting); [NAME], [TITLE], [QUOTE] in press_release.md if using quote
- [ ] Blog draft reviewed (blog_draft.md, medium_post.md)
- [ ] Tweet thread + blog promo tweet reviewed (x_post_main.md, x_post_blog.md)
- [ ] Discord post + reminder reviewed (discord_post.md, discord_reminder.md)
- [ ] All references say "Zcash" / "ZEC" (not placeholder protocol names)

**ACCESS VERIFIED**
- [ ] Can log into Strapi
- [ ] Can access @ShapeShift Twitter

**PARTNER STATUS**
- [ ] Zcash / ECC team contacted
- [ ] Partner confirmed (or launching without)

**PRODUCT VERIFIED**
- [ ] ZEC send works on app.shapeshift.com
- [ ] ZEC receive works (transparent t-address generated)
- [ ] ZEC swap works (e.g., BTC→ZEC)
- [ ] CTA link confirmed: app.shapeshift.com

**READY TO LAUNCH?**
- [ ] YES → Execute checklist
- [ ] NOT YET → Fix it or go minimal

---

# 📊 METRICS (Day 7)

| Metric | Target (Tier 1) | Actual |
|--------|----------------------|--------|
| Twitter Profile Visits | >500 | _____ |
| Tweet Engagements | >200 | _____ |
| Website Traffic | +10% | _____ |
| ZEC Wallet Activations | — | _____ |
| ZEC Swap Volume | — | _____ |
| Onchain Txs (ZEC) | >100 | _____ |

**SUCCESS:** Hit targets + positive response
**OKAY:** Close to targets
**REVIEW:** Missed targets → log learnings

---

# 📚 GLOSSARY

| Term | Meaning |
|------|---------|
| GTM | Go-To-Market — announcing/marketing a feature |
| QT | Quote Tweet — retweet with your comment |
| KOL | Key Opinion Leader — influencer |
| Engagement | Likes, RTs, replies |
| Profile Visits | Clicks to your profile (conversion metric) |
| ZEC | Zcash — privacy-protecting digital currency |
| UTXO | Unspent Transaction Output — how Zcash and Bitcoin track balances |
| t-address | Transparent Zcash address (like a Bitcoin address, visible on-chain) |
| z-address | Shielded Zcash address (encrypted, private — not yet supported in ShapeShift) |
| zk-SNARKs | Zero-knowledge proofs used by Zcash for transaction privacy |
| ECC | Electric Coin Company — creators and maintainers of Zcash |

---

**Questions?** Ping Apotheosis on Discord.
