# Content Worker Specification
## Generates draft content from GTM plans

---

## Overview

The Content Worker reads a GTM plan YAML file, pulls in all source inputs (PRs, feature briefs, docs), and generates draft content for each enabled channel using an LLM.

**Role in system:** This is the "writer" — it turns product inputs into marketing drafts.

---

## Interface

### Input

```
.gtm/{id}/plan.yaml
```

**Required fields:**
```yaml
id: string                    # Initiative ID
title: string                 # Human-readable title
tier: 0|1|2                   # Determines which channels are expected
channels:
  {channel}:
    enabled: boolean          # Only generate for enabled channels
    status: pending           # Only generate if status is pending
provenance:
  inputs:                     # Source material for content
    - type: feature_brief|pr|doc|url
      path: string            # Local file path
      url: string             # Or remote URL
tracking:
  utm_base:
    campaign: string          # For CTAs
```

### Output

```
.gtm/{id}/drafts/
├── x_post.md
├── x_thread.md
├── discord_post.md
├── farcaster_post.md
├── blog_outline.md
├── blog_draft.md
├── release_notes_short.md
├── release_notes_long.md
└── partner_brief.md
```

**Updated plan.yaml:**
```yaml
content_outputs:
  x_post:
    status: generated
    artifact_path: ./drafts/x_post.md
    generated_at: "2026-02-01T10:00:00Z"
channels:
  x:
    status: generated
    artifact_path: ./drafts/x_post.md
history:
  - action: content_generated
    timestamp: "2026-02-01T10:00:00Z"
    actor: content-worker
    details:
      outputs: [x_post, discord_post, blog_draft]
      model: claude-3-5-sonnet
      prompt_version: "1.0"
```

---

## Commands

```bash
# Generate content for a specific plan
content-worker generate --plan .gtm/STRK-AGENT-001/plan.yaml

# Generate by initiative ID (assumes .gtm/{id}/ structure)
content-worker generate --id STRK-AGENT-001

# Regenerate specific channel only
content-worker regenerate --id STRK-AGENT-001 --channel x_post

# Regenerate all channels (overwrites existing)
content-worker regenerate --id STRK-AGENT-001 --all

# Dry run (show what would be generated, don't write)
content-worker generate --id STRK-AGENT-001 --dry-run

# Generate with specific model
content-worker generate --id STRK-AGENT-001 --model claude-3-5-sonnet
```

---

## Behavior

### Generation Flow

```
1. Load plan.yaml
   └─→ Validate required fields exist
   └─→ Check tier to determine expected channels

2. Load source inputs
   └─→ For each provenance.input:
       ├─→ If type=feature_brief: Read local markdown file
       ├─→ If type=pr: Fetch PR description + diff summary from GitHub
       ├─→ If type=doc: Read local doc
       └─→ If type=url: Fetch and extract content

3. Load brand context
   └─→ Read brand/voice.md
   └─→ Read brand/dos-and-donts.md
   └─→ Read any channel-specific templates

4. For each enabled channel with status=pending:
   └─→ Load channel template (templates/channels/{channel}.md)
   └─→ Construct prompt:
       ├─→ System: Brand voice + channel constraints
       ├─→ User: Source inputs + title + specific ask
   └─→ Call LLM API
   └─→ Parse response
   └─→ Write to drafts/{channel}.md
   └─→ Update plan.yaml status

5. Append to history

6. Save plan.yaml
```

### Channel → Output Mapping

| Channel | Output File | Notes |
|---------|-------------|-------|
| x | x_post.md | Single post, 280 char |
| x (thread) | x_thread.md | Multi-tweet thread |
| discord | discord_post.md | Formatted for Discord |
| farcaster | farcaster_post.md | 320 char limit |
| blog | blog_outline.md, blog_draft.md | Two-stage: outline then draft |
| release_notes | release_notes_short.md, release_notes_long.md | Short for changelog, long for docs |
| partner_outbounds | partner_brief.md | For partner comms |

### Tier → Channel Requirements

| Tier | Required Outputs |
|------|------------------|
| 0 | release_notes_short |
| 1 | + x_post, discord_post |
| 2 | + blog_draft, partner_brief, x_thread |

---

## Dependencies

### External Services
- **LLM API:** Claude (Anthropic) or GPT (OpenAI)
- **GitHub API:** For fetching PR content (optional)

### Local Files
- `brand/voice.md` — Brand voice guide
- `brand/dos-and-donts.md` — Guardrails
- `templates/channels/*.md` — Channel templates
- `templates/prompts/content_system.md` — System prompt

### Environment Variables
```bash
ANTHROPIC_API_KEY=sk-ant-...      # Or OPENAI_API_KEY
GITHUB_TOKEN=ghp_...               # For PR fetching
GTM_ROOT=./.gtm                    # Path to GTM plans
BRAND_ROOT=./brand                 # Path to brand assets
TEMPLATES_ROOT=./templates         # Path to templates
```

---

## Prompt Structure

### System Prompt (content_system.md)

```markdown
You are a marketing content writer for ShapeShift, a self-custodial DeFi platform.

## Brand Voice
{contents of brand/voice.md}

## Things We Never Say
{contents of brand/dos-and-donts.md}

## Your Task
Generate marketing content for the specified channel. Follow the template structure exactly. Include a clear CTA with the provided tracking link.

## Output Format
Return ONLY the content, no preamble or explanation. The content should be ready to post.
```

### User Prompt (per channel)

```markdown
## Initiative
Title: {plan.title}
ID: {plan.id}

## Source Material
{concatenated provenance.inputs content}

## Channel: {channel_name}
{contents of templates/channels/{channel}.md}

## Tracking
Campaign: {tracking.utm_base.campaign}
CTA URL: {canonical_url}?utm_source=shapeshift&utm_medium=social&utm_campaign={campaign}

Generate the {channel_name} content now.
```

---

## Output Format

### Draft File Structure

Each draft file should contain:

```markdown
---
generated_at: 2026-02-01T10:00:00Z
model: claude-3-5-sonnet
prompt_version: "1.0"
channel: x_post
initiative: STRK-AGENT-001
status: generated
---

[Actual content here]
```

The frontmatter provides traceability. The content below the `---` is what gets posted.

---

## Error Handling

| Error | Handling |
|-------|----------|
| Missing provenance.inputs | Warn and generate with title only |
| LLM API failure | Retry 3x with backoff, then fail |
| Invalid plan.yaml | Exit with validation error |
| Channel template missing | Use generic template, warn |
| Brand files missing | Exit with error (required) |

---

## Configuration

### config.yaml (worker config)

```yaml
llm:
  provider: anthropic  # or openai
  model: claude-3-5-sonnet-20241022
  max_tokens: 4096
  temperature: 0.7

retry:
  max_attempts: 3
  backoff_seconds: [1, 5, 15]

channels:
  x_post:
    max_length: 280
    template: templates/channels/x_post.md
  x_thread:
    max_tweets: 10
    template: templates/channels/x_thread.md
  discord:
    max_length: 2000
    template: templates/channels/discord.md
  # ... etc
```

---

## Testing

### Test Cases

1. **Happy path:** Plan with all inputs, generates all channel outputs
2. **Missing inputs:** Plan with no provenance.inputs, generates with title only
3. **Partial channels:** Only some channels enabled, generates only those
4. **Regenerate single:** Regenerates one channel without touching others
5. **Status check:** Skips channels not in `pending` status
6. **Tier enforcement:** Warns if tier 2 but missing expected channels

### Test Command

```bash
# Run with test fixtures
content-worker test

# Generate for test plan
content-worker generate --plan ./test/fixtures/sample-plan.yaml --dry-run
```

---

## Implementation Notes

### Recommended Structure (Node.js)

```
content-worker/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── generator.ts          # Main generation logic
│   ├── llm/
│   │   ├── client.ts         # LLM API client
│   │   └── prompts.ts        # Prompt construction
│   ├── inputs/
│   │   ├── loader.ts         # Load provenance inputs
│   │   └── github.ts         # GitHub PR fetching
│   ├── outputs/
│   │   ├── writer.ts         # Write draft files
│   │   └── yaml.ts           # Update plan.yaml
│   └── config.ts             # Configuration loading
├── package.json
├── tsconfig.json
└── README.md
```

### Key Functions

```typescript
// Main entry point
async function generate(planPath: string, options: GenerateOptions): Promise<void>

// Load and validate plan
async function loadPlan(path: string): Promise<GTMPlan>

// Load all source inputs
async function loadInputs(plan: GTMPlan): Promise<SourceContent[]>

// Generate content for a channel
async function generateChannel(
  channel: string,
  inputs: SourceContent[],
  brandContext: BrandContext
): Promise<string>

// Write draft and update plan
async function writeDraft(
  planPath: string,
  channel: string,
  content: string
): Promise<void>
```

---

## Future Enhancements

- [ ] Image generation for social cards
- [ ] A/B variant generation (multiple options per channel)
- [ ] Tone adjustment per channel (more casual for Discord)
- [ ] Auto-fetch canonical URL metadata
- [ ] Integration with Notion/docs for input pulling

---

*This worker is the core of content automation. Get this right, and the rest is distribution.*
