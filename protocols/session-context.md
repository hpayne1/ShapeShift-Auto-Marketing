# Session Context Protocol

The **Session Context** is shared state that persists across skill invocations within a campaign. It solves context loss, prevents redundant research, and enables skills to build on each other's work.

---

## Why Session Context Exists

**Problems it solves:**
- Context loss between skill invocations
- Redundant research (each skill re-learns the same facts)
- Off-task behavior (no scope boundaries)
- Compute waste (no budget tracking)

**How it helps:**
- Skills receive relevant context, not blank slate
- Knowledge accumulates across the workflow
- Task scope is explicit and enforced
- Compute budget prevents runaway costs

---

## Session Context Schema

```yaml
session_context:
  # === Session Identity ===
  id: "session-2026-01-29-001"
  started_at: "2026-01-29T10:00:00Z"
  last_updated: "2026-01-29T14:30:00Z"
  
  # === Campaign Reference ===
  campaign:
    gtm_id: "YIELD-XYZ-001"
    title: "Yield.xyz Integration Launch"
    tier: 2
    campaign_owner: "@phil"
    status: "in_progress"  # kickoff | in_progress | review | published | closed
  
  # === Active Task ===
  active_task:
    type: "content_generation"
    description: "Generate Tier 2 content for Yield.xyz integration"
    assigned_to: "content-worker"
    started_at: "2026-01-29T14:00:00Z"
    
    scope:
      objectives:
        - "Create announcement posts for X, Discord, Farcaster"
        - "Draft blog post outline"
      boundaries:
        - "Only channels: X, Discord, Farcaster, Blog"
        - "No partner mentions without approval"
        - "No APY claims without verified source"
      out_of_scope:
        - "Partner outreach (separate task)"
        - "Paid promotion (not this campaign)"
    
    budget:
      max_skill_calls: 10
      max_tokens: 100000
      deadline: "2026-01-30T12:00:00Z"
  
  # === Accumulated Knowledge ===
  knowledge:
    # Product facts (from Product Oracle)
    product:
      chains_supported: 28
      chains_new_30d: ["Blast", "Base"]
      yield_protocols: ["Yearn", "Tokemak", "Yield.xyz"]
      features:
        swap: true
        cross_chain: true
        yield: true
        lending: false
    
    # Protocol research (from research phase)
    protocol:
      name: "Yield.xyz"
      type: "yield_aggregator"
      chains: ["ethereum", "arbitrum", "optimism"]
      tvl: "$50M"
      key_feature: "Auto-compounding vaults"
      integration_type: "Native yield aggregation"
    
    # Brand decisions (approved by Campaign Owner)
    brand_decisions:
      - decision: "Use 'yield optimization' not 'yield farming'"
        approved_by: "@phil"
        timestamp: "2026-01-29T11:00:00Z"
      - decision: "Messaging angle: cross-chain + self-custody"
        approved_by: "@phil"
        timestamp: "2026-01-29T11:00:00Z"
    
    # Audience insights (from Audience Analyzer)
    audience:
      primary_segment: "defi_degens"
      secondary_segment: "yield_seekers"
      platform_notes:
        x: "Benefit-focused, less technical"
        farcaster: "Technical details OK, builder audience"
        discord: "Community-focused, include call to action"
    
    # Past learnings (from Campaign Memory)
    past_learnings:
      - "Thread format outperforms single posts by 3x for integrations"
      - "Tuesday/Wednesday posts get 40% more engagement"
      - "Avoid superlatives—specific numbers perform better"
  
  # === Artifacts Produced ===
  artifacts:
    - type: "research_summary"
      path: ".gtm/YIELD-XYZ-001/research/protocol_analysis.json"
      produced_by: "research-agent"
      timestamp: "2026-01-29T10:30:00Z"
    
    - type: "draft_x_post"
      path: ".gtm/YIELD-XYZ-001/drafts/x_post.md"
      produced_by: "content-worker"
      timestamp: "2026-01-29T14:30:00Z"
      status: "pending_review"
    
    - type: "draft_discord"
      path: ".gtm/YIELD-XYZ-001/drafts/discord_post.md"
      produced_by: "content-worker"
      timestamp: "2026-01-29T14:35:00Z"
      status: "pending_review"
  
  # === Pending Decisions ===
  pending_decisions:
    - id: "decision-001"
      question: "Can we mention specific APY ranges?"
      context: "Yield.xyz vaults show 5-15% APY but rates fluctuate"
      options:
        - "Yes, with disclaimer about variability"
        - "No, just say 'competitive yields'"
        - "Ask Yield.xyz for approved language"
      escalated_to: "@phil"
      escalated_at: "2026-01-29T14:20:00Z"
      status: "awaiting_response"
      deadline: "2026-01-30T12:00:00Z"
  
  # === Completed Decisions ===
  decisions_made:
    - id: "decision-000"
      question: "Which messaging angle to use?"
      decision: "Both - technical on Farcaster, benefits on X"
      decided_by: "@phil"
      timestamp: "2026-01-29T11:00:00Z"
  
  # === Validation Status ===
  validations:
    brand_validator:
      last_run: "2026-01-29T14:40:00Z"
      status: "pass"
      issues: []
    
    link_checker:
      last_run: null
      status: "pending"
      issues: []
    
    audience_analyzer:
      last_run: "2026-01-29T14:25:00Z"
      status: "pass"
      notes: "Content matches target segments"
    
    release_coordinator:
      last_run: "2026-01-29T10:00:00Z"
      status: "blocked"
      blockers:
        - "Feature not yet deployed to prod"
        - "Partner sync pending"
  
  # === Compute Tracking ===
  compute:
    skills_invoked: 5
    budget_remaining: 5
    tokens_used: 45000
    budget_tokens_remaining: 55000
    
    invocation_log:
      - skill: "product-oracle"
        timestamp: "2026-01-29T10:05:00Z"
        tokens: 2000
        result: "success"
      - skill: "campaign-memory"
        timestamp: "2026-01-29T10:10:00Z"
        tokens: 3000
        result: "success"
      - skill: "audience-analyzer"
        timestamp: "2026-01-29T14:25:00Z"
        tokens: 5000
        result: "success"
      - skill: "content-worker"
        timestamp: "2026-01-29T14:30:00Z"
        tokens: 30000
        result: "success"
      - skill: "brand-validator"
        timestamp: "2026-01-29T14:40:00Z"
        tokens: 5000
        result: "success"
  
  # === History ===
  history:
    - action: "session_started"
      timestamp: "2026-01-29T10:00:00Z"
      actor: "bot-manager"
      details: "Campaign kickoff received from @phil"
    
    - action: "knowledge_acquired"
      timestamp: "2026-01-29T10:05:00Z"
      actor: "product-oracle"
      details: "Product facts loaded"
    
    - action: "decision_escalated"
      timestamp: "2026-01-29T14:20:00Z"
      actor: "content-worker"
      details: "APY claim question escalated to Campaign Owner"
```

---

## How Skills Use Session Context

### Reading Context

Skills receive relevant portions of session context:

```yaml
# Content Worker receives:
context_for_content_worker:
  campaign:
    gtm_id: "YIELD-XYZ-001"
    tier: 2
  
  task:
    description: "Generate Tier 2 content for Yield.xyz integration"
    scope:
      channels: ["x", "discord", "farcaster", "blog"]
      boundaries: ["No APY claims without source"]
  
  knowledge:
    product: { ... }
    protocol: { ... }
    brand_decisions: [ ... ]
    audience: { ... }
    past_learnings: [ ... ]
  
  budget:
    tokens_remaining: 55000
```

### Writing Context

Skills report back updates:

```yaml
# Content Worker reports:
context_update:
  artifacts:
    - type: "draft_x_post"
      path: ".gtm/YIELD-XYZ-001/drafts/x_post.md"
      status: "pending_review"
  
  pending_decisions:
    - question: "Can we mention specific APY ranges?"
      context: "..."
  
  compute:
    tokens_used: 30000
```

---

## Context Lifecycle

### 1. Session Start (Kickoff)
```yaml
# Bot Manager initializes context
session_context:
  id: "session-2026-01-29-001"
  campaign:
    gtm_id: "YIELD-XYZ-001"
    campaign_owner: "@phil"
  knowledge: {}  # Empty, will be populated
  compute:
    budget_remaining: 10
```

### 2. Knowledge Gathering
```yaml
# Product Oracle adds product facts
knowledge.product: { chains: 28, ... }

# Campaign Memory adds learnings
knowledge.past_learnings: [ "Threads outperform...", ... ]

# Audience Analyzer adds segment info
knowledge.audience: { primary: "defi_degens", ... }
```

### 3. Execution
```yaml
# Content Worker uses knowledge, produces artifacts
artifacts: [ { type: "draft_x_post", ... } ]

# Brand Validator checks content
validations.brand_validator: { status: "pass" }
```

### 4. Review
```yaml
# Campaign Owner decisions recorded
decisions_made: [ { question: "...", decision: "..." } ]

# Status updates
campaign.status: "review"
```

### 5. Session Close
```yaml
# Final state archived
campaign.status: "published"
# Context saved to Campaign Memory for future reference
```

---

## Context Scoping Rules

### Scope Enforcement

Bot Manager enforces task scope:

```yaml
scope_check:
  task: "Generate X post"
  request: "Also create a YouTube video script"
  
  result: "BLOCKED"
  reason: "YouTube video is out of scope for this task"
  action: "Request denied. Create separate task if needed."
```

### Budget Enforcement

Bot Manager tracks compute budget:

```yaml
budget_check:
  budget_remaining: 2
  request: "Run comprehensive competitor analysis"
  estimated_cost: 5
  
  result: "BLOCKED"
  reason: "Request exceeds remaining budget (5 > 2)"
  action: "Escalate to Campaign Owner for budget approval"
```

---

## Context Persistence

### Where Context Lives

```
.gtm/YIELD-XYZ-001/
├── plan.yaml              # GTM plan (existing)
├── session_context.yaml   # Session context (new)
├── drafts/
│   ├── x_post.md
│   └── discord_post.md
└── research/
    └── protocol_analysis.json
```

### Context Archival

After campaign closes, context is:
1. Archived with campaign files
2. Key learnings extracted to Campaign Memory
3. Available for future reference

---

## Context Handoff Between Skills

### Bot Manager → Skill

```yaml
skill_invocation:
  skill: "content-worker"
  task: "Generate X post for Yield.xyz announcement"
  
  context:
    campaign: { gtm_id: "YIELD-XYZ-001", tier: 2 }
    knowledge: { product: {...}, protocol: {...}, audience: {...} }
    constraints: ["No APY claims", "Use approved messaging angle"]
    budget: { tokens_remaining: 55000 }
```

### Skill → Bot Manager

```yaml
skill_result:
  skill: "content-worker"
  status: "success"
  
  outputs:
    artifacts: [{ type: "draft_x_post", path: "..." }]
  
  context_updates:
    pending_decisions: [{ question: "APY claims?", ... }]
    compute: { tokens_used: 30000 }
  
  next_suggested: "brand-validator"
```

---

*Session Context is the shared memory that makes the 80% bot execution efficient. Without it, every skill starts from scratch.*
