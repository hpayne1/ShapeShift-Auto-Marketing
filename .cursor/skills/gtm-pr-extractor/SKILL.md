---
name: gtm-pr-extractor
description: Parse a ShapeShift GitHub PR as the canonical source of truth for a feature. Use when you have a PR URL and need structured feature data (title, description, files changed, feature summary) for GTM packet generation.
---

# GTM PR Extractor

Parse the ShapeShift GitHub PR as the source of truth for what actually shipped. The PR defines the feature; downstream skills use this data for accurate GTM materials.

## When to Use

- User provides a PR URL (e.g. `https://github.com/shapeshift/foo/pull/123`)
- Generating a GTM packet and need feature context
- Need to set `sourceOfTruth` in `protocol_analysis.json`
- gtm-workshop or gtm-full-packet needs PR-derived data

## Inputs

| Input | Required | Example |
|-------|----------|---------|
| PR URL | Yes | `https://github.com/shapeshift/agent/pull/456` |

**Optional:** Output path (default: `research-output/{protocol}/research/pr_extraction.json`)

## Outputs

- `research/pr_extraction.json`:
  - `title` — PR title
  - `description` — PR body/description
  - `url` — PR URL (source of truth)
  - `filesChanged` — list of file paths
  - `labels` — PR labels
  - `featureSummary` — one-paragraph description of what shipped (derived from title + description + file paths)
  - `mergedAt` — merge date if available

- Ensure `sourceOfTruth` in `protocol_analysis.json` is set to the PR URL. If `protocol_analysis.json` does not exist yet, note that it should be created with this value when the packet is generated.

## Logic

1. Fetch PR content via GitHub API or web fetch
   - Use `GITHUB_TOKEN` env var for private repos
   - Fallback: fetch public PR HTML and parse
2. Extract: title, body, file paths, labels
3. Derive `featureSummary`: combine title + first paragraph of body; add context from file paths (e.g. "yields/", "staking/" suggests yield feature)
4. Write `pr_extraction.json` to the packet's `research/` folder
5. If `protocol_analysis.json` exists, add or update `sourceOfTruth: <PR URL>`

## GitHub API

For private repos, set `GITHUB_TOKEN` in the environment. The API endpoint for PR details:

```
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}
```

For files changed:

```
GET https://api.github.com/repos/{owner}/{repo}/pulls/{number}/files
```

## Example Output

```json
{
  "title": "Add rFOX staking on Arbitrum",
  "description": "Integrates rFOX staking contract...",
  "url": "https://github.com/shapeshift/rFOX/pull/12",
  "filesChanged": ["src/staking/rfox.ts", "src/hooks/useRfoxStaking.ts"],
  "labels": ["feature", "yield"],
  "featureSummary": "Adds rFOX staking on Arbitrum. Users can stake FOX and earn USDC rewards distributed monthly via DAO multisig.",
  "mergedAt": "2026-02-10T14:32:00Z"
}
```

## Integration

- **gtm-workshop:** Accepts PR URL; can invoke this skill or pass PR URL to gtm-full-packet
- **gtm-full-packet:** Calls PR extractor when `--pr <url>` is provided; uses output for generation
- **gtm-final-check:** Verifies packet claims match PR (source of truth)
