# ShapeShift Auto-Marketing

Automated marketing orchestration for ShapeShift. From code ship to content publish.

---

## START HERE

**New here?** Read [START-HERE.md](START-HERE.md) for the full workflow: diagram, skills tree, when and how to use each skill, and links.

**One-pager:** [gtm-coordinator/docs/START-HERE.html](gtm-coordinator/docs/START-HERE.html) — open in browser, print or save as PDF.

**Workflow:** Planning (gtm-workshop) → Generate (gtm full-packet) → Gap Audit → Questionnaire → Merge → Final Check → Execute

---

## What Is This?

An AI-powered marketing system that:
1. **Watches** for new features (GitHub PRs/releases)
2. **Generates** content drafts (X posts, Discord, blogs)
3. **Records** product walkthroughs automatically
4. **Publishes** with human approval gates
5. **Tracks** performance metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│   GitHub PR Merged                                               │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │   GitHub    │────▶│   Content   │────▶│  Publisher  │       │
│   │   Watcher   │     │   Worker    │     │   Worker    │       │
│   └─────────────┘     └─────────────┘     └─────────────┘       │
│         │                   │                   │                │
│         │                   ▼                   ▼                │
│         │             ┌─────────────┐     ┌─────────────┐       │
│         └────────────▶│  Walkthrough│     │  Analytics  │       │
│                       │  Generator  │     │   Worker    │       │
│                       └─────────────┘     └─────────────┘       │
│                                                                  │
│   All state in: .gtm/{id}/plan.yaml                             │
│   Human approval required before publish                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Initialize a GTM Plan

```bash
cd gtm-coordinator
npm install
npm run build
npm link

# Create a new GTM plan
gtm init --id STRK-001 --title "Starknet Integration Launch" --tier 2
```

### 2. Generate Content (Manual Mode)

See [GETTING-STARTED.md](./GETTING-STARTED.md) for the full manual workflow using Claude/GPT.

### 3. Review & Approve

```bash
# Check plan status
gtm validate .gtm/STRK-001/plan.yaml

# Approve for publishing
gtm marketing-approve --reviewer "@yourname"
```

## Project Structure

```
shapeshift-automarketing/
├── gtm-coordinator/          # CLI tool for managing GTM plans
│   ├── src/
│   │   ├── cli.ts           # Main CLI entry
│   │   ├── commands/        # CLI commands
│   │   └── lib/             # Core logic
│   └── templates/           # Plan templates
│
├── brand/                    # Brand guidelines
│   ├── voice.md             # Voice & tone guide
│   └── dos-and-donts.md     # Content rules
│
├── templates/                # Content templates
│   └── channels/
│       ├── x_post.md        # X/Twitter posts
│       ├── x_thread.md      # X threads
│       ├── discord.md       # Discord announcements
│       ├── blog.md          # Blog posts
│       └── farcaster.md     # Farcaster casts
│
├── worker-specs/             # Worker specifications
│   ├── ARCHITECTURE.md      # System overview
│   ├── content-worker.md    # Content generation
│   ├── publisher-worker.md  # Publishing
│   ├── analytics-worker.md  # Metrics tracking
│   ├── github-watcher.md    # PR/release monitoring
│   ├── walkthrough-generator.md  # Demo creation
│   └── walkthrough-runner.ts     # Playwright automation
│
├── grants/                   # Grant proposals
│   └── starknet-*/          # Starknet grant materials
│
└── .gtm/                     # Generated GTM plans (gitignored)
    └── {id}/
        ├── plan.yaml
        ├── drafts/
        └── reports/
```

## Core Concepts

### GTM Plans

Every marketing initiative is a **GTM Plan** — a YAML file that tracks:
- What's being launched (provenance)
- What content to create (channels)
- Who approved what (gates)
- What was published (outputs)

### Tiers

| Tier | Description | Approval |
|------|-------------|----------|
| 0 | Major launch (new chain, protocol) | Full review |
| 1 | Significant feature | Marketing review |
| 2 | Minor update, bug fix | Light review |

### Workers

Stateless scripts that:
1. Read from `plan.yaml`
2. Do their job (generate, publish, analyze)
3. Write status back to `plan.yaml`

## Current Status

### ✅ Done
- GTM Coordinator CLI
- YAML schema & validation
- Brand voice guide
- Channel templates
- Worker specifications
- Walkthrough automation script

### ⚠️ In Progress
- Content generation prompts
- API integrations

### ❌ Not Started
- Worker implementations
- Web dashboard
- Automated scheduling

## Documentation

| Doc | Purpose |
|-----|---------|
| **[START-HERE.md](START-HERE.md)** | Full workflow diagram, skills tree, links |
| **[START-HERE.html](gtm-coordinator/docs/START-HERE.html)** | Printable one-pager |
| [GTM Skills Spec](gtm-coordinator/docs/GTM-SKILLS-SPEC.md) | Master spec for all GTM skills |
| [Marketing Release Process](gtm-coordinator/docs/marketing-release-process.md) | Step-by-step launch flow |
| [Getting Started](GETTING-STARTED.md) | Manual workflow guide |
| [Architecture](worker-specs/ARCHITECTURE.md) | System design |
| [Brand Voice](brand/voice.md) | Content guidelines |
| [GTM Coordinator Overview](gtm-coordinator/docs/GTM-Coordinator-Overview.md) | CLI reference |

## Contributing

This is an internal ShapeShift project. See the worker specs for implementation details.

## License

MIT
