# Human Escalation Protocol

The **Human Escalation Protocol** defines how bots communicate with humans. It standardizes the format for questions, blockers, approvals, and FYIs to ensure clear, actionable communication.

---

## Why This Protocol Exists

**Problems it solves:**
- Unclear bot questions that humans can't answer
- Missing context in escalations
- No tracking of escalation status
- Inconsistent urgency signaling

**Goals:**
- Every escalation is actionable
- Humans have full context to decide
- Response tracking prevents dropped balls
- Clear priority system respects human time

---

## Escalation Types

| Type | When to Use | Human Action Required |
|------|-------------|----------------------|
| `decision_needed` | Bot needs human to choose between options | Select an option |
| `approval_request` | Content/action ready for sign-off | Approve or reject |
| `blocker` | Bot is stuck and cannot proceed | Unblock or cancel |
| `fyi` | Informational, no action required | Acknowledge |
| `review_ready` | Deliverable ready for human review | Review and provide feedback |

---

## Escalation Schema

```yaml
escalation:
  # === Identity ===
  id: "esc-2026-01-29-001"
  type: "decision_needed"  # decision_needed | approval_request | blocker | fyi | review_ready
  priority: "normal"       # urgent | normal | low
  
  # === Source ===
  from:
    skill: "content-worker"
    session_id: "session-2026-01-29-001"
    gtm_id: "YIELD-XYZ-001"
  
  # === Routing ===
  to: "@phil"              # Campaign Owner or specific person
  channel: "slack"         # slack | discord | email | in_app
  
  # === Context ===
  context:
    campaign: "Yield.xyz Integration Launch"
    task: "Generate announcement content"
    progress: "Draft created, need strategy decision"
    relevant_files:
      - ".gtm/YIELD-XYZ-001/drafts/x_post.md"
  
  # === The Ask ===
  summary: "Need decision on APY claims in marketing content"
  
  detail: |
    Yield.xyz vaults currently show 5-15% APY, but rates fluctuate daily.
    
    The draft X post mentions "competitive yields" but doesn't include 
    specific numbers. Should we:
    
    A) Include APY range with disclaimer about variability
    B) Keep it vague ("competitive yields")
    C) Ask Yield.xyz for their approved marketing language
    
    Context: Past campaigns with specific numbers performed 2x better,
    but we need to ensure accuracy and compliance.
  
  # === Recommendation (if applicable) ===
  recommendation:
    option: "C"
    reasoning: |
      Getting Yield.xyz's approved language ensures accuracy and 
      strengthens the partnership. We can use their numbers with confidence.
  
  # === Actions ===
  actions:
    - id: "approve_a"
      label: "Include APY range with disclaimer"
      description: "Add '5-15% APY (rates vary)' to content"
    - id: "approve_b"
      label: "Keep vague"
      description: "Stick with 'competitive yields'"
    - id: "approve_c"
      label: "Ask partner"
      description: "Request approved language from Yield.xyz"
    - id: "custom"
      label: "Other"
      description: "Provide custom guidance"
  
  # === Timing ===
  created_at: "2026-01-29T14:20:00Z"
  deadline: "2026-01-30T12:00:00Z"
  sla:
    urgent: "2 hours"
    normal: "24 hours"
    low: "48 hours"
  
  # === Status Tracking ===
  status: "pending"  # pending | acknowledged | resolved | expired
  acknowledged_at: null
  resolved_at: null
  resolution: null
```

---

## Priority Levels

### Urgent (2-hour SLA)
Use for:
- Blockers preventing any progress
- Time-sensitive opportunities (newsjacking window)
- Issues with already-published content
- Partner coordination with hard deadlines

```yaml
escalation:
  priority: "urgent"
  summary: "Published post has incorrect link - needs immediate fix"
  deadline: "2026-01-29T16:00:00Z"  # 2 hours from now
```

### Normal (24-hour SLA)
Use for:
- Strategy decisions during content creation
- Approval requests for drafts
- Non-blocking questions
- Standard checkpoints

```yaml
escalation:
  priority: "normal"
  summary: "Draft content ready for review"
  deadline: "2026-01-30T14:00:00Z"  # Next day
```

### Low (48-hour SLA)
Use for:
- Nice-to-have input
- Post-campaign feedback requests
- Non-urgent suggestions
- FYI items

```yaml
escalation:
  priority: "low"
  summary: "Campaign performance summary - FYI"
  deadline: "2026-02-01T14:00:00Z"  # 2 days out
```

---

## Escalation Templates

### Decision Needed

```yaml
escalation:
  type: "decision_needed"
  priority: "normal"
  
  summary: "Messaging angle decision for Yield.xyz campaign"
  
  detail: |
    We can position this integration two ways:
    
    **Option A: Technical angle**
    "Cross-chain yield optimization with auto-compounding"
    Best for: Farcaster, technical audience
    
    **Option B: Benefit angle**  
    "Earn more on your crypto without extra work"
    Best for: X, general audience
    
    **Option C: Both**
    Technical on Farcaster, benefits on X
    
  recommendation:
    option: "C"
    reasoning: "Matches platform audiences, maximizes reach"
  
  actions:
    - id: "approve_a"
      label: "Technical only"
    - id: "approve_b"
      label: "Benefits only"
    - id: "approve_c"
      label: "Both (recommended)"
```

### Approval Request

```yaml
escalation:
  type: "approval_request"
  priority: "normal"
  
  summary: "Content ready for final approval - Yield.xyz campaign"
  
  detail: |
    All content has been drafted and validated:
    
    ✅ X post - Brand validated, links checked
    ✅ Discord announcement - Ready
    ✅ Farcaster cast - Ready
    ✅ Blog outline - Ready for expansion
    
    Please review the drafts and approve for publishing.
  
  context:
    relevant_files:
      - ".gtm/YIELD-XYZ-001/drafts/x_post.md"
      - ".gtm/YIELD-XYZ-001/drafts/discord_post.md"
      - ".gtm/YIELD-XYZ-001/drafts/farcaster_post.md"
  
  actions:
    - id: "approve"
      label: "Approve all"
      description: "Content is ready to publish"
    - id: "approve_with_edits"
      label: "Approve with minor edits"
      description: "I'll make small changes, then good to go"
    - id: "needs_revision"
      label: "Needs revision"
      description: "Significant changes needed - will provide feedback"
    - id: "reject"
      label: "Reject"
      description: "Do not publish this content"
```

### Blocker

```yaml
escalation:
  type: "blocker"
  priority: "urgent"
  
  summary: "Cannot proceed - feature not deployed to production"
  
  detail: |
    Release Coordinator check failed:
    
    ❌ Yield.xyz integration is not live on app.shapeshift.com
    
    The PR was merged but deployment hasn't happened yet.
    
    Options:
    1. Wait for deployment (ETA unknown)
    2. Get deployment ETA from engineering
    3. Proceed with draft but hold publishing
    4. Cancel campaign until feature is live
  
  actions:
    - id: "wait"
      label: "Wait for deployment"
    - id: "get_eta"
      label: "I'll get ETA from engineering"
    - id: "hold_publish"
      label: "Continue drafts, hold publishing"
    - id: "cancel"
      label: "Cancel campaign for now"
```

### FYI

```yaml
escalation:
  type: "fyi"
  priority: "low"
  
  summary: "Competitor launched similar feature - opportunity identified"
  
  detail: |
    News Watcher detected:
    
    Uniswap announced yield aggregation feature today.
    
    This creates an opportunity to highlight ShapeShift's:
    - Self-custodial approach (vs Uniswap's custody model)
    - Cross-chain support (28 chains vs their 5)
    - Existing Yield.xyz integration
    
    No action required now, but consider for future content.
  
  actions:
    - id: "acknowledge"
      label: "Got it"
    - id: "create_campaign"
      label: "Create response campaign"
```

### Review Ready

```yaml
escalation:
  type: "review_ready"
  priority: "normal"
  
  summary: "Draft content ready for 10% review phase"
  
  detail: |
    Content generation complete for Yield.xyz campaign:
    
    **X Post** (280 chars)
    "ShapeShift now supports Yield.xyz vaults across Ethereum, 
    Arbitrum, and Optimism. Earn yield on your crypto—self-custodial, 
    no KYC required. Your keys, your yield. 🦊"
    
    **Discord** (preview)
    "Big news, foxes! Yield.xyz integration is live..."
    
    **Farcaster** (preview)
    "New integration: @yield_xyz vaults now accessible..."
    
    All content has passed Brand Validator and Link Checker.
    
    Please review and provide feedback or approval.
  
  context:
    relevant_files:
      - ".gtm/YIELD-XYZ-001/drafts/x_post.md"
      - ".gtm/YIELD-XYZ-001/drafts/discord_post.md"
      - ".gtm/YIELD-XYZ-001/drafts/farcaster_post.md"
    
    validations:
      brand_validator: "pass"
      link_checker: "pass"
      audience_analyzer: "pass"
  
  actions:
    - id: "approve"
      label: "Approve"
    - id: "feedback"
      label: "Provide feedback"
    - id: "reject"
      label: "Reject"
```

---

## Response Schema

```yaml
response:
  # === Reference ===
  escalation_id: "esc-2026-01-29-001"
  
  # === Decision ===
  action: "approve_c"  # ID from escalation.actions
  
  # === Additional Input ===
  notes: |
    Good recommendation. Also:
    - Emphasize self-custody angle on X
    - Add ShapeShift Discord link to Discord post
  
  # === Custom Input (if action was "custom") ===
  custom_input: null
  
  # === Metadata ===
  responded_by: "@phil"
  responded_at: "2026-01-29T15:30:00Z"
```

---

## Routing Rules

### Who Gets What

| Escalation Type | Default Route | Fallback |
|----------------|---------------|----------|
| Strategy decisions | Campaign Owner | Marketing Lead |
| Technical blockers | Engineering | Campaign Owner |
| Brand/voice issues | Campaign Owner | Brand Steward |
| Partner mentions | Campaign Owner | Partnerships |
| Urgent issues | Campaign Owner | On-call |

### Channel Selection

| Priority | Primary Channel | Backup |
|----------|----------------|--------|
| Urgent | Slack DM + @mention | SMS |
| Normal | Slack channel | Email |
| Low | Email | Slack channel |

---

## Escalation Lifecycle

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Created   │ ──▶ │ Acknowledged│ ──▶ │  Resolved   │ ──▶ │   Closed    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
   Notification       Human sees it      Decision made
   sent to human      and acknowledges   and recorded
```

### Status Tracking

```yaml
escalation_lifecycle:
  created_at: "2026-01-29T14:20:00Z"
  acknowledged_at: "2026-01-29T14:45:00Z"
  resolved_at: "2026-01-29T15:30:00Z"
  
  time_to_acknowledge: "25 minutes"
  time_to_resolve: "1 hour 10 minutes"
  within_sla: true
```

---

## Escalation Aggregation

For review phases, aggregate multiple items:

```yaml
escalation:
  type: "review_ready"
  summary: "5 items ready for review"
  
  items:
    - type: "draft"
      name: "X post"
      status: "ready"
      quick_action: "approve"
    
    - type: "draft"
      name: "Discord post"
      status: "ready"
      quick_action: "approve"
    
    - type: "decision"
      name: "APY claims"
      status: "needs_decision"
      quick_action: "view_options"
    
    - type: "validation"
      name: "Link check"
      status: "pass"
      quick_action: "none"
    
    - type: "validation"
      name: "Release check"
      status: "blocked"
      quick_action: "view_blocker"
  
  bulk_actions:
    - id: "approve_all_ready"
      label: "Approve all ready items"
    - id: "review_individually"
      label: "Review each item"
```

---

*Clear escalation protocols respect human time while ensuring bots get the input they need to proceed.*
