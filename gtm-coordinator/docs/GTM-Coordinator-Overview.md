# GTM Coordinator — Product Overview

**Version:** 0.2.0 | **Status:** Local CLI (v0)

---

## What Is It?

The GTM Coordinator is a **local CLI tool** that manages Go-To-Market plans as structured YAML files. It ensures every feature launch has consistent documentation, required approvals, and trackable content—before anything goes live.

Think of it as a **checklist engine + content scaffold** that enforces your GTM process.

---

## Why Does It Exist?

| Problem | Solution |
|---------|----------|
| Launches slip through without marketing review | Explicit gates that block until requirements are met |
| No single source of truth for launch status | Canonical YAML file per initiative |
| Content scattered across Notion/Slack/docs | All drafts in one place, linked to the plan |
| Hard to know what's ready vs blocked | Normalized status model + validation |
| Different features need different rigor | Tier system (0/1/2) + Risk levels (low/medium/high) |

---

## Core Concepts

### Tiers (What surfaces are required?)

| Tier | Description | Surfaces Enabled |
|------|-------------|------------------|
| **0** | Silent/internal | Release notes, changelog only |
| **1** | Standard launch | + Discord, X, asset checklist |
| **2** | Major launch | + Blog, tracking, in-app, partners, hero asset |

### Risk Levels (How much governance?)

| Risk | Approvals | Extra Requirements |
|------|-----------|-------------------|
| **Low** | 1 | None |
| **Medium** | 1 | QA cannot be red |
| **High** | 2 | Smoke test pass, rollback plan, QA green |

### Statuses (Where is each piece?)

Every channel and asset uses the same status enum:
```
not_applicable → pending → generated → needs_review → approved → scheduled → published
                                                                          ↘ blocked
```

---

## The Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. INIT          2. ENRICH         3. REVIEW         4. APPROVE            │
│  ─────────        ──────────        ─────────         ──────────            │
│  Create plan      Add PRs/links     Generate packet   QA gate               │
│  Set tier/risk    Auto-gen drafts   Validate          Marketing gate        │
│  Lock to commit   Fill placeholders Address blockers  Execute & publish     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Commands:**
```bash
gtm init --id INIT-1234 --title "Feature X" --tier 2 --risk medium --release "2026-02-01"
gtm enrich --id INIT-1234 --pr <url> --canonical-url <url>
gtm packet --id INIT-1234                    # Generate review packet
gtm qa-pass --id INIT-1234 --signal green    # QA approves
gtm marketing-approve --id INIT-1234 --reviewer "@name"
```

---

## What Gets Created?

```
.gtm/
└── INIT-1234/
    ├── plan.yaml              ← Canonical GTM plan (source of truth)
    ├── review.md              ← Marketing Review Packet (generated)
    └── drafts/
        ├── release_notes_short.md
        ├── discord_post.md
        ├── x_post.md
        ├── blog_draft.md
        ├── partner_brief.md
        └── ...
```

**The YAML captures:**
- Provenance (git SHA, PRs, inputs)
- Timing (release window, publish mode)
- Tracking (canonical URL, UTMs, dashboards, events)
- Channels (enabled/status/owner per channel)
- Assets (hero, required items, PII safety)
- Gates (QA signal, marketing approvals)
- History (audit log of all changes)

---

## Key Interfaces

### For Product/Eng
- Run `gtm init` when planning a feature
- Add PR links with `gtm enrich --pr <url>`
- Lock to commit with `gtm lock --sha <sha>` for traceability

### For Marketing
- Review generated packet (`.gtm/INIT-####/review.md`)
- Edit drafts in `.gtm/INIT-####/drafts/`
- Update statuses: `gtm set-status --field channels.blog.status --value needs_review`
- Approve when ready: `gtm marketing-approve --reviewer "@name"`

### For QA
- Record signal: `gtm qa-pass --signal green --smoke-test pass`
- Add evidence: `--evidence <loom-url>`
- High-risk requires: smoke test pass + rollback plan

---

## Validation = Enforcement

The `gtm validate` command (and `gtm marketing-approve`) checks:

**Tier requirements:**
- Tier 2 must have: canonical URL, dashboard URL, blog, hero asset, partner brief

**Risk requirements:**
- High risk must have: 2 approvals, smoke test pass, rollback plan, QA green

**Channel requirements:**
- Enabled channels must have status ≥ `needs_review` before approval

If validation fails, approval is blocked (unless `--force` is used).

---

## What's Next? (Future Roadmap)

| Phase | Capability |
|-------|------------|
| **v0 (Now)** | Local CLI, manual commands |
| **v1** | GitHub Actions integration (auto-trigger on PR labels) |
| **v2** | Worker bots that read YAML → execute tasks → write status back |
| **v3** | Web dashboard reading `index.json` |

Workers will follow a simple contract:
```
Read .gtm/INIT-####/plan.yaml → Do task → Update status → Done
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `gtm init` | Create new GTM plan |
| `gtm enrich` | Add PRs, generate draft scaffolds |
| `gtm lock` | Lock to git commit SHA |
| `gtm packet` | Generate Marketing Review Packet |
| `gtm validate` | Check tier/risk requirements |
| `gtm set-status` | Update any status field |
| `gtm qa-pass` | Record QA gate |
| `gtm marketing-approve` | Approve marketing gate |
| `gtm marketing-block` | Block with reason |
| `gtm utm` | Generate tracked URLs |
| `gtm links-check` | Validate all URLs |
| `gtm index` | Build index of all initiatives |
| `gtm migrate` | Upgrade old plans to new schema |

---

*Questions? The source of truth is always the YAML file in `.gtm/INIT-####/plan.yaml`*
