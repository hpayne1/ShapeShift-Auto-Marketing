---
name: gtm-cool-ideas-evaluator
description: Evaluate cool ideas in cool_ideas.md with reality check (resourcing, min sample size, CPA, projected outcomes), produce comparison/ranking, and recommend pursue/validate/defer — or "recommend none" when no ideas are viable. Use when user says "evaluate these cool ideas", "reality check on the ideas", "which of these is feasible", or after ideas from questionnaire are merged.
---

# GTM Cool Ideas Evaluator

Run a reality check on ideas in `cool_ideas.md`. Add resourcing, minimum sample size, CPA, and projected outcomes to each entry. Produce a comparison table and ranked recommendations — including **"We recommend you don't do any of these"** when none meet criteria. Not every idea makes the final cut.

## When to Use

- After ideas are in cool_ideas.md (from scoper, questionnaire, or chat)
- User says "evaluate these cool ideas", "reality check on the ideas", "which of these is feasible"
- After questionnaire-merger when otherIdeas were submitted — run evaluator to produce options and recommendation
- Before committing budget to any activation

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Packet path | Yes | `research-output/yield-xyz` |
| cool_ideas.md | Yes (from packet) | Must exist with at least one entry |

## Outputs

1. **Update cool_ideas.md** — Add Reality Check block to each entry
2. **Create cool_ideas_evaluation.md** — Comparison table, ranked list, recommendations (including "recommend none" when applicable)

## Workflow

### Step 1: Load cool_ideas.md and packet context

Read:
- `intelligence/cool_ideas.md` — all entries (each `## [Title]` section)
- `marketing_brief.md` — audience, value prop, launch scope
- `research/protocol_analysis.json` — category, chains, assets

If cool_ideas.md is empty or missing, inform user: "No ideas to evaluate. Submit ideas first (chat, file, or via discovery questionnaire otherIdeas field), then run gtm-cool-ideas-scoper to scope them."

### Step 2: For each idea, add Reality Check

For each entry in cool_ideas.md, research and add:

- **Resourcing:** People, hours, tools (e.g. "1 person, 10–15 hrs, no tools")
- **Min sample size:** For meaningful results — research (e.g. "DeFi survey minimum sample size", "meme contest participation benchmarks", "A/B test sample size crypto") — cite sources
- **Projected outcomes:** What we think will happen (e.g. "50–150 entries, 2–5x engagement vs baseline")
- **CPA (if paid):** Budget / projected conversions (e.g. "$20–40 per acquisition at $500 budget")
- **Reality-check summary:** 1–2 sentences on viability, key constraint, recommendation

Insert a **Reality Check** block after each entry's existing content (before the `---` separator).

### Step 3: Update cool_ideas.md

Write the Reality Check block into each entry. Structure:

```markdown
### Reality Check
- **Resourcing:** [people, hours, tools]
- **Min sample size:** [for meaningful results; cite research]
- **Projected outcomes:** [what we think will happen]
- **CPA (if paid):** [e.g. "$20–40/acq at $500 budget"]
- **Reality-check summary:** [1–2 sentences: viability, constraint, recommendation]
```

### Step 4: Produce cool_ideas_evaluation.md

Write `intelligence/cool_ideas_evaluation.md`:

```markdown
# Cool Ideas Evaluation: {Protocol}

**Generated:** {YYYY-MM-DD}
**Packet:** {path}
**Entries evaluated:** {n}

## Comparison

| Idea | Budget | Time | Resourcing | Min sample | CPA | Feasibility |
|------|--------|------|------------|------------|-----|-------------|
| [Title] | [range] | [effort] | [people/hrs] | [benchmark] | [if paid] | High/Med/Low |
| ... | ... | ... | ... | ... | ... | ... |

## Ranked by viability

1. [Idea A] — [brief rationale]
2. [Idea B] — ...
3. [Idea C] — Defer: [reason]

## Recommendations

[ONE of the following:]

**Pursue:** [ideas that meet criteria] — [brief why]

**Validate first:** [ideas that need pilot or more research] — [brief why]

**Defer:** [ideas that are too heavy or unproven] — [brief why]

**Recommend none:** We recommend you don't do any of these because [resourcing, min sample, CPA, or fit with launch scope]. Here are the options we evaluated: [brief summary of each].
```

**Critical:** Use **Recommend none** when no ideas are viable (min sample unlikely, resourcing exceeds capacity, CPA too high, or ideas don't align with launch). Present the options evaluated and the rationale clearly.

## Rules

- Be honest: if none are viable, say so. "Recommend none" is a valid and useful outcome.
- Cite research for min sample size when possible
- Match feasibility to resourcing and launch context (budget, timeline, team size)
- Append Reality Check; do not remove or overwrite existing scoped content

## Integration

- **gtm-cool-ideas-scoper:** Produces cool_ideas.md entries; evaluator adds Reality Check and comparison
- **gtm-questionnaire-merger:** If otherIdeas in form, merger extracts and scoper processes; then run evaluator
- **Discovery questionnaire:** otherIdeas field feeds into scoper → evaluator flow
