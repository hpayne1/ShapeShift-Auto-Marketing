# ShapeShift Auto-Marketing — Start Here

**What this is:** An AI-powered GTM (go-to-market) system for launching features. Engineers and product people use Cursor skills + a CLI to generate packets, fill gaps, run final checks, and execute launches.

**One-pager:** [START-HERE.html](gtm-coordinator/docs/START-HERE.html) — open in browser, print or save as PDF.

---

## Workflow Tree (What to Do and When)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PLANNING                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

  gtm-workshop (Cursor skill)
  ├── Inputs: PR link, protocol URLs (website, Twitter, Farcaster), partner transcript
  ├── When: Start of any launch
  ├── How: In Cursor, "Use gtm-workshop skill" + paste PR, URLs, and/or transcript
  └── Output: Extraction, gap list → feeds into full-packet

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: GENERATE                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

  gtm full-packet (CLI)
  ├── Inputs: --protocol, --url (required), --pr, --protocol-twitter, --protocol-farcaster
  ├── When: After planning; uses PR extractor + protocol enricher when flags passed
  ├── How: gtm full-packet --protocol rFOX --url <wiki> --pr <github-pr> --protocol-twitter <x>
  └── Output: research-output/<protocol>/ (checklist, drafts, press, calendar, etc.)

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: GAP RESOLUTION                                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘

  gtm-gap-auditor (Cursor skill)
  ├── When: After full-packet; before questionnaire
  ├── How: "Run gtm-gap-auditor skill on research-output/rfox"
  └── Output: research/gtm_gap_report.md

  gtm-questionnaire-generator (Cursor skill)
  ├── When: After gap audit
  ├── How: "Run gtm-questionnaire-generator skill on research-output/rfox"
  └── Output: research/gtm_discovery_questionnaire.html (fillable form)

  [Product person fills form → Save JSON or copy]

  gtm-questionnaire-merger (Cursor skill)
  ├── When: After product person returns filled form
  ├── How: "Run gtm-questionnaire-merger skill; packet is research-output/rfox; here's the form [paste/file]"
  └── Output: Updated packet (marketing_brief, partner_kit, drafts, etc.)

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: FINAL CHECK & LAUNCH                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

  gtm-final-check (Cursor skill)
  ├── When: After merge; before launch
  ├── How: "Run GTM final check on research-output/rfox"
  └── Output: Fix list (placeholders, framing, copy, brand voice, cadence)

  Execute (human)
  ├── When: After final check passes
  ├── How: Follow checklist.md (PRE-FLIGHT, Day 0, Days 1–7)
  └── Output: Launched content
```

---

## Skills Quick Reference

| Skill | Where | When to Use | How |
|-------|-------|-------------|-----|
| **gtm-workshop** | Cursor | Start of launch; have PR, URLs, or transcript | "Use gtm-workshop" + paste inputs |
| **gtm-pr-extractor** | CLI (via full-packet) | When you have a PR URL | Pass `--pr <url>` to full-packet |
| **gtm-protocol-enricher** | CLI (via full-packet) | When you have Twitter/Farcaster | Pass `--protocol-twitter`, `--protocol-farcaster` |
| **gtm-gap-auditor** | Cursor | After full-packet | "Run gtm-gap-auditor on research-output/rfox" |
| **gtm-questionnaire-generator** | Cursor | After gap audit | "Run gtm-questionnaire-generator on research-output/rfox" |
| **gtm-questionnaire-merger** | Cursor | After product fills form | "Run gtm-questionnaire-merger; here's the form [paste/file]" |
| **gtm-final-check** | Cursor | Before launch | "Run GTM final check on research-output/rfox" |

---

## Source of Truth

| Source | Role |
|--------|------|
| **PR (ShapeShift GitHub)** | Primary — what shipped, what the feature is |
| **Protocol URLs (website, Twitter, Farcaster)** | Enrichment — branding, tone, messaging |

---

## Links

| Doc | Path |
|-----|------|
| **Start Here (this)** | [START-HERE.md](START-HERE.md) |
| **Printable one-pager** | [gtm-coordinator/docs/START-HERE.html](gtm-coordinator/docs/START-HERE.html) |
| **GTM Skills Spec** | [gtm-coordinator/docs/GTM-SKILLS-SPEC.md](gtm-coordinator/docs/GTM-SKILLS-SPEC.md) |
| **Marketing Release Process** | [gtm-coordinator/docs/marketing-release-process.md](gtm-coordinator/docs/marketing-release-process.md) |
| **Getting Started (manual)** | [GETTING-STARTED.md](GETTING-STARTED.md) |
| **GTM Coordinator Overview** | [gtm-coordinator/docs/GTM-Coordinator-Overview.md](gtm-coordinator/docs/GTM-Coordinator-Overview.md) |

### Skills (Cursor)

| Skill | Path |
|-------|------|
| gtm-workshop | [.cursor/skills/gtm-workshop/SKILL.md](.cursor/skills/gtm-workshop/SKILL.md) |
| gtm-pr-extractor | [.cursor/skills/gtm-pr-extractor/SKILL.md](.cursor/skills/gtm-pr-extractor/SKILL.md) |
| gtm-protocol-enricher | [.cursor/skills/gtm-protocol-enricher/SKILL.md](.cursor/skills/gtm-protocol-enricher/SKILL.md) |
| gtm-gap-auditor | [.cursor/skills/gtm-gap-auditor/SKILL.md](.cursor/skills/gtm-gap-auditor/SKILL.md) |
| gtm-questionnaire-generator | [.cursor/skills/gtm-questionnaire-generator/SKILL.md](.cursor/skills/gtm-questionnaire-generator/SKILL.md) |
| gtm-questionnaire-merger | [.cursor/skills/gtm-questionnaire-merger/SKILL.md](.cursor/skills/gtm-questionnaire-merger/SKILL.md) |
| gtm-final-check | [.cursor/skills/gtm-final-check/SKILL.md](.cursor/skills/gtm-final-check/SKILL.md) |

---

## Prerequisites

1. **GTM Coordinator CLI:** `cd gtm-coordinator && npm install && npm link`
2. **Brand assets:** `brand/voice.md`, `brand/dos-and-donts.md`
3. **OPENAI_API_KEY** (for full-packet generation)
4. **GITHUB_TOKEN** (optional; for private PR extraction)
5. **Cursor** (for skills)

---

## Minimal Path (30 min)

1. **Planning:** PR link + protocol website URL
2. **Generate:** `gtm full-packet --protocol <Name> --url <URL> --pr <PR>`
3. **Final check:** Use gtm-final-check skill
4. **Execute:** Follow checklist Day 0

---

## Full Path (with gaps + questionnaire)

1. **Planning:** gtm-workshop with PR, URLs, transcript
2. **Generate:** `gtm full-packet --protocol <Name> --url <URL> --pr <PR> --protocol-twitter <X> --protocol-farcaster <FC>`
3. **Gap audit:** gtm-gap-auditor
4. **Questionnaire:** gtm-questionnaire-generator → product fills → gtm-questionnaire-merger
5. **Final check:** gtm-final-check
6. **Execute:** checklist
