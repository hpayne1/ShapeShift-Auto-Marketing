# Getting Started: How to Use the Auto-Marketing System

A practical step-by-step guide for executing GTM campaigns.

---

## Overview

This system has three modes of operation:

| Mode | Automation Level | What You Do |
|------|------------------|-------------|
| **Manual** | None | Use GTM Coordinator to track, generate content yourself with LLM |
| **Semi-Auto** | Content generation | Workers generate drafts, you review and post manually |
| **Full Auto** | End-to-end | Workers generate, you approve, workers publish |

**Start with Manual.** It's enough to execute the Starknet campaign while you build out automation.

---

## Prerequisites

### 1. Install GTM Coordinator CLI

```bash
cd gtm-coordinator
npm install
npm link  # Makes 'gtm' command available globally
```

### 2. Gather Your Brand Assets

You need these files in place:

```
brand/
├── voice.md              # Your brand voice guide (upload your real one!)
└── dos-and-donts.md      # What to say/not say
```

### 3. Have Your LLM Ready

For manual mode, you'll use Claude or ChatGPT directly:
- Claude: chat.anthropic.com or API
- ChatGPT: chat.openai.com or API

---

## Step-by-Step: Running a Campaign (Manual Mode)

### Step 1: Create the GTM Plan

```bash
gtm init \
  --id STRK-AGENT-001 \
  --title "Agent.ShapeShift Starknet Integration Launch" \
  --tier 2 \
  --risk medium \
  --release "2026-02-01"
```

This creates:
```
.gtm/STRK-AGENT-001/
├── plan.yaml
└── drafts/
```

### Step 2: Add Source Inputs

```bash
# Add PR that contains the feature
gtm enrich --id STRK-AGENT-001 --pr "https://github.com/shapeshift/agent/pull/123"

# Add canonical URL for tracking
gtm enrich --id STRK-AGENT-001 --canonical-url "https://agent.shapeshift.com"
```

Optionally, create a feature brief:
```bash
# Create a brief file
mkdir -p .gtm/STRK-AGENT-001/inputs
```

Then write `.gtm/STRK-AGENT-001/inputs/feature-brief.md`:
```markdown
# Starknet Integration Feature Brief

## What's launching
Agent.ShapeShift now supports Starknet chain and swaps.

## Key capabilities
- Connect Starknet wallets
- Swap any chain → STRK via natural language
- Access Starknet DeFi positions

## Target audience
- Existing ShapeShift users
- Starknet ecosystem users
- AI/agent enthusiasts

## Key messages
- "Your AI agent now speaks Starknet"
- Natural language DeFi on L2
- Cross-chain to Starknet in one command

## Links
- Product: agent.shapeshift.com
- Docs: [link]
```

### Step 3: Generate Content (Manual with LLM)

Open Claude or ChatGPT and use this prompt structure:

```
I need you to generate marketing content for ShapeShift.

## Brand Voice
[Paste contents of brand/voice.md]

## Do's and Don'ts  
[Paste contents of brand/dos-and-donts.md]

## Channel Template
[Paste contents of templates/channels/x_post.md]

## Feature Brief
[Paste your feature brief]

## Task
Generate 3 X post variants for announcing Starknet support on Agent.ShapeShift.

Include:
- UTM tracked link: agent.shapeshift.com?utm_source=twitter&utm_medium=social&utm_campaign=starknet-agent-launch
- @Starknet mention where appropriate
```

### Step 4: Save Drafts

Save the generated content to the drafts folder:

```
.gtm/STRK-AGENT-001/drafts/
├── x_post_v1.md
├── x_post_v2.md
├── x_post_v3.md
├── discord_post.md
└── blog_draft.md
```

### Step 5: Review and Edit

Review each draft:
- Does it match ShapeShift voice?
- Is the CTA clear?
- Are links correct with UTM params?
- Any factual errors?

Edit as needed.

### Step 6: Update Status

```bash
# Mark content as ready for review
gtm set-status --id STRK-AGENT-001 --field channels.x.status --value needs_review

# After you've reviewed and edited
gtm set-status --id STRK-AGENT-001 --field channels.x.status --value approved
```

### Step 7: Get Approval

```bash
gtm marketing-approve --id STRK-AGENT-001 --reviewer "@yourname"
```

This validates that all tier 2 requirements are met.

### Step 8: Publish (Manual)

1. Copy the approved content from drafts
2. Post to X manually (or use scheduling tool)
3. Post to Discord
4. Publish blog

After publishing, update the plan:

```bash
gtm set-status --id STRK-AGENT-001 --field channels.x.status --value published
gtm set-status --id STRK-AGENT-001 --field channels.x.published_url --value "https://x.com/ShapeShift/status/123456"
```

### Step 9: Track Performance

Manually check:
- X Analytics for post performance
- UTM clicks in your analytics dashboard
- Discord engagement

Create a report in `.gtm/STRK-AGENT-001/reports/week-1.md`

---

## Quick Reference: GTM Coordinator Commands

```bash
# Create new plan
gtm init --id <ID> --title "<Title>" --tier <0|1|2> --risk <low|medium|high>

# Add inputs
gtm enrich --id <ID> --pr <url>
gtm enrich --id <ID> --canonical-url <url>

# Update status
gtm set-status --id <ID> --field <path.to.field> --value <value>

# Validate plan
gtm validate --id <ID>

# Approve
gtm marketing-approve --id <ID> --reviewer "@name"

# Generate UTM links
gtm utm --id <ID> --url <base-url>

# Check all links
gtm links-check --id <ID>
```

---

## Prompt Templates for Content Generation

### X Post Prompt

```
Generate an X post (max 280 characters) for ShapeShift announcing [FEATURE].

Voice: Confident, direct, empowering. Short sentences. No hype.
Emoji: Use 🦊 sparingly, ✓ for lists, 🚀 for launches.

Feature: [DESCRIPTION]
Link: [URL with UTM]
Partner to mention: @[PARTNER]

Output just the tweet text, nothing else.
```

### X Thread Prompt

```
Generate a 5-tweet thread for ShapeShift announcing [FEATURE].

Voice: Confident, direct, empowering.
Structure:
- Tweet 1: Hook (must stop the scroll)
- Tweets 2-4: Key benefits/capabilities
- Tweet 5: CTA with link

Feature: [DESCRIPTION]
Link: [URL with UTM]

Number each tweet (1/, 2/, etc.)
```

### Discord Prompt

```
Generate a Discord announcement for ShapeShift's #announcements channel.

Voice: Warmer than X, community-first, can be more detailed.
Format: Use **bold**, bullet points, emojis for visual breaks.
Length: 800-1200 characters.

Feature: [DESCRIPTION]
Link: [URL]

Include:
- Headline with 📣 emoji
- "Hey foxes!" greeting (optional)
- What's new section with bullets
- How to try it section
- CTA for questions
```

### Blog Post Prompt

```
Generate a blog post for ShapeShift announcing [FEATURE].

Voice: Professional but accessible, educational.
Length: 600-800 words.
Structure:
- Title (clear, includes feature name)
- Meta description (150 chars)
- Introduction (2 paragraphs)
- What's New (with subheadings)
- How to Get Started (numbered steps)
- What's Next (tease future)
- CTA

Feature: [DESCRIPTION]
Link: [URL]
```

---

## Checklist: Before Publishing

### Content Quality
- [ ] Matches ShapeShift voice
- [ ] No typos or grammar errors
- [ ] Facts are accurate
- [ ] Links work
- [ ] UTM tracking in place

### Compliance
- [ ] No price speculation
- [ ] No financial advice
- [ ] No unverified claims
- [ ] No competitor mentions

### Timing
- [ ] Feature is actually live
- [ ] Good posting time (check best times)
- [ ] No conflicting announcements

### Tracking
- [ ] GTM plan status updated
- [ ] Ready to capture published URLs
- [ ] Analytics dashboards ready

---

## Troubleshooting

### "GTM command not found"
```bash
cd gtm-coordinator
npm link
```

### "Validation failed"
Check what's missing:
```bash
gtm validate --id <ID>
```
The error will tell you what tier/risk requirements aren't met.

### "Content doesn't sound right"
- Re-read brand/voice.md
- Check the dos-and-donts.md
- Try a different prompt structure
- Edit manually — AI is a starting point, not the final word

---

## Next Steps: Adding Automation

Once you're comfortable with manual mode:

### 1. Build Content Worker
See `worker-specs/content-worker.md` for full spec.

Basic automation:
```bash
# Instead of manual LLM prompting:
content-worker generate --id STRK-AGENT-001
```

### 2. Build Publisher Worker
See `worker-specs/publisher-worker.md` for full spec.

```bash
# Instead of manual posting:
publisher-worker publish --id STRK-AGENT-001
```

### 3. Build Analytics Worker
See `worker-specs/analytics-worker.md` for full spec.

```bash
# Instead of manual metric pulling:
analytics-worker report --id STRK-AGENT-001
```

---

## File Locations Reference

```
ShapeShift Auto-marketing/
├── .gtm/                           # Your GTM plans live here
│   └── STRK-AGENT-001/
│       ├── plan.yaml               # Source of truth
│       ├── drafts/                 # Generated content
│       ├── inputs/                 # Feature briefs, etc.
│       └── reports/                # Performance reports
├── brand/
│   ├── voice.md                    # Brand voice guide
│   └── dos-and-donts.md            # Rules
├── templates/
│   └── channels/
│       ├── x_post.md
│       ├── x_thread.md
│       ├── discord.md
│       ├── farcaster.md
│       └── blog.md
├── worker-specs/                   # How to build workers
├── grants/                         # Starknet proposal
└── gtm-coordinator/                # CLI tool
```

---

*Start simple. Manual mode is fine. Add automation as you learn what works.*
