---
name: gtm-cool-ideas-scoper
description: Ingest human-submitted marketing ideas (one or many), scope each, research similar activations, add projections, and append to intelligence/cool_ideas.md. Use when the user says "here's a cool idea", "we could do this activation", "scope this idea", or pastes/describes creative concepts. Supports batch: numbered list, bulleted list, or file with one idea per section.
---

# GTM Cool Ideas Scoper

Take a human-submitted creative idea (activation, experiment, concept) and scope it, research it, add projections, and append it to `intelligence/cool_ideas.md`. This is for ideas that aren't part of the normal marketing checklist — things a person thought of that the bot enriches.

## When to Use

- User says "here's a cool idea", "we could do this activation", "scope this idea"
- User pastes or describes a creative marketing concept
- During gtm-workshop when someone mentions an idea in the transcript
- Anytime after full-packet exists and someone has an idea to capture
- When questionnaire-merger passes otherIdeas from the discovery questionnaire

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Human idea(s) | Yes | Pasted text, file path, or described in chat. Supports batch: numbered list (1. ... 2. ...), bulleted list, or file with one idea per `##` section or line |
| Packet path | Recommended | `research-output/yield-xyz` (for protocol context) |

## Outputs

- Append to or create `intelligence/cool_ideas.md` in the packet folder
- If no packet path: ask user for packet path, or create `cool_ideas.md` in a sensible default (e.g. most recent launch folder) and note that context was limited

## Workflow

### Step 1: Receive idea(s)

Accept one or multiple ideas in any form:
- Pasted text in chat — single idea or batch (numbered "1. ... 2. ...", bulleted list)
- File path to a text/md file — one idea per `##` section, numbered list, or line
- Description from the user ("we could run a meme contest for yield stakers")
- From questionnaire-merger: otherIdeas field (list of strings)

**Batch parsing:** If input contains multiple ideas (e.g. "1. Meme contest... 2. Prediction market... 3. Reply-guy campaign..."), treat each as a separate idea. Process each and append each as a separate entry to cool_ideas.md.

### Step 2: Load packet context (if packet path provided)

Read:
- `marketing_brief.md` — audience, value prop, launch focus
- `research/protocol_analysis.json` — category, chains, assets

Use this to tailor scope and projections to the launch.

### Step 3: Scope the idea

Expand the raw idea into:
- What it is (clear description)
- How it fits the launch (protocol, audience, chains)
- Channels/tactics (X, Discord, Farcaster, blog, etc.)
- Key milestones or phases

### Step 4: Research

Do light web search for:
- Similar activations in crypto/DeFi
- Benchmarks (engagement, participation, cost)
- Risks or pitfalls
- Best practices

Use search patterns similar to fullPacketGenerator (e.g. "{category} marketing activation {idea type} crypto 2025" or similar). Cite sources when useful.

### Step 5: Projections

Estimate based on scope and research:
- **Budget:** Range (e.g. $0–200, $500–1k)
- **Time:** Effort (e.g. 1 week prep, 2 weeks execution)
- **Reach:** Expected impressions/engagement if applicable
- **Feasibility:** high/medium/low + brief rationale

### Step 6: Write output

Ensure `intelligence/` directory exists (create it if the packet has no intelligence folder yet). Append to `intelligence/cool_ideas.md`. Create the file if it doesn't exist. Use this structure:

```markdown
## [Idea Title]

**Submitted:** [YYYY-MM-DD]
**Source:** Human (from [context: chat, workshop, call, etc.])

### Idea (original)
[Person's raw idea in their words]

### Scoped Description
[Bot-expanded: what it is, how it fits the launch, channels/tactics]

### Projections
- **Budget:** [estimate]
- **Time:** [effort estimate]
- **Reach:** [expected impressions/engagement if applicable]
- **Feasibility:** [high/medium/low + brief why]

### Research Notes
[What the bot found: similar activations, benchmarks, risks, best practices]

### Next Steps
[Concrete actions to move forward or validate]

---
```

## Rules

- Preserve the person's original idea verbatim in "Idea (original)"
- Be realistic with projections — cite research where possible
- If research finds nothing useful, say so and base estimates on scope alone
- Follow ShapeShift brand voice for any suggested copy or CTAs
- Append; do not overwrite existing entries in cool_ideas.md

## Integration

- **wild_cards.md:** Bot-invented ideas (no human input). cool_ideas.md = human ideas, bot-scoped.
- **gtm-interception-content:** Problem-led content hooks. cool_ideas.md = creative activations.
- **gtm-workshop:** Can invoke this skill when transcript or chat mentions an idea to scope.
- **gtm-cool-ideas-evaluator:** After scoper appends ideas, run evaluator for reality check and comparison/ranking.
- **gtm-questionnaire-merger:** Extracts otherIdeas from discovery questionnaire; pass to scoper to process each.

## Example Session

```
User: Here's a cool idea — we could run a meme contest where people submit yield-related memes and we reward the top 3 with crypto.

Agent: [Loads packet research-output/yield-xyz, scopes idea, searches "DeFi meme contest crypto 2025", adds projections]
Agent: I've scoped your idea and appended it to intelligence/cool_ideas.md. Summary:
- Budget: $200–500 (rewards + promotion)
- Time: 1 week prep + 1 week contest
- Feasibility: High — similar contests have driven 2–5x engagement for DeFi protocols
```
