---
name: gtm-questionnaire-generator
description: Build an HTML form from a GTM gap report that a product person can fill out, save, and re-upload. Use after gtm-gap-auditor to produce the discovery questionnaire.
---

# GTM Questionnaire Generator

Build an HTML form from the gap report that a product person can fill out, save as a file, and re-upload (or paste back). Pre-fill where extraction already has values.

## When to Use

- After running **gtm-gap-auditor** on a packet
- Need a fillable form for product person to complete
- User says "generate questionnaire" or "create form from gaps"

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Packet path | Yes | `research-output/rfox` |
| Gap report | Yes (or run gtm-gap-auditor first) | `research/gtm_gap_report.md` |
| Pre-fill from extraction | No | Values from workshop or PR extraction |

## Outputs

- `research/gtm_discovery_questionnaire.html` — fillable form with:
  - One field per gap (or grouped by section)
  - Pre-filled where extraction has values
  - **Save as file** button: export form data as JSON for download
  - **Copy to clipboard** button: fallback for paste/email return
  - Instructions: "Fill out, click Save, upload the file or paste responses back"
- `research/gtm_discovery_questionnaire.md` — markdown version for reference

## Form Requirements

### Sections
- Critical (required): Launch date, CTA URL, protocol roster, campaign type
- Important: Primary audience, lead value prop, differentiation, co-marketing
- Optional: Asset approval date, scope lock date, press embargo
- **Other ideas (optional):** Always include a section "Any other marketing ideas or activations?" — textarea, multi-line. Prompt: "Got ideas that aren't in the normal checklist? Add them here — one per line. We'll scope and evaluate them." Field key: `otherIdeas`

### Controls
- **Save as file:** Export form data as JSON; user downloads, re-uploads later
- **Copy to clipboard:** Copy structured text; user pastes back into chat or email
- Instructions at top: "Fill out, click Save, upload the file or paste responses back for merger"

### Pre-fill
- Use extraction values from workshop (transcript) or PR extraction where available
- Mark pre-filled fields so product person knows what's already set

## Template-Driven Rules (CRITICAL)

The form must be **derived from packet data**, not hardcoded to any specific protocol. Every launch gets a form tailored to its own protocol roster, chains, and assets.

### What to derive from packet data

| Form Element | Source | Rule |
|-------------|--------|------|
| **Chain list** (protocol roster table) | `research/protocol_analysis.json` or asset/chain summaries in `research/` | Only show chains present in the packet data. Do NOT hardcode a fixed list of chains. |
| **Packet slug** (`_packet` in JS export) | Packet directory name (e.g. `yield-xyz`) | Derive from packet path. Never hardcode. |
| **Pre-filled values** (launch date, CTA, lead protocols) | `marketing_brief.md`, `research/protocol_analysis.json` | Pre-fill from packet; mark as "(pre-filled)". |
| **Protocol-specific checkboxes** (e.g. "Drop X, Add Y") | Gap report actions | Derive from gap report. If no gap report action suggests add/drop, omit these checkboxes. |
| **Folder choice options** | Packet slug | Default to current slug; always include "New slug" option. Do NOT hardcode alternatives. |
| **Form title** | Protocol name from packet | Use protocol name, not a hardcoded name. |

### What NOT to include

- Fixed chain lists (Sui, Monad, Hyperevm, etc. should NOT appear unless they are in the protocol data)
- Protocol-specific checkbox options like "Drop Drift, Figment" — these belong in the gap report, not baked into the form
- Hardcoded `_packet` values in JavaScript — always derive from packet path

### Pre-fill logic

1. Read `marketing_brief.md` → extract lead protocols, CTA URL, audience, value prop
2. Read `research/protocol_analysis.json` → extract chains, assets, category
3. Read `checklist.md` → extract launch date (if set)
4. For each gap in the gap report: create a form field. If the packet already has a value, pre-fill it and mark "(pre-filled)".

## HTML Structure

- Dark theme (ShapeShift style)
- Sections with headers matching gap report sections
- Input types: text, date, textarea, radio, checkbox
- Protocol roster table: rows derived from chains in the packet (NOT a fixed list)
- Buttons: Save as file, Copy to clipboard
- JavaScript `getFormData()`: `_packet` derived from form title or a hidden field, not hardcoded

## JSON Export Schema

Form data structure should align with **gtm-questionnaire-merger** expectations:
- Top-level keys: `launchDate`, `ctaUrl`, `conversionEvent`, `protocolsPerChain`, `campaignType`, `leadProtocols`, `andMore`, `definitiveRoster`, `comarketingProtocols`, `primaryAudience`, `leadValueProp`, `differentiation`, `walletPartnerCriteria`, `assetApprovalDate`, `scopeLockDate`, `otherIdeas`, etc.
- `otherIdeas`: string (newline-separated list of ideas). Optional. When present, merger extracts and agent runs gtm-cool-ideas-scoper then gtm-cool-ideas-evaluator.
- `protocolsPerChain`: object with chain slugs as keys, values: `{ primary, secondary, notes }`
- `_packet`: derived from packet path (e.g. `yield-xyz`, `rfox`)
- `_updated`: ISO date string

## Integration

- **gtm-gap-auditor:** Produces gap report; generator consumes it
- **gtm-questionnaire-merger:** Consumes filled form (JSON or pasted text). If otherIdeas present, merger instructs agent to run gtm-cool-ideas-scoper then gtm-cool-ideas-evaluator.
- **gtm-cool-ideas-scoper / gtm-cool-ideas-evaluator:** otherIdeas from form feeds into cool-ideas flow
- **gtm-seo-topic-generator:** May run in parallel; no dependency
- **gtm-interception-content:** May run in parallel; no dependency
