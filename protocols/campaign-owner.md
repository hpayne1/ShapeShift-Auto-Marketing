# Campaign Owner Protocol

The **Campaign Owner** is the dedicated human role that owns GTM campaigns end-to-end. This role prevents brand dilution and ensures consistent voice across all releases.

---

## Why This Role Exists

- Engineers as their own managers = inconsistent brand voice
- Bots without human direction = drift and confusion
- 80% automation only works with 20% human bookends

---

## The 10/80/10 Model

| Phase | Owner | Time | Responsibility |
|-------|-------|------|----------------|
| **10% Kickoff** | Campaign Owner | Start | Sets direction, strategy, constraints |
| **80% Execution** | Bot Manager + Skills | Middle | Research, drafts, iterations |
| **10% Review** | Campaign Owner | End | Edits, approvals, final sign-off |

---

## 10% Kickoff Phase

The Campaign Owner's responsibilities at campaign start:

### 1. Review Trigger
- Assess the trigger (PR merged, integration ready, partner request)
- Confirm this warrants a GTM campaign
- Validate timing is appropriate

### 2. Set Campaign Brief
```yaml
campaign_brief:
  gtm_id: "YIELD-XYZ-001"
  objective: "Announce Yield.xyz integration to drive adoption"
  
  messaging:
    primary_angle: "Cross-chain yield optimization"
    secondary_angle: "Self-custodial earning"
    key_messages:
      - "Earn yield across X chains without leaving ShapeShift"
      - "Your keys, your yield"
    avoid:
      - "Guaranteed returns"
      - "Best yields" (no superlatives)
  
  constraints:
    - "Must coordinate with Yield.xyz marketing"
    - "No specific APY claims without source"
    - "Launch after feature is live on prod"
  
  success_metrics:
    - "10K impressions on announcement"
    - "500 clicks to yield page"
    - "50 new yield deposits in first week"
```

### 3. Approve Tier and Channels
- Confirm tier assignment (1/2/3)
- Approve channel selection
- Set any channel-specific constraints

### 4. Set Timeline
```yaml
timeline:
  kickoff: "2026-01-29"
  drafts_due: "2026-01-30"
  review_deadline: "2026-01-31 12:00 UTC"
  publish_window: "2026-02-01 14:00-16:00 UTC"
  
  checkpoints:
    - name: "Draft review"
      date: "2026-01-30"
      required: true
    - name: "Partner sync"
      date: "2026-01-31"
      required: true
    - name: "Final approval"
      date: "2026-02-01 12:00 UTC"
      required: true
```

---

## During 80% Bot Execution

While bots are working, the Campaign Owner:

### Available for Async Questions
- Respond to Bot Manager escalations within SLA
- Provide clarifications when bots are blocked
- Make quick decisions on minor issues

### Escalation Response SLAs
| Priority | Response Time | Example |
|----------|---------------|---------|
| Urgent | 2 hours | Blocker preventing progress |
| Normal | 24 hours | Strategy clarification |
| Low | 48 hours | Nice-to-have input |

### Checkpoint Responses
- Review checkpoint deliverables when notified
- Approve to proceed or request changes
- Don't block on minor issues—note for final review

---

## 10% Review Phase

The Campaign Owner's responsibilities at campaign end:

### 1. Content Review
- Review all generated content across channels
- Check for:
  - Voice consistency (sounds like ShapeShift)
  - Factual accuracy (claims are correct)
  - Brand alignment (follows dos/don'ts)
  - Messaging alignment (matches brief objectives)

### 2. Edit or Approve
```yaml
review_decision:
  status: "approved" | "needs_revision" | "rejected"
  
  # If needs_revision:
  feedback:
    - channel: "x_post"
      issue: "Too technical for general audience"
      suggestion: "Simplify first sentence, move technical details to thread"
    - channel: "discord"
      issue: "Missing call to action"
      suggestion: "Add link to yield page at end"
  
  # If approved:
  sign_off:
    reviewer: "@campaign_owner"
    timestamp: "2026-02-01T11:30:00Z"
    notes: "Good to publish. Minor typo fixed in Discord post."
```

### 3. Final Sign-Off
- Confirm all content is ready
- Approve publish timing
- Authorize Bot Manager to proceed with publishing

### 4. Post-Publish Monitoring (First 24h)
- Monitor initial engagement
- Watch for negative reactions or issues
- Be available for rapid response if needed
- Flag any concerns to Bot Manager

---

## Escalation Triggers to Campaign Owner

The Bot Manager will escalate to Campaign Owner for:

### Always Escalate
- **Tier 1 campaigns** - Major launches always need human oversight
- **Tier 2 campaigns** - Significant features need review
- **Strategy decisions** - Positioning, messaging angle changes
- **Partner mentions** - Any co-marketing or partner references
- **Claims with numbers** - Statistics, performance claims, comparisons

### Escalate If Flagged
- Brand Validator flags content issues
- Audience Analyzer detects segment mismatch
- Release Coordinator finds timing blockers
- News Watcher identifies opportunity or risk

### Don't Escalate (Bot Manager Handles)
- Tier 3 routine updates (unless flagged)
- Technical execution (publishing, scheduling)
- Routine link checking, UTM generation
- Standard brand validation passes

---

## Campaign Owner Checklist

### Kickoff Checklist
- [ ] Reviewed trigger and confirmed GTM is warranted
- [ ] Set campaign brief with objectives and constraints
- [ ] Approved tier and channel selection
- [ ] Set timeline with checkpoints
- [ ] Communicated availability for async questions

### Review Checklist
- [ ] Reviewed all content across channels
- [ ] Verified factual accuracy
- [ ] Confirmed brand voice alignment
- [ ] Checked messaging matches objectives
- [ ] Approved or provided revision feedback
- [ ] Signed off on final content
- [ ] Confirmed publish timing

### Post-Publish Checklist
- [ ] Monitored first 24h engagement
- [ ] Responded to any issues or questions
- [ ] Flagged learnings for Campaign Memory
- [ ] Closed out campaign in GTM tracker

---

## Handoff Format

### Bot Manager → Campaign Owner (Escalation)
```yaml
escalation:
  type: "decision_needed"
  priority: "normal"
  gtm_id: "YIELD-XYZ-001"
  
  context:
    task: "GTM campaign for Yield.xyz integration"
    progress: "Content drafted, awaiting strategy approval"
  
  question: |
    Should we position this as:
    A) Cross-chain yield optimization (technical angle)
    B) Earn more on your crypto (user benefit angle)
    C) Both in different channels
  
  recommendation: "Option C - technical on Farcaster, user benefit on X"
  
  deadline: "2026-01-30T12:00:00Z"
  
  actions:
    - label: "Approve recommendation"
      action: "approve_c"
    - label: "Choose option A"
      action: "approve_a"
    - label: "Choose option B"
      action: "approve_b"
```

### Campaign Owner → Bot Manager (Response)
```yaml
response:
  escalation_id: "esc-001"
  decision: "approve_c"
  notes: "Good thinking. Also emphasize self-custody angle on X."
  timestamp: "2026-01-30T10:15:00Z"
```

---

## Success Metrics for Campaign Owner Role

| Metric | Target |
|--------|--------|
| Escalation response time | < 24h average |
| First-pass approval rate | > 80% |
| Post-publish issues | < 5% of campaigns |
| Brand consistency score | > 90% |

---

*The Campaign Owner is the human anchor that keeps the 80% automation on track. Without this role, brand voice dilutes and bots drift.*
