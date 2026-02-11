# GTM Research Tool v2 - Technical Specification

**Status:** Ready for Implementation  
**Author:** GTM Coordinator Team  
**Date:** January 2026  

---

## Executive Summary

Enhance the `gtm research` command to be a **comprehensive, engineer-first marketing automation tool** that:

1. Scrapes protocol websites for context
2. Searches ShapeShift's GitHub for actual implementation details
3. Generates a structured Marketing Brief (7 core questions)
4. Scans trending crypto narratives
5. Analyzes competitor announcements + finds DM targets
6. Recommends optimal posting times
7. Generates scrappy, budget-constrained "wild card" ideas
8. Creates all content drafts (blog, X threads, follow-ups, Discord)
9. Generates press materials (press release, PR brief, op-ed templates)
10. Generates design briefs for AI/human designers
11. Creates a 7-day distribution calendar with action checklist
12. Outputs everything in a navigable HTML index
13. Supports iterative refinement via feedback.yaml
14. Can be triggered automatically via GitHub Actions on feature flag deployment

---

## Primary User: The Engineer

**Assumption:** The engineer who built the feature is the one running this tool. They have:
- No marketing team
- No social media lead (they copy-paste from outputs)
- External press agency (gets the press/ folder auto-emailed)
- No designer (tool outputs AI prompts or briefs for external design)

**Goal:** Engineer pushes button → gets everything needed → executes launch in ~2-3 hours over 7 days

---

## What The Fuck Is This? (Start Here)

**This section lives at the VERY TOP of every generated checklist.md**

```markdown
# You Shipped Code. Now Tell People About It.

You merged a PR. A feature is live. This packet helps you announce it.

At ShapeShift, engineers own their launches. There's no marketing team.
Things don't blow up on their own. If you don't market it, no one will 
use it. That's just how it works.

This isn't busywork. It's intentional storytelling and advocacy for the 
principles and tech you built.

---

## What Kind of Launch Is This?

**Your launch: TIER {tier}**

| Tier | What It Is | Examples | Time Required |
|------|------------|----------|---------------|
| **Tier 0** | Small update, bug fix, minor improvement | Gas optimization, UI tweak, small fix | 30 min (tweet + Discord) |
| **Tier 1** | New feature, integration, meaningful addition | New protocol support, new chain, new feature | 2-3 hours over 7 days |
| **Tier 2** | Major launch, strategic importance, press-worthy | Major partnership, flagship feature, rebrand | 4-5 hours over 14 days + press |

---

## Is This Mandatory?

**Yes.** If you want people to use what you built.

Look, the feature works either way. But if you don't tell anyone:
- No one discovers it
- No one uses it  
- You built something that sits unused

That's a waste of your engineering time.

The minimum is 30 minutes. You can do that.

---

## Can I Bail?

**No.** But you can hand it off.

Someone has to own this launch. If you can't, pass it to:
- **Head of Engineering (Apotheosis)** — Can reassign or handle it
- **Another contributor** — If someone volunteers

But it can't just be dropped. If you turn on the feature flag, you 
own the launch until you explicitly hand it off.

**To hand off:** Message Apotheosis: "Need to hand off {protocol} launch, can't own it right now."

---

## What Already Happened (Automatically)

When your PR merged and the feature flag was enabled:

✓ This packet was generated
✓ Press materials were emailed to the press agency
✓ Launch was added to the GTM tracker
✓ You were assigned as owner

**YOU still need to:**
○ Review the content (20 min)
○ Post to social media (Day 0)
○ Coordinate with partner (optional but recommended)
○ Do follow-ups (Days 1-7)
○ Log metrics (Day 7)

---

## I'm Lost / Overwhelmed

Ping **Apotheosis** (Head of Engineering):
- Discord: @apotheosis
- "First time doing a launch, need help"

They've done this before. They can walk you through it or pair with you.

---

## Quick Paths

**[I'M BUSY]** → Skip to "Minimum Viable Launch" (30 min total)
**[I'VE GOT TIME]** → Follow the full checklist  
**[I CAN'T DO THIS]** → Hand off to Apotheosis

---

## Glossary

*You're an engineer. You know technical terms. Here are the marketing terms you'll encounter.*

### Core Terms (You'll Use These)

| Term | What It Means |
|------|---------------|
| **GTM** | Go-To-Market — the process of announcing/marketing a feature |
| **Tier** | How big a deal this launch is (0=small, 1=medium, 2=big) |
| **Partner** | The protocol you integrated (e.g., THORChain team) |
| **QT** | Quote Tweet — retweet with your own comment added |
| **DM** | Direct Message — private message on social platforms |
| **KOL** | Key Opinion Leader — influencer or thought leader in the space |
| **Engagement** | Likes, retweets, replies, saves — interactions with content |
| **Impressions** | Number of times content was displayed (vanity metric, less important) |
| **Profile Visits** | People who clicked through to your profile (conversion metric, more important) |
| **Conversion** | When someone takes the desired action (signs up, swaps, etc.) |
| **Creative** | The visual/copy assets — images, videos, ad copy |
| **CTA** | Call To Action — what you want people to do ("Try it now", "Learn more") |

### Metrics & Measurement

| Term | What It Means |
|------|---------------|
| **CTR** | Click-Through Rate — % of people who clicked after seeing content |
| **CPC** | Cost Per Click — how much you pay per click on paid content |
| **CPM** | Cost Per Mille — cost per 1,000 impressions |
| **CPA** | Cost Per Acquisition — cost to acquire one user/customer |
| **ROAS** | Return On Ad Spend — revenue generated per dollar spent on ads |
| **ROI** | Return On Investment — overall return relative to cost |
| **LTV** | Lifetime Value — total value a user generates over their lifetime |
| **ARPU** | Average Revenue Per User — revenue divided by number of users |
| **DAU** | Daily Active Users — unique users per day |
| **MAU** | Monthly Active Users — unique users per month |
| **North Star Goal** | The ONE metric that matters most for success |

### User Journey

| Term | What It Means |
|------|---------------|
| **NUX** | New User Experience — what new users see/do first |
| **Retargeting** | Showing ads to people who already visited/engaged |
| **Post-click Conversion** | Conversion that happens after someone clicks your content |
| **Post-click Tracking** | Tracking what users do after clicking |
| **Holdout** | A control group that doesn't see the marketing (for measurement) |

### Channel Types

| Term | What It Means |
|------|---------------|
| **Paid Social** | Paying for promotion on social platforms (Twitter ads, etc.) |
| **Paid Search** | Paying for search engine placement (Google ads) |
| **Partner-led Channels** | Distribution through partners (protocol teams, integrators) |
| **Product-led Channels** | Users discover through the product itself |
| **Social-led Marketing** | Organic social media (not paid) |
| **Affiliate Marketers** | People who promote for commission on conversions |
| **Display Advertising** | Banner ads on websites |
| **DSP** | Demand-Side Platform — tool for buying digital ads programmatically |

### SEO & Search

| Term | What It Means |
|------|---------------|
| **SEO** | Search Engine Optimization — making content rank in search |
| **SEM** | Search Engine Marketing — paid search ads |
| **Page Rank** | How well a page ranks in search results |

### Website/App Terms

| Term | What It Means |
|------|---------------|
| **CRO** | Conversion Rate Optimization — improving % of visitors who convert |
| **On-site Merchandising** | Promoting features/products within the app |
| **On-site Social** | Social features within the app (sharing, referrals) |
| **Pop-over** | Overlay that appears on top of content |
| **Pop-under** | Window that opens behind the current window |
| **Banner Ad** | Rectangular ad displayed on a webpage |

### Attribution & Modeling

| Term | What It Means |
|------|---------------|
| **MTA** | Multi-Touch Attribution — crediting multiple touchpoints for a conversion |
| **MMM** | Marketing Mix Modeling — statistical analysis of marketing effectiveness |
| **Targeting** | Showing content to specific audience segments |
| **Untargeting** | Excluding specific audiences from seeing content |

### Crypto-Specific

| Term | What It Means |
|------|---------------|
| **Onchain** | Transactions/activity recorded on the blockchain |
| **TVL** | Total Value Locked — assets deposited in a protocol |
| **Swap Volume** | Total value of trades/swaps through the platform |
| **Degen** | DeFi power user, often takes high risks |
| **CT** | Crypto Twitter — the crypto community on Twitter/X |
| **Alpha** | Insider information or early knowledge about opportunities |
| **Shill** | Aggressively promoting (often with negative connotation) |
| **WAGMI** | "We're All Gonna Make It" — optimistic community phrase |
```

---

## Launch Ownership

**The Rule:** Whoever enables the feature flag owns the launch until explicitly handed off.

```typescript
interface LaunchOwnership {
  owner: string;           // Engineer who enabled feature flag
  assignedAt: string;      // When flag was enabled
  handedOffTo: string | null;
  handedOffAt: string | null;
  handoffReason: string | null;
}
```

**In the checklist:**
```markdown
## Launch Owner

**Current Owner:** @{engineer_handle}
**Assigned:** {date} (when feature flag was enabled)

To hand off: Message Apotheosis with reason.
```

**In Slack notification:**
```
🚀 GTM Packet Ready: THORChain

Owner: @engineer_handle ← YOU OWN THIS
...
```

---

## Operational Quick Start

### How to Post

| Platform | Account | Access |
|----------|---------|--------|
| **Blog (Strapi)** | shapeshift.com | [Loom walkthrough by Fabio](link) - cms.shapeshift.com |
| **Twitter/X** | @ShapeShift | Credentials in DAO 1Password → "ShapeShift Twitter" |
| **Twitter/X** | Personal | Your own account - QT the main account |
| **Discord** | ShapeShift Discord | #announcements channel |
| **Farcaster** | @shapeshift | Credentials in DAO 1Password |

### Which Account Posts What

| Content | Posted From | Then... |
|---------|-------------|---------|
| Main announcement thread | **@ShapeShift** | You QT from personal with your take |
| Educational thread (Day 1) | **@ShapeShift** | Contributors QT |
| Personal takes/walkthroughs | **Your account** | @ShapeShift RTs |
| Info bot QT | **@ShapeShift** | QT @ShapeShiftInfoBot showing the swap |

**Important:** Always QT @ShapeShiftInfoBot when showing a swap in progress - this is social proof.

### Graphic Design Help

| Option | Best For | Contact |
|--------|----------|---------|
| **Midjourney** | Quick AI-generated graphics | Use prompts in `design/ai_prompts.txt` |
| **Hoff** | Custom design work | [contact method] |
| **Atlin** | Custom design work | [contact method] |

No dedicated marketing team. **This tool IS the marketing team.** The designers above are freelancers who work well with ShapeShift.

### If Partner Doesn't Respond

```
T-5: Send partner kit
T-3: No response? Ping again. Try:
     - Different channel (Telegram if you used Discord)
     - Different contact (find their marketing person)
     - Tag them on Twitter asking for DM
T-1: Still nothing? Launch without coordination.
     - Post anyway
     - Tag them in announcement
     - They may RT after seeing it live
```

### If Something Goes Wrong

```
Tweet getting ratioed? → Don't delete. Respond thoughtfully or let it ride.
Blog has an error? → Fix in Strapi, it updates live.
Partner posts wrong thing? → DM them, ask to delete/edit.
Major crisis? → Ping Apotheosis in Discord.
```

### There Is No Marketing Team

This tool IS the marketing team. You execute what it generates.

If you're stuck: Ping Apotheosis or ask in #contributors Discord.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Module Specifications](#2-module-specifications)
   - 2.1 Web Fetcher
   - 2.2 GitHub Client
   - 2.3 Narrative Scanner
   - 2.4 Competitor Intelligence
   - 2.5 DM Target Generator
   - 2.6 Timing Intelligence
   - 2.7 Wild Card Generator
   - 2.8 Distribution Playbook
   - 2.9 Press Suite Generator
   - 2.10 Learnings Integration (AI gets smarter)
   - 2.11 Action Checklist Generator
   - 2.12 Design Brief Generator
   - 2.13 Partner Kit Generator
   - 2.14 Metrics Logger
   - 2.15 Launch State Machine (flexible timing)
   - 2.16 Press Feedback Loop (agency teaches AI)
   - 2.17 Marketing Brief Generator
   - 2.18 Feedback Loader
   - 2.19 Index Generator
   - 2.20 Research Orchestrator
3. [Data Models](#3-data-models)
4. [API Contracts](#4-api-contracts)
5. [Prompts](#5-prompts)
6. [File Structure](#6-file-structure)
7. [CLI Interface](#7-cli-interface)
8. [Dependencies](#8-dependencies)
9. [Environment Variables](#9-environment-variables)
10. [Testing Plan](#10-testing-plan)
11. [GitHub Automation](#11-github-automation)

**Appendices:**
- A: ShapeShift Brand Context
- B: Customer Profile (Living Document)
- C: Version History
- D: Quick Reference

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           gtm research --protocol "X" --url "Y"             │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RESEARCH ORCHESTRATOR                              │
│                         (src/lib/researchAgent.ts)                          │
└─────────────────────────────────────────────────────────────────────────────┘
           │              │              │              │              │
           ▼              ▼              ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ Protocol │   │  GitHub  │   │Narrative │   │Competitor│   │  Timing  │
    │ Website  │   │  Search  │   │ Scanner  │   │  Intel   │   │  Intel   │
    │ Fetcher  │   │  Client  │   │          │   │          │   │          │
    └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
           │              │              │              │              │
           └──────────────┴──────────────┴──────────────┴──────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────┐
                    │         AGGREGATED CONTEXT        │
                    │  (Protocol + Code + Trends + etc) │
                    └───────────────────────────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────┐
                    │            GPT-4o                 │
                    │    (Marketing Brief + Content)    │
                    └───────────────────────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
    ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
    │  Marketing   │           │   Content    │           │ Distribution │
    │    Brief     │           │   Drafts     │           │   Calendar   │
    └──────────────┘           └──────────────┘           └──────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────┐
                    │       INDEX GENERATOR             │
                    │  (HTML with all sections)         │
                    └───────────────────────────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────┐
                    │         OUTPUT FILES              │
                    │   research-output/{protocol}/     │
                    └───────────────────────────────────┘
```

---

## 2. Module Specifications

### 2.1 Web Fetcher (EXISTING - src/lib/webFetch.ts)

**Purpose:** Fetch and extract text content from protocol websites.

**Interface:**
```typescript
interface WebsiteContent {
  title: string;
  description: string;
  content: string;  // Cleaned text, max 15000 chars
  url: string;
}

function fetchWebsiteContent(url: string): Promise<WebsiteContent>
```

**Status:** Already implemented. No changes needed.

---

### 2.2 GitHub Client (NEW - src/lib/github.ts)

**Purpose:** Search ShapeShift's GitHub for PRs and code related to a protocol.

**Interface:**
```typescript
interface GitHubConfig {
  token?: string;  // From GITHUB_TOKEN env var
  org: string;     // Default: 'shapeshift'
  repos: string[]; // Default: ['web', 'unchained', 'hdwallet']
}

interface PRSearchResult {
  number: number;
  title: string;
  url: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: string;
  mergedAt: string | null;
  body: string;  // PR description (often contains business case)
}

interface PRDetails extends PRSearchResult {
  files: PRFile[];
  commits: PRCommit[];
  labels: string[];
  reviewers: string[];
}

interface PRFile {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  patch?: string;  // Diff content (truncated if large)
}

interface PRCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface CodeSearchResult {
  path: string;
  repo: string;
  url: string;
  snippet: string;  // Matching code snippet
}

interface GitHubContext {
  prs: PRDetails[];
  codeMatches: CodeSearchResult[];
  designDocs: string[];  // URLs extracted from PR descriptions
  businessCase: string | null;  // Extracted from PR body
}

// Functions
function searchPRs(query: string, config?: GitHubConfig): Promise<PRSearchResult[]>
function getPRDetails(owner: string, repo: string, prNumber: number): Promise<PRDetails>
function searchCode(query: string, config?: GitHubConfig): Promise<CodeSearchResult[]>
function extractDesignDocs(prBody: string): string[]
function buildGitHubContext(protocolName: string, prUrl?: string): Promise<GitHubContext>
```

**API Endpoints Used:**
- `GET /search/issues?q={query}+org:shapeshift+type:pr` - Search PRs
- `GET /repos/{owner}/{repo}/pulls/{number}` - Get PR details
- `GET /repos/{owner}/{repo}/pulls/{number}/files` - Get PR files
- `GET /search/code?q={query}+org:shapeshift` - Search code

**Rate Limiting:**
- Without token: 60 requests/hour
- With token: 5000 requests/hour
- Implement exponential backoff on 403 responses

**Error Handling:**
- Log warning if rate limited, continue with partial data
- Return empty GitHubContext if GitHub unreachable

---

### 2.3 Narrative Scanner (NEW - src/lib/narrativeScanner.ts)

**Purpose:** Identify trending crypto narratives to tie the launch into.

**Interface:**
```typescript
interface TrendingNarrative {
  topic: string;
  description: string;
  relevanceScore: number;  // 0-1, how relevant to this protocol
  suggestedAngle: string;  // How to tie the launch into this narrative
  exampleTweets: string[]; // 2-3 example tweets in this narrative
}

interface NarrativeScanResult {
  scannedAt: string;
  narratives: TrendingNarrative[];
  recommendedHooks: string[];  // Ready-to-use narrative hooks
}

function scanNarratives(
  protocolCategory: string,  // e.g., "yield", "DEX", "bridge"
  protocolKeywords: string[] // e.g., ["staking", "APY", "yield farming"]
): Promise<NarrativeScanResult>
```

**Implementation Approach:**
- Use GPT-4o with a prompt that asks it to identify current crypto narratives
- Provide context about the protocol category
- GPT-4o has training data about common crypto narratives and can extrapolate
- Optionally: In future, could integrate Twitter API for real-time data

**Fallback Narratives (if API fails):**
- "Real yield" discourse
- "Liquid staking" trends
- "Cross-chain" momentum
- "Airdrop season" speculation
- "DeFi renaissance" narrative

---

### 2.4 Competitor Intelligence (NEW - src/lib/competitorIntel.ts)

**Purpose:** Discover who else has integrated this protocol and learn from their announcements.

**Interface:**
```typescript
interface CompetitorDiscovery {
  competitor: string;       // e.g., "Uniswap", "1inch"
  integrationUrl: string;   // Where we found they integrated
  source: 'web_search' | 'github' | 'gpt_knowledge';
}

interface CompetitorAnnouncement {
  competitor: string;
  announcementUrl: string;  // Link to tweet/blog
  date: string;
  platform: 'twitter' | 'blog' | 'discord' | 'other';
  content: string;          // The announcement text (scraped or summarized)
  engagement: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
  whatWorked: string[];     // Analysis of why it performed well
}

interface CompetitorIntelResult {
  // Discovery phase
  discoveredCompetitors: CompetitorDiscovery[];
  searchQueries: string[];  // What we searched for
  
  // Analysis phase
  announcements: CompetitorAnnouncement[];
  bestPractices: string[];  // Extracted from actual competitor comms
  differentiationAngles: string[];  // How ShapeShift can stand out
  
  // Fallback flag
  usedGptFallback: boolean;  // True if web search found nothing
}

function discoverCompetitors(protocolName: string): Promise<CompetitorDiscovery[]>
function fetchCompetitorAnnouncements(competitors: CompetitorDiscovery[]): Promise<CompetitorAnnouncement[]>
function analyzeCompetitors(
  protocolName: string,
  protocolCategory: string,
  manualCompetitors?: string[]  // Optional manual override
): Promise<CompetitorIntelResult>
```

**Implementation Approach (3-tier fallback):**

```
TIER 1: Web Search Discovery
├── Search: "{protocolName} integrated on"
├── Search: "{protocolName} partners"
├── Search: "{protocolName} announcement {competitor}"
└── Parse results for competitor names and announcement URLs

TIER 2: Scrape Competitor Announcements
├── For each discovered competitor:
│   ├── Try to fetch their announcement blog/tweet
│   └── Extract the actual announcement content
└── Analyze what messaging they used

TIER 3: GPT Knowledge Fallback
├── If web search finds nothing useful:
│   └── Use GPT-4o knowledge about how competitors typically announce
└── Flag output as "usedGptFallback: true"
```

**Search Queries to Try:**
```
"{protocol} integrated site:twitter.com"
"{protocol} integration announcement"
"{protocol} now available on"
"{protocol} partners with"
"{protocol} launches on {known_aggregator}"
```

**Manual Override:**
- User can specify competitors in feedback.yaml under `competitors.add`
- These get priority and always get analyzed

---

### 2.5 DM Target Generator (NEW - src/lib/dmTargets.ts)

**Purpose:** Identify high-value accounts to DM about the launch, based on competitor engagement analysis.

**Interface:**
```typescript
interface DMTarget {
  handle: string;           // Twitter/X handle
  displayName: string;
  followerCount: number;
  relevanceReason: string;  // Why we're suggesting this person
  source: 'competitor_engagement' | 'protocol_community' | 'influencer' | 'power_user';
  engagementHistory: string;  // "Liked/RT'd competitor's integration announcement"
  suggestedMessage: string;   // Personalized DM template
  priority: 'high' | 'medium' | 'low';
}

interface DMTargetResult {
  targets: DMTarget[];  // 10-20 accounts
  antiTargets: string[];  // Accounts to NOT DM (competitors, shills)
  dmTemplate: string;  // Generic template if personalized not available
  bestTimeToSend: string;  // "Weekday mornings EST"
}

function generateDMTargets(
  protocolName: string,
  competitorIntel: CompetitorIntelResult,
  customerProfile: CustomerProfile
): Promise<DMTargetResult>
```

**Target Discovery Flow:**
```
1. From Competitor Intel:
   └── Find who engaged with competitor announcements
   └── These people are interested in this protocol

2. From Protocol Community:
   └── Search "{protocol} user" or "{protocol} fan"
   └── Find active community members

3. Filter Out (ANTI-TARGETS):
   ✗ Competitor employees/founders
   ✗ People who work at competing products
   ✗ Obvious paid shills
   ✗ Bots/spam accounts
   ✗ Anyone with "works at [competitor]" in bio

4. Prioritize:
   HIGH: Engaged with competitor + has audience (1k+ followers)
   MEDIUM: Active in protocol community
   LOW: General DeFi influencers
```

**DM Best Practices:**
- **NO links in first DM** - Link previews look spammy, kills open rates
- **First 30 characters = value add** - This shows in notification preview
- **Minimal emojis** - Keep it professional, not salesy
- **Personalize the opener** - Reference something specific about them

**DM Template (to riff off of):**
```
Swap BTC to ETH without bridges - {name}, saw you're into 
{protocol}. ShapeShift just shipped native support.

Thought you'd want to know since you [specific reason].

Want me to send the link?
```

**Why this works:**
- "Swap BTC to ETH without bridges" = value in first 30 chars
- No link = doesn't look like spam
- Asking "want me to send?" = gets them to respond first
- Then you send link in second message after they reply

**DM List Format:**
```markdown
## DM Targets

| Handle | Why Them | Opener Angle |
|--------|----------|--------------|
| @thorchain_degen | Active in THORChain discord, 5k followers | "Saw your thread on THORChain routing" |
| @defi_chad | RT'd competitor's integration | "Noticed you tried [competitor]'s version" |
| @yield_farmer_42 | Power user, posts about cross-chain | "Your thread on bridging pain points" |
```

---

### 2.6 Timing Intelligence (NEW - src/lib/timingIntel.ts)

**Purpose:** Recommend optimal posting times for crypto audiences.

**Interface:**
```typescript
interface PostingWindow {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  timeSlots: {
    start: string;  // "09:00"
    end: string;    // "11:00"
    timezone: string;  // "EST"
    quality: 'optimal' | 'good' | 'acceptable';
    reason: string;
  }[];
}

interface TimingRecommendation {
  recommendedLaunchDay: string;  // e.g., "Tuesday" or specific date
  avoidDays: string[];           // e.g., ["Weekend", "US holidays"]
  postingWindows: PostingWindow[];
  cryptoSpecificConsiderations: string[];  // e.g., "Avoid during ETH upgrades"
  suggestedSchedule: {
    contentType: string;  // "Main announcement"
    suggestedTime: string;  // "Tuesday 10:00 EST"
    reason: string;
  }[];
}

function getTimingRecommendations(
  tier: number,  // 0, 1, or 2
  targetAudiences: string[]
): Promise<TimingRecommendation>
```

**Built-in Knowledge (hardcoded + GPT enhancement):**
```
Optimal Crypto Twitter Times (EST):
- Weekdays: 9-11am, 2-4pm
- Best days: Tuesday, Wednesday, Thursday
- Avoid: Weekends, US holidays, major crypto events (ETH upgrades, BTC halvings)

By Audience:
- DeFi degens: Late night EST (matches Asia/EU morning)
- Institutions: Business hours EST
- Developers: Weekday afternoons
```

---

### 2.6 Wild Card Generator (NEW - src/lib/wildCardGenerator.ts)

**Purpose:** Generate scrappy, low-budget, high-impact marketing ideas.

**Constraints (HARD REQUIREMENTS):**
- **Max budget: $10,000 per idea** (most should be <$1,000)
- **Must be feasible for a DAO** with limited centralized resources
- **Must target ShapeShift's defined customer profile** (see shapeshift-context.md)
- **Scrappy > polished** - crypto-native, guerrilla tactics preferred

**Interface:**
```typescript
interface WildCardIdea {
  title: string;
  description: string;
  estimatedBudget: {
    low: number;   // e.g., 0
    high: number;  // e.g., 500, MAX 10000
    breakdown: string;  // "Twitter ads: $200, Meme bounty: $300"
  };
  riskLevel: 'medium' | 'high' | 'yolo';
  potentialUpside: string;
  potentialDownside: string;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeToExecute: string;  // "2 hours", "1 day", "1 week"
  whoCanExecute: string;  // "Any contributor", "Marketing workstream", "Needs dev"
  targetCustomerSegment: string;  // Must reference customer profile
  exampleExecution: string;  // Specific, actionable steps
}

interface WildCardResult {
  ideas: WildCardIdea[];  // 3-5 ideas
  customerProfileUsed: string;  // Which segments were targeted
  disclaimer: string;
}

function generateWildCards(
  protocolName: string,
  protocolCategory: string,
  customerProfile: CustomerProfile  // Loaded from shapeshift-context.md
): Promise<WildCardResult>
```

**Idea Categories (Scrappy Focus):**
- **Meme bounties** - Pay $50-200 for best memes, community creates content
- **Reply-guy campaigns** - Coordinated contributor replies on relevant tweets
- **Quote-tweet storms** - 5+ contributors QT with personal takes
- **Prediction markets** - Create a Polymarket/Manifold question about the launch
- **Trading competitions** - Small prize pools ($500-2000) for volume/activity
- **Scavenger hunts** - Easter eggs in the product, rewards for finding them
- **Hot takes** - Controversial but defensible positions that spark debate
- **Cross-protocol raids** - Friendly engagement with partner communities
- **User testimonial harvesting** - Reach out to power users for quotes
- **Live events** - Twitter Spaces, Discord AMAs (free but high-effort)

**Anti-patterns (DO NOT SUGGEST):**
- Paid influencer campaigns (>$5k)
- Professional video production
- Anything requiring legal review
- Conference sponsorships
- Traditional PR/media buys

---

### 2.7 Distribution Playbook (NEW - src/lib/distributionPlaybook.ts)

**Purpose:** Generate a day-by-day content distribution calendar.

**Interface:**
```typescript
interface ContentPiece {
  id: string;
  type: 'blog' | 'tweet' | 'thread' | 'discord' | 'video' | 'email' | 'farcaster';
  title: string;
  description: string;
  draftPath: string;  // Path to the draft file
  dependencies: string[];  // IDs of content that must go first
}

interface ScheduledPost {
  contentId: string;
  day: number;  // 0 = launch day, 1 = day after, etc.
  time: string;  // "09:00 EST"
  platform: string;
  action: string;  // "Publish", "QT", "Cross-post"
  notes: string;
}

interface DistributionCalendar {
  launchDate: string | null;  // If known
  schedule: ScheduledPost[];
  contentPieces: ContentPiece[];
  playbook: string;  // Markdown explanation of the strategy
}

function generateDistributionCalendar(
  tier: number,
  enabledChannels: string[],
  contentDrafts: Record<string, string>  // draftName -> content
): Promise<DistributionCalendar>
```

**ShapeShift Distribution Playbook (Built-in):**

```markdown
## Day 0 (Launch Day)
- 09:00 EST: Blog post goes live (canonical source of truth)
- 09:30 EST: Main announcement tweet (links to blog)
- 09:35 EST: Thread with key details (QT of main tweet)
- 10:00 EST: Discord announcement in #announcements
- 10:30 EST: Contributor QTs with personal takes/walkthroughs
- 11:00 EST: Farcaster cross-post
- 12:00 EST: Partner account cross-promotion (if coordinated)

## Day 1
- 10:00 EST: Video/Loom walkthrough drops
- 10:30 EST: Main account QTs the video
- 14:00 EST: Educational thread breaking down the feature

## Day 2-3
- Morning: RT/QT user testimonials and reactions
- Afternoon: Data thread (volumes, usage stats if available)
- Partner cross-promotion content

## Day 7
- Recap thread: "In case you missed it" + metrics
- Lessons learned (internal)
```

---

### 2.8 Press Suite Generator (NEW - src/lib/pressSuite.ts)

**Purpose:** Generate hands-off press materials that the press team can use directly or personalize.

**Outputs:**
1. **Press Release** - Formal announcement for media outlets
2. **PR Brief** - Talking points and key messages for spokespeople
3. **Op-Ed Templates** - Multiple angles that contributors can claim and personalize

**Interface:**
```typescript
interface PressRelease {
  headline: string;
  subheadline: string;
  dateline: string;  // "DENVER, CO - January 29, 2026"
  body: string;      // Full press release (500-800 words)
  boilerplate: string;  // About ShapeShift paragraph
  mediaContact: string;
  quotes: {
    attribution: string;  // "[NAME], [TITLE] at ShapeShift"
    quote: string;
  }[];
}

interface PRBrief {
  keyMessages: string[];      // 5-7 bullet points
  talkingPoints: string[];    // Longer explanations
  anticipatedQuestions: {
    question: string;
    suggestedAnswer: string;
  }[];
  doNotSay: string[];         // Topics to avoid
  bridgingPhrases: string[];  // "What's really exciting is..."
  successMetrics: string[];   // What makes this newsworthy
}

interface OpEdTemplate {
  angle: 'political' | 'technical' | 'philosophical' | 'market' | 'user_story';
  title: string;
  subtitle: string;
  targetPublication: string[];  // e.g., ["CoinDesk", "Decrypt", "The Block"]
  suitableAuthors: string[];    // e.g., ["Engineering lead", "Founder", "Community member"]
  
  // The actual template
  hookOptions: string[];        // 2-3 opening hook options
  body: string;                 // Main content with [PERSONALIZE] placeholders
  callToAction: string;
  
  // Personalization guide
  personalizationNotes: string;  // How to make it your own
  currentEventsHooks: string[];  // Timely angles to tie into
}

interface PressSuiteResult {
  pressRelease: PressRelease;
  prBrief: PRBrief;
  opEds: OpEdTemplate[];  // 4 angles: political, technical, philosophical, market
}

function generatePressSuite(
  protocol: ProtocolAnalysis,
  brief: MarketingBrief,
  shapeshiftContext: ShapeShiftContext
): Promise<PressSuiteResult>
```

**Op-Ed Angles (Generate All 4):**

| Angle | Focus | Best For | Target Outlets |
|-------|-------|----------|----------------|
| **Political/Regulatory** | Self-custody rights, financial freedom, regulatory landscape | Founders, policy people | CoinDesk Opinion, Decrypt |
| **Technical/Builder** | Architecture decisions, why this matters for DeFi infra | Engineers, technical leads | The Block, dev blogs |
| **Philosophical** | Sovereignty, decentralization, why this matters for humanity | Thought leaders, OGs | Long-form crypto media |
| **Market/Trends** | Current narratives, what's happening in crypto, timing | Analysts, traders | Twitter threads, newsletters |

**Op-Ed Template Structure:**
```markdown
# {TITLE}
## {SUBTITLE}

[HOOK - Choose from options below]
- Option A: Start with current event...
- Option B: Start with provocative question...
- Option C: Start with personal anecdote...

[BODY]
{Main argument with [PERSONALIZE: Add your own experience here] placeholders}

[CURRENT EVENTS TIE-IN]
Suggestions:
- If discussing regulation: Reference recent SEC/CFTC news
- If discussing markets: Reference current market conditions
- If discussing technology: Reference recent protocol upgrades

[CALL TO ACTION]
{How readers can engage}

---
**Author Notes:**
- Suitable for: {list of people who could sign this}
- Personalize by: {specific things to add}
- Avoid: {things that would undermine the piece}
```

**ShapeShift Ethos Integration:**
All press materials should lean into:
- Non-custodial as a feature, not a limitation
- Principled stance on privacy, self-sovereignty
- Open source, transparent, community-governed
- Ability to comment on broader industry trends from a values-based perspective

---

### 2.9 Design Brief Generator (NEW - src/lib/designBrief.ts)

**Purpose:** Generate design briefs that work for AI tools (Midjourney/DALL-E) or human designers.

**Interface:**
```typescript
interface DesignBrief {
  // For human designers
  concept: string;
  dimensions: string;  // "1200x675 for Twitter, 1080x1080 for square"
  brandGuidelines: {
    primaryColors: string[];
    fonts: string[];
    logoUsage: string;
    doNots: string[];
  };
  visualDirection: string;
  mustInclude: string[];
  references: string[];  // Links to similar designs
  
  // For AI tools
  aiPrompts: {
    twitter: string;      // Ready for Midjourney/DALL-E
    square: string;       // Instagram/Discord
    banner: string;       // Blog header
  };
}

function generateDesignBrief(
  protocolName: string,
  brief: MarketingBrief,
  brandContext: ShapeShiftContext
): Promise<DesignBrief>
```

**AI Prompt Template:**
```
Minimalist crypto announcement graphic. Dark background (#1a1a2e). 
{Protocol} logo centered. ShapeShift fox logo subtle in corner.
Text: "{headline}". Clean sans-serif font (Inter or similar).
No gradients. Professional DeFi aesthetic. High contrast.
--ar 16:9 --style raw
```

**Brand Guidelines (from ShapeShift):**
```yaml
colors:
  primary: "#3761F9"  # ShapeShift blue
  background: "#1a1a2e"  # Dark
  accent: "#00D395"  # Green for positive
  text: "#FFFFFF"

fonts:
  - "Inter" (headings)
  - "Space Grotesk" (body)

logo:
  - Fox logo in corner, not center
  - Never distort or recolor
  - Minimum clear space around logo

do_not:
  - Use gradients
  - Use 3D effects
  - Use stock photos of people
  - Use red (negative connotation)
```

---

### 2.10 Learnings Integration (NEW - src/lib/learningsIntegration.ts)

**Purpose:** Read past launch learnings and use them to improve future content generation. The AI gets smarter with every launch.

**Interface:**
```typescript
interface PastLaunch {
  id: string;
  protocolName: string;
  tier: number;
  date: string;
  metrics: LaunchMetrics;
  learnings: {
    whatWorked: string[];
    whatDidntWork: string[];
    nextTimeDo: string[];
    nextTimeAvoid: string[];
  };
}

interface LearningsContext {
  totalLaunches: number;
  
  // Pattern recognition
  bestPerformingContent: {
    contentType: string;
    example: string;
    avgEngagement: number;
  }[];
  
  worstPerformingContent: {
    contentType: string;
    whyItFailed: string;
  }[];
  
  // Timing insights
  bestPostingTimes: string[];
  worstPostingTimes: string[];
  
  // Partner insights
  partnerTacticsThatWorked: string[];
  
  // Consolidated recommendations
  doThis: string[];
  avoidThis: string[];
}

interface ContentAdaptation {
  original: string;
  adapted: string;
  reason: string;  // "Past launches showed X works better"
}

function loadPastLearnings(launchHistoryDir: string): Promise<PastLaunch[]>
function aggregateLearnings(launches: PastLaunch[]): LearningsContext
function applyLearningsToContent(
  content: ContentDrafts,
  learnings: LearningsContext
): Promise<{
  adaptedContent: ContentDrafts;
  adaptations: ContentAdaptation[];
}>
```

**How It Works:**

```
1. LOAD: Read all past launches
   └── gtm-launches/*/learnings.md
   └── gtm-launches/*/metrics.json

2. AGGREGATE: Find patterns
   ├── "Tweets with questions get 2x engagement"
   ├── "Day 1 educational threads outperform Day 0"
   ├── "Partner QT within 30 min = best results"
   └── "Metrics threads underperform on weekdays"

3. APPLY: Adapt new content
   ├── Rewrite hooks to use question format
   ├── Adjust timing recommendations
   ├── Emphasize partner coordination
   └── Skip/modify underperforming content types

4. EXPLAIN: Show what changed
   └── "Applied 3 learnings from past 12 launches"
```

**Learnings Added to All Prompts:**

```
## Learnings from Past Launches (n={count})

CONTENT THAT PERFORMS WELL:
{bestPerformingContent}

CONTENT THAT UNDERPERFORMS:
{worstPerformingContent}

TIMING INSIGHTS:
{timingInsights}

PARTNER TACTICS THAT WORKED:
{partnerTactics}

Apply these learnings. Specifically:
- {doThis[0]}
- {doThis[1]}

Avoid:
- {avoidThis[0]}
- {avoidThis[1]}
```

**Example Adaptation Report (included in output):**

```markdown
## 🧠 AI Adaptations Based on Past Launches

Based on 12 past launches, I made these adjustments:

### Tweet Hook
**Before:** "Introducing THORChain support on ShapeShift"
**After:** "What if you could swap BTC for ETH without bridges?"
**Why:** Question-format hooks get 2.3x more engagement (observed in 8/12 launches)

### Educational Thread Timing
**Before:** Day 0, 14:00 EST
**After:** Day 1, 10:00 EST  
**Why:** Day 1 threads avg 340 engagements vs Day 0's 180

### Metrics Thread
**Changed to:** Optional
**Why:** Last 6 launches averaged only 45 engagements. Skip unless numbers are exceptional.
```

**Minimum Launches for Learning:**
| Launches | Learning Level |
|----------|----------------|
| 0-2 | Defaults only |
| 3-5 | Basic patterns |
| 6+ | Full integration |

---

### 2.11 Action Checklist Generator (NEW - src/lib/actionChecklist.ts)

**Purpose:** Generate a simple, time-boxed checklist for the engineer to execute the launch.

**Interface:**
```typescript
interface ChecklistItem {
  id: string;
  day: number;  // 0 = launch day, -1 = pre-launch
  time: string;  // "09:00 EST" or "Morning"
  task: string;
  estimatedMinutes: number;
  draftFile: string | null;  // Path to file to use
  platform: string | null;  // "Twitter", "Discord", etc.
  notes: string;
  isOptional: boolean;
}

interface ActionChecklist {
  totalEstimatedHours: number;
  checklistByDay: Record<number, ChecklistItem[]>;
  metricsToCheck: MetricTarget[];
  automatedTasks: string[];  // What happens automatically
}

interface MetricTarget {
  metric: string;
  source: string;
  target: string;
  howToCheck: string;
}

function generateActionChecklist(
  tier: number,
  calendar: DistributionCalendar,
  outputDir: string
): ActionChecklist
```

**Output Format (checklist.md):**
```markdown
# {Protocol} Launch Checklist
**Tier:** {tier} | **Total Time:** ~{hours} hours over {duration}

---

## Automated (No Action Needed)
- [x] Press folder emailed to agency
- [x] GTM packet generated
- [x] Past learnings loaded (see below)

---

## 📋 PRE-LAUNCH PHASE

### Day -7 to -5: Partner Coordination — 30 min
- [ ] **Send partner kit** to protocol team (partner/partner_kit.pdf) — 5 min
- [ ] **Request feedback** by Day -3 — 2 min
- [ ] **Identify partner contact** for launch day coordination — 5 min

### Day -3: Feedback Integration — 20 min
- [ ] **Review partner feedback** (partner/partner_feedback.yaml)
- [ ] **Regenerate if needed:** `gtm research --partner-feedback`
- [ ] **Confirm launch timing** with partner

### Day -1: Final Review — 30 min
- [ ] **Final review** of all content
- [ ] **Review blog draft** (drafts/blog_draft.md) — 10 min
- [ ] **Review tweet thread** (drafts/x_post.md) — 5 min
- [ ] **Prep DM list** (outreach/dm_targets.md) — 5 min
- [ ] **Confirm partner is ready** to QT

---

## 🚀 LAUNCH PHASE

### Launch Day (Day 0) — 60 min

| Time | Task | File | Est. |
|------|------|------|------|
| 08:30 | Publish blog to Strapi | drafts/blog_draft.md | 10 min |
| 09:00 | Post main tweet thread | drafts/x_post.md | 5 min |
| 09:05 | Reply with blog link | drafts/blog_for_x.md | 2 min |
| 09:10 | Post Discord announcement | drafts/discord_post.md | 2 min |
| 09:15 | **Notify partner: "We're live!"** | — | 2 min |
| 09:30 | Partner QTs (confirm they did) | — | 2 min |
| 09:30 | Send DMs to targets | outreach/dm_targets.md | 15 min |
| 10:00 | Cross-post to Farcaster | (same as tweet) | 5 min |
| 12:00 | Check replies, respond | — | 15 min |
| 15:00 | QT positive reactions | — | 5 min |

### Day 1 — 20 min
- [ ] 10:00 - Post educational thread (drafts/followup_educational.md)
- [ ] Reply to overnight comments
- [ ] DM anyone who engaged positively
- [ ] Check partner cross-posted to their Discord

### Day 2-3 — 15 min
- [ ] Post "how to use" content
- [ ] QT user testimonials
- [ ] Share partner cross-posts

### Day 4-6 — 10 min
- [ ] Post metrics thread if data looks good (drafts/followup_metrics.md)
- [ ] Continue engaging

### Day 7 — 30 min
- [ ] Post recap thread (drafts/followup_recap.md)
- [ ] **Run:** `gtm metrics --launch {protocol}`
- [ ] Review AI-generated learnings

---

## 📊 METRICS BENCHMARKS (Tier {tier})

{Dynamically generated based on tier}

### Tier 0 (Minor Update)
| Metric | Target | Great | Check At |
|--------|--------|-------|----------|
| Tweet Engagements | >50 | >150 | Day 3 |
| Profile Visits | >100 | >300 | Day 3 |
| Onchain Txs | >20 | >50 | Day 3 |

### Tier 1 (Standard Launch)
| Metric | Target | Great | Check At |
|--------|--------|-------|----------|
| Tweet Engagements | >200 | >500 | Day 7 |
| Profile Visits | >500 | >1500 | Day 7 |
| Website Traffic | +10% | +25% | Day 7 |
| Swap Volume | +5% | +15% | Day 7 |
| Onchain Txs | >100 | >300 | Day 7 |

### Tier 2 (Major Launch)
| Metric | Target | Great | Check At |
|--------|--------|-------|----------|
| Tweet Engagements | >500 | >2000 | Day 14 |
| Profile Visits | >1500 | >5000 | Day 14 |
| Website Traffic | +25% | +50% | Day 14 |
| Swap Volume | +15% | +30% | Day 14 |
| Onchain Txs | >500 | >1500 | Day 14 |
| Press Mentions | >1 | >3 | Day 14 |

---

## 🧠 LEARNINGS FROM PAST LAUNCHES

{AI-generated based on reading past learnings.md files}

**What's worked before:**
- {learning 1 from past launches}
- {learning 2 from past launches}

**What to avoid:**
- {anti-pattern from past launches}

**Applied to this launch:**
- {how AI adapted content based on learnings}

---

## Success Criteria

**SUCCESS:** Hit targets + positive community response  
**OKAY:** Close to targets, no negative feedback  
**REVIEW:** Missed targets → log learnings for next time

---

## ⚡ MINIMUM VIABLE LAUNCH (If You're Slammed)

Don't have time for the full 7-day plan? Here's the bare minimum:

**30 minutes total:**
- [ ] Post tweet thread from @ShapeShift (drafts/x_post.md) — 5 min
- [ ] Post Discord announcement (drafts/discord_post.md) — 2 min
- [ ] QT from your personal account with your take — 3 min

**That's it. You shipped.**

Everything else (blog, follow-ups, DMs, partner coordination) is bonus.
A shipped launch beats a perfect plan stuck in drafts.

You can always add follow-up content later. The feature is live. 
People will find it.

---

## ✅ PRE-FLIGHT CHECK

Run through this before you launch:

```
PRE-FLIGHT CHECK: {Protocol}

CONTENT READY
  [ ] Blog draft reviewed and ready
  [ ] Tweet thread reviewed and ready
  [ ] Discord post reviewed and ready
  [ ] Images generated (or skipping images)

ACCESS VERIFIED  
  [ ] Can log into Strapi (cms.shapeshift.com)
  [ ] Can access @ShapeShift Twitter (check 1Password)
  [ ] Can post in Discord #announcements

PARTNER STATUS
  [ ] Partner contacted
  [ ] Partner confirmed launch date
      └── If NO: Launching without coordination (that's okay)

TIMING
  [ ] Launch date confirmed: ___________
  [ ] I'm available at launch time (or have backup)

READY TO LAUNCH?
  [YES] → Execute checklist
  [NOT YET] → What's blocking? Fix it or launch minimal.
```
```

---

### 2.11 Partner Kit Generator (NEW - src/lib/partnerKit.ts)

**Purpose:** Generate a shareable partner marketing kit that can be sent directly to the partner's marketing team.

**Interface:**
```typescript
interface PartnerAsk {
  ask: string;
  impact: 'high' | 'medium' | 'low';
  copyProvided: boolean;
  assetProvided: boolean;
  deadline: string;  // "Day 0", "Within 48 hours"
}

interface PartnerCopy {
  platform: 'twitter' | 'discord' | 'telegram' | 'newsletter' | 'blog';
  copy: string;
  hashtags: string[];
  mentions: string[];
}

interface PartnerKit {
  // Header
  protocolName: string;
  launchDate: string;
  shapeshiftContact: string;
  
  // What we're announcing
  announcement: {
    headline: string;
    summary: string;
    keyMessages: string[];
    valueForPartner: string;  // Why this is good for THEM
  };
  
  // What ShapeShift is doing
  ourPlan: {
    day: number;
    action: string;
    platform: string;
  }[];
  
  // Partner asks
  asks: {
    highImpact: PartnerAsk[];
    mediumImpact: PartnerAsk[];
    optional: PartnerAsk[];
  };
  
  // Ready-to-use content for partner
  partnerCopy: PartnerCopy[];
  
  // Assets
  assets: {
    name: string;
    description: string;
    path: string;  // Where to find it in the kit
  }[];
  
  // Timeline
  timeline: {
    date: string;
    action: string;
    owner: 'shapeshift' | 'partner' | 'both';
  }[];
  
  // Feedback mechanism
  feedbackUrl: string;  // Link to feedback form or GitHub issue
}

interface PartnerFeedback {
  partnerName: string;
  submittedAt: string;
  
  // What they can commit to
  canDo: string[];
  cantDo: string[];
  
  // Preferences
  preferredLaunchTime: string;
  additionalAssets: string[];  // "We need a vertical graphic"
  copyEdits: string;           // "Can you change X to Y?"
  
  // Their additions
  theyWillProvide: string[];   // "We'll also post a blog"
}

function generatePartnerKit(
  protocolName: string,
  brief: MarketingBrief,
  calendar: DistributionCalendar,
  shapeshiftContact: string
): Promise<PartnerKit>

function applyPartnerFeedback(
  kit: PartnerKit,
  feedback: PartnerFeedback
): Promise<PartnerKit>  // Regenerate with their input
```

**Partner Kit Output Format:**

```markdown
# {Protocol} Integration - Partner Marketing Kit

**For:** {Protocol} Marketing Team  
**From:** ShapeShift DAO  
**Launch:** {Date}  
**Contact:** {Name} ({Discord/Telegram})

---

## 🎯 What We're Announcing

{One paragraph summary}

**Why This Matters for {Protocol}:**
{Value prop from their perspective - more users, more volume, etc.}

**Key Messages:**
- {message 1}
- {message 2}
- {message 3}

---

## 📅 What ShapeShift Is Doing

| Day | Our Action | Platform |
|-----|------------|----------|
| 0 | Main announcement | Twitter, Discord, Blog |
| 1 | Educational thread | Twitter |
| 2-3 | User content, metrics | Twitter |
| 7 | Recap | Twitter |

---

## 🙏 Partner Asks

### High Impact (These really help!)

- [ ] **QT our main announcement** 
  - When: Day 0, within 2 hours of our post
  - Copy provided: ✅ (see below)
  
- [ ] **Post to your Discord**
  - When: Day 0
  - Copy provided: ✅ (see below)

### Medium Impact

- [ ] **Include in newsletter** (if you have one)
- [ ] **Create a tutorial video** (we can provide talking points)

### Optional / If Bandwidth

- [ ] **Host a Twitter Space together**
- [ ] **Share to Telegram**

---

## ✍️ Ready-to-Use Copy

### For {Protocol}'s Twitter

```
{Protocol} swaps are now live on @ShapeShift! 🦊

{One line value prop}

Self-custody. No KYC. Try it: {link}
```

### For {Protocol}'s Discord

```
Hey {Protocol} community! 

ShapeShift just shipped native {Protocol} support. 
{One line benefit}

Check it out: {link}
```

---

## 🎨 Assets Included

- [ ] Twitter graphic (1200x675)
- [ ] Discord banner (if applicable)
- [ ] Logo lockup (ShapeShift + {Protocol})

---

## ⏰ Suggested Timeline

| Date/Time | Action | Owner |
|-----------|--------|-------|
| {Date - 1} | Partner kit sent | ShapeShift |
| {Date} 08:30 | Blog goes live | ShapeShift |
| {Date} 09:00 | Main tweet | ShapeShift |
| {Date} 09:30 | Partner QT | **{Protocol}** |
| {Date} 10:00 | Discord posts | Both |

---

## 💬 Feedback & Coordination

**Have feedback on this kit?**

- Need different assets?
- Want to adjust the copy?
- Have a bigger idea?

→ [Submit feedback here]({feedback_url})

We'll adapt the plan based on your input!

---

**Questions?** Reach {contact} on Discord/Telegram.
```

**Feedback Integration:**

When partner submits feedback:
1. Tool loads `partner_feedback.yaml` 
2. Regenerates relevant sections
3. Notifies engineer: "Partner requested changes, regenerating..."
4. Updates `partner_kit.md` with adaptations

---

### 2.12 Metrics Logger (NEW - src/lib/metricsLogger.ts)

**Purpose:** Prompt engineer to log Day 7 metrics and capture learnings for future launches.

**Interface:**
```typescript
interface LaunchMetrics {
  launchId: string;
  protocolName: string;
  launchDate: string;
  metricsCollectedAt: string;
  
  // Core metrics
  twitter: {
    profileVisits: number;
    mainTweetImpressions: number;
    mainTweetEngagements: number;
    threadEngagements: number;
    followersDelta: number;
  };
  
  website: {
    trafficDelta: number;  // Percentage change
    blogPostViews: number;
    newUsers: number;
  };
  
  product: {
    swapVolumeDelta: number;  // Percentage change
    onchainTxCount: number;
    uniqueUsers: number;
  };
  
  partner: {
    partnerPosted: boolean;
    partnerReach: number;  // Their tweet impressions if known
    crossPromoEffectiveness: string;  // Qualitative
  };
  
  // Assessment
  overallScore: 'success' | 'okay' | 'underperformed' | 'failed';
  
  // Learnings
  whatWorked: string[];
  whatDidntWork: string[];
  nextTimeDo: string[];
  nextTimeAvoid: string[];
  
  // Notes
  notes: string;
}

interface MetricsPrompt {
  questions: {
    id: string;
    question: string;
    type: 'number' | 'text' | 'select' | 'multiselect';
    options?: string[];
    required: boolean;
  }[];
}

function generateMetricsPrompt(launchId: string): MetricsPrompt
function saveMetrics(launchId: string, metrics: LaunchMetrics): void
function generateLearningsSummary(metrics: LaunchMetrics): string
```

**Metrics Collection Flow:**

```
Day 7 arrives
     │
     ▼
Engineer gets reminder: "Time to log THORChain metrics!"
     │
     ▼
Opens metrics form (CLI or web)
     │
     ├── Twitter Analytics screenshot / numbers
     ├── GA dashboard numbers  
     ├── ShapeShift API query (auto if available)
     └── Qualitative: what worked / didn't
     │
     ▼
Metrics saved to launch history
     │
     ▼
AI generates learnings summary
     │
     ▼
Status updated: IN_PROGRESS → COMPLETE
```

---

### 2.15 Launch State Machine (NEW - src/lib/launchState.ts)

**Purpose:** Track launch state separately from content generation. Not all launches have a fixed timeline - materials may be generated days/weeks before launch date is confirmed.

**Launch States:**
```typescript
type LaunchState = 
  | 'GENERATED'        // Materials created, no timeline yet
  | 'PARTNER_CONTACTED' // Partner has the kit, awaiting response
  | 'LAUNCH_CONFIRMED'  // Date confirmed, countdown begins
  | 'LIVE'              // Day 0
  | 'IN_PROGRESS'       // Days 1-7/14
  | 'METRICS_DUE'       // Reminder to collect metrics
  | 'COMPLETE';         // Learnings generated

interface LaunchStatus {
  id: string;
  protocolName: string;
  state: LaunchState;
  
  // Timeline (filled in as confirmed)
  generatedAt: string;
  partnerContactedAt: string | null;
  launchDateConfirmed: string | null;  // When we set the date
  launchDate: string | null;           // The actual date
  metricsCollectedAt: string | null;
  completedAt: string | null;
  
  // State-specific data
  partnerContact: string | null;
  partnerResponseReceived: boolean;
  countdownStarted: boolean;
}
```

**CLI Commands for State Management:**
```bash
# After generating materials, contact partner
gtm status --launch thorchain --set partner-contacted

# Once partner confirms date
gtm status --launch thorchain --confirm-date 2026-02-15

# View current state
gtm status --launch thorchain

Output:
  Launch: THORChain
  State: LAUNCH_CONFIRMED ✓
  
  Timeline:
  ✓ Generated: Jan 22, 2026
  ✓ Partner Contacted: Jan 23, 2026
  ✓ Launch Date Confirmed: Feb 15, 2026
  ○ T-7: Feb 8 - Final partner feedback
  ○ T-1: Feb 14 - Final review
  → T-0: Feb 15 - LAUNCH DAY
  ○ T+7: Feb 22 - Collect metrics
```

**Flexible Timeline:**

```
Feature flag merged
        │
        ▼
GitHub Action runs → gtm research --auto
        │
        ▼
State: GENERATED
Materials ready, but NO countdown yet
        │
        ▼
Engineer sends partner kit
        │
        ▼
gtm status --launch {protocol} --set partner-contacted
State: PARTNER_CONTACTED
        │
        ▼
Partner responds, date agreed
        │
        ▼
gtm status --launch {protocol} --confirm-date {date}
State: LAUNCH_CONFIRMED
        │
        ▼
System calculates: T-7, T-3, T-1, T-0, T+7
Reminders scheduled automatically
        │
        ▼
T-0: State → LIVE
T+1: State → IN_PROGRESS
T+7: State → METRICS_DUE (reminder sent)
After metrics: State → COMPLETE
```

**Why This Matters:**
- Feature flag may be merged weeks before launch is ready
- Partner may need time to coordinate internally
- Launch date may shift based on partner availability
- System adapts to real-world coordination

---

### 2.16 Press Feedback Loop (NEW - src/lib/pressFeedback.ts)

**Purpose:** Collect feedback from press agency on what worked, what got picked up, and how materials were edited. This feeds back into the learning system.

**Interface:**
```typescript
interface PressSubmission {
  launchId: string;
  submittedAt: string;
  
  // What actually went out (vs what was generated)
  pressReleaseEdits: {
    original: string;
    edited: string;
    editReason: string;
  } | null;
  
  opEdsSent: {
    angle: string;
    publication: string;
    author: string;
    status: 'sent' | 'picked_up' | 'rejected' | 'pending';
  }[];
  
  // Results
  coverage: {
    outlet: string;
    url: string;
    headline: string;
    publishedAt: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  
  // Engagement (if trackable)
  engagement: {
    totalImpressions: number | null;
    socialShares: number | null;
    backlinks: number | null;
  };
  
  // Qualitative feedback
  whatWorkedWell: string[];
  whatToImprove: string[];
  suggestionsForFuture: string[];
}

interface PressLearnings {
  // Aggregated from past submissions
  editsAgencyMakes: string[];  // Common edits they make
  publicationsThatPickUp: string[];
  publicationsThatDont: string[];
  anglesMediaLikes: string[];
  anglesMediaIgnores: string[];
  headlinePatternsThatWork: string[];
  timingInsights: string[];
}

function submitPressFeedback(feedback: PressSubmission): void
function aggregatePressLearnings(submissions: PressSubmission[]): PressLearnings
function applyPressLearningsToContent(
  pressSuite: PressSuiteResult,
  learnings: PressLearnings
): PressSuiteResult
```

**Press Feedback Form (press/press_feedback.yaml):**
```yaml
# Press Agency Feedback
# Fill this out after the launch and send back to ShapeShift
# Run: gtm press-feedback --launch {protocol}

launch_id: thorchain-2026-01

# What did you edit in the press release?
press_release_edits:
  made_edits: true
  summary: "Shortened lede, added more specific numbers"
  # Paste the version you sent out:
  final_version: |
    ...

# Which op-eds did you pitch?
op_eds_pitched:
  - angle: political
    publication: CoinDesk
    author: "Erik Voorhees"
    status: picked_up  # sent | picked_up | rejected | pending
    
  - angle: technical
    publication: The Block
    author: "Lead Engineer"
    status: pending

# Coverage received
coverage:
  - outlet: CoinDesk
    url: "https://..."
    headline: "ShapeShift Adds Native THORChain Swaps"
    sentiment: positive  # positive | neutral | negative
    
  - outlet: Decrypt
    url: "https://..."
    headline: "..."
    sentiment: positive

# Engagement (if you can track it)
engagement:
  total_impressions: 45000
  social_shares: 234
  backlinks: 12

# Your feedback for the AI
what_worked:
  - "The self-custody angle resonated well"
  - "Numbers in the press release helped"
  
what_to_improve:
  - "Op-eds were too long - publications want 600-800 words"
  - "Need more timely news hooks"
  
suggestions:
  - "Include a quote from the partner protocol"
  - "Add comparison data to competitors"
```

**How Press Learnings Feed Back:**

```
Press feedback submitted
         │
         ▼
Aggregate with past submissions
         │
         ├── "Agency always shortens lede → write tighter ledes"
         ├── "CoinDesk picks up political angles 70% of time"
         ├── "Op-eds over 1000 words rarely get picked up"
         └── "Self-custody messaging consistently resonates"
         │
         ▼
Apply to future press generation
         │
         ├── Tighter press release ledes
         ├── Prioritize political angle for CoinDesk
         ├── Cap op-eds at 800 words
         └── Emphasize self-custody in all materials
```

**Press Learnings in Future Prompts:**

```
## Press Learnings (from agency feedback)

WHAT GETS PICKED UP:
- Self-custody / sovereignty angles
- Specific numbers and metrics
- Timely news hooks

WHAT DOESN'T WORK:
- Op-eds over 1000 words (keep to 600-800)
- Generic "we're excited" language
- Technical jargon without explanation

COMMON EDITS AGENCY MAKES:
- Shortens lede to 1-2 sentences
- Adds specific numbers
- Removes marketing language

APPLY THIS BY:
- Writing tighter ledes
- Including specific metrics upfront
- Keeping op-eds under 800 words
```

**CLI Interface:**

```bash
gtm metrics --launch thorchain-2026-01

# Interactive prompts:
? Twitter profile visits (Day 0-7): 1,234
? Main tweet impressions: 45,000
? Main tweet engagements: 892
? Website traffic change (%): +15
? Blog post views: 2,100
? Swap volume change (%): +8
? Onchain transactions: 156
? Did partner post? (Y/n): Y
? What worked well? (comma-separated): 
  > Educational thread got lots of saves, partner QT timing was perfect
? What didn't work? (comma-separated):
  > Discord engagement was low, metrics thread underperformed
? Overall assessment: (success / okay / underperformed / failed): success
? Any notes?: 
  > Consider doing Twitter Space next time for this tier

✅ Metrics saved to gtm-launches/2026-01-thorchain/metrics.json
📊 Learnings summary generated
```

**Auto-Generated Learnings:**

```markdown
# THORChain Launch - Post-Mortem

**Launch Date:** January 30, 2026  
**Assessment:** ✅ Success

## Metrics Summary

| Metric | Actual | Target | Status |
|--------|--------|--------|--------|
| Profile Visits | 1,234 | >500 | 🟢 +147% |
| Tweet Engagements | 892 | >200 | 🟢 +346% |
| Website Traffic | +15% | +10% | 🟢 |
| Swap Volume | +8% | +5% | 🟢 |
| Onchain Txs | 156 | >100 | 🟢 |

## What Worked
- Educational thread got lots of saves
- Partner QT timing was perfect
- Day 1 follow-up drove second wave of engagement

## What Didn't Work
- Discord engagement was low
- Metrics thread (Day 5) underperformed

## Recommendations for Future Launches
- ✅ DO: Time partner QT within 30 min of main post
- ✅ DO: Educational thread on Day 1
- ❌ AVOID: Metrics thread mid-week (try weekend)
- 💡 TRY: Twitter Space for Tier 1+ launches

---
*Generated by GTM Coordinator | Learn from every launch*
```

---

### 2.13 Marketing Brief Generator (NEW - src/lib/marketingBrief.ts)

**Purpose:** Generate structured answers to 7 core marketing questions.

**Interface:**
```typescript
interface MarketingBrief {
  // The 7 Core Questions
  targetAudience: {
    who: string;
    whatWeKnow: string;
    psychographics: string;  // Motivations, pain points
  };
  
  problemSolved: {
    problem: string;
    ahaMonent: string;
    beforeAfter: string;  // "Before X, now Y"
  };
  
  gtmOneSentence: string;  // ELI10 - explain like I'm 10
  
  businessOutcomes: {
    outcomes: string[];
    metrics: string[];  // How we'll measure
  };
  
  wildSuccess: {
    vision: string;
    timeframe: string;
    indicators: string[];
  };
  
  uniqueVsCompetitors: {
    competitors: string[];
    differentiators: string[];
    positioningStatement: string;
  };
  
  keyMessages: {
    primary: string;
    supporting: string[];
    tweetReady: string;  // Ready to copy-paste
  };
  
  // Add-ons
  risksAndConstraints: {
    risks: string[];
    mitigations: string[];
    timingConsiderations: string;
  };
  
  requiredAssets: {
    socialPosts: { needed: boolean; status: string };
    designCreative: { needed: boolean; status: string };
    webProduct: { needed: boolean; status: string };
    email: { needed: boolean; status: string };
    partnerBrief: { needed: boolean; status: string };
    internalDocs: { needed: boolean; status: string };
  };
  
  additionalQuestions: string[];  // AI-surfaced questions we didn't ask
}

function generateMarketingBrief(
  protocol: ProtocolAnalysis,
  githubContext: GitHubContext | null,
  competitorIntel: CompetitorIntelResult | null,
  feedback: Feedback | null
): Promise<MarketingBrief>
```

**Key message principle (applies to all protocols and features):**  
The GTM one-sentence and key messages (primary, supporting, tweet-ready) must be **actual marketing copy**. Lead with the product/feature benefit that compels—e.g. "now live," "do X, get Y," "rewards in your wallet every month." ShapeShift differentiators (no custody, privacy, no KYC) are **supporting** messages, not the default lead. If the main hook is only "keeping your keys safe" or "no custody," reframe so the lead is what the user gets or does (earn, stake, swap, get paid, etc.). This principle persists across all research-output folders and generated content.

---

### 2.9 Feedback Loader (NEW - src/lib/feedbackLoader.ts)

**Purpose:** Load and apply user feedback for iterative refinement.

**Interface:**
```typescript
interface Feedback {
  // Override any section
  targetAudience?: {
    override?: string;
    add?: string;
    remove?: string;
  };
  
  tone?: {
    override?: string;  // e.g., "more degen", "more professional"
  };
  
  keyMessages?: {
    add?: string[];
    remove?: string[];
    emphasize?: string[];
  };
  
  competitors?: {
    add?: string[];
    ignore?: string[];
  };
  
  wildCards?: {
    moreOf?: string;  // e.g., "more meme ideas"
    avoid?: string;   // e.g., "nothing controversial"
  };
  
  customInstructions?: string;  // Freeform instructions for GPT
}

function loadFeedback(outputDir: string): Feedback | null
function generateFeedbackTemplate(outputDir: string): void
function applyFeedback(brief: MarketingBrief, feedback: Feedback): string  // Returns prompt modifier
```

**feedback.yaml Template:**
```yaml
# GTM Research Feedback
# Edit this file and re-run with: gtm research --refine
# 
# Any field you set will override or modify the AI's output.

target_audience:
  # override: "Focus specifically on yield farmers who use Yearn"
  # add: "Also consider institutional DeFi users"
  # remove: "Don't target developers"

tone:
  # override: "More crypto-native/degen, less corporate"

key_messages:
  # add:
  #   - "Emphasize the gas savings"
  #   - "Mention the audit status"
  # remove:
  #   - "Don't compare to competitors directly"
  # emphasize:
  #   - "Self-custody angle"

competitors:
  # add:
  #   - "Zapper"
  #   - "DeBank"
  # ignore:
  #   - "Uniswap"  # Not really a competitor for this

wild_cards:
  # more_of: "community challenges and gamification"
  # avoid: "anything controversial or edgy"

custom_instructions: |
  # Add any custom instructions for the AI here.
  # Example: "Make sure to mention the rFOX rewards program"
```

---

### 2.10 Index Generator (NEW - src/lib/indexGenerator.ts)

**Purpose:** Generate a navigable HTML index page with all outputs.

**Interface:**
```typescript
interface IndexSection {
  id: string;
  title: string;
  content: string;  // HTML content
  files?: { name: string; path: string; description: string }[];
}

function generateIndexHTML(
  protocolName: string,
  brief: MarketingBrief,
  intelligence: {
    narratives: NarrativeScanResult;
    competitors: CompetitorIntelResult;
    timing: TimingRecommendation;
    wildCards: WildCardResult;
  },
  calendar: DistributionCalendar,
  outputDir: string
): string
```

**HTML Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GTM Packet: {Protocol}</title>
  <style>
    /* Modern, clean, print-friendly CSS */
    /* Use system fonts, good contrast, collapsible sections */
  </style>
</head>
<body>
  <header>
    <h1>{Protocol} GTM Packet</h1>
    <p class="tagline">{One-sentence GTM idea}</p>
    <p class="meta">Generated: {date} | Tier: {tier}</p>
  </header>

  <!-- MARKETING BRIEF (THE 7 QUESTIONS) -->
  <section id="brief">
    <h2>Marketing Brief</h2>
    <!-- Each question with answer -->
  </section>

  <!-- INTELLIGENCE -->
  <section id="intelligence">
    <h2>Market Intelligence</h2>
    <div id="narratives">...</div>
    <div id="competitors">...</div>
    <div id="timing">...</div>
    <div id="wildcards">...</div>
  </section>

  <!-- DISTRIBUTION CALENDAR -->
  <section id="calendar">
    <h2>Distribution Calendar</h2>
    <!-- Day-by-day schedule -->
  </section>

  <!-- GENERATED ASSETS -->
  <section id="assets">
    <h2>Generated Assets</h2>
    <ul>
      <li><a href="drafts/x_post.md">Twitter Thread</a></li>
      <!-- etc -->
    </ul>
  </section>

  <!-- IMPLEMENTATION DETAILS -->
  <section id="implementation">
    <h2>Implementation Details (from GitHub)</h2>
    <!-- PR info, code changes -->
  </section>

  <footer>
    <p>Generated by GTM Coordinator v0.3.0</p>
    <p>To refine: edit feedback.yaml and run <code>gtm research --refine</code></p>
  </footer>
</body>
</html>
```

---

### 2.11 Research Orchestrator (MODIFY - src/lib/researchAgent.ts)

**Purpose:** Coordinate all modules and aggregate results.

**Updated Interface:**
```typescript
interface ResearchConfig {
  protocolName: string;
  websiteUrl: string;
  prUrl?: string;
  tier: number;
  skipGithub?: boolean;
  skipIntelligence?: boolean;
  refine?: boolean;  // Load feedback.yaml
}

interface FullResearchResults {
  // Existing
  protocol: ProtocolAnalysis;
  content: ContentDrafts;
  
  // New
  github: GitHubContext | null;
  brief: MarketingBrief;
  intelligence: {
    narratives: NarrativeScanResult;
    competitors: CompetitorIntelResult;
    timing: TimingRecommendation;
    wildCards: WildCardResult;
  };
  calendar: DistributionCalendar;
}

async function runFullResearch(
  config: ResearchConfig,
  onProgress?: (step: string, progress: number) => void
): Promise<FullResearchResults>
```

**Orchestration Flow:**
```
1. Load feedback.yaml if --refine
2. Fetch protocol website
3. Search GitHub (parallel with step 2 if no --no-github)
4. Build aggregated context
5. Generate Marketing Brief
6. Run intelligence modules (parallel):
   - Narrative Scanner
   - Competitor Intel
   - Timing Intel
   - Wild Card Generator
7. Generate content drafts (parallel):
   - Twitter thread
   - Discord announcement
   - Blog draft
   - Partner brief
   - Release notes
   - User guide
8. Generate distribution calendar
9. Generate HTML index
10. Write all output files
```

---

## 3. Data Models

### 3.1 Protocol Analysis (Existing)
```typescript
interface ProtocolAnalysis {
  name: string;
  tagline: string;
  category: string;
  keyFeatures: string[];
  targetAudience: string[];
  valueProposition: string;
  technicalHighlights: string[];
  integrationOpportunities: string[];
  risks: string[];
  competitorComparison: string;
}
```

### 3.2 Content Drafts (Expanded)
```typescript
interface ContentDrafts {
  // Core announcements (from @ShapeShift main)
  blogDraft: string;        // Full blog for Strapi CMS
  xPostMain: string;        // Main announcement thread (@ShapeShift)
  discordPost: string;      // Discord #announcements
  farcasterPost: string;    // Farcaster cross-post
  infoBotQT: string;        // QT of @ShapeShiftInfoBot showing swap
  
  // Personal account content (from engineer's account)
  xPostPersonal: string;    // Personal take, QTs the main thread
  personalWalkthrough: string;  // "Here's how I built this" thread
  
  // Follow-up content (Days 1-7, from @ShapeShift)
  followupEducational: string;  // Day 1: "How to use" thread
  followupMetrics: string;      // Day 4-6: Data/stats thread
  followupRecap: string;        // Day 7: "In case you missed it"
  
  // Supporting materials
  userGuide: string;
  partnerBrief: string;
  releaseNotesShort: string;
  releaseNotesLong: string;
}
```

**Account Assignment in Output:**
```markdown
## Twitter Content

### From @ShapeShift (main account)
- drafts/x_post_main.md — Main announcement
- drafts/infobot_qt.md — QT the info bot showing swap
- drafts/followup_*.md — All follow-up threads

### From Your Personal Account  
- drafts/x_post_personal.md — Your take, QT the main thread
- drafts/personal_walkthrough.md — "Here's how I built this"

### Coordination
1. @ShapeShift posts main thread
2. You QT from personal within 30 min
3. @ShapeShift QTs your personal take
4. @ShapeShift QTs the info bot
```

---

## 4. API Contracts

### 4.1 GitHub API
```
Base URL: https://api.github.com

Headers:
  Authorization: Bearer {GITHUB_TOKEN}  (optional)
  Accept: application/vnd.github.v3+json
  User-Agent: GTM-Coordinator/0.3.0

Endpoints:
  GET /search/issues?q={query}+org:shapeshift+type:pr
  GET /repos/{owner}/{repo}/pulls/{number}
  GET /repos/{owner}/{repo}/pulls/{number}/files
  GET /search/code?q={query}+org:shapeshift

Rate Limits:
  - Unauthenticated: 60/hour
  - Authenticated: 5000/hour
```

### 4.2 OpenAI API (Existing)
```
Model: gpt-4o
Temperature: 0.7 (content), 0.5 (analysis), 0.9 (wild cards)
Max Tokens: 4096 (default), 8192 (blog draft)
Response Format: json_object (for structured outputs)
```

---

## 5. Prompts

### 5.1 Marketing Brief Prompt
```
You are a marketing strategist creating a GTM brief for ShapeShift DAO.

## ShapeShift Context
- Vision: Self-custodial future of sovereign finance
- Values: No custody, open code, decentralization, no KYC
- Voice: Principled, empowering, community-minded, visionary

## Protocol Context
{protocolAnalysis}

## Implementation Context (from GitHub)
{githubContext}

## Competitor Context
{competitorIntel}

## User Feedback (if any)
{feedback}

Generate a Marketing Brief answering these questions in PLAIN LANGUAGE (no marketing jargon):

1. **Who are we speaking to?** Be specific about the audience segments and what we know about them.

2. **What problem are we solving?** What's the "aha" moment when users discover this?

3. **GTM idea in one sentence** - Explain it like you're talking to a smart 10-year-old. This must be **actual marketing**: lead with what's live / what the user does / what they get (e.g. stake X, earn Y; rewards in wallet). Do not lead with "keeping your keys safe" or "no custody" alone—use those as supporting differentiators.

4. **Business outcomes** - What specifically changes? How will we measure it?

5. **Wild success** - Paint a picture of the best-case scenario.

6. **Unique vs competitors** - Why would someone choose ShapeShift for this over alternatives?

7. **Key messages** - Write a ready-to-post social announcement. Primary and tweet-ready must lead with the product/feature benefit (earn, get paid, now live, etc.); no custody/privacy are supporting messages, not the main hook.

Also include:
- Risks and constraints (blockers, timing, narrative risks)
- Required assets checklist
- 2-3 additional questions the team should consider

Respond in JSON format matching the MarketingBrief interface.
```

### 5.2 Narrative Scanner Prompt
```
You are a crypto marketing analyst scanning the current narrative landscape.

Protocol Category: {category}
Protocol Keywords: {keywords}

Identify 3-5 trending narratives in crypto Twitter that this launch could tie into.

For each narrative:
- What is it about?
- How relevant is it to this protocol (0-1 score)?
- How could ShapeShift tie this launch into the narrative?
- Give 1-2 example tweet hooks using this narrative

Also provide 3 ready-to-use narrative hooks for the launch.

Respond in JSON format matching NarrativeScanResult.
```

### 5.3 Competitor Intelligence Prompt
```
You are a competitive analyst researching how other projects announced similar integrations.

Protocol: {protocolName}
Category: {category}

Based on your knowledge:
1. Who are the likely competitors that might have integrated similar protocols?
2. What are best practices for announcing DeFi integrations?
3. What typically works well in these announcements?
4. How can ShapeShift differentiate its announcement?

Provide specific, actionable insights. Avoid generic advice.

Respond in JSON format matching CompetitorIntelResult.
```

### 5.4 Wild Card Generator Prompt
```
You are a creative marketing strategist generating unconventional ideas.

Protocol: {protocolName}
Category: {category}
Target Audiences: {audiences}

Generate 3-5 "wild card" marketing ideas that are:
- Unexpected and attention-grabbing
- Higher risk but potentially high reward
- Feasible for a DAO with limited resources
- Aligned with crypto/DeFi culture

Categories to consider:
- Meme marketing
- Community challenges
- Controversial takes
- Guerrilla tactics
- Interactive content

For each idea, provide:
- Title and description
- Risk level (medium/high/yolo)
- Potential upside and downside
- Implementation difficulty
- Resources needed
- Example execution

Be creative! These should make people say "that's crazy... but it might work."

Respond in JSON format matching WildCardResult.
```

### 5.5 Distribution Calendar Prompt
```
You are a content strategist planning a launch distribution calendar.

Tier: {tier}
Enabled Channels: {channels}
Available Content: {contentList}

Create a day-by-day distribution calendar following ShapeShift's playbook:

Day 0 (Launch):
- Blog → Main tweet → Thread → Discord → Contributor QTs → Farcaster

Day 1:
- Video content → Educational thread

Day 2-3:
- User reactions, data threads, partner content

Day 7:
- Recap thread

For each scheduled post, specify:
- Exact time (EST)
- Platform
- Content piece to use
- Action (Publish, QT, Cross-post)
- Notes

Optimize for maximum engagement and content ROI.

Respond in JSON format matching DistributionCalendar.
```

---

## 6. File Structure

### 6.1 Source Files
```
gtm-coordinator/
├── src/
│   ├── cli.ts                      # CLI entry point
│   ├── commands/
│   │   └── research.ts             # MODIFY: Add new options + --auto flag
│   └── lib/
│       ├── openai.ts               # EXISTING: OpenAI client
│       ├── webFetch.ts             # EXISTING: Website fetcher
│       ├── researchAgent.ts        # MODIFY: Add orchestration
│       ├── github.ts               # NEW: GitHub API client
│       ├── marketingBrief.ts       # NEW: Brief generator
│       ├── narrativeScanner.ts     # NEW: Trend scanner
│       ├── competitorIntel.ts      # NEW: Competitor discovery + analysis
│       ├── dmTargets.ts            # NEW: DM target generator
│       ├── timingIntel.ts          # NEW: Timing recommendations
│       ├── wildCardGenerator.ts    # NEW: Wild ideas (budget-constrained)
│       ├── pressSuite.ts           # NEW: Press release, PR brief, op-eds
│       ├── designBrief.ts          # NEW: Design briefs + AI prompts
│       ├── actionChecklist.ts      # NEW: Engineer checklist generator
│       ├── distributionPlaybook.ts # NEW: Calendar generator
│       ├── indexGenerator.ts       # NEW: HTML generator
│       ├── feedbackLoader.ts       # NEW: Feedback handling
│       ├── partnerKit.ts           # NEW: Partner marketing kit generator
│       ├── metricsLogger.ts        # NEW: Post-launch metrics collection
│       ├── learningsIntegration.ts # NEW: Read past launches, adapt content
│       ├── launchState.ts          # NEW: Launch state machine
│       ├── pressFeedback.ts        # NEW: Press agency feedback loop
│       └── pressEmailer.ts         # NEW: Auto-email press folder
```

### 6.2 Output Structure
```
research-output/{protocol}/
├── index.html                      # Main navigable page (starts with TL;DR)
├── checklist.md                    # ACTION CHECKLIST for engineer
├── marketing_brief.json            # Structured brief data
├── feedback.yaml                   # Template for refinement
│
├── intelligence/
│   ├── narrative_scan.md
│   ├── competitor_intel.md
│   ├── timing_recommendations.md
│   └── wild_cards.md
│
├── research/
│   ├── protocol_analysis.json
│   ├── github_context.json
│   ├── gtm_strategy.md
│   └── implementation_notes.md
│
├── drafts/
│   ├── blog_draft.md               # Full blog for Strapi CMS
│   │
│   ├── ## FROM @SHAPESHIFT (main account)
│   ├── x_post_main.md              # Main announcement thread
│   ├── infobot_qt.md               # QT @ShapeShiftInfoBot showing swap
│   ├── discord_post.md             # Discord #announcements
│   ├── farcaster_post.md           # Farcaster cross-post
│   ├── followup_educational.md     # Day 1: Educational thread
│   ├── followup_metrics.md         # Day 4-6: Data/metrics thread
│   ├── followup_recap.md           # Day 7: Recap thread
│   │
│   ├── ## FROM YOUR PERSONAL ACCOUNT
│   ├── x_post_personal.md          # Your take, QT the main thread
│   ├── personal_walkthrough.md     # "Here's how I built this" (optional)
│   │
│   ├── ## SUPPORTING
│   ├── user_guide.md
│   ├── partner_brief.md
│   ├── release_notes_short.md
│   └── release_notes_long.md
│
├── outreach/
│   ├── dm_targets.md               # WHO to DM + personalized messages
│   └── partner_contacts.md         # Protocol team contacts
│
├── press/                          # Auto-emailed to press agency
│   ├── press_release.md            # Formal press release
│   ├── pr_brief.md                 # Talking points for spokespeople
│   ├── op_ed_political.md          # Political/regulatory angle
│   ├── op_ed_technical.md          # Builder/technical angle
│   ├── op_ed_philosophical.md      # Sovereignty/values angle
│   ├── op_ed_market.md             # Market trends angle
│   └── press_feedback.yaml         # Agency fills in after launch
│
├── design/
│   ├── design_brief.md             # For human designer
│   └── ai_prompts.txt              # Ready-to-paste Midjourney/DALL-E
│
├── partner/                        # SEND TO PARTNER
│   ├── partner_kit.md              # Full partner marketing kit
│   ├── partner_kit.pdf             # PDF version (shareable)
│   ├── partner_copy.txt            # Just the copy, easy to grab
│   ├── partner_feedback.yaml       # Partner fills this in
│   └── assets/                     # Graphics for partner
│       ├── twitter_graphic.png
│       └── logo_lockup.png
│
├── distribution/
│   ├── calendar.md
│   └── playbook.md
│
└── automation/
    └── github_action.yml           # Ready to copy into repo
```

---

## 7. CLI Interface

### 7.1 Command Signatures

**Research Command (Generate GTM Packet)**
```bash
gtm research [options]

Options:
  --protocol <name>     Protocol name (required)
  --url <url>           Protocol website URL (required)
  --pr <url>            GitHub PR URL (optional, auto-searches if not provided)
  --tier <0|1|2>        Tier level (default: 1)
  --id <id>             GTM plan ID to update (optional)
  --output <dir>        Output directory (default: ./research-output/{protocol})
  --no-github           Skip GitHub search
  --no-intelligence     Skip intelligence modules (narratives, competitors, etc.)
  --refine              Load feedback.yaml and regenerate
  --partner-feedback    Load partner_feedback.yaml and regenerate partner kit
  --no-index            Skip HTML index generation
  --auto                Auto mode: email press folder, notify engineer (for CI/CD)
  --press-email <addr>  Email address for press agency (used with --auto)
  --notify <webhook>    Slack/Discord webhook for notification (used with --auto)
  -h, --help            Display help
```

**Metrics Command (Log Post-Launch Metrics)**
```bash
gtm metrics [options]

Options:
  --launch <id>         Launch ID (e.g., "thorchain-2026-01") (required)
  --interactive         Interactive mode with prompts (default)
  --from-file <path>    Load metrics from JSON file
  --output <dir>        Output directory (default: same as launch packet)
  -h, --help            Display help

Examples:
  gtm metrics --launch thorchain-2026-01
  gtm metrics --launch thorchain-2026-01 --from-file metrics.json
```

**List Command (View Launch History)**
```bash
gtm list [options]

Options:
  --status <status>     Filter by status (generated, confirmed, live, complete)
  --limit <n>           Number of launches to show (default: 10)
  -h, --help            Display help

Example output:
  | Launch      | State              | Launch Date | Score      |
  |-------------|--------------------| ------------|------------|
  | thorchain   | ⏳ LAUNCH_CONFIRMED | Feb 15      | —          |
  | arbitrum    | ✅ COMPLETE         | Jan 15      | 🟢 Success |
  | base        | ✅ COMPLETE         | Dec 10      | 🟢 Success |
  | yield       | 📦 GENERATED        | TBD         | —          |
```

**Status Command (Manage Launch State)**
```bash
gtm status [options]

Options:
  --launch <id>              Launch ID (required)
  --set <state>              Set state: partner-contacted
  --confirm-date <date>      Confirm launch date (starts countdown)
  -h, --help                 Display help

Examples:
  # View current status
  gtm status --launch thorchain
  
  # Mark partner as contacted
  gtm status --launch thorchain --set partner-contacted
  
  # Confirm launch date (starts T-minus countdown)
  gtm status --launch thorchain --confirm-date 2026-02-15

Example output:
  Launch: THORChain
  State: LAUNCH_CONFIRMED ✓
  
  Timeline:
  ✓ Generated: Jan 22, 2026
  ✓ Partner Contacted: Jan 23, 2026
  ✓ Launch Date Confirmed: Feb 15, 2026
  
  Countdown:
  ○ T-7 (Feb 8): Final partner feedback due
  ○ T-3 (Feb 12): Regenerate if needed
  ○ T-1 (Feb 14): Final review
  → T-0 (Feb 15): LAUNCH DAY
  ○ T+7 (Feb 22): Collect metrics
```

**Press Feedback Command**
```bash
gtm press-feedback [options]

Options:
  --launch <id>              Launch ID (required)
  --from-file <path>         Load from YAML file
  -h, --help                 Display help

Example:
  # Submit press feedback after launch
  gtm press-feedback --launch thorchain --from-file press_feedback.yaml
```

### 7.2 Example Usage
```bash
# Full research
gtm research --protocol "Yield.xyz" --url "https://yield.xyz"

# With specific PR
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" \
  --pr "https://github.com/shapeshift/web/pull/8752"

# Quick mode (website + AI only)
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" \
  --no-github --no-intelligence

# Refine after editing feedback.yaml
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" --refine

# High-tier launch
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" --tier 2
```

---

## 8. Dependencies

### 8.1 New Dependencies
```json
{
  "dependencies": {
    "openai": "^4.77.0",        // Existing
    // No new dependencies needed - using native fetch for GitHub API
  }
}
```

### 8.2 Node.js Requirements
- Node.js 18+ (for native fetch)
- ES Modules (already configured)

---

## 9. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o |
| `GITHUB_TOKEN` | No | GitHub personal access token (recommended for higher rate limits) |

### 9.1 Getting a GitHub Token
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `public_repo`, `read:org`
4. Copy token and set: `export GITHUB_TOKEN="ghp_..."`

---

## 10. Testing Plan

### 10.1 Unit Tests
- [ ] GitHub client: Mock API responses, test parsing
- [ ] Marketing Brief: Test JSON structure validation
- [ ] Index Generator: Test HTML output structure
- [ ] Feedback Loader: Test YAML parsing and application

### 10.2 Integration Tests
- [ ] Full research flow with mock OpenAI responses
- [ ] GitHub search with real API (use test token)
- [ ] Feedback refinement loop

### 10.3 Manual Testing
```bash
# Test 1: Basic flow
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" --no-github

# Test 2: With GitHub
export GITHUB_TOKEN="your-token"
gtm research --protocol "THORChain" --url "https://thorchain.org"

# Test 3: Refinement
# Edit feedback.yaml
gtm research --protocol "Yield.xyz" --url "https://yield.xyz" --refine

# Test 4: Full flow with PR
gtm research --protocol "Arbitrum" --url "https://arbitrum.io" \
  --pr "https://github.com/shapeshift/web/pull/1234"

# Test 5: Auto mode (CI/CD simulation)
gtm research --protocol "THORChain" --url "https://thorchain.org" \
  --auto --press-email "press@agency.com" --notify "https://hooks.slack.com/..."
```

---

## 11. GitHub Automation

**Trigger:** When a PR that enables a feature flag is merged to main, automatically run GTM research and notify the team.

### 11.1 GitHub Action Workflow

```yaml
# .github/workflows/gtm-launch-trigger.yml
name: GTM Launch Trigger

on:
  pull_request:
    types: [closed]
    branches: [main, develop]
    paths:
      - 'src/config/feature-flags/**'
      - 'src/features/**'

jobs:
  detect-and-launch:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Detect Feature Flag Change
        id: detect
        run: |
          # Parse PR title/body for protocol name
          # Look for patterns like "Enable THORChain" or "[Feature] Yield.xyz integration"
          PROTOCOL=$(echo "${{ github.event.pull_request.title }}" | grep -oP '(?<=Enable |Feature: |Integration: )\w+' || echo "")
          
          if [ -n "$PROTOCOL" ]; then
            echo "protocol=$PROTOCOL" >> $GITHUB_OUTPUT
            echo "should_run=true" >> $GITHUB_OUTPUT
          else
            echo "should_run=false" >> $GITHUB_OUTPUT
          fi
          
      - name: Install GTM Coordinator
        if: steps.detect.outputs.should_run == 'true'
        run: npm install -g gtm-coordinator
        
      - name: Run GTM Research
        if: steps.detect.outputs.should_run == 'true'
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gtm research \
            --protocol "${{ steps.detect.outputs.protocol }}" \
            --url "https://${{ steps.detect.outputs.protocol }}.xyz" \
            --pr "${{ github.event.pull_request.html_url }}" \
            --auto \
            --press-email "${{ secrets.PRESS_AGENCY_EMAIL }}" \
            --notify "${{ secrets.SLACK_WEBHOOK }}"
            
      - name: Upload GTM Packet
        if: steps.detect.outputs.should_run == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: gtm-packet-${{ steps.detect.outputs.protocol }}
          path: research-output/${{ steps.detect.outputs.protocol }}/
          
      - name: Comment on PR
        if: steps.detect.outputs.should_run == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🚀 GTM Packet Generated!
              
              The marketing automation has generated a launch packet for **${{ steps.detect.outputs.protocol }}**.
              
              **Next steps:**
              1. Download the packet from the workflow artifacts
              2. Review \`checklist.md\` for your action items
              3. Press materials have been sent to the agency
              
              [View Workflow Run](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})`
            })
```

### 11.2 Required Secrets

| Secret | Purpose |
|--------|---------|
| `OPENAI_API_KEY` | For GPT-4o calls |
| `GITHUB_TOKEN` | Auto-provided, for GitHub API |
| `PRESS_AGENCY_EMAIL` | Email address to send press/ folder |
| `SLACK_WEBHOOK` | Slack webhook for notifications |

### 11.3 Notification Format

**Slack Message:**
```
🚀 *GTM Packet Ready: {Protocol}*

A new feature has been deployed and the marketing packet is ready.

*Engineer:* @{pr_author}
*Tier:* {tier}
*Est. Launch Time:* ~2.5 hours over 7 days

📋 *Quick Links:*
• <{artifact_url}|Download Packet>
• <{checklist_url}|View Checklist>

Press materials have been automatically sent to the agency.
```

### 11.4 Press Agency Email

**Subject:** `[ShapeShift] GTM Materials: {Protocol} Integration`

**Body:**
```
Hi team,

ShapeShift has just deployed a new integration: {Protocol}.

Attached is the press packet containing:
- Press release (ready to distribute)
- PR brief (talking points)
- Op-ed templates (4 angles for contributor bylines)

Launch is expected within 24-48 hours. Please review and 
let us know if you need any clarification.

Best,
ShapeShift GTM Automation
```

**Attachment:** `{protocol}_press_packet.zip` (contents of press/ folder)

---

## Appendix A: ShapeShift Brand Context

Include in all GPT prompts:

```
## ShapeShift Brand Context

**Vision:** A world where anyone, anywhere can seamlessly access decentralized finance. A self-custodial future of sovereign finance that is open, borderless, and in your hands.

**Mission:** ShapeShift is a global community of high-quality builders accelerating access to a decentralized, self-sovereign financial system. With no custody, open code, and modular DeFi tools, we empower individuals to connect directly with the open protocols shaping the future.

**Brand Voice:**
- Speak in 3rd person omniscient (authoritative and trusted)
- Principled: Self-custody is king, privacy is a human right, open source transparency, no KYC, decentralization & free markets
- Empowering: Show users the value clearly, let users visualize themselves in control
- Community-minded: Highlight user journeys, spotlight contributors and partners
- Visionary: Post about macro trends, crosschain flows, and ecosystem shifts

**Content Guidelines:**
- Clean, simple messaging that highlights user value
- CTAs should incite curiosity, pose questions, and drive action
- Use data and metrics when available
- Educational but not condescending
- Never post faces from main account
- Product posts should be quotable by contributors
```

---

## Appendix B: Customer Profile (Living Document)

**Location:** This profile lives in `shapeshift-context.md` and should be updated whenever ShapeShift adds new features, chains, or capabilities.

**Purpose:** Used by Wild Card Generator, Marketing Brief, and Press Suite to ensure all content targets the right audiences.

**Structure:**
```yaml
# Customer Profile
# Last updated: {date}
# Update trigger: New chain, new feature, new integration

## Primary Segments

### 1. DeFi Power Users
description: "Experienced crypto users who actively manage portfolios across multiple protocols"
characteristics:
  - Uses 3+ DeFi protocols regularly
  - Comfortable with wallet management
  - Values gas optimization and efficiency
  - Follows crypto Twitter actively
chains_they_use:
  - Ethereum
  - Arbitrum
  - Optimism
  - Base
what_they_want:
  - Best rates across DEXs
  - Portfolio tracking in one place
  - Self-custody (non-negotiable)
where_to_reach_them:
  - Crypto Twitter
  - Discord servers (DeFi-focused)
  - Farcaster
messaging_that_resonates:
  - "Your keys, your crypto"
  - "Best rates, no middleman"
  - "One interface, all of DeFi"

### 2. Yield Seekers
description: "Users primarily interested in earning yield on their holdings"
characteristics:
  - Actively moves funds for best APY
  - Tracks yield aggregators
  - Risk-aware but return-focused
chains_they_use:
  - Ethereum (staking)
  - Arbitrum (yield farms)
  - Any chain with good yields
what_they_want:
  - Easy yield comparison
  - Risk assessment
  - Gas-efficient deposits/withdrawals
where_to_reach_them:
  - DefiLlama
  - Yield farming Discords
  - Twitter yield threads
messaging_that_resonates:
  - "Real yield, real returns"
  - "Stake without giving up custody"

### 3. Cross-Chain Traders
description: "Users who frequently move assets between chains"
characteristics:
  - Uses bridges regularly
  - Arbitrages across chains
  - Needs fast, reliable swaps
chains_they_use:
  - All supported chains
  - Especially new L2s
what_they_want:
  - Fast bridging
  - Competitive rates
  - Chain abstraction
where_to_reach_them:
  - Bridge protocol communities
  - L2 ecosystem Discords
messaging_that_resonates:
  - "Any chain, any asset"
  - "Bridge without the headache"

### 4. Privacy-Conscious Users
description: "Users who prioritize financial privacy and sovereignty"
characteristics:
  - Avoids KYC platforms
  - Uses privacy tools
  - Philosophically aligned with decentralization
chains_they_use:
  - Any non-custodial option
what_they_want:
  - No KYC, no data collection
  - Transparent, auditable code
  - Self-custody always
where_to_reach_them:
  - Privacy-focused communities
  - Cypherpunk circles
  - Bitcoin maximalist adjacent
messaging_that_resonates:
  - "No KYC. No custody. No compromise."
  - "Your finances are your business"

### 5. New Chain Users (DYNAMIC - Update on new chain launches)
description: "Users of newly supported chains"
chains:
  # UPDATE THIS LIST when new chains are added
  - name: "Base"
    added: "2024-Q2"
    user_characteristics: "Coinbase-adjacent, newer to DeFi"
    messaging: "Base users: welcome to self-custody DeFi"
  - name: "Arbitrum"
    added: "2023-Q4"
    user_characteristics: "Gas-conscious, high-activity traders"
    messaging: "Arbitrum's best DEX aggregator"
  # Add new chains here...

## Secondary Segments

### Institutions/DAOs
description: "Treasuries and organizations managing crypto"
needs: "Security, auditability, no custody risk"
messaging: "Enterprise-grade, self-custody first"

### Developers
description: "Builders integrating or building on ShapeShift"
needs: "Good docs, APIs, open source code"
messaging: "Open source, permissionless, forkable"

## Anti-Personas (Who we DON'T target)
- Users who want custodial convenience over self-sovereignty
- Users looking for memecoins/gambling (not our focus)
- Users who need fiat on/off ramps as primary feature

## Update Protocol
When to update this profile:
1. New chain added → Add to "New Chain Users" segment
2. New feature added → Update relevant segment's "what_they_want"
3. New integration → May create new segment or expand existing
4. Quarterly review → Validate segments still accurate
```

**How Modules Use This:**
- **Wild Cards**: Must specify which segment(s) an idea targets
- **Marketing Brief**: Uses segments to answer "who are we speaking to"
- **Press Suite**: Op-eds can target specific segments
- **Content Drafts**: Tone adjusts based on primary segment for this launch

---

## Appendix C: Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Jan 2026 | Initial `gtm research` command |
| 0.2.0 | Jan 2026 | Added OpenAI integration, content generation |
| 0.3.0 | Jan 2026 | GitHub, Brief, Intelligence modules |
| 0.4.0 | Jan 2026 | Engineer-first workflow, DM targets, design briefs, GitHub automation, action checklist, follow-up content, press auto-email |
| 0.5.0 | Jan 2026 | Partner Kit Generator (shareable PDF + feedback loop), Metrics Logger (Day 7 post-mortem), `gtm metrics` and `gtm list` commands |
| 0.6.0 | Jan 2026 | Pre-launch timeline (Day -7 to -1), tier-based metric benchmarks, Learnings Integration (AI reads past launches and adapts) |
| 0.7.0 | Jan 2026 | Launch State Machine (flexible timing, countdown only after date confirmed), Press Feedback Loop (agency feedback improves AI), `gtm status` and `gtm press-feedback` commands |
| 0.8.0 | Jan 2026 | Operational Quick Start (Strapi Loom, 1Password, designer contacts), Personal vs @ShapeShift account delineation, Info bot QT, DM best practices (no links, 30-char value hook), Minimum Viable Launch, Pre-flight Check |
| 0.9.0 | Jan 2026 | "WTF Is This" newbie onboarding, Tier definitions (0/1/2), Straight-talk on mandatory nature, Launch ownership model (feature flag owner = launch owner), Handoff process to Apotheosis |
| 1.0.0 | Jan 2026 | Comprehensive marketing glossary (50+ terms): Core terms, Metrics (CTR, CPC, CPM, CPA, ROAS, ROI, LTV, ARPU, DAU, MAU), User Journey, Channel Types, SEO/SEM, Attribution (MTA, MMM), Crypto-specific terms |

---

## Appendix D: Quick Reference

### What Gets Generated (32+ files)
```
checklist.md          ← START HERE (engineer action items)
index.html            ← Full packet overview

drafts/               ← 12 content pieces
  blog_draft.md         (for Strapi)
  blog_for_x.md         (same blog as thread)
  x_post.md             (main announcement)
  discord_post.md
  farcaster_post.md
  followup_educational.md
  followup_metrics.md
  followup_recap.md
  user_guide.md
  partner_brief.md
  release_notes_*.md

outreach/             ← 2 files
  dm_targets.md         (who to DM + messages)
  partner_contacts.md

partner/              ← SEND TO PARTNER (5+ files)
  partner_kit.md        (full kit - markdown)
  partner_kit.pdf       (shareable PDF)
  partner_copy.txt      (just the copy)
  partner_feedback.yaml (they fill in, you regenerate)
  assets/               (graphics for them)

press/                ← 6 files (auto-emailed to agency)
  press_release.md
  pr_brief.md
  op_ed_*.md (4 angles)

design/               ← 2 files
  design_brief.md       (for human)
  ai_prompts.txt        (for Midjourney/DALL-E)

intelligence/         ← 4 files
  narrative_scan.md
  competitor_intel.md
  timing_recommendations.md
  wild_cards.md
```

### Post-Launch (Day 7+)
```
gtm metrics --launch {protocol}

Generates:
  metrics.json          ← Raw metrics data
  learnings.md          ← AI-generated post-mortem
  status: COMPLETE      ← Updates launch status
```

### Metrics That Matter
| Metric | Source | Why |
|--------|--------|-----|
| Twitter Profile Visits | Twitter Analytics | Converts to website |
| Website Traffic | Google Analytics / Ahrefs | Shows interest |
| Swap Volume Delta | ShapeShift API* | Actual usage |
| Onchain Txs | Block explorer | Feature adoption |

### Time Investment by Tier
| Tier | Est. Time | Focus |
|------|-----------|-------|
| 0 | 30 min | Just post tweet + Discord |
| 1 | 2-3 hours | Full 7-day campaign |
| 2 | 4-5 hours | + Press outreach, extensive follow-up |

---

**End of Specification**
