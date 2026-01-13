# Auto-Marketing Platform Architecture
## The Orchestrator + Worker System

---

## Overview

This document specs the architecture for ShapeShift's automated marketing platform. The system follows an **orchestrator + worker** pattern:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             FULL SYSTEM ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐                                                            │
│  │  GITHUB WATCHER │ ──────────────────────────────────────────────┐            │
│  │  (Trigger)      │                                               │            │
│  └────────┬────────┘                                               │            │
│           │ PR merged / Release                                    │            │
│           ▼                                                        ▼            │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐           │
│  │  GTM COORDINATOR│     │   WALKTHROUGH   │     │  CONTRIBUTOR    │           │
│  │  (Orchestrator) │     │   GENERATOR     │     │  NOTIFIER       │           │
│  │                 │     │                 │     │                 │           │
│  │  Creates plan   │     │  Screen capture │     │  Discord/Email  │           │
│  │  Tracks status  │     │  AI scripts     │     │  QT prompts     │           │
│  └────────┬────────┘     └────────┬────────┘     └─────────────────┘           │
│           │                       │                                             │
│           ▼                       ▼                                             │
│  ┌─────────────────┐     ┌─────────────────┐                                   │
│  │ CONTENT WORKER  │◄────│ Brand + Templates│                                   │
│  │                 │     │                 │                                   │
│  │ LLM → Drafts    │     │ voice.md        │                                   │
│  │ + QT prompts    │     │ x_post.md, etc  │                                   │
│  └────────┬────────┘     └─────────────────┘                                   │
│           │                                                                     │
│           ▼                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐                                   │
│  │ HUMAN APPROVAL  │────▶│ PUBLISHER WORKER│                                   │
│  │ GATE            │     │                 │                                   │
│  │                 │     │ X API           │                                   │
│  │ Review + Edit   │     │ Discord webhook │                                   │
│  │ Contributor QTs │     │ Farcaster       │                                   │
│  └─────────────────┘     └────────┬────────┘                                   │
│                                   │                                             │
│                                   ▼                                             │
│                          ┌─────────────────┐     ┌─────────────────┐           │
│                          │ ANALYTICS WORKER│◄────│ TWITTER API     │           │
│                          │                 │     │                 │           │
│                          │ Pull metrics    │     │ Metrics         │           │
│                          │ Generate reports│     │ Optimal times   │           │
│                          │ Data post ideas │     │ Performance     │           │
│                          └─────────────────┘     └─────────────────┘           │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                        All state in: .gtm/{id}/plan.yaml                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Key Principle:** Workers are stateless. All state lives in the GTM plan YAML files. Workers read the YAML, do their task, write status back to YAML.

---

## System Components

### 1. Orchestrator (This Repo)

**What it does:**
- Creates and manages GTM plans
- Dispatches tasks to workers
- Enforces approval gates
- Aggregates status across all initiatives
- Provides human interface (CLI, eventually web)

**What exists:**
- `gtm-coordinator/` — CLI tool for managing plans ✅
- YAML schema for plans ✅
- Validation logic ✅
- Status tracking ✅

**What needs to be built:**
- Worker dispatch mechanism
- Task queue / scheduling
- Index aggregation (see all initiatives)
- Notification system (alerts for humans)

---

### 2. Content Worker

**What it does:**
- Reads a GTM plan YAML
- Generates draft content for all enabled channels
- Writes drafts to `drafts/` folder
- Updates plan status to `generated`

**Input:**
```yaml
# Reads from plan.yaml
id: STRK-AGENT-001
title: "Agent.ShapeShift Starknet Launch"
channels:
  x: { enabled: true, status: pending }
  discord: { enabled: true, status: pending }
  blog: { enabled: true, status: pending }
provenance:
  inputs:
    - type: feature_brief
      path: ./briefs/starknet-agent.md
    - type: pr
      url: https://github.com/shapeshift/agent/pull/123
```

**Output:**
```
.gtm/STRK-AGENT-001/
├── plan.yaml (status updated to 'generated')
└── drafts/
    ├── x_post.md
    ├── x_thread.md
    ├── discord_post.md
    ├── blog_outline.md
    ├── blog_draft.md
    └── partner_brief.md
```

**Implementation approach:**
- Standalone script/service
- Uses LLM (Claude/GPT) for generation
- Reads brand voice guide + channel templates
- Can be triggered manually or via webhook

---

### 3. Publisher Worker

**What it does:**
- Reads approved content from `drafts/` folder
- Posts to actual channels (X, Discord, Farcaster)
- Writes `published_url` back to plan
- Updates status to `published`

**Input:**
```yaml
# Reads from plan.yaml
channels:
  x:
    enabled: true
    status: approved  # Only publishes if approved
    artifact_path: ./drafts/x_post.md
```

**Output:**
```yaml
# Writes back to plan.yaml
channels:
  x:
    status: published
    published_url: "https://x.com/ShapeShift/status/1234567890"
    published_at: "2026-02-01T14:30:00Z"
```

**Implementation approach:**
- Standalone script/service
- Integrates with platform APIs (X, Discord webhooks, etc.)
- Respects `publish_window` timing
- Can schedule or post immediately

---

### 4. Analytics Worker

**What it does:**
- Reads published URLs from plan
- Pulls metrics from platform APIs
- Generates performance reports
- Flags underperforming content

**Input:**
```yaml
# Reads from plan.yaml
channels:
  x:
    published_url: "https://x.com/ShapeShift/status/1234567890"
tracking:
  utm_base:
    campaign: starknet-agent-launch
```

**Output:**
```
.gtm/STRK-AGENT-001/
├── plan.yaml
└── reports/
    ├── week-1.md
    ├── week-2.md
    └── summary.md
```

**Implementation approach:**
- Scheduled job (daily/weekly)
- Pulls from X Analytics API, Discord insights, etc.
- Correlates with UTM tracking data
- LLM summarizes metrics into readable reports

---

## Data Flow

### Happy Path: Feature Launch → Published Content

```
1. TRIGGER
   └─→ Human runs: gtm init --id STRK-AGENT-001 --tier 2
       └─→ Creates .gtm/STRK-AGENT-001/plan.yaml

2. ENRICH
   └─→ Human runs: gtm enrich --pr <url> --feature-brief <path>
       └─→ Adds provenance.inputs to plan.yaml

3. GENERATE (Content Worker)
   └─→ Worker triggered (manual or webhook)
       └─→ Reads plan.yaml + inputs
       └─→ Generates drafts via LLM
       └─→ Writes to drafts/ folder
       └─→ Updates status: pending → generated

4. REVIEW
   └─→ Human reviews drafts, makes edits
   └─→ Human runs: gtm set-status --field channels.x.status --value approved
       └─→ Updates status: generated → approved

5. APPROVE GATE
   └─→ Human runs: gtm marketing-approve --reviewer "@name"
       └─→ Validates tier/risk requirements
       └─→ Sets gates.marketing_gate.status: approved

6. PUBLISH (Publisher Worker)
   └─→ Worker triggered (manual or on approval)
       └─→ Reads approved content
       └─→ Posts to channels
       └─→ Writes published_url back
       └─→ Updates status: approved → published

7. TRACK (Analytics Worker)
   └─→ Scheduled job (weekly)
       └─→ Pulls metrics for published content
       └─→ Generates reports
       └─→ Flags underperformers
```

---

## Interface Contracts

### Plan YAML → Worker

Workers read from `.gtm/{id}/plan.yaml`. The contract:

```yaml
# What Content Worker needs
id: string
title: string
tier: 0|1|2
channels:
  {channel_name}:
    enabled: boolean
    status: pending|generated|needs_review|approved|scheduled|published|blocked
provenance:
  inputs: 
    - type: feature_brief|pr|doc|url
      path: string (local) | url: string (remote)
content_outputs:
  {output_type}:
    status: pending|generated|approved
    artifact_path: string|null

# What Publisher Worker needs
channels:
  {channel_name}:
    enabled: boolean
    status: approved  # Only acts on approved
    artifact_path: string
    publish_window: datetime|null
timing:
  publish_mode: manual|auto_when_green|auto_on_flag

# What Analytics Worker needs
channels:
  {channel_name}:
    published_url: string|null
tracking:
  utm_base:
    source: string
    medium: string
    campaign: string
  dashboard_urls: string[]
```

### Worker → Plan YAML

Workers write back to `.gtm/{id}/plan.yaml`:

```yaml
# Content Worker writes
content_outputs:
  x_post:
    status: generated
    artifact_path: ./drafts/x_post.md
    generated_at: datetime
history:
  - action: content_generated
    timestamp: datetime
    actor: content-worker
    details: { outputs: [...] }

# Publisher Worker writes
channels:
  x:
    status: published
    published_url: string
    published_at: datetime
history:
  - action: published
    timestamp: datetime
    actor: publisher-worker
    details: { channel: x, url: ... }

# Analytics Worker writes
# (creates separate report files, doesn't modify plan.yaml much)
```

---

## Worker Specifications

### Content Worker Spec

**File:** `worker-specs/content-worker.md`

```
Name: content-worker
Trigger: Manual CLI | Webhook | Scheduled
Input: .gtm/{id}/plan.yaml
Output: .gtm/{id}/drafts/*.md

Dependencies:
- LLM API (Claude/GPT)
- Brand voice guide (./brand/voice.md)
- Channel templates (./templates/channels/*.md)

Environment:
- ANTHROPIC_API_KEY or OPENAI_API_KEY
- GTM_ROOT (path to .gtm folder)

Commands:
- content-worker generate --plan <path>
- content-worker generate --id <initiative-id>
- content-worker regenerate --id <id> --channel <channel>

Behavior:
1. Load plan.yaml
2. For each enabled channel with status=pending:
   a. Load channel template
   b. Load brand voice guide
   c. Load all provenance.inputs
   d. Generate draft via LLM
   e. Write to drafts/{channel}.md
   f. Update content_outputs.{channel}.status = generated
3. Append to history
4. Save plan.yaml
```

---

### Publisher Worker Spec

**File:** `worker-specs/publisher-worker.md`

```
Name: publisher-worker
Trigger: Manual CLI | On approval webhook | Scheduled
Input: .gtm/{id}/plan.yaml + drafts/*.md
Output: Published posts, updated plan.yaml

Dependencies:
- X API credentials
- Discord webhook URLs
- Farcaster hub credentials
- Blog CMS credentials

Environment:
- X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN
- DISCORD_WEBHOOK_{CHANNEL}
- FARCASTER_SIGNER
- BLOG_CMS_API_KEY
- GTM_ROOT

Commands:
- publisher-worker publish --plan <path>
- publisher-worker publish --id <id> --channel <channel>
- publisher-worker schedule --id <id> --channel <channel> --time <datetime>
- publisher-worker dry-run --id <id>

Behavior:
1. Load plan.yaml
2. Check gates.marketing_gate.status == approved
3. For each enabled channel with status=approved:
   a. Load artifact from artifact_path
   b. Check publish_window (if set, schedule or skip)
   c. Post to channel API
   d. Capture published_url
   e. Update channel.status = published
   f. Update channel.published_url
   g. Update channel.published_at
4. Append to history
5. Save plan.yaml
```

---

### Analytics Worker Spec

**File:** `worker-specs/analytics-worker.md`

```
Name: analytics-worker
Trigger: Scheduled (daily/weekly) | Manual CLI
Input: .gtm/{id}/plan.yaml (published URLs)
Output: .gtm/{id}/reports/*.md

Dependencies:
- X Analytics API
- Discord insights (if available)
- UTM tracking service (analytics dashboard)
- LLM for report generation

Environment:
- X_API_KEY (with analytics scope)
- ANALYTICS_DASHBOARD_API
- ANTHROPIC_API_KEY (for report summaries)
- GTM_ROOT

Commands:
- analytics-worker report --plan <path>
- analytics-worker report --id <id>
- analytics-worker report --all (all published initiatives)
- analytics-worker weekly-summary

Behavior:
1. Load plan.yaml
2. For each channel with status=published:
   a. Fetch metrics from platform API
   b. Fetch UTM click data
3. Compile metrics into structured data
4. Generate report via LLM (or template)
5. Write to reports/{date}.md
6. If metrics below threshold, flag for human review
```

---

## Brand & Template Assets

### Required Assets (To Be Created)

```
brand/
├── voice.md              # Brand voice guide
├── dos-and-donts.md      # What we say vs don't say
├── terminology.md        # Approved terms and phrases
└── visual-guidelines.md  # Asset specs, colors, etc.

templates/
├── channels/
│   ├── x_post.md         # Template + examples for X posts
│   ├── x_thread.md       # Template for threads
│   ├── discord.md        # Discord announcement template
│   ├── farcaster.md      # Farcaster cast template
│   ├── blog.md           # Blog post structure
│   └── partner_brief.md  # Partner outreach template
└── prompts/
    ├── content_system.md # System prompt for content generation
    ├── summary.md        # Prompt for report summaries
    └── optimize.md       # Prompt for optimization suggestions
```

---

## Implementation Phases

### Phase 0: Foundation (Exists)
- [x] GTM Coordinator CLI
- [x] YAML schema
- [x] Status tracking
- [x] Validation logic

### Phase 1: Manual + LLM (Minimum Viable)
- [ ] Brand voice guide document
- [ ] Channel templates
- [ ] Content generation prompts
- [ ] Manual workflow: Human runs LLM with prompts, pastes into drafts/

**This is enough to execute the Starknet GTM.** Human uses Claude/GPT manually, GTM Coordinator tracks everything.

### Phase 2: Content Worker (Semi-Automated)
- [ ] Content worker script
- [ ] LLM API integration
- [ ] Input parsing (PRs, briefs, docs)
- [ ] Draft generation pipeline
- [ ] Status writeback

**Human triggers content generation, reviews output, approves.**

### Phase 3: Publisher Worker (Automated Publishing)
- [ ] X API integration
- [ ] Discord webhook integration
- [ ] Farcaster integration
- [ ] Scheduling logic
- [ ] Status writeback

**Human approves, worker publishes automatically.**

### Phase 4: Analytics Worker (Automated Reporting)
- [ ] X Analytics API integration
- [ ] UTM tracking integration
- [ ] Report generation
- [ ] Alerting for underperformers

**Metrics and reports generated automatically.**

### Phase 5: Full Orchestration
- [ ] Task queue / scheduler
- [ ] Webhook triggers (PR merged → generate content)
- [ ] Web dashboard for status
- [ ] Notification system

**End-to-end automation with human approval gates.**

---

## Technology Choices

### Recommended Stack

| Component | Technology | Why |
|-----------|------------|-----|
| Orchestrator | Node.js (TypeScript) | Already using for gtm-coordinator |
| Workers | Node.js or Python | Depends on API client availability |
| LLM | Claude API | Better at following brand voice |
| State | YAML files (Git) | Simple, auditable, no infra |
| Task Queue | GitHub Actions or simple cron | Start simple |
| Secrets | .env files / GitHub Secrets | Standard approach |

### API Dependencies

| Service | API | Purpose |
|---------|-----|---------|
| Anthropic | Claude API | Content generation, summaries |
| X/Twitter | X API v2 | Posting, analytics |
| Discord | Webhooks | Posting announcements |
| Farcaster | Hub API | Posting casts |
| Analytics | TBD | UTM tracking, click data |

---

## File Structure (Target State)

```
ShapeShift Auto-marketing/
├── gtm-coordinator/          # Orchestrator CLI (exists)
│   ├── src/
│   └── ...
│
├── workers/
│   ├── content-worker/       # Content generation worker
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── publisher-worker/     # Publishing worker
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── analytics-worker/     # Analytics worker
│       ├── src/
│       ├── package.json
│       └── README.md
│
├── brand/                    # Brand assets
│   ├── voice.md
│   ├── dos-and-donts.md
│   └── ...
│
├── templates/                # Content templates
│   ├── channels/
│   └── prompts/
│
├── .gtm/                     # GTM plans (generated)
│   ├── STRK-AGENT-001/
│   │   ├── plan.yaml
│   │   ├── drafts/
│   │   └── reports/
│   └── index.json
│
├── worker-specs/             # Worker specifications (this folder)
│   ├── ARCHITECTURE.md
│   ├── content-worker.md
│   ├── publisher-worker.md
│   ├── analytics-worker.md
│   ├── github-watcher.md
│   ├── walkthrough-generator.md
│   ├── walkthrough-runner.ts     # Executable Playwright script
│   ├── walkthrough-cli.md        # CLI documentation
│   ├── twitter-analytics.md
│   ├── app-interaction-map.md    # UI element mapping for automation
│   └── shapeshift-testid-pr-template.md  # PR to add test IDs
│
└── grants/                   # Grant proposals
    └── ...
```

---

## Next Steps (Building This)

### Immediate (This Week)
1. Create `brand/voice.md` — Document ShapeShift's voice
2. Create channel templates — X, Discord, blog structures
3. Create content prompts — System prompts for LLM

### Short-term (Next 2 Weeks)
4. Build content-worker scaffold — Basic script that reads YAML, calls LLM
5. Test on a sample GTM plan — Generate real drafts
6. Iterate on prompts — Tune for quality

### Medium-term (Month 1-2)
7. Build publisher-worker — X API integration first
8. Add Discord webhook support
9. Build analytics-worker — Start with X metrics

### Ongoing
10. Iterate based on Starknet campaign learnings
11. Add more channels as needed
12. Build web dashboard if warranted

---

*This architecture is designed to be incrementally buildable. You can execute the Starknet GTM with just Phase 1 (manual + LLM), then automate more over time.*
