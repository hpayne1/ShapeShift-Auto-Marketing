# Skills Directory

This directory contains **Skills**—structured system prompts that give AI the context and capabilities to act as specialized workers in the ShapeShift auto-marketing system.

---

## Architecture Overview

The system follows a **six-layer architecture** with **21 skills**:

```
┌─────────────────────────────────────────────────────────────────┐
│  HUMAN LAYER (20%)                                              │
│  Campaign Owner - 10% kickoff, 10% review                       │
├─────────────────────────────────────────────────────────────────┤
│  COORDINATION LAYER (2 skills)                                  │
│  bot-manager.md │ gtm-owner.md                                  │
├─────────────────────────────────────────────────────────────────┤
│  EXECUTION LAYER (5 skills)                                     │
│  content-worker │ publisher-worker │ analytics-worker           │
│  twitter-analytics │ walkthrough-generator                      │
├─────────────────────────────────────────────────────────────────┤
│  KNOWLEDGE LAYER (3 skills)                                     │
│  product-oracle │ asset-manager │ campaign-memory               │
├─────────────────────────────────────────────────────────────────┤
│  QUALITY LAYER (4 skills)                                       │
│  brand-validator │ link-checker │ audience-analyzer             │
│  release-coordinator                                            │
├─────────────────────────────────────────────────────────────────┤
│  MONITORING LAYER (4 skills)                                    │
│  github-watcher │ competitor-watcher │ integration-observer     │
│  news-watcher                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## The 10/80/10 Workflow

| Phase | Owner | Skills Involved |
|-------|-------|-----------------|
| **10% Kickoff** | Campaign Owner (Human) | Bot Manager receives brief |
| **80% Execution** | Bot Manager + Skills | All layers coordinate |
| **10% Review** | Campaign Owner (Human) | Human approves/edits |

---

## Skill Directory

### Coordination Layer

| Skill | Purpose | Entry Point |
|-------|---------|-------------|
| **bot-manager.md** | Central brain, routing, context, escalation | Start here for workflows |
| **gtm-owner.md** | Strategy proposer, brand guardian | Strategy decisions |

### Execution Layer

| Skill | Purpose | Called By |
|-------|---------|-----------|
| **content-worker.md** | Generate draft content | Bot Manager |
| **publisher-worker.md** | Publish to channels | Bot Manager |
| **analytics-worker.md** | Analyze performance | Bot Manager |
| **twitter-analytics.md** | X-specific metrics | Analytics Worker |
| **walkthrough-generator.md** | Product demo videos | Bot Manager |

### Knowledge Layer

| Skill | Purpose | Queried By |
|-------|---------|------------|
| **product-oracle.md** | Source of truth for product state | Content Worker, Brand Validator |
| **asset-manager.md** | Source of truth for visual assets | Content Worker |
| **campaign-memory.md** | Historical context and learnings | Bot Manager, Content Worker |

### Quality Layer

| Skill | Purpose | Called By |
|-------|---------|-----------|
| **brand-validator.md** | Voice/tone compliance | Content Worker, Bot Manager |
| **link-checker.md** | URL and UTM validation | Publisher Worker |
| **audience-analyzer.md** | Segment fit verification | Content Worker |
| **release-coordinator.md** | Timing and readiness check | Bot Manager, Publisher |

### Monitoring Layer

| Skill | Purpose | Reports To |
|-------|---------|------------|
| **github-watcher.md** | Internal repo monitoring | Bot Manager |
| **competitor-watcher.md** | Competitor activity | Bot Manager |
| **integration-observer.md** | Partner activity | Bot Manager |
| **news-watcher.md** | News tie-ins, press opportunities | Bot Manager |

### Deprecated

| Skill | Status | Replacement |
|-------|--------|-------------|
| **orchestrator.md** | ⚠️ DEPRECATED | Use **bot-manager.md** |

---

## How to Use Skills

### In Cursor (Recommended)

1. Start a new chat with Claude
2. Read the skill file you need (e.g., `bot-manager.md`)
3. Claude operates as that specialized worker

### In API Calls

```python
import anthropic

client = anthropic.Anthropic()

with open("skills/bot-manager.md") as f:
    system_prompt = f.read()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Start campaign for Yield.xyz integration"}
    ]
)
```

---

## Skill Relationships

```
                        Campaign Owner (Human)
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Bot Manager      │ ◄── Entry point
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
   ┌───────────┐        ┌───────────┐        ┌───────────┐
   │Execution  │◄──────▶│ Knowledge │        │  Quality  │
   │  Layer    │        │   Layer   │        │   Layer   │
   └───────────┘        └───────────┘        └───────────┘
         │                                         │
         │                                         │
         ▼                                         │
   ┌───────────┐                                   │
   │Monitoring │───────────────────────────────────┘
   │  Layer    │      (triggers & validations)
   └───────────┘
```

### Data Flow

1. **Monitoring Layer** detects triggers → alerts Bot Manager
2. **Bot Manager** queries Knowledge Layer for context
3. **Bot Manager** dispatches to Execution Layer
4. **Quality Layer** validates before human review
5. **Human** approves at checkpoint gates
6. **Execution Layer** publishes content

---

## Quick Reference: Which Skill to Use

| Task | Start With |
|------|------------|
| Run a campaign end-to-end | `bot-manager.md` |
| Get strategy/tier recommendation | `gtm-owner.md` |
| Generate content | `content-worker.md` |
| Check brand compliance | `brand-validator.md` |
| Verify product facts | `product-oracle.md` |
| Check past campaign learnings | `campaign-memory.md` |
| Monitor competitors | `competitor-watcher.md` |
| Watch for news opportunities | `news-watcher.md` |

---

## Protocols

Skills communicate using standardized protocols in `/protocols/`:

| Protocol | Purpose |
|----------|---------|
| `campaign-owner.md` | Human role and 10/80/10 workflow |
| `session-context.md` | Shared state between skills |
| `human-escalation.md` | Bot → Human communication format |
| `checkpoint-gates.md` | Approval gate definitions |

---

## Key Design Principles

1. **Layered Architecture** - Each layer has clear responsibility
2. **Context Sharing** - Session context prevents redundant work
3. **Human Bookends** - 10/80/10 ensures human oversight
4. **Quality Gates** - Validation before human review
5. **Source of Truth** - Knowledge layer provides accurate facts

---

## Adding New Skills

When creating new skills:

1. Determine which layer it belongs to
2. Follow the skill template structure
3. Define inputs/outputs clearly
4. Specify which skills it calls/is called by
5. Add to this README
6. Update ARCHITECTURE.md

---

## Related Files

- `/protocols/` - Communication protocols
- `/brand/` - Brand voice guidelines
- `/templates/channels/` - Channel-specific templates
- `/worker-specs/ARCHITECTURE.md` - Full system architecture
- `/gtm-coordinator/` - CLI tool for GTM management

---

*21 skills across 6 layers, coordinated by Bot Manager, with human oversight at key checkpoints.*
