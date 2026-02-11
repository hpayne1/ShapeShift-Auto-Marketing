---
name: gtm-protocol-enricher
description: Pull branding, positioning, messaging, and social tone from a protocol's website and social channels (Twitter, Farcaster). Use when you need to align GTM copy with how the protocol markets itself.
---

# GTM Protocol Enricher

Pull branding, positioning, messaging, and social tone from the protocol's website and social channels. This is **enrichment only**—not source of truth. The PR defines what shipped; the protocol enricher helps align how we talk about it.

## When to Use

- User provides protocol website URL, Twitter URL, and/or Farcaster URL
- Generating GTM packet and need protocol branding/tone
- Need to align messaging with how the protocol markets itself
- Want to reference what works for them (structure, hooks, CTAs)

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| Website URL | Yes | `https://yield.xyz` |
| Twitter URL | No | `https://x.com/yieldxyz` or `https://twitter.com/yieldxyz` |
| Farcaster URL | No | `https://warpcast.com/yieldxyz` |

**Optional:** Output path (default: `research-output/{protocol}/research/protocol_enrichment.json`)

## Outputs

- `research/protocol_enrichment.json`:
  - `website`: taglines, hero copy, product descriptions, terminology
  - `twitter`: recent posts, tone, CTAs, hashtags, inferred what works (structure, hooks)
  - `farcaster`: recent casts, tone, formats, Frames usage
  - `messagingAlignment`: notes on terminology to use, channel-specific tone
  - `whatWorks`: inferred patterns (e.g. "questions in hooks", "short threads")

## Logic

1. **Website:** Scrape main page for hero, headlines, product copy. Avoid JS-heavy pages; fetch text content.
2. **Twitter:** Fetch recent posts (public). Infer tone, CTAs, hashtags. "What works" = structure/tone patterns (no engagement metrics unless visible).
3. **Farcaster:** Fetch recent casts. Infer tone, formats, Frames usage.
4. Summarize: messaging alignment notes, terminology to adopt, channel-specific tone.
5. Write `protocol_enrichment.json` to the packet's `research/` folder.

## Scraping Notes

- Use existing `webFetch` or equivalent; handle timeouts and failures gracefully.
- Twitter/Farcaster may have rate limits or ToS restrictions; make scraping optional and fail-gracefully.
- Do not infer engagement metrics unless clearly available; "what works" = qualitative patterns only.

## Example Output

```json
{
  "website": {
    "tagline": "Earn on assets you have",
    "heroCopy": "Move your assets into yield without leaving your wallet",
    "terminology": ["yield", "positions", "earn"]
  },
  "twitter": {
    "recentPosts": ["..."],
    "tone": "direct, product-focused",
    "ctas": ["Try now", "Get started"],
    "whatWorks": "Short threads, questions in hooks"
  },
  "farcaster": {
    "recentCasts": ["..."],
    "tone": "community-focused, casual",
    "formats": ["Frames for actions"]
  },
  "messagingAlignment": {
    "useTerms": ["yield", "positions"],
    "avoidTerms": ["farming", "staking" if they don't use it],
    "channelTone": { "twitter": "direct", "farcaster": "warm" }
  }
}
```

## Integration

- **gtm-workshop:** Accepts protocol URLs; can invoke this skill or pass to gtm-full-packet
- **gtm-full-packet:** Calls protocol enricher when `--protocol-website`, `--protocol-twitter`, `--protocol-farcaster` provided
- **content-worker / drafts:** Use enrichment for tone and terminology alignment
