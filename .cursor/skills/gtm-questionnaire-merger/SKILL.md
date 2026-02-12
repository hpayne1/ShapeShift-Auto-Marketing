---
name: gtm-questionnaire-merger
description: Merge filled questionnaire data into the existing GTM packet. Use when a product person has filled the discovery questionnaire and you need to apply their answers to the packet.
---

# GTM Questionnaire Merger

Merge filled questionnaire data into the existing packet. Accepts JSON file (preferred) or pasted text from the form's copy button. Only updates fields that were in the questionnaire; does not overwrite other content.

## When to Use

- Product person has filled the discovery questionnaire
- User provides filled form: JSON file path or pasted text
- Need to apply answers to the packet before final check

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Packet path | Yes | `research-output/rfox` |
| Filled form | Yes | JSON file path or pasted text from copy |

## Outputs

- Updated files:
  - `marketing_brief.md` — launch date, CTA, protocol roster, differentiation
  - `partner/partner_kit.md` — launch date, protocol roster, co-marketing, CTA
  - `checklist.md` — timeline dates
  - Drafts (x_post_main, discord_post, blog_draft, etc.) — CTA URL, protocol/chains
  - `press/pr_brief.md`, `press_release.md` — launch date, embargo, CTA, differentiation
  - `research/protocol_analysis.json` — if applicable
  - `calendar/content_calendar.md` — if applicable
- `research/discovery_answers_{date}.md` — record of what was merged

## Logic

1. Parse input: JSON file or structured text (from copy button)
2. Map each field to packet files (see Materials Requiring Updates in gap report)
3. Apply replacements:
   - Launch date → all files with date references
   - CTA URL → all drafts, partner kit, index
   - Protocol roster → marketing brief, partner kit, drafts
   - Conversion event → marketing brief
   - Differentiation → marketing brief, PR brief
   - etc.
4. Do **not** overwrite content that wasn't in the questionnaire
5. Write `discovery_answers_{date}.md` with before/after for audit

## Field Mapping

| Form Field | Target Files |
|------------|--------------|
| launchDate | marketing_brief, partner_kit, checklist, press_release, pr_brief |
| ctaUrl | drafts, partner_kit, index, marketing_brief |
| conversionEvent | marketing_brief |
| protocolsPerChain | marketing_brief, partner_kit |
| leadProtocols | marketing_brief, partner_kit, drafts |
| andMore | marketing_brief, partner_kit |
| definitiveRoster | marketing_brief, partner_kit |
| campaignType | marketing_brief, pr_brief |
| comarketingProtocols | partner_kit, marketing_brief |
| primaryAudience | marketing_brief |
| leadValueProp | marketing_brief |
| differentiation | marketing_brief, pr_brief |
| embargo | press_release, pr_brief |
| assetApprovalDate | checklist |
| scopeLockDate | checklist |
| otherIdeas | Cool ideas flow — see below |

## Handling Pasted Text

If user pastes text (from copy button) instead of JSON:
- Parse structured text format (e.g. `Launch date: 2026-03-15`, `CTA URL: app.shapeshift.com/#/yields`)
- Extract key-value pairs. Map labels to form fields: e.g. "Other ideas (one per line)" → otherIdeas
- Map to same field mapping as JSON

## Handling otherIdeas

When `otherIdeas` is present in the filled form (non-empty string):
1. Parse into list: split by newline, trim each line, discard empty lines
2. After applying all other field merges, run **gtm-cool-ideas-scoper** with packet path and the list of ideas. Scoper will scope each and append to `intelligence/cool_ideas.md`
3. Then run **gtm-cool-ideas-evaluator** on the packet. Evaluator adds Reality Check to each entry and produces `intelligence/cool_ideas_evaluation.md` with comparison and recommendation (including "recommend none" when applicable)

Record in `discovery_answers_{date}.md` that otherIdeas were submitted and passed to cool-ideas flow.

## Integration

- **gtm-questionnaire-generator:** Produces form; merger consumes filled output. Form includes otherIdeas field.
- **gtm-cool-ideas-scoper:** Receives otherIdeas list after merger; scopes each, appends to cool_ideas.md
- **gtm-cool-ideas-evaluator:** Runs after scoper when otherIdeas were present; produces comparison and recommendation
- **gtm-final-check:** Runs after merger on merged packet
