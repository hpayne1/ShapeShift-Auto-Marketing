---
name: gtm-workshop
description: Workshop a GTM (go-to-market) launch plan from a call transcript or notes. Use when the user has a partner call transcript, meeting notes, or wants to plan a product launch, integration announcement, or co-marketing campaign.
---

# GTM Workshop

Guide the user through creating a complete GTM launch plan from a call transcript or meeting notes.

## When to Use

- User provides a call transcript with a partner
- User has meeting notes about a launch
- User wants to plan a product/integration announcement
- User mentions "GTM", "launch plan", "partner brief", or "co-marketing"

## Workflow

1. **Receive input** - User provides transcript (pasted or file) or meeting notes
2. **Extract decisions** - Parse for key launch parameters (see extraction schema)
3. **Identify gaps** - Check what's missing from the extraction
4. **Ask questions** - Use the question bank to fill gaps
5. **Generate outputs** - Create/update GTM materials

## Step 1: Receive Input

Accept input in any form:
- Pasted transcript in chat
- File path to a transcript (txt/md)
- Bullet points or notes

If no input provided, ask:
> "Please paste the call transcript or meeting notes, or provide a file path."

## Step 2: Extract Key Decisions

Parse the input for these targets (see [reference/extraction-schema.md](reference/extraction-schema.md) for full schema):

**Required:**
- Partner name
- Launch date
- Chains/networks in scope
- Protocols per chain

**Timeline dates:**
- Launch date
- Embargo date
- Asset approval date
- Scope lock date
- Creative review window

**Optional but common:**
- Budget and paid conversion structure
- Quotes and quote attribution
- Press coordination notes
- Feature flag decisions
- Wallet partner criteria

## Step 3: Identify Gaps

After extraction, check for missing required fields. Common gaps:
- Protocol roster per chain (often needs screenshots from yields UI)
- Embargo timing (often implied but not explicit)
- Conversion event definition
- Attribution owner

## Step 4: Ask Clarifying Questions

Use the question bank ([reference/question-bank.md](reference/question-bank.md)) to fill gaps.

**Critical questions to always ask if not in transcript:**
1. Timeline - launch date, embargo date, approval dates
2. Landing page location
3. Conversion event definition

**Use AskQuestion tool when available** for structured input. Example:

```
AskQuestion:
- "What is the launch date?" with date input
- "Where should the landing page live?" with options
```

## Step 5: Generate Outputs

Once all inputs gathered, create/update these files in the launch folder:

| File | Purpose |
|------|---------|
| `marketing_brief.md` | Core positioning, chains, protocols, messages |
| `partner/partner_kit.md` | Partner-facing brief with timeline, copy, asks |
| `press/pr_brief.md` | Press talking points, quotes, embargo |
| `checklist.md` | Launch timeline with dates filled in |

**Output location:**  
`gtm-coordinator/research-output/{partner-slug}/`

## Key Principles

### Key message = actual marketing
The GTM one-sentence and key messages (in marketing_brief, partner_kit, pr_brief) must be **real marketing copy**. Lead with the product/feature benefit that compels (e.g. "now live," "stake X, earn Y," "rewards in your wallet every month"). ShapeShift differentiators (no custody, privacy, no KYC) are **supporting** messages, not the default lead. If the main hook is only "keeping your keys safe" or "no custody," reframe so the lead is what the user gets or does. This applies to every protocol and feature, not just the current one.

### Timeline is never pre-baked
Always extract timeline from the transcript. If not found, prompt for:
- Launch date
- Embargo date
- Asset approval date
- Scope lock date
- Creative review window

### Wallet partner criteria is context-dependent
The criteria for wallet partners is: wallet must NOT already offer whatever feature is being marketed, AND must be WalletConnect compatible OR already supported in ShapeShift.

Ask: "What feature should partner wallets NOT already offer for this launch?"

### Protocol roster: 1 per chain unless specified
Default to 1 protocol per chain. If user wants more, they'll specify (e.g., "primary + secondary").

### Screenshots for protocol discovery
Web fetches often timeout. If user needs protocol lists per chain, ask for screenshots from the yields UI (e.g., develop.shapeshift.com/#/yields filtered by chain).

### Draft quotes are plug-and-play
Include ready-to-use quote templates that can be attributed to different people:

**Operator quote:**
> "Yield should feel as simple as holding. This launch is about turning idle assets into productive assets without adding complexity for the user."

**Strategy quote:**
> "The best yield products win on distribution and UX. This launch is designed to meet users where they are."

**Partnership quote:**
> "Partnerships like this work when incentives and execution are aligned."

## Example Session

```
User: Here's the transcript from my call with Protocol X...

Agent: [Extracts: launch date Feb 15, chains: Ethereum + Arbitrum, budget $3k shared]

Agent: I found these details in the transcript:
- Partner: Protocol X
- Launch: Feb 15, 2026
- Chains: Ethereum, Arbitrum
- Budget: $3k shared

I'm missing:
- Protocol per chain (which Protocol X products on each chain?)
- Embargo date
- Landing page location

[Uses AskQuestion to gather missing info]

Agent: [Generates marketing_brief.md, partner_kit.md, pr_brief.md]
```

## Additional Resources

- For full extraction schema: [reference/extraction-schema.md](reference/extraction-schema.md)
- For complete question templates: [reference/question-bank.md](reference/question-bank.md)
