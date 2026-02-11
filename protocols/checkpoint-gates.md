# Checkpoint Gates Protocol

**Checkpoint Gates** are structured approval points in the GTM workflow where human review is required before proceeding. They ensure quality and alignment at critical moments.

---

## Why Checkpoints Exist

**Problems they solve:**
- Work going too far before human review
- Unclear when human input is needed
- No standard for what "ready for review" means
- Wasted effort on wrong direction

**Benefits:**
- Catch issues early, not at the end
- Clear handoff points between bot and human
- Defined criteria for passing each gate
- Audit trail of approvals

---

## Standard Checkpoints

### Tier-Based Checkpoints

| Tier | Checkpoints Required |
|------|---------------------|
| Tier 1 (Major) | Kickoff → Strategy → Drafts → Final → Publish |
| Tier 2 (Significant) | Kickoff → Drafts → Final |
| Tier 3 (Routine) | Drafts → Final (combined) |

---

## Checkpoint Definitions

### 1. Kickoff Gate

**When:** Before any work begins

**Purpose:** Ensure campaign is worth doing and direction is clear

**Criteria:**
```yaml
kickoff_gate:
  name: "Kickoff Approval"
  required_for: ["tier_1", "tier_2"]
  
  inputs_required:
    - campaign_brief: "Objectives, messaging angle, constraints"
    - tier_assignment: "Confirmed tier level"
    - channel_selection: "Approved channels"
    - timeline: "Key dates and deadlines"
  
  checks:
    - "Campaign objective is clear and measurable"
    - "Tier assignment matches the significance"
    - "Timeline is realistic"
    - "No conflicts with other campaigns"
  
  approver: "campaign_owner"
  
  outputs:
    - approved_brief: "Locked campaign brief"
    - session_context: "Initialized with kickoff decisions"
```

**Gate Pass:**
```yaml
kickoff_gate_pass:
  gtm_id: "YIELD-XYZ-001"
  gate: "kickoff"
  status: "approved"
  
  approved_by: "@phil"
  approved_at: "2026-01-29T10:00:00Z"
  
  notes: "Good to proceed. Coordinate with Yield.xyz on timing."
  
  locked_decisions:
    - tier: 2
    - channels: ["x", "discord", "farcaster", "blog"]
    - messaging_angle: "Cross-chain yield + self-custody"
    - publish_target: "2026-02-01"
```

---

### 2. Strategy Gate (Tier 1 only)

**When:** After research, before content creation

**Purpose:** Align on strategic approach before investing in content

**Criteria:**
```yaml
strategy_gate:
  name: "Strategy Approval"
  required_for: ["tier_1"]
  
  inputs_required:
    - research_summary: "Protocol analysis, market context"
    - messaging_strategy: "Key messages, angles, positioning"
    - channel_strategy: "Content type per channel"
    - partner_coordination: "Any co-marketing plans"
  
  checks:
    - "Research is thorough and accurate"
    - "Messaging aligns with brand voice"
    - "Strategy differentiates from competitors"
    - "Partner coordination is confirmed (if applicable)"
  
  approver: "campaign_owner"
  
  outputs:
    - approved_strategy: "Locked messaging and channel approach"
    - content_briefs: "Per-channel content briefs"
```

**Gate Pass:**
```yaml
strategy_gate_pass:
  gtm_id: "STARKNET-001"
  gate: "strategy"
  status: "approved"
  
  approved_by: "@phil"
  approved_at: "2026-01-15T14:00:00Z"
  
  notes: "Strong positioning. Add comparison to zkSync in blog."
  
  locked_decisions:
    - primary_message: "First zkEVM with native Bitcoin support"
    - differentiator: "Self-custodial cross-chain on Starknet"
    - blog_angle: "Technical deep-dive for builders"
    - x_angle: "User benefits, less technical"
```

---

### 3. Drafts Gate

**When:** After content creation, before final polish

**Purpose:** Review draft content for direction and quality

**Criteria:**
```yaml
drafts_gate:
  name: "Draft Review"
  required_for: ["tier_1", "tier_2", "tier_3"]
  
  inputs_required:
    - draft_content: "All channel drafts"
    - validation_results: "Brand Validator, Audience Analyzer results"
    - open_questions: "Any pending decisions"
  
  checks:
    - "Content matches approved strategy/brief"
    - "Brand voice is consistent"
    - "Facts are accurate (Product Oracle verified)"
    - "Audience fit is appropriate"
    - "No compliance issues"
  
  approver: "campaign_owner"
  
  outputs:
    - feedback: "Revision requests or approval"
    - approved_drafts: "Drafts cleared for final polish"
```

**Gate Pass:**
```yaml
drafts_gate_pass:
  gtm_id: "YIELD-XYZ-001"
  gate: "drafts"
  status: "approved_with_feedback"
  
  approved_by: "@phil"
  approved_at: "2026-01-30T11:00:00Z"
  
  feedback:
    - channel: "x_post"
      status: "approved"
      notes: "Good. Strong hook."
    
    - channel: "discord"
      status: "needs_revision"
      notes: "Add link to yield page. More excitement for community."
    
    - channel: "farcaster"
      status: "approved"
      notes: "Perfect for builder audience."
    
    - channel: "blog"
      status: "approved"
      notes: "Outline looks good. Proceed to full draft."
  
  next_step: "Revise Discord post, then proceed to final gate"
```

---

### 4. Final Gate

**When:** After all revisions, before publishing

**Purpose:** Final sign-off on publish-ready content

**Criteria:**
```yaml
final_gate:
  name: "Final Approval"
  required_for: ["tier_1", "tier_2", "tier_3"]
  
  inputs_required:
    - final_content: "All channel content, revised"
    - all_validations: "Brand, links, audience, release checks"
    - publish_plan: "Timing, coordination, rollback plan"
  
  checks:
    - "All feedback from drafts gate addressed"
    - "All validations pass"
    - "Links verified working"
    - "Release Coordinator confirms feature is live"
    - "Partner coordination confirmed (if applicable)"
  
  approver: "campaign_owner"
  
  outputs:
    - publish_authorization: "Cleared to publish"
    - publish_schedule: "Confirmed timing"
```

**Gate Pass:**
```yaml
final_gate_pass:
  gtm_id: "YIELD-XYZ-001"
  gate: "final"
  status: "approved"
  
  approved_by: "@phil"
  approved_at: "2026-02-01T12:00:00Z"
  
  authorization:
    publish_approved: true
    publish_window: "2026-02-01T14:00:00Z - 2026-02-01T16:00:00Z"
    coordination_confirmed: "Yield.xyz posting at 14:00 UTC"
  
  final_checklist:
    - "✅ All content approved"
    - "✅ All links verified"
    - "✅ Feature live on prod"
    - "✅ Partner sync confirmed"
    - "✅ Rollback plan in place"
  
  notes: "Good to go. I'll be monitoring for first hour after publish."
```

---

### 5. Publish Gate (Tier 1 only)

**When:** Immediately before publishing

**Purpose:** Final confirmation for major launches

**Criteria:**
```yaml
publish_gate:
  name: "Publish Confirmation"
  required_for: ["tier_1"]
  
  inputs_required:
    - final_approval: "Final gate passed"
    - live_verification: "Feature confirmed working"
    - timing_confirmation: "Publish window is now"
  
  checks:
    - "Final gate approval is recent (< 24h)"
    - "Feature still working (quick check)"
    - "No breaking news that should delay"
    - "Partner confirmed ready (if coordinated)"
  
  approver: "campaign_owner"
  
  outputs:
    - publish_command: "Execute publish now"
```

**Gate Pass:**
```yaml
publish_gate_pass:
  gtm_id: "STARKNET-001"
  gate: "publish"
  status: "approved"
  
  approved_by: "@phil"
  approved_at: "2026-01-20T14:00:00Z"
  
  confirmation: "Publish now. All systems go."
  
  monitoring:
    owner: "@phil"
    duration: "First 2 hours"
    escalation: "DM me immediately for any issues"
```

---

## Gate Failure Handling

### Rejection

```yaml
gate_rejection:
  gtm_id: "YIELD-XYZ-001"
  gate: "drafts"
  status: "rejected"
  
  rejected_by: "@phil"
  rejected_at: "2026-01-30T11:00:00Z"
  
  reason: "Messaging doesn't match brand voice. Too salesy."
  
  required_changes:
    - "Remove 'amazing' and 'incredible' - not our voice"
    - "Focus on user empowerment, not hype"
    - "Add specific numbers instead of superlatives"
  
  next_step: "Revise and resubmit to drafts gate"
```

### Conditional Pass

```yaml
gate_conditional:
  gtm_id: "YIELD-XYZ-001"
  gate: "final"
  status: "conditional"
  
  approved_by: "@phil"
  approved_at: "2026-02-01T11:00:00Z"
  
  condition: "Publish only after confirming feature is live"
  
  verification_required:
    check: "Visit app.shapeshift.com/earn and verify Yield.xyz appears"
    responsible: "bot-manager"
    before: "publish"
  
  auto_proceed: true  # Proceed automatically once condition met
```

### Blocked

```yaml
gate_blocked:
  gtm_id: "YIELD-XYZ-001"
  gate: "final"
  status: "blocked"
  
  blocker:
    type: "release_not_ready"
    detail: "Feature deployment delayed to 2026-02-03"
  
  action_required:
    options:
      - "Wait for deployment, then re-request final gate"
      - "Cancel campaign"
      - "Reschedule to 2026-02-03"
    
    decision_by: "@phil"
    deadline: "2026-02-01T16:00:00Z"
```

---

## Checkpoint Dashboard

Aggregate view of all checkpoints:

```yaml
checkpoint_dashboard:
  gtm_id: "YIELD-XYZ-001"
  
  gates:
    - name: "kickoff"
      status: "passed"
      approved_at: "2026-01-29T10:00:00Z"
      approved_by: "@phil"
    
    - name: "drafts"
      status: "passed"
      approved_at: "2026-01-30T11:00:00Z"
      approved_by: "@phil"
    
    - name: "final"
      status: "pending"
      submitted_at: "2026-02-01T10:00:00Z"
      awaiting: "@phil"
      deadline: "2026-02-01T12:00:00Z"
  
  overall_status: "awaiting_final_approval"
  next_action: "Campaign Owner to approve final gate"
```

---

## Checkpoint Timing

### SLAs by Gate

| Gate | Standard SLA | Expedited SLA |
|------|-------------|---------------|
| Kickoff | 24 hours | 4 hours |
| Strategy | 48 hours | 12 hours |
| Drafts | 24 hours | 4 hours |
| Final | 12 hours | 2 hours |
| Publish | 1 hour | 15 minutes |

### Escalation on SLA Breach

```yaml
sla_escalation:
  gate: "final"
  submitted_at: "2026-02-01T10:00:00Z"
  sla_deadline: "2026-02-01T22:00:00Z"
  
  current_time: "2026-02-01T21:00:00Z"
  time_remaining: "1 hour"
  
  action: "Send reminder to @phil"
  
  if_breached:
    escalate_to: "@marketing_lead"
    message: "Final gate for YIELD-XYZ-001 is past SLA"
```

---

*Checkpoint gates ensure human oversight at critical moments without blocking bot productivity between checkpoints.*
