# Walkthrough Generator CLI

## Quick Start

```bash
# Install dependencies
npm install playwright

# Run walkthrough (text-based selectors - works now)
npx ts-node walkthrough-runner.ts

# Run walkthrough (data-testid selectors - after PR merged)
npx ts-node walkthrough-runner.ts --testids

# Custom output directory
npx ts-node walkthrough-runner.ts --output=./.gtm/STRK-456
```

---

## Commands

### Generate Walkthrough from PR

```bash
# Full pipeline: analyze PR → generate script → record → process
walkthrough create --pr https://github.com/shapeshift/web/pull/456

# Options
--staging <url>     Use staging environment (default: app.shapeshift.com)
--output <dir>      Output directory (default: ./.gtm/{pr-number})
--testids           Use data-testid selectors (requires PR merge)
--dry-run           Show steps without executing
```

### Manual Walkthrough

```bash
# Record a specific flow
walkthrough record --flow btc-to-starknet

# Available flows:
#   btc-to-starknet    BTC → STRK swap
#   eth-to-starknet    ETH → STRK swap
#   connect-wallet     Wallet connection flow
#   view-portfolio     Portfolio overview
```

### Process Existing Recording

```bash
# Generate narration and cuts from existing video
walkthrough process --video ./recording.webm

# Create GIF from video
walkthrough gif --video ./recording.webm --start 5 --duration 10
```

---

## Output Structure

```
.gtm/walkthroughs/
├── recordings/
│   └── recording.webm          ← Full screen recording
│
├── screenshots/
│   ├── 01-trade-page.png
│   ├── 02-chain-dropdown-open.png
│   ├── 03-starknet-selected.png
│   ├── 04-asset-search-open.png
│   ├── 05-strk-selected.png
│   ├── 06-btc-selected.png
│   ├── 07-amount-entered.png
│   └── 08-final-state.png
│
├── narration-script.md         ← Timestamped narration
│
└── metadata.yaml               ← Run info, timestamps
```

---

## Adding New Flows

### 1. Define Steps

```typescript
// In walkthrough-runner.ts

const MY_NEW_FLOW: WalkthroughStep[] = [
  {
    name: 'step-1',
    narration: "What the narrator says during this step",
    action: async (page, selectors) => {
      await page.click(selectors.someButton);
    },
    screenshotName: '01-step-name',
    waitAfter: 2000, // ms to wait after action
  },
  // ... more steps
];
```

### 2. Register Flow

```typescript
const FLOWS: Record<string, WalkthroughStep[]> = {
  'btc-to-starknet': BTC_TO_STARKNET_STEPS,
  'my-new-flow': MY_NEW_FLOW,
};
```

### 3. Run It

```bash
walkthrough record --flow my-new-flow
```

---

## Selector Modes

### Text-Based (Default)

Works without any code changes to ShapeShift. Uses visible text and position.

```typescript
// Example: Find the chain button near "You Get" text
buyChainButton: 'button:near(:text("You Get")):has-text(/Ethereum|Bitcoin|Starknet/i)'
```

**Pros:**
- Works immediately
- No PR needed

**Cons:**
- Fragile if text changes
- Harder to debug

### data-testid (Preferred)

Requires the [test ID PR](./shapeshift-testid-pr-template.md) to be merged.

```typescript
// Example: Find by explicit test ID
buyChainButton: '[data-testid="chain-selector-buy"]'
```

**Pros:**
- 100% reliable
- Self-documenting
- Industry standard

**Cons:**
- Requires code change

---

## Troubleshooting

### "Element not found"

1. Check if the app changed (text, layout)
2. Try running with `--headed` to see what's happening
3. Take a screenshot at the failure point
4. Update selector in `TEXT_SELECTORS` or `TESTID_SELECTORS`

### Recording quality issues

```bash
# Increase viewport size
walkthrough record --viewport 1920x1080

# Use specific browser
walkthrough record --browser chromium
```

### Timeout errors

```bash
# Increase default wait time
walkthrough record --wait 3000
```

---

## Integration with GTM System

When a PR merges:

```
GitHub Watcher detects merge
         │
         ▼
Walkthrough Generator runs
         │
         ├─→ Analyzes PR for feature
         ├─→ Selects appropriate flow
         ├─→ Records walkthrough
         ├─→ Generates narration
         ├─→ Creates GIF for X
         │
         ▼
Content Worker picks up assets
         │
         ├─→ Generates X post with GIF
         ├─→ Generates QT prompts
         ├─→ Stores in plan.yaml
         │
         ▼
Human reviews & approves
         │
         ▼
Publisher posts to channels
```

---

## Environment Variables

```bash
# Base URL (for staging vs production)
SHAPESHIFT_BASE_URL=https://staging.app.shapeshift.com

# Output directory
WALKTHROUGH_OUTPUT_DIR=./.gtm/walkthroughs

# Use test IDs
USE_TEST_IDS=true
```
