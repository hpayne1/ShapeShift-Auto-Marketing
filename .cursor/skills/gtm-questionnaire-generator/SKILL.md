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

### Controls
- **Save as file:** Export form data as JSON; user downloads, re-uploads later
- **Copy to clipboard:** Copy structured text; user pastes back into chat or email
- Instructions at top: "Fill out, click Save, upload the file or paste responses back for merger"

### Pre-fill
- Use extraction values from workshop (transcript) or PR extraction where available
- Mark pre-filled fields so product person knows what's already set

## HTML Structure

Follow the pattern from [yield-xyz gtm_discovery_questionnaire.html](gtm-coordinator/research-output/yield-xyz/research/gtm_discovery_questionnaire.html):
- Dark theme (ShapeShift style)
- Sections with headers
- Input types: text, date, textarea, radio, checkbox
- Protocol roster table (chain → primary, secondary, notes)
- Buttons: Save as file, Copy to clipboard

## JSON Export Schema

Form data structure should align with **gtm-questionnaire-merger** expectations:
- Top-level keys: `launchDate`, `ctaUrl`, `conversionEvent`, `protocolsPerChain`, `campaignType`, `leadProtocols`, `andMore`, `definitiveRoster`, `comarketingProtocols`, `primaryAudience`, `leadValueProp`, `differentiation`, `walletPartnerCriteria`, `assetApprovalDate`, `scopeLockDate`, etc.
- `protocolsPerChain`: object with chain slugs as keys, values: `{ primary, secondary, notes }`

## Integration

- **gtm-gap-auditor:** Produces gap report; generator consumes it
- **gtm-questionnaire-merger:** Consumes filled form (JSON or pasted text)
