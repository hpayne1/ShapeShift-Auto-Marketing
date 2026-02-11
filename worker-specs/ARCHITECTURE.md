# Auto-Marketing Platform Architecture

## Six-Layer Bot Manager System

---

## Overview

This document specifies the architecture for ShapeShift's automated marketing platform. The system follows a **six-layer architecture** with a **10/80/10 human-bot workflow**:

- **10% Human Kickoff** - Campaign Owner sets direction
- **80% Bot Execution** - Bot Manager coordinates skills
- **10% Human Review** - Campaign Owner approves and edits

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SIX-LAYER ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  HUMAN LAYER (20% of work)                                               │   │
│  │  Campaign Owner │ Developers │ Community Team                            │   │
│  │  - 10% kickoff: Sets direction, strategy, constraints                    │   │
│  │  - 10% review: Edits, approves, final sign-off                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                                      ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  COORDINATION LAYER                                                      │   │
│  │  Bot Manager │ GTM Owner                                                 │   │
│  │  - Routes tasks, manages context, enforces scope                        │   │
│  │  - Proposes strategy, guards brand                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│         ┌────────────────────────────┼────────────────────────────┐            │
│         ▼                            ▼                            ▼            │
│  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐         │
│  │  EXECUTION   │          │  KNOWLEDGE   │          │   QUALITY    │         │
│  │  LAYER       │          │  LAYER       │          │   LAYER      │         │
│  ├──────────────┤          ├──────────────┤          ├──────────────┤         │
│  │Content Worker│◄────────▶│Product Oracle│          │Brand Valid.  │         │
│  │Publisher     │          │Asset Manager │          │Link Checker  │         │
│  │Analytics     │          │Campaign Mem. │          │Audience Anal.│         │
│  │Walkthrough   │          └──────────────┘          │Release Coord.│         │
│  │Twitter Anal. │                                    └──────────────┘         │
│  └──────────────┘                                                              │
│         │                                                                       │
│         ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  MONITORING LAYER                                                        │   │
│  │  GitHub Watcher │ Competitor Watcher │ Integration Observer │ News Watch │   │
│  │  - Watches for triggers, opportunities, issues                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│              All state in: .gtm/{id}/plan.yaml + session_context.yaml           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## The 10/80/10 Model

| Phase | Owner | Responsibility |
|-------|-------|----------------|
| **10% Kickoff** | Campaign Owner (Human) | Sets direction, strategy, constraints, brief |
| **80% Execution** | Bot Manager + Skills | Research, drafts, iterations, coordination |
| **10% Review** | Campaign Owner (Human) | Edits, approvals, final sign-off, publish |

**Key Principle:** Humans bookend the work. Bots execute the middle. Without dedicated human ownership, brand voice dilutes and bots drift.

---

## Layer 1: Human Layer

### Campaign Owner Role

The dedicated human who owns GTM campaigns end-to-end.

**Protocol:** `protocols/campaign-owner.md`

**Responsibilities:**
- Review triggers and set campaign brief
- Approve tier and channel selection
- Available async for questions during execution
- Review all content before publish
- Final sign-off on timing and publish

**Why This Role Exists:**
- Engineers as their own managers = inconsistent brand voice
- Bots without human direction = drift and confusion
- 80% automation only works with 20% human bookends

---

## Layer 2: Coordination Layer

### Bot Manager

The central brain that coordinates all bot work.

**Skill:** `skills/bot-manager.md`

**Responsibilities:**
1. **Task Routing** - Dispatch to appropriate skills
2. **Context Management** - Maintain session state, prevent redundant research
3. **Scope Enforcement** - Keep skills on task, manage compute budget
4. **Human Escalation** - Route questions to right humans
5. **Compute Optimization** - Model selection, batching, caching

### GTM Owner

The AI strategist for brand and go-to-market.

**Skill:** `skills/gtm-owner.md`

**Responsibilities:**
1. **Brand Guardian** - Enforce voice, validate terminology
2. **Strategy Proposer** - Assess tiers, propose campaigns
3. **Approval Interface** - Package proposals for human approval

---

## Layer 3: Execution Layer

Skills that create and publish content.

| Skill | Purpose |
|-------|---------|
| `content-worker.md` | Generate draft content |
| `publisher-worker.md` | Publish to channels |
| `analytics-worker.md` | Analyze campaign performance |
| `twitter-analytics.md` | X-specific metrics |
| `walkthrough-generator.md` | Product demo videos |

---

## Layer 4: Knowledge Layer

Skills that maintain authoritative knowledge.

| Skill | Purpose |
|-------|---------|
| `product-oracle.md` | Source of truth for product state |
| `asset-manager.md` | Source of truth for visual assets |
| `campaign-memory.md` | Historical context and learnings |

---

## Layer 5: Quality Layer

Skills that validate content before human review.

| Skill | Purpose |
|-------|---------|
| `brand-validator.md` | Voice/tone compliance |
| `link-checker.md` | URL and UTM validation |
| `audience-analyzer.md` | Segment fit verification |
| `release-coordinator.md` | Timing and readiness check |

---

## Layer 6: Monitoring Layer

Skills that watch for triggers and opportunities.

| Skill | Purpose |
|-------|---------|
| `github-watcher.md` | Internal repo monitoring |
| `competitor-watcher.md` | Competitor activity |
| `integration-observer.md` | Partner activity |
| `news-watcher.md` | News tie-ins, press opportunities |

---

## Complete Skill Inventory

**Total: 21 skills** (up from original 7)

### Coordination (2)
- `bot-manager.md` - Central brain
- `gtm-owner.md` - Strategy and brand

### Execution (5)
- `content-worker.md`
- `publisher-worker.md`
- `analytics-worker.md`
- `twitter-analytics.md`
- `walkthrough-generator.md`

### Knowledge (3)
- `product-oracle.md`
- `asset-manager.md`
- `campaign-memory.md`

### Quality (4)
- `brand-validator.md`
- `link-checker.md`
- `audience-analyzer.md`
- `release-coordinator.md`

### Monitoring (4)
- `github-watcher.md`
- `competitor-watcher.md`
- `integration-observer.md`
- `news-watcher.md`

### Deprecated (1)
- `orchestrator.md` - Superseded by Bot Manager

### Sub-skills (2)
- `utm-generator.md` (extract from publisher)
- `tier-classifier.md` (extract from github-watcher)

---

## Protocols

Standardized communication and workflow formats.

| Protocol | Purpose |
|----------|---------|
| `campaign-owner.md` | Human role definition, 10/80/10 workflow |
| `session-context.md` | Shared state schema |
| `human-escalation.md` | Bot → Human communication format |
| `checkpoint-gates.md` | Approval gate definitions |

---

## Data Flow

### Happy Path: Trigger → Published Content

```
1. TRIGGER
   └─→ GitHub Watcher detects PR merged
       └─→ Alerts Bot Manager
       └─→ Bot Manager queries GTM Owner for tier assessment

2. KICKOFF (10% Human)
   └─→ Campaign Owner receives kickoff request
       └─→ Reviews trigger, sets brief
       └─→ Approves tier and channels
       └─→ Bot Manager initializes session context

3. KNOWLEDGE GATHERING
   └─→ Bot Manager queries Knowledge Layer:
       └─→ Product Oracle (current product facts)
       └─→ Asset Manager (available assets)
       └─→ Campaign Memory (past learnings)
   └─→ Session context updated with knowledge

4. CONTENT GENERATION (80% Bot)
   └─→ Bot Manager dispatches to Content Worker
       └─→ Content Worker receives context
       └─→ Generates drafts for each channel
       └─→ Returns artifacts

5. QUALITY VALIDATION
   └─→ Bot Manager dispatches to Quality Layer:
       └─→ Brand Validator (voice check)
       └─→ Link Checker (URL validation)
       └─→ Audience Analyzer (segment fit)
       └─→ Release Coordinator (timing check)
   └─→ Issues flagged, passed content marked ready

6. REVIEW (10% Human)
   └─→ Bot Manager submits to checkpoint gate
       └─→ Campaign Owner reviews drafts
       └─→ Provides feedback or approves
       └─→ Content revised if needed

7. FINAL APPROVAL
   └─→ Final gate submitted
       └─→ Campaign Owner signs off
       └─→ Publisher Worker authorized

8. PUBLISH
   └─→ Bot Manager dispatches to Publisher Worker
       └─→ Content posted to channels
       └─→ Published URLs recorded
       └─→ Status updated to published

9. POST-PUBLISH
   └─→ Analytics Worker tracks metrics
       └─→ Campaign Memory records learnings
       └─→ Session archived
```

---

## Session Context

Shared state that persists across skill invocations.

**Protocol:** `protocols/session-context.md`

```yaml
session_context:
  id: "session-2026-01-29-001"
  
  campaign:
    gtm_id: "YIELD-XYZ-001"
    tier: 2
    campaign_owner: "@phil"
  
  knowledge:
    product: { chains: 28, ... }
    protocol: { name: "Yield.xyz", ... }
    audience: { segment: "defi_degens", ... }
  
  artifacts:
    - type: "draft_x_post"
      path: ".gtm/YIELD-XYZ-001/drafts/x_post.md"
  
  compute:
    skills_invoked: 5
    budget_remaining: 5
```

**Key Benefits:**
- No context loss between skills
- No redundant research
- Compute budget tracking
- Audit trail of decisions

---

## Checkpoint Gates

Structured approval points requiring human review.

**Protocol:** `protocols/checkpoint-gates.md`

| Gate | Required For | Purpose |
|------|--------------|---------|
| Kickoff | Tier 1, 2 | Approve brief and direction |
| Strategy | Tier 1 only | Approve strategic approach |
| Drafts | All tiers | Review content |
| Final | All tiers | Sign-off before publish |
| Publish | Tier 1 only | Confirm before major launch |

---

## Human Escalation

Standardized format for bot → human communication.

**Protocol:** `protocols/human-escalation.md`

```yaml
escalation:
  type: "decision_needed"
  priority: "normal"
  
  summary: "Need decision on APY claims"
  detail: "..."
  
  recommendation:
    option: "C"
    reasoning: "..."
  
  actions:
    - id: "approve_a"
      label: "Option A"
    - id: "approve_b"
      label: "Option B"
```

---

## File Structure

```
ShapeShift Auto-marketing/
├── protocols/
│   ├── campaign-owner.md       # Human role definition
│   ├── session-context.md      # Shared state schema
│   ├── human-escalation.md     # Communication format
│   └── checkpoint-gates.md     # Approval gates
│
├── skills/
│   ├── bot-manager.md          # Coordination layer
│   ├── gtm-owner.md            # Strategy and brand
│   │
│   ├── content-worker.md       # Execution layer
│   ├── publisher-worker.md
│   ├── analytics-worker.md
│   ├── twitter-analytics.md
│   ├── walkthrough-generator.md
│   │
│   ├── product-oracle.md       # Knowledge layer
│   ├── asset-manager.md
│   ├── campaign-memory.md
│   │
│   ├── brand-validator.md      # Quality layer
│   ├── link-checker.md
│   ├── audience-analyzer.md
│   ├── release-coordinator.md
│   │
│   ├── github-watcher.md       # Monitoring layer
│   ├── competitor-watcher.md
│   ├── integration-observer.md
│   ├── news-watcher.md
│   │
│   ├── orchestrator.md         # DEPRECATED
│   └── README.md
│
├── brand/
│   ├── voice.md
│   └── dos-and-donts.md
│
├── templates/
│   └── channels/
│
├── .gtm/                       # GTM plans (generated)
│   └── {id}/
│       ├── plan.yaml
│       ├── session_context.yaml
│       └── drafts/
│
└── gtm-coordinator/            # CLI tool
```

---

## Key Design Principles

1. **Human Bookends** - 10/80/10 workflow ensures human oversight
2. **Shared Context** - Session context prevents redundant work
3. **Scope Enforcement** - Bot Manager keeps skills on task
4. **Quality Gates** - Validation before human review
5. **Source of Truth** - Knowledge layer provides accurate facts
6. **Compute Awareness** - Budget tracking prevents waste

---

## Migration from Original Architecture

| Original | New |
|----------|-----|
| Flat skills | Layered architecture |
| Orchestrator | Bot Manager (with context) |
| No human role defined | Campaign Owner protocol |
| No context sharing | Session context |
| No validation layer | Quality layer (4 skills) |
| No monitoring | Monitoring layer (4 skills) |
| No knowledge layer | Knowledge layer (3 skills) |
| 7 skills | 21 skills |

---

*This architecture enables 80% automation while maintaining brand consistency through dedicated human ownership and quality validation.*
