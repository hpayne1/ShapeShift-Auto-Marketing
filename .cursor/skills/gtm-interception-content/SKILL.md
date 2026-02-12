---
name: gtm-interception-content
description: Generate problem-led social hooks, press angles, and content angles for crypto marketing interception. Use after full-packet to produce content that meets users where they have a problem, not just announcements. Complementary to gtm-seo-topic-generator.
---

# GTM Interception Content

Produce problem-led content angles for social media, press, and community — designed to intercept users who have a problem and present the protocol/feature as the solution. This is the opposite of announcement-first marketing.

## When to Use

- After `gtm full-packet` or after `gtm-questionnaire-merger` (packet exists)
- When user says "interception angles," "problem-led content," "social hooks," or "how do we reach people who aren't following us"
- Before or alongside `gtm-final-check`

## Inputs

| Input | Required | Source |
|-------|----------|--------|
| Packet path | Yes | `research-output/<slug>` |
| `marketing_brief.md` | Yes | From full-packet |
| `research/protocol_analysis.json` | Yes | From full-packet |
| Asset/chain data | Recommended | `research/*.md` or `research/*.json` |

## Outputs

- `intelligence/interception_angles.md` — structured doc with social hooks, press angles, community angles

## Generation Logic

### Step 1: Read packet

Load:
- `marketing_brief.md` — audience, problem, value prop
- `research/protocol_analysis.json` — category, features, assets, chains
- Any chain/asset summaries in `research/`

### Step 2: Identify the problems users have

For every protocol category, map to real user problems:

| Category | User Problems |
|----------|---------------|
| Yield / Staking | Idle assets earning nothing; CEX custody risk; KYC friction; low APY; too many platforms |
| Bridge | Moving assets is confusing; bridge exploits; high fees; slow transfers |
| Lending | Want to borrow without selling; earn interest safely; avoid liquidation |
| DEX / Swap | Bad rates; MEV; slippage; too many chains to manage |

### Step 3: Generate content angles

**Social Hooks (8-12):** Short, punchy, problem-first. Ready to post or adapt.

Format: Problem statement or question → implicit solution is the protocol.

Rules:
- Follow ShapeShift brand voice (see `brand/voice.md`)
- NO hashtags, NO emojis except optional fox
- Questions perform 2x better — use them
- Under 280 chars each
- Never say "swap" for non-swap protocols
- No banned phrases (game-changer, revolutionary, unlock, seamlessly, thrilled, excited)

Example hooks for yield:
- "Your USDC is sitting there doing nothing. That's a choice."
- "What if you could earn yield without handing over your keys?"
- "Still earning 0% on stablecoins? There's a better way."
- "How much yield are you leaving on the table?"
- "DeFi yield without the custody tradeoff. It exists."

**Press Angles (3-5):** Problem-led story pitches, not announcements.

Format: Headline pitch + 2-sentence description + target outlet.

Example:
- "The Custody Problem: Why DeFi Users Are Leaving CEXs for Self-Custody Yield" — Target: CoinDesk Opinion
- "Stablecoin Yield in 2026: Where the Smart Money Is Earning" — Target: Decrypt, The Block

**Community Angles (3-5):** Discord/Farcaster/Reddit prompts that start conversations.

Format: Question or discussion starter.

Example:
- "What's the most yield you've earned without giving up your keys? Drop your setup."
- "Unpopular opinion: if you're earning yield on a CEX, you don't actually own those assets."

### Step 4: Write output

Write `intelligence/interception_angles.md`:

```markdown
# Interception Content Angles: {Protocol}

**Generated:** {date}
**Packet:** {packet path}
**Protocol category:** {category}

## User Problems We're Solving

1. {problem 1}
2. {problem 2}
3. ...

---

## Social Hooks (Problem-Led)

*Ready to post or adapt. All under 280 chars. Follow ShapeShift brand voice.*

| # | Hook | Problem Addressed | Platform |
|---|------|-------------------|----------|
| 1 | "Your USDC is sitting there doing nothing. That's a choice." | Idle assets | X, Farcaster |
| 2 | ... | ... | ... |

---

## Press Angles (Problem-Led)

| # | Headline Pitch | Description | Target Outlet |
|---|----------------|-------------|---------------|
| 1 | "The Custody Problem: ..." | ... | CoinDesk Opinion |
| 2 | ... | ... | ... |

---

## Community Conversation Starters

| # | Prompt | Platform | Goal |
|---|--------|----------|------|
| 1 | "What's the most yield you've earned without giving up your keys?" | Discord, Reddit | Engagement, social proof |
| 2 | ... | ... | ... |

---

## How to Use These

- **Social:** Pick 2-3 hooks per week for the content calendar. Rotate between problem-led and announcement-led.
- **Press:** Use as pitch subjects; pair with the press release from the packet.
- **Community:** Post 1-2 per week in Discord #general or Reddit. Respond to replies.
- **Calendar:** Add to `calendar/content_calendar.md` alongside existing announcement content.
```

## Rules

- All hooks must follow ShapeShift brand voice (`brand/voice.md`, `brand/dos-and-donts.md`)
- Problem-first: the hook is the pain, not the product. The product is the implicit answer.
- No generic marketing phrases. Specific, punchy, human.
- Match terminology to protocol category (stake, earn, bridge, lend — never "swap" for non-swap)
- Generate at least 8 social hooks, 3 press angles, 3 community starters

## Integration

- **gtm-seo-topic-generator:** Complementary — that skill produces blog/SEO topics; this skill produces social/press/community angles
- **gtm-final-check:** Run final check after adding interception angles to catch any brand voice issues
- **calendar/content_calendar.md:** Interception hooks should be layered into the calendar alongside announcement content
