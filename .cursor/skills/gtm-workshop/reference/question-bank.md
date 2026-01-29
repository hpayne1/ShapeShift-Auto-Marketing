# GTM Question Bank

Pre-baked questions to fill gaps in launch planning.

## Timeline Questions

### Launch Date (required if missing)

```
AskQuestion:
  id: launch_date
  prompt: "What is the launch date?"
  options:
    - { id: "provide", label: "I will provide the date" }
```

Or ask conversationally:
> "What's the target launch date for this announcement?"

### Embargo Date

```
AskQuestion:
  id: embargo_date
  prompt: "When should the press embargo lift?"
  options:
    - { id: "same_as_launch", label: "Same as launch date" }
    - { id: "before_launch", label: "Before launch (I'll specify)" }
    - { id: "no_embargo", label: "No embargo needed" }
```

### Full Timeline

If multiple dates are missing, ask for the full timeline:

> "I need the key dates for this launch. Please provide:
> - Launch date
> - Embargo date (when press can publish)
> - Asset approval date (when both sides sign off on creatives)
> - Scope lock date (when feature list is finalized)"

---

## Scope Questions

### Chains (required if missing)

```
AskQuestion:
  id: chains
  prompt: "Which chains/networks are in scope for this launch?"
  options:
    - { id: "paste", label: "I will paste the chain list" }
    - { id: "find", label: "Find it in a ShapeShift repo" }
```

### Protocol Roster (required if missing)

```
AskQuestion:
  id: protocol_roster
  prompt: "What protocol should we highlight for each chain?"
  options:
    - { id: "one_per_chain", label: "1 per chain (default)" }
    - { id: "multiple", label: "Multiple per chain (I'll specify)" }
    - { id: "screenshot", label: "I'll provide a screenshot from yields UI" }
```

Follow-up if they choose one_per_chain:
> "For each chain, which protocol is the primary yield opportunity?
> - [Chain 1]: ?
> - [Chain 2]: ?
> - ..."

### Feature Flags

```
AskQuestion:
  id: feature_flags
  prompt: "Which yield types are enabled at launch?"
  options:
    - { id: "native_only", label: "Native staking only" }
    - { id: "native_liquid", label: "Native + Liquid staking" }
    - { id: "all", label: "Native + Liquid + DeFi protocols" }
    - { id: "custom", label: "Custom (I'll specify)" }
  allow_multiple: false
```

---

## Paid Conversion Questions

### Landing Page

```
AskQuestion:
  id: landing_page
  prompt: "Where should the conversion landing page live?"
  options:
    - { id: "app_earn", label: "app.shapeshift.com/earn" }
    - { id: "app_custom", label: "app.shapeshift.com/[custom path]" }
    - { id: "external", label: "External site (partner-hosted)" }
    - { id: "draft_only", label: "Just draft copy (no page yet)" }
```

### Conversion Event

```
AskQuestion:
  id: conversion_event
  prompt: "What counts as a conversion for this campaign?"
  options:
    - { id: "start_earn", label: "Start Earn/Yield flow" }
    - { id: "deposit", label: "First deposit" }
    - { id: "email", label: "Email signup" }
    - { id: "other", label: "Other (I'll specify)" }
```

### Attribution Owner

> "Who will own daily attribution reporting for Feb [X-Y]? (One person who checks ad performance and reports results)"

### Budget

If budget not in transcript:
> "Is there a shared paid conversion budget? If so, what's the total and split?"

---

## Press Questions

### Embargo Timing

```
AskQuestion:
  id: embargo_time
  prompt: "What time should the embargo lift on [embargo date]?"
  options:
    - { id: "8am_pt", label: "8:00am PT" }
    - { id: "9am_pt", label: "9:00am PT" }
    - { id: "noon_pt", label: "12:00pm PT" }
    - { id: "other", label: "Other (I'll specify)" }
```

### Op-Ed Theme

```
AskQuestion:
  id: oped_theme
  prompt: "Which op-ed angle should we use?"
  options:
    - { id: "consumer", label: "Yield without the UX tax (consumer-first)" }
    - { id: "industry", label: "Onchain yield goes mainstream (industry/exec)" }
    - { id: "narrative", label: "From idle to productive assets (narrative)" }
    - { id: "custom", label: "Custom theme (I'll specify)" }
```

### Quotes

> "Who should be quoted in press materials? For each person, I can use a plug-and-play quote or you can provide custom ones."

Default quotes available:
- **Operator:** "Yield should feel as simple as holding..."
- **Strategy:** "The best yield products win on distribution and UX..."
- **Partnership:** "Partnerships like this work when incentives and execution are aligned..."

---

## Wallet Partner Questions

### Wallet Criteria

```
AskQuestion:
  id: wallet_criteria
  prompt: "What feature should partner wallets NOT already offer?"
  options:
    - { id: "yield_earn", label: "Native yield/earn features" }
    - { id: "staking", label: "Native staking" }
    - { id: "defi", label: "Built-in DeFi" }
    - { id: "custom", label: "Custom criteria (I'll specify)" }
```

### Wallet Count

```
AskQuestion:
  id: wallet_count
  prompt: "How many wallet partners should I include in the shortlist?"
  options:
    - { id: "three", label: "3" }
    - { id: "five", label: "5" }
    - { id: "seven", label: "7" }
```

---

## Question Priority

When multiple fields are missing, ask in this order:

1. **Launch date** (required, blocks everything)
2. **Chains** (required, defines scope)
3. **Protocol roster** (required, defines co-marketing targets)
4. **Timeline** (embargo, approval, scope lock)
5. **Landing page** (needed for paid conversion)
6. **Conversion event** (needed for paid conversion)
7. **Press details** (embargo time, op-ed theme, quotes)
8. **Wallet partners** (criteria, count)

---

## Conversational Fallbacks

If AskQuestion tool is not available, ask conversationally:

### For multiple gaps:
> "I extracted what I could from the transcript. To complete the GTM plan, I need:
> 1. [missing field 1]
> 2. [missing field 2]
> 3. [missing field 3]
> 
> Can you provide these?"

### For screenshots:
> "To get the protocol list per chain, could you share a screenshot from develop.shapeshift.com/#/yields filtered by each chain? Web fetches often timeout from my end."

### For timeline:
> "The transcript mentions [partial info]. Can you confirm the full timeline?
> - Launch: [date or ?]
> - Embargo: [date or ?]
> - Approval: [date or ?]"
