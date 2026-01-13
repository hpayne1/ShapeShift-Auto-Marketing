# Claude Skills for ShapeShift Auto-Marketing

This directory contains **Claude Skills**—structured system prompts that give Claude the context and capabilities to act as specialized workers in the auto-marketing system.

---

## 🧠 How to Use These Skills

### In Cursor

1. Start a new chat
2. Copy the contents of the skill file you need
3. Paste it as your first message (or use as system prompt)
4. Claude will now operate as that specialized worker

### In Claude.ai

1. Create a new Project
2. Add the skill file to Project Knowledge
3. Claude will reference it in all conversations

### In API Calls

```python
import anthropic

client = anthropic.Anthropic()

with open("skills/content-worker.md") as f:
    system_prompt = f.read()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Generate an X post for the Starknet launch"}
    ]
)
```

---

## 📁 Available Skills

| Skill | File | Purpose |
|-------|------|---------|
| **Orchestrator** | `orchestrator.md` | Master coordinator, delegates to workers |
| **Content Worker** | `content-worker.md` | Generates draft marketing content |
| **Publisher Worker** | `publisher-worker.md` | Posts approved content to channels |
| **Analytics Worker** | `analytics-worker.md` | Generates performance reports |
| **GitHub Watcher** | `github-watcher.md` | Monitors repos for GTM opportunities |
| **Walkthrough Generator** | `walkthrough-generator.md` | Creates product demo videos |
| **Twitter Analytics** | `twitter-analytics.md` | Pulls and analyzes X metrics |

---

## 🔄 Skill Relationships

```
                    ┌─────────────────┐
                    │   ORCHESTRATOR  │  ← Start here for full workflows
                    └────────┬────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│GitHub Watcher│    │Content Worker│    │  Publisher   │
└──────────────┘    └──────────────┘    └──────────────┘
       │                                       │
       ▼                                       │
┌──────────────┐    ┌──────────────┐           │
│ Walkthrough  │    │   Twitter    │←──────────┘
│  Generator   │    │  Analytics   │
└──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Analytics   │
                    │   Worker     │
                    └──────────────┘
```

---

## 🎯 Quick Reference: Which Skill to Use

| Task | Skill |
|------|-------|
| "Plan a marketing campaign" | Orchestrator |
| "Write a tweet about X" | Content Worker |
| "Post this to Discord" | Publisher Worker |
| "How did our campaign perform?" | Analytics Worker |
| "Check for new PRs to market" | GitHub Watcher |
| "Create a demo video" | Walkthrough Generator |
| "Pull our Twitter metrics" | Twitter Analytics |

---

## 📝 Skill Anatomy

Each skill follows this structure:

```markdown
# {Worker Name} Skill

You are the **{Worker Name}** for ShapeShift's auto-marketing system.
Your role is to {purpose}.

## Your Identity
{Who the AI should be}

## Core Context
{Background knowledge it needs}

## Input Format
{What it receives}

## Output Format
{What it produces}

## Commands You Understand
{What it can do}

## Your Process
{How it should work}
```

---

## 🔧 Customization

These skills are designed to be:

- **Composable** - Use multiple skills together via Orchestrator
- **Editable** - Modify for your specific needs
- **Extensible** - Add new sections as needed

### Adding Custom Context

Add to any skill:
```markdown
## Custom Context

### Our Current Campaigns
- Starknet launch (Tier 1, in progress)
- Weekly stats (recurring)

### Priority Channels
1. X (primary)
2. Discord (community)
3. Blog (SEO)
```

### Modifying Behavior

Edit the relevant section:
```markdown
## Constraints

- Never claim features that don't exist
- Always maintain 3rd person voice
- Maximum 2 emojis per post
+ - Always include the $FOX hashtag on Thursdays
+ - Prioritize meme content on weekends
```

---

## 🚀 Example Workflows

### 1. Full Campaign Launch

```
1. Use Orchestrator skill
2. Input: "A PR just merged adding Solana support"
3. Orchestrator creates GTM plan, delegates to Content Worker
4. Switch to Content Worker skill
5. Generate content for each channel
6. Human reviews and approves
7. Switch to Publisher Worker skill
8. Execute publishing
```

### 2. Quick Tweet

```
1. Use Content Worker skill directly
2. Input: GTM plan YAML or brief
3. Get draft tweet
4. Review and post manually (or use Publisher)
```

### 3. Performance Check

```
1. Use Twitter Analytics skill
2. Input: Tweet IDs or campaign ID
3. Get metrics report
4. Optionally pass to Analytics Worker for deeper analysis
```

---

## 📊 Metrics & KPIs

All skills are calibrated to these ShapeShift benchmarks:

| Metric | Target |
|--------|--------|
| X Engagement Rate | 2-4% |
| Link CTR | 1%+ |
| Discord Response | 20+ reactions |
| Content Approval Rate | 80%+ first pass |

---

## 🔐 Security Notes

- Skills don't store credentials
- API keys should be in environment variables
- Never paste credentials into skill prompts
- Review all content before publishing

---

## 📚 Related Files

- `/brand/voice.md` - Brand voice guidelines
- `/brand/dos-and-donts.md` - Content rules
- `/templates/channels/` - Channel-specific templates
- `/worker-specs/` - Technical specifications
- `/gtm-coordinator/` - CLI tool for GTM management

---

Happy automating! 🦊
