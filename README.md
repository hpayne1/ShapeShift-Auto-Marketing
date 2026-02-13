# ShapeShift Auto-Marketing

**AI-powered go-to-market tooling for ShapeShift.** Turn a feature (PR, protocol URLs, partner notes) into a launch-ready packet: drafts, checklist, SEO topics, gap resolution, and final QA — then execute with human approval.

**Created by [Hpayne](https://github.com/hpayne1).**

---

## What It Is

**This workflow runs inside Cursor** — you use Cursor's AI plus built-in skills for planning, gap audit, questionnaire, and final check; the **GTM Coordinator CLI** runs in the terminal for `full-packet` and `seo-batch`.

An auto-marketing system that:

- **Ingests** what's shipping (GitHub PR) and how the protocol presents itself (website, Twitter, Farcaster).
- **Generates** a full GTM packet: marketing brief, channel drafts (X, Discord, blog, Farcaster), press angles, launch checklist, and optional SEO/interception content.
- **Fills gaps** via a product questionnaire (HTML form → merge back into the packet).
- **Runs a final check** before launch (placeholders, framing, copy, brand voice, cadence).
- **Delivers** a single folder per launch with everything needed to execute Day 0–7.

The flow is the same for any integration or feature launch; only the inputs (PR, protocol, campaign type) change.

---

## Workflow (Phases)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PLANNING (Cursor)                                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
  gtm-workshop → PR link, protocol URLs (website, Twitter, Farcaster), optional transcript

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: GENERATE (CLI)                                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘
  gtm full-packet → gtm-coordinator/research-output/<protocol>/

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: ENRICH (Cursor + CLI)                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
  gtm-seo-topic-generator, gtm-interception-content (Cursor) | gtm seo-batch (CLI)

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: GAPS (Cursor)                                                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
  gtm-gap-auditor → gtm-questionnaire-generator → product fills form → gtm-questionnaire-merger

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: FINAL CHECK (Cursor)                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
  gtm-final-check → fix list

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 6: EXECUTE (Human)                                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘
  Checklist: pre-flight, Day 0, Days 1–7
```

---

## End Result (What You Get)

Packets are created at **`gtm-coordinator/research-output/<protocol>/`** (from repo root). When you refer to a packet in Cursor or the CLI, use that path (e.g. `gtm-coordinator/research-output/yield-xyz` or `research-output/yield-xyz` if your cwd is `gtm-coordinator`). Use **view.html** (with a local server) to preview and copy channel drafts.

| Output | Purpose |
|--------|---------|
| **Marketing brief** | Positioning, key messages, audience |
| **Channel drafts** | X posts, threads, Discord, blog, Farcaster (copy-paste ready) |
| **Press & calendar** | Angles, hooks, calendar suggestions |
| **Checklist** | Pre-flight, Day 0, Days 1–7 with approval gates |
| **Gap report → questionnaire → merged packet** | Product input applied so nothing is missing |
| **SEO topics + articles** (optional) | Problem-led SEO content from packet data |
| **Interception angles** (optional) | Social hooks and conversation starters |

After **final check**, the packet is ready for a human to execute: publish, track, and follow up.

---

## Flow (High Level)

```
1. Planning     → PR link, protocol URLs (website, Twitter, Farcaster), optional transcript
2. Generate     → gtm full-packet (CLI) → research-output/<protocol>/
3. Enrich       → SEO topics, interception content, optional cool-ideas scoping
4. Gaps         → gtm-gap-auditor → questionnaire (HTML form) → product fills → gtm-questionnaire-merger
5. Final check  → gtm-final-check (Cursor skill) → fix list
6. Execute      → Human runs checklist (pre-flight, Day 0, Days 1–7)
```

**Tools:** Cursor (skills for workshop, gap audit, questionnaire, final check) + **GTM Coordinator CLI** (`gtm full-packet`, `gtm seo-batch`, `gtm init`, `gtm validate`). Source of truth: **ShapeShift GitHub PR**; protocol URLs add branding and tone.

---

## What You Need

- **Where it runs:** The workflow is designed to run **inside Cursor**. Skills live in `.cursor/skills/` and are used from Cursor chat; the CLI runs in a terminal (same machine).
- **Inputs (per launch):** PR link (ShapeShift repo), protocol wiki/website URL; optional Twitter, Farcaster, transcript. **No PR?** Use gtm-workshop with protocol URLs and/or transcript; run `gtm full-packet --protocol <Name> --url <URL>` without `--pr`.
- **Setup:** Open this repo in **Cursor**; install **GTM Coordinator CLI** from [gtm-coordinator](gtm-coordinator) (`npm install`, `npm link`). **Env:** `OPENAI_API_KEY` (required), `GITHUB_TOKEN` (optional for private PRs). **Main CLI commands:** `gtm full-packet`, `gtm seo-batch`, `gtm init`, `gtm validate` — full list in [GTM-Coordinator-Overview](gtm-coordinator/docs/GTM-Coordinator-Overview.md).
- **Brand:** [brand/voice.md](brand/voice.md), [brand/dos-and-donts.md](brand/dos-and-donts.md) so generated copy stays on-brand.

---

## Quick Start

1. **Open this repo in Cursor** (so skills are available).
2. **Install the CLI:** `cd gtm-coordinator && npm install && npm link`
3. **Set env:** `OPENAI_API_KEY` (required); `GITHUB_TOKEN` optional for private PRs.
4. **Generate a packet:** `gtm full-packet --protocol <Name> --url <protocol-wiki-or-website> --pr <github-pr-url>`
5. **Run final check in Cursor:** e.g. "Run the GTM final check on gtm-coordinator/research-output/<protocol>" (gtm-final-check skill).
6. **Execute:** From the packet folder run `npx serve .` (e.g. `cd gtm-coordinator/research-output/<protocol> && npx serve .`), open index.html in the browser; use view.html to preview and copy channel copy. Follow checklist Day 0–7.

For the full path (workshop, questionnaire, SEO, etc.) see [START-HERE.md](START-HERE.md) or [Marketing Release Process](gtm-coordinator/docs/marketing-release-process.md).

---

## Skills

**What they are:** Cursor agent skills in `.cursor/skills/` — the AI uses them when you ask in chat. Each skill has a `SKILL.md` that tells the agent what to do.

**How to invoke:** In Cursor chat, ask in natural language; no @-mention required. Examples: *"Run the GTM final check on gtm-coordinator/research-output/yield-xyz"* or *"Use the gtm-workshop skill with this PR: [paste link]."* The agent uses the skills when this repo is open.

| Skill | Purpose | When to use |
|-------|---------|-------------|
| **gtm-workshop** | Plan a launch from PR, protocol URLs, or transcript | Start of any launch |
| **gtm-pr-extractor** | Parse a ShapeShift GitHub PR as source of truth | Via full-packet `--pr` or in workshop |
| **gtm-protocol-enricher** | Pull branding, messaging, tone from protocol site/Twitter/Farcaster | Via full-packet flags or in workshop |
| **gtm-gap-auditor** | Compare packet to schema; flag missing/uncertain fields | After full-packet |
| **gtm-questionnaire-generator** | Build fillable HTML form from gap report | After gap audit |
| **gtm-questionnaire-merger** | Merge product's filled form back into the packet | After product fills form |
| **gtm-final-check** | Pre-launch QA: placeholders, framing, copy, brand voice, cadence | Before launch |
| **gtm-seo-topic-generator** | Generate 20–30 problem-led SEO topics from packet | After full-packet (optional) |
| **gtm-interception-content** | Problem-led social hooks, press angles, community angles | After full-packet (optional) |
| **gtm-cool-ideas-scoper** | Scope a human-submitted idea; research, projections; append to cool_ideas | On-demand (optional) |

Full spec and per-skill docs: [GTM-SKILLS-SPEC](gtm-coordinator/docs/GTM-SKILLS-SPEC.md), [.cursor/skills/](.cursor/skills/).

---

## Documentation

| Doc | Purpose |
|-----|---------|
| **[START-HERE.md](START-HERE.md)** | Workflow tree, when to use each skill, minimal vs full path |
| **[START-HERE.html](gtm-coordinator/docs/START-HERE.html)** | Same — open in browser, print or PDF |
| **[GETTING-STARTED.md](GETTING-STARTED.md)** | Manual workflow (Claude/GPT), modes, prerequisites |
| **[marketing-release-process.md](gtm-coordinator/docs/marketing-release-process.md)** | Step-by-step planning → execute (SEO, questionnaire, final check) |
| **[GTM-Coordinator-Overview.md](gtm-coordinator/docs/GTM-Coordinator-Overview.md)** | CLI overview, tiers, statuses |
| **[GTM-Coordinator-OnePager.html](gtm-coordinator/docs/GTM-Coordinator-OnePager.html)** | CLI one-pager |
| **[launch-bin-structure.md](gtm-coordinator/docs/launch-bin-structure.md)** | What's in a launch folder (index, checklist, drafts, view.html) |
| **[GTM-SKILLS-SPEC.md](gtm-coordinator/docs/GTM-SKILLS-SPEC.md)** | Master spec for all GTM skills |
| **[brand/voice.md](brand/voice.md)** | Voice and tone for copy |
| **[brand/dos-and-donts.md](brand/dos-and-donts.md)** | Content rules |
| **[protocols/](protocols/)** | campaign-owner, checkpoint-gates, human-escalation, session-context |
| **[worker-specs/ARCHITECTURE.md](worker-specs/ARCHITECTURE.md)** | System design |
| **worker-specs/** (content-worker, publisher-worker, github-watcher, etc.) | Future worker specs |

---

## Project Structure

```
├── gtm-coordinator/       # CLI: full-packet, seo-batch, init, validate, etc.
│   └── research-output/   # Generated packets (one folder per protocol)
├── .cursor/skills/        # Cursor skills: gtm-workshop, gap-auditor, questionnaire, final-check, etc.
├── brand/                 # Voice and dos-and-donts for generated copy
├── templates/channels/    # X, Discord, blog, Farcaster templates
├── worker-specs/          # Specs for future workers (content, publisher, analytics)
├── protocols/             # Campaign owner, checkpoint gates, human escalation
└── research-output/       # Generated packets (when run from repo root)
```

---

## Status

- **In use:** GTM Coordinator CLI, full-packet generation, gap audit → questionnaire → merge, final check, SEO batch, interception content, cool-ideas scoper.
- **Spec'd, not built:** Worker implementations (content, publisher, analytics), web dashboard, automated scheduling.

---

## License

MIT
