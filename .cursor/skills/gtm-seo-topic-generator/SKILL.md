---
name: gtm-seo-topic-generator
description: Generate 20-30 problem-led SEO topics from a GTM packet for crypto content marketing. Use after full-packet generation to produce search-intent topics that intercept users with a problem (e.g. "how to earn on my USDC"). Output feeds into gtm seo-batch CLI.
---

# GTM SEO Topic Generator

Produce 20-30 problem-led SEO topic suggestions from the protocol analysis, marketing brief, and asset/chain data. In crypto marketing, users convert when they find a solution to a problem they already have — not from announcements. This skill generates the search queries those users are typing.

## When to Use

- After running `gtm full-packet` (packet exists in `research-output/<slug>/`)
- When user says "generate SEO topics," "blog topics," "content topics," or "what should we write about"
- Before running `gtm seo-batch` to generate articles

## Inputs

| Input | Required | Source |
|-------|----------|--------|
| Packet path | Yes | `research-output/<slug>` |
| `research/protocol_analysis.json` | Yes | From full-packet |
| `marketing_brief.md` | Yes | From full-packet |
| Asset/chain summary | Recommended | `research/yield_assets_chains_summary.md` or similar |

## Outputs

- `research/seo_topics.md` — structured list of 20-30 topics

## Topic Generation Logic

### Step 1: Read packet data

Load from the packet:
- `research/protocol_analysis.json` — category, key features, chains, assets, providers
- `marketing_brief.md` — audience, problem solved, value prop, key messages
- Any asset/chain summary in `research/` (e.g. `yield_assets_chains_summary.md`)

### Step 2: Identify topic dimensions

Extract these dimensions to cross-multiply into topics:

| Dimension | Examples |
|-----------|---------|
| **Assets** | USDC, ETH, stETH, DAI, SOL, ATOM |
| **Chains** | Ethereum, Arbitrum, Solana, Base |
| **Actions** | earn, stake, lend, bridge (from protocol category) |
| **Providers** | Aave, Lido, Morpho (from protocol roster) |
| **Problems** | idle assets, low yield, custody risk, KYC, complexity |
| **Comparisons** | vs Yearn, vs Beefy, vs Zapper, vs CEX (Coinbase, Binance) |

### Step 3: Generate topics in these categories

**Category 1: "How to" queries (8-10 topics)**
Problem-led. The user has an asset and wants to do something with it.
- How to earn yield on USDC without KYC
- How to stake ETH and keep your keys
- How to earn on stETH in 2026
- How to earn yield on [ASSET] on [CHAIN]

**Category 2: "Best" queries (5-7 topics)**
Comparison-led. The user is evaluating options.
- Best self-custody yield platform 2026
- Best place to stake [ASSET] without giving up custody
- Best DeFi yield aggregator for [CHAIN]
- Best alternatives to [COMPETITOR] for yield

**Category 3: Problem/pain queries (4-5 topics)**
The user has a frustration and is looking for a fix.
- Earn yield without KYC verification
- DeFi yield without giving up your keys
- How to avoid CEX custody risk and still earn
- Self-custody staking for beginners

**Category 4: Comparison queries (3-4 topics)**
Direct head-to-head searches.
- [Protocol] vs Yearn vs Beefy: which is best for yield
- ShapeShift vs Zapper for DeFi yields
- Self-custody yield: ShapeShift vs CEX

**Category 5: Specific use-case queries (3-4 topics)**
Narrow, high-intent.
- Earn on USDC on Arbitrum
- Stake SOL with no minimum
- USDT yield on Base chain

### Step 4: Write output

Write `research/seo_topics.md` in this format:

```markdown
# SEO Topics: {Protocol}

**Generated:** {date}
**Packet:** {packet path}
**Protocol category:** {category}

## How-to Queries

| # | Topic | Target Keyword | Asset/Chain | Notes |
|---|-------|----------------|-------------|-------|
| 1 | How to earn yield on USDC without KYC | earn yield USDC no KYC | USDC | High intent |
| 2 | ... | ... | ... | ... |

## Best / Comparison Queries

| # | Topic | Target Keyword | Competitor | Notes |
|---|-------|----------------|------------|-------|
| 1 | Best self-custody yield platform 2026 | best self custody yield | General | Evergreen |
| 2 | ... | ... | ... | ... |

## Problem / Pain Queries

| # | Topic | Target Keyword | Pain Point | Notes |
|---|-------|----------------|------------|-------|
| 1 | Earn yield without KYC | yield no KYC | Privacy | High intent |
| 2 | ... | ... | ... | ... |

## Specific Use-Case Queries

| # | Topic | Target Keyword | Asset/Chain | Notes |
|---|-------|----------------|-------------|-------|
| 1 | Earn on USDC on Arbitrum | USDC yield Arbitrum | USDC / Arbitrum | Narrow |
| 2 | ... | ... | ... | ... |

---

**Total topics:** {count}
**Next step:** Run `gtm seo-batch --packet research-output/{slug}` to generate articles from these topics.
```

## Rules

- Generate **at least 20, ideally 25-30** topics
- Every topic must be a query a real person would type into Google
- Cross-reference assets and chains from the actual protocol data — do not invent chains or assets not in the packet
- Vary the topics — do not repeat the same query with minor word changes
- Include the year (2026) in 3-5 topics for freshness signals
- Prioritize high-intent queries (user wants to DO something, not just learn)
- For yield/staking protocols: lead with "earn," "stake," "yield" — never "swap"
- For bridge protocols: lead with "bridge," "move," "transfer"
- For lending: lead with "lend," "borrow," "earn interest"

## Integration

- **gtm full-packet:** Produces the packet this skill reads
- **gtm seo-batch CLI:** Consumes `research/seo_topics.md` and generates one article per topic
- **gtm-interception-content:** Complementary — that skill produces social/press angles; this skill produces blog/SEO angles
