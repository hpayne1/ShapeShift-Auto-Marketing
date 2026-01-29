# GTM Extraction Schema

Data model for extracting launch decisions from call transcripts.

## Core Fields

### Partner Info

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `partnerName` | string | yes | "Yield.xyz" |
| `partnerContacts` | string[] | no | ["Ryan", "press@yield.xyz"] |
| `partnerSlug` | string | yes (derived) | "yield-xyz" |

### Timeline

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `launchDate` | date | yes | "2026-02-10" |
| `embargoDate` | date | no | "2026-02-05" |
| `assetApprovalDate` | date | no | "2026-02-05" |
| `scopeLockDate` | date | no | "2026-02-02" |
| `creativeReviewStart` | date | no | "2026-02-02" |
| `creativeReviewEnd` | date | no | "2026-02-06" |

### Scope

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `chains` | string[] | yes | ["Tron", "Katana", "Solana", "Plasma"] |
| `protocolsPerChain` | object | yes | `{"Tron": "StakeKit", "Katana": "Morpho"}` |
| `featureFlags` | object | no | `{"nativeStaking": true, "liquidStaking": true}` |

### Paid Conversion

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `budgetTotal` | number | no | 5000 |
| `budgetShapeShift` | number | no | 2500 |
| `budgetPartner` | number | no | 2500 |
| `conversionEvent` | string | no | "Start Earn flow" |
| `landingPage` | string | no | "app.shapeshift.com/earn" |
| `attributionOwner` | string | no | "Ryan" |

### Press

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `embargoTime` | string | no | "8:00am PT" |
| `opEdTheme` | string | no | "Yield without the UX tax" |
| `quotes` | object[] | no | `[{"person": "You", "quote": "..."}]` |

### Wallet Partners

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `walletCriteria` | string | no | "No native yield/earn features" |
| `walletShortlist` | string[] | no | ["Rabby", "Frame", "Safe"] |

## Extraction Patterns

Common patterns to look for in transcripts:

### Date patterns
- "launch on [date]"
- "go live [date]"
- "embargo until [date]"
- "approval by [date]"
- "lock scope on [date]"

### Chain patterns
- "chains: [list]"
- "networks: [list]"
- "support for [chain]"
- "on [chain]"

### Protocol patterns
- "[protocol] on [chain]"
- "[chain] uses [protocol]"
- "via [protocol]"
- "through [protocol]"

### Budget patterns
- "$[amount] you + $[amount] them"
- "[amount] matched"
- "shared spend"
- "co-marketing budget"

### Wallet criteria patterns
- "wallets that don't have [feature]"
- "no native [feature]"
- "WalletConnect compatible"

## Output Format

After extraction, produce a JSON object:

```json
{
  "partner": {
    "name": "Yield.xyz",
    "slug": "yield-xyz",
    "contacts": ["Ryan"]
  },
  "timeline": {
    "launchDate": "2026-02-10",
    "embargoDate": "2026-02-05",
    "assetApprovalDate": "2026-02-05",
    "scopeLockDate": "2026-02-02"
  },
  "scope": {
    "chains": ["Tron", "Katana", "Solana", "Plasma"],
    "protocolsPerChain": {
      "Tron": "StakeKit",
      "Katana": "Morpho",
      "Solana": ["Kamino", "Drift"],
      "Plasma": "Fluid"
    }
  },
  "paidConversion": {
    "budgetTotal": 5000,
    "conversionEvent": "Start Earn flow",
    "landingPage": "app.shapeshift.com/earn"
  },
  "press": {
    "embargoTime": "8:00am PT",
    "opEdTheme": "Yield without the UX tax"
  },
  "walletPartners": {
    "criteria": "No native yield/earn features",
    "shortlist": ["Rabby", "Frame", "Safe"]
  }
}
```

## Gap Detection

After extraction, check for these required fields:
- `partner.name`
- `timeline.launchDate`
- `scope.chains`
- `scope.protocolsPerChain`

If any are missing, use the question bank to prompt.
