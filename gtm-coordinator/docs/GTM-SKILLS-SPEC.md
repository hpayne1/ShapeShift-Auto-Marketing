# GTM Skills Specification

Master spec for the ShapeShift Auto-Marketing GTM workflow skills. PR is the source of truth; protocol URLs enrich branding and messaging. The questionnaire flow fills gaps via an HTML form that product people fill, save, and re-upload.

---

## Skill Summary

| Skill | Status | Purpose | Key Inputs | Key Outputs |
|-------|--------|---------|------------|-------------|
| **gtm-workshop** | Update | Extract from transcripts; accept PR + protocol URLs; identify gaps | Transcripts, PR link, protocol URLs | Extraction, gap list, kickoff |
| **gtm-pr-extractor** | New | Parse PR as source of truth | PR URL | Structured feature data |
| **gtm-protocol-enricher** | New | Pull branding, messaging, social tone | Website URL, Twitter URL, Farcaster URL | Branding, positioning, what-works summary |
| **gtm-full-packet** | Existing | Generate packet from PR + enrichment + workshop | PR data, protocol data, extraction | `research-output/` with drafts |
| **gtm-gap-auditor** | New | Compare packet to schema; flag missing/uncertain fields | Packet | Gap report |
| **gtm-questionnaire-generator** | New | Build HTML form from gaps | Gap report, optional pre-fill | HTML form (fillable, saveable) |
| **gtm-questionnaire-merger** | New | Merge filled form + packet | JSON/text + packet | Merged packet |
| **gtm-final-check** | Existing | Pre-launch QA | Merged packet | Fix list |
| **gtm-execute** | Optional | Orchestrator or checklist guidance | Approved packet | Day 0-7 execution |

---

## Workflow

```
Phase 1: Inputs
  gtm-workshop → transcripts, PR link, protocol URLs (website, Twitter, Farcaster)
  gtm-pr-extractor → PR URL
  gtm-protocol-enricher → Website, Twitter, Farcaster URLs

Phase 2: Generate
  gtm-full-packet → PR data + protocol enrichment + workshop extraction → research-output/

Phase 3: Gap Resolution
  gtm-gap-auditor → packet → gap report
  gtm-questionnaire-generator → gap report → HTML form
  [Product person fills form, saves/upload]
  gtm-questionnaire-merger → filled form + packet → merged packet

Phase 4: Launch
  gtm-final-check → merged packet → fix list
  gtm-execute → approved packet → Day 0-7 guidance
```

---

## Source of Truth Hierarchy

| Source | Role |
|--------|------|
| **PR (ShapeShift GitHub)** | Primary — what actually shipped, what the feature is |
| **Protocol URL (website, Twitter, Farcaster)** | Enrichment only — branding, messaging, tone, what works |

---

## Build Specs

See [START-HERE.md](../../START-HERE.md) for the workflow diagram and skills tree. See [START-HERE.html](START-HERE.html) for the printable one-pager.

See individual skill files in `.cursor/skills/` for detailed specs.

- [gtm-workshop](.cursor/skills/gtm-workshop/SKILL.md)
- [gtm-pr-extractor](.cursor/skills/gtm-pr-extractor/SKILL.md)
- [gtm-protocol-enricher](.cursor/skills/gtm-protocol-enricher/SKILL.md)
- [gtm-gap-auditor](.cursor/skills/gtm-gap-auditor/SKILL.md)
- [gtm-questionnaire-generator](.cursor/skills/gtm-questionnaire-generator/SKILL.md)
- [gtm-questionnaire-merger](.cursor/skills/gtm-questionnaire-merger/SKILL.md)
- [gtm-final-check](.cursor/skills/gtm-final-check/SKILL.md)

---

## Launch bin structure

Each launch has one folder under `research-output/<launch-slug>/` (index, checklist, view.html, drafts, partner, press, etc.) plus **SHIPPED.md** to record what went out and reuse copy. See [Launch bin structure](launch-bin-structure.md).

---

## Related Docs

- [Marketing Release Process](marketing-release-process.md)
- [GTM Coordinator Overview](GTM-Coordinator-Overview.md)
- [Launch bin structure](launch-bin-structure.md)
