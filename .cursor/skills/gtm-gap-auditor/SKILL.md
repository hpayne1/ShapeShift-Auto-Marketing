---
name: gtm-gap-auditor
description: Compare a GTM packet to a schema and flag missing, empty, or uncertain fields. Use after full-packet generation to identify what a product person needs to fill in.
---

# GTM Gap Auditor

Compare packet contents to a schema and flag gaps. Produces a structured gap report that feeds into the questionnaire generator. Run after `gtm full-packet` and before the questionnaire is filled out.

## When to Use

- After running `gtm full-packet` (or equivalent)
- Before generating the discovery questionnaire
- When user says "audit this packet," "what's missing," or "gap analysis"

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Packet path | Yes | `research-output/rfox` or `gtm-coordinator/research-output/rfox` |

## Outputs

- `research/gtm_gap_report.md` — human-readable gap report with:
  - Table: Field | Current Value | Expected/Required | Action
  - Sections: Timeline, CTA/Conversion, Protocol Roster, Messaging, Co-Marketing, etc.
- Structured gap list (for questionnaire generator): list of fields with type, current value, question text

## Logic

1. Load packet files:
   - `marketing_brief.md`
   - `research/protocol_analysis.json`
   - `checklist.md`
   - Drafts (x_post_main, discord_post, blog_draft, etc.)
   - `partner/partner_kit.md`
   - `press/pr_brief.md`
   - `calendar/content_calendar.md`
2. Compare to schema (see [extraction-schema.md](.cursor/skills/gtm-workshop/reference/extraction-schema.md) + packet-specific fields):
   - Required: launch date, CTA URL, protocol roster, campaign type
   - Flag: `Unknown`, `undefined`, empty arrays, missing required fields
   - Check consistency: dates match across files, CTA same everywhere
3. Produce gap report in same structure as [yield-xyz gtm_gap_analysis.md](gtm-coordinator/research-output/yield-xyz/research/gtm_gap_analysis.md)

## Fields to Audit

### Timeline
- Launch date
- Embargo date
- Asset approval date
- Scope lock date
- Consistency across checklist, partner kit, press

### CTA and Conversion
- CTA URL
- Conversion event
- Consistency across drafts

### Protocol Roster
- Protocols per chain
- Lead protocols vs "and more"
- Definitive roster for headlines

### Messaging
- Primary audience
- Lead value prop
- Differentiation
- Key message / one-liner

### Co-Marketing
- Co-marketing protocols
- Wallet partner criteria

### Campaign Type
- Integration vs program/launch

## Output Format (gtm_gap_report.md)

```markdown
# {Protocol} GTM Gap Report

**Based on:** packet at {path}
**Date:** {date}

## Timeline Gaps
| Item | Current | Expected | Action |
|------|---------|----------|--------|
| Launch date | ... | ... | ... |

## CTA and Conversion Gaps
...

## Protocol Roster Gaps
...

## Materials Requiring Updates (Post-Questionnaire)
1. marketing_brief.md — ...
2. partner/partner_kit.md — ...
...
```

## Integration

- **gtm-questionnaire-generator:** Consumes gap report to build HTML form
- **gtm-questionnaire-merger:** Uses same field list to map filled answers to packet files
