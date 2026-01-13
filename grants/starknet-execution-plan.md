# Starknet GTM Execution Plan
## How the Auto-Marketing Platform Delivers

This document details how ShapeShift's auto-marketing infrastructure will execute the Starknet GTM campaign.

---

## Campaign Architecture

We'll run **8 distinct GTM initiatives** over 6 months, each managed as a separate plan in the GTM Coordinator:

| ID | Initiative | Tier | Risk | Est. Content Pieces |
|----|------------|------|------|---------------------|
| STRK-AGENT-001 | Agent.ShapeShift Starknet Launch | 2 | Medium | 25+ |
| STRK-AGENT-002 | "Trade Starknet via AI" Tutorial Series | 1 | Low | 15+ |
| STRK-AGENT-003 | Starknet Trading Competition | 2 | Medium | 20+ |
| STRK-WALLET-001 | App.ShapeShift Starknet Chain Support | 2 | Medium | 25+ |
| STRK-WALLET-002 | Starknet DeFi Features (Staking/LP) | 2 | Medium | 20+ |
| STRK-ECO-001 | Starknet Ecosystem Spotlight Series | 1 | Low | 15+ |
| STRK-PARTNER-001 | Co-Marketing with Starknet Projects | 1 | Low | 10+ |
| STRK-SUSTAIN-001 | Ongoing Starknet Content | 1 | Low | 20+ |

**Total: 150+ content pieces** across all channels

---

## Worker Agent Architecture

The $15K platform development budget funds these worker agents:

### 1. Content Writer Agent 🤖
**Input:** GTM Plan YAML + Feature Brief + Brand Voice Guide  
**Output:** Draft content for all enabled channels

```
Capabilities:
├── X Post Generation (280 char, thread variants)
├── Discord Announcement Formatting
├── Farcaster Cast Composition
├── Blog Draft Generation (outline → full draft)
├── Partner Brief Creation
└── Release Notes Compilation
```

**Cost Estimate:** $6,000 (development + LLM API credits)

### 2. Publisher Agent 🚀
**Input:** Approved content from GTM Coordinator  
**Output:** Published posts to social channels

```
Capabilities:
├── X API Integration (post, thread, schedule)
├── Discord Webhook Publishing
├── Farcaster Hub Publishing
├── Blog CMS Integration
└── Status Update (writes published_url back to YAML)
```

**Cost Estimate:** $5,000 (development + API integrations)

### 3. Analytics Agent 📊
**Input:** Published URLs + UTM parameters  
**Output:** Performance reports, optimization recommendations

```
Capabilities:
├── X Analytics Pull
├── UTM Click Tracking
├── On-chain Attribution (Starknet swaps)
├── Weekly Report Generation
└── Underperforming Content Flagging
```

**Cost Estimate:** $4,000 (development + analytics APIs)

---

## Execution Flow (Per Initiative)

### Phase 1: Initialization
```bash
# Marketing lead creates the GTM plan
gtm init --id STRK-AGENT-001 \
  --title "Agent.ShapeShift Starknet Integration Launch" \
  --tier 2 \
  --risk medium \
  --release "2026-02-01"
```

### Phase 2: Enrichment
```bash
# Add inputs that inform content generation
gtm enrich --id STRK-AGENT-001 \
  --pr "https://github.com/shapeshift/agent/pull/123" \
  --canonical-url "https://agent.shapeshift.com/starknet" \
  --feature-brief "./briefs/starknet-agent.md"
```

### Phase 3: Content Generation (AI Worker)
```bash
# Content Writer Agent reads the plan and generates drafts
worker-content generate --plan .gtm/STRK-AGENT-001/plan.yaml

# Creates:
# .gtm/STRK-AGENT-001/drafts/
#   ├── x_post.md
#   ├── x_thread.md  
#   ├── discord_post.md
#   ├── farcaster_post.md
#   ├── blog_draft.md
#   └── partner_brief.md
```

### Phase 4: Human Review
```bash
# Generate review packet for marketing lead
gtm packet --id STRK-AGENT-001

# Marketing lead reviews drafts, makes edits
# Then approves:
gtm marketing-approve --id STRK-AGENT-001 --reviewer "@harper"
```

### Phase 5: Publishing (AI Worker)
```bash
# Publisher Agent reads approved content and publishes
worker-publish execute --plan .gtm/STRK-AGENT-001/plan.yaml

# Updates plan with published URLs:
# channels.x.published_url: "https://x.com/ShapeShift/status/..."
# channels.discord.published_url: "https://discord.com/channels/..."
```

### Phase 6: Performance Tracking
```bash
# Analytics Agent pulls metrics and generates reports
worker-analytics report --plan .gtm/STRK-AGENT-001/plan.yaml

# Creates:
# .gtm/STRK-AGENT-001/reports/
#   ├── week-1-performance.md
#   ├── week-2-performance.md
#   └── ...
```

---

## Human Oversight Model

### What Humans Do (10 hrs/week @ $12K/6mo = ~$46/hr)

| Task | Hours/Week | Description |
|------|------------|-------------|
| Content Review | 4 hrs | Review AI drafts, edit for voice/accuracy |
| Approval Gates | 2 hrs | Run `gtm marketing-approve` for each initiative |
| Strategy Adjustments | 2 hrs | Analyze reports, adjust messaging/targeting |
| Escalations | 2 hrs | Handle edge cases, partner communications |

### What AI Does (Automated)

| Task | Trigger | Output |
|------|---------|--------|
| Draft Generation | Plan created/enriched | Drafts for all channels |
| Publishing | Approval granted | Live posts |
| UTM Link Generation | Content approved | Tracked URLs |
| Performance Reporting | Weekly cron | Metrics summary |
| Status Updates | Any state change | Updated YAML + history |

### Approval Gates (Enforced)

```
TIER 2 REQUIREMENTS (Major launches):
✓ Canonical URL set
✓ Dashboard URL configured  
✓ Blog draft approved
✓ Hero asset uploaded
✓ Partner brief created

MEDIUM RISK REQUIREMENTS:
✓ 1 marketing approval
✓ QA signal not red

Cannot publish until ALL gates pass.
```

---

## Paid Amplification Strategy ($15K)

### Allocation by Initiative

| Initiative | Paid Budget | Strategy |
|------------|-------------|----------|
| STRK-AGENT-001 (Launch) | $4,000 | Launch day X ads, promoted posts |
| STRK-AGENT-003 (Competition) | $3,000 | Contest promotion, influencer posts |
| STRK-WALLET-001 (Launch) | $4,000 | Launch day X ads, promoted posts |
| STRK-ECO-001 (Ecosystem) | $2,000 | Sponsored co-marketing |
| Reserve/Optimization | $2,000 | Reallocate to top performers |

### Paid Execution Process

1. **AI generates ad variants** from approved organic content
2. **Human selects** best 3-5 variants for each campaign
3. **Set budget caps** per campaign in X Ads Manager
4. **Analytics Agent tracks** paid vs organic attribution
5. **Weekly optimization** based on CPA performance

---

## Content Calendar (Month 1-2 Detail)

### Week 1-2: Agent.ShapeShift Starknet Launch
```
Mon:  Teaser post (X) - "Something's cooking with @Starknet..."
Tue:  Discord community heads-up
Wed:  LAUNCH DAY - Full announcement blast (X thread, Discord, Farcaster)
Thu:  Blog post goes live, partner co-posts
Fri:  Demo video / Loom walkthrough
Sat:  Weekend engagement post
Sun:  Recap + "try it yourself" CTA
```

### Week 3-4: Education Phase
```
Mon:  Tutorial #1: "Swap $ETH to $STRK via AI Agent"
Wed:  Tutorial #2: "Check Starknet portfolio with natural language"
Fri:  Tutorial #3: "DeFi yields on Starknet, explained by AI"
```

### Week 5-8: Activation
```
Trading competition launch → daily leaderboard updates → winner announcements
```

---

## Reporting to Starknet

### Weekly Report (Automated by Analytics Agent)

```markdown
# Starknet GTM Weekly Report - Week N

## Content Published
- X Posts: 12 (8 organic, 4 promoted)
- Discord: 5 announcements
- Blog: 1 tutorial

## Performance
- Impressions: 150,000
- Engagements: 12,000 (8% rate)
- Clicks to Starknet actions: 2,500
- UTM-tracked conversions: 180 swaps

## Spend
- Paid: $1,200 / $15,000 budget
- CPA: $6.67

## Top Performing Content
1. "Your AI agent now speaks Starknet" - 45K impressions
2. Tutorial thread on swapping - 2.1K clicks

## Next Week Focus
- Education content push
- Influencer outreach
```

### Monthly Report (Human-Curated)

- Full attribution analysis
- A/B test results
- Strategic recommendations
- Budget reallocation proposals

### Final Report

- Complete campaign retrospective
- ROI analysis
- Lessons learned
- Recommendations for future Starknet campaigns

---

## Risk Contingencies

### If AI Content Quality Suffers
- Increase human review time (draw from reserve budget)
- Narrow content types to those AI handles well
- More templated/structured content vs creative

### If Platform Development Delays
- Core GTM Coordinator is already functional
- Workers can be simplified (semi-manual publishing)
- Prioritize Content Writer Agent > others

### If Paid Underperforms
- Reallocate to organic content volume
- Invest more in community/partner co-marketing
- Fund additional development instead

### If Starknet Integration Delays
- Adjust campaign timing to match ship dates
- Create "coming soon" / anticipation content
- Focus on education content that doesn't require live features

---

## Success Criteria (Go/No-Go for Future)

At 6 months, we evaluate:

| Metric | Success Threshold | Stretch Goal |
|--------|-------------------|--------------|
| Content Pieces | 100+ | 200+ |
| Total Impressions | 3M+ | 10M+ |
| Clicks to Starknet | 30K+ | 100K+ |
| On-chain Conversions | 5K+ | 20K+ |
| Cost per Conversion | <$10 | <$3 |
| Human Hours/Content Piece | <0.5 hr | <0.25 hr |

**If successful:** Model becomes template for all ShapeShift ecosystem GTMs.

---

## Appendix: Sample Generated Content

### X Post (AI-Generated Draft)
```
🚀 Your AI agent now speaks Starknet

Ask @ShapeShiftAgent to:
→ Swap $ETH to $STRK  
→ Check Starknet DeFi yields
→ Explain gas on L2 vs L1

No wallet switching. No manual bridging. Just ask.

Try it: agent.shapeshift.com

🧵 Thread below on what's possible...
```

### Discord Announcement (AI-Generated Draft)
```
📣 **Starknet Integration is LIVE on Agent.ShapeShift**

Hey foxes! 🦊

Your favorite AI trading agent just got a major upgrade. You can now:

✅ **Trade on Starknet** - Swap any token via natural language
✅ **Check yields** - "What's the best STRK yield?" 
✅ **Portfolio view** - See your Starknet positions alongside everything else

**How to try it:**
1. Go to agent.shapeshift.com
2. Connect your wallet
3. Ask: "Swap 0.1 ETH to STRK on Starknet"

Questions? Drop them below! 👇

*This integration is part of our partnership with @Starknet Foundation*
```

### Blog Outline (AI-Generated)
```
Title: "Starknet Meets AI: Trade L2 with Natural Language"

1. Intro: The friction of multi-chain DeFi
2. What is Agent.ShapeShift?
3. Starknet integration: What you can do
   - Swaps
   - Yield checking
   - Portfolio management
4. Step-by-step tutorial
5. Why Starknet? (L2 benefits)
6. What's next: Roadmap
7. CTA: Try it now
```

---

*This execution plan is designed to be auditable, measurable, and adaptable. Every piece of content, every approval, and every metric is tracked in the GTM Coordinator system.*
