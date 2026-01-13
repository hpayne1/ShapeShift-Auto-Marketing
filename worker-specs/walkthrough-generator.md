# Walkthrough Generator Specification
## Auto-generates product walkthroughs from code/testing

---

## Overview

The Walkthrough Generator creates product walkthrough content by:
1. Reading GitHub PRs/code to understand what changed
2. AI generates a step-by-step walkthrough script
3. AI executes those steps on the live app and records the screen
4. Produces video + script + QT-ready content

**Role in system:** This is the "demo creator" — it turns shipped code into visual content.

---

## The Full Pipeline (Both AI Analysis + Live Recording)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WALKTHROUGH GENERATION PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. PR ANALYSIS                                                              │
│     ─────────────                                                            │
│     • Fetch PR: title, description, files changed                           │
│     • Identify: new UI components, routes, features                         │
│     • Extract: entry points, user flows affected                            │
│                              │                                               │
│                              ▼                                               │
│  2. SCRIPT GENERATION                                                        │
│     ──────────────────                                                       │
│     • AI generates step-by-step walkthrough                                  │
│     • Each step: action, expected result, narration                         │
│     • Output: executable script (what to click, type, wait for)             │
│                              │                                               │
│                              ▼                                               │
│  3. LIVE RECORDING                                                           │
│     ──────────────                                                           │
│     • Browser automation (Playwright) executes script                       │
│     • Screen recording captures the entire flow                             │
│     • Screenshots captured at key moments                                   │
│                              │                                               │
│                              ▼                                               │
│  4. POST-PROCESSING                                                          │
│     ────────────────                                                         │
│     • AI reviews recording, adds timestamps                                 │
│     • Generates final narration script                                      │
│     • Creates short-form cuts (15s, 30s, GIF)                               │
│                              │                                               │
│                              ▼                                               │
│  5. OUTPUT                                                                   │
│     ──────                                                                   │
│     • Full video (MP4)                                                      │
│     • Screenshots (PNG)                                                     │
│     • Narration script (for contributor voiceover)                          │
│     • QT prompts                                                            │
│     • GIF for X posts                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** AI doesn't just analyze — it actually performs the walkthrough and records it.

---

---

## Step 1: PR Analysis

### Input
```yaml
source:
  type: github_pr
  url: https://github.com/shapeshift/web/pull/456
  
target:
  staging_url: "https://staging.app.shapeshift.com"
  production_url: "https://app.shapeshift.com"
```

### What AI Extracts from PR

```typescript
interface PRAnalysis {
  // Basic info
  title: string;           // "feat: Add Starknet chain support"
  description: string;     // PR description
  
  // Code analysis
  files_changed: string[]; // List of modified files
  ui_components: string[]; // New/modified React components
  routes_added: string[];  // New URL routes
  config_changes: {
    chains_added: string[];    // ["starknet"]
    tokens_added: string[];    // ["STRK", "ETH-STARKNET"]
    features_enabled: string[];
  };
  
  // Inferred walkthrough info
  entry_point: string;     // Where user starts (e.g., "/trade")
  user_flow: string[];     // Sequence of actions
  key_screens: string[];   // Important UI states to capture
}
```

### AI Prompt for PR Analysis

```
Analyze this GitHub PR for a crypto trading app:

PR Title: {{pr.title}}
PR Description: {{pr.description}}
Files Changed: {{pr.files}}

Based on the code changes, identify:
1. What new feature/capability was added?
2. Where does the user start to use this feature? (URL/entry point)
3. What sequence of actions would a user take?
4. What are the key screens/states to show?
5. What's the main value prop to highlight?

Output as JSON matching this schema:
{
  "feature_summary": "...",
  "entry_point": "/trade",
  "user_flow": ["step 1", "step 2", ...],
  "key_screens": ["screen 1", "screen 2", ...],
  "value_props": ["prop 1", "prop 2", ...]
}
```

---

## Step 2: Executable Script Generation

AI takes the PR analysis and generates an **executable Playwright script** that will actually perform the walkthrough.

### AI Prompt for Script Generation

```
Based on this feature analysis, generate a Playwright script that demonstrates the feature.

Feature: {{analysis.feature_summary}}
Entry Point: {{analysis.entry_point}}
User Flow: {{analysis.user_flow}}

Generate a Playwright script that:
1. Navigates to the entry point
2. Performs each step in the user flow
3. Waits appropriately between actions (for recording)
4. Includes comments for narration timing

The app uses these test IDs:
- Chain selector: [data-testid="chain-selector"]
- Asset selector: [data-testid="asset-selector"]
- Amount input: [data-testid="amount-input"]
- Swap button: [data-testid="swap-button"]
- etc.

Output a complete, runnable Playwright script.
```

### Generated Executable Script

```typescript
// Auto-generated walkthrough script for: Starknet Support
// PR: https://github.com/shapeshift/web/pull/456

import { test, expect } from '@playwright/test';

test('Starknet Swap Walkthrough', async ({ page }) => {
  // Configure recording
  await page.video().start({ dir: './recordings' });
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: Entry Point (0:00-0:08)
  // Narration: "Let's check out the new Starknet integration on ShapeShift."
  // ═══════════════════════════════════════════════════════════════
  await page.goto('https://app.shapeshift.com/trade');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Hold for viewer orientation
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: Open Chain Selector (0:08-0:15)
  // Narration: "Starknet is now in the chain selector."
  // ═══════════════════════════════════════════════════════════════
  await page.click('[data-testid="chain-selector-dest"]');
  await page.waitForTimeout(1500); // Show dropdown
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: Select Starknet (0:15-0:22)
  // Narration: "Just click to select it."
  // ═══════════════════════════════════════════════════════════════
  await page.click('[data-testid="chain-option-starknet"]');
  await page.waitForTimeout(2000); // Show selection
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 4: Select STRK Asset (0:22-0:30)
  // Narration: "Select STRK as your destination token."
  // ═══════════════════════════════════════════════════════════════
  await page.click('[data-testid="asset-selector-dest"]');
  await page.waitForTimeout(1000);
  await page.click('[data-testid="asset-STRK"]');
  await page.waitForTimeout(2000);
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 5: Select BTC Source (0:30-0:42)
  // Narration: "Now pick what you want to swap from. I'll do BTC — native Bitcoin."
  // ═══════════════════════════════════════════════════════════════
  await page.click('[data-testid="asset-selector-source"]');
  await page.waitForTimeout(1000);
  await page.fill('[data-testid="asset-search"]', 'BTC');
  await page.waitForTimeout(500);
  await page.click('[data-testid="asset-BTC"]');
  await page.waitForTimeout(2000);
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 6: Enter Amount (0:42-0:50)
  // Narration: "Enter how much you want to swap."
  // ═══════════════════════════════════════════════════════════════
  await page.fill('[data-testid="amount-input"]', '0.01');
  await page.waitForTimeout(3000); // Wait for quote to load
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 7: Show Route (0:50-1:00)
  // Narration: "ShapeShift finds the best route automatically."
  // ═══════════════════════════════════════════════════════════════
  await page.click('[data-testid="show-route-details"]');
  await page.waitForTimeout(3000); // Let viewer see the route
  
  // ═══════════════════════════════════════════════════════════════
  // SCENE 8: Final State (1:00-1:08)
  // Narration: "BTC to Starknet. One transaction. Self-custodial."
  // ═══════════════════════════════════════════════════════════════
  await page.waitForTimeout(3000); // Hold on final state
  
  // Stop recording
  await page.video().stop();
});
```

---

## Step 3: Live Recording Execution

### Recording Process

```typescript
// walkthrough-runner.ts
import { chromium } from 'playwright';

async function recordWalkthrough(scriptPath: string, outputDir: string) {
  const browser = await chromium.launch({
    headless: false, // Need visible browser for recording
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
  });
  
  const page = await context.newPage();
  
  // Execute the generated script
  await executeScript(page, scriptPath);
  
  // Close and save
  await context.close();
  await browser.close();
  
  // Return path to recorded video
  return `${outputDir}/recording.webm`;
}
```

### Screenshot Capture at Key Moments

```typescript
// During script execution, capture screenshots
async function captureKeyMoment(page: Page, name: string, screenshotDir: string) {
  await page.screenshot({
    path: `${screenshotDir}/${name}.png`,
    fullPage: false,
  });
}

// In the generated script:
// After SCENE 3:
await captureKeyMoment(page, '03-starknet-selected', screenshotDir);
```

---

## Step 4: Post-Processing

### AI Reviews Recording, Generates Final Script

```typescript
async function generateNarrationScript(
  recording: string,
  generatedScript: string
): Promise<NarrationScript> {
  // Extract key frames from recording
  const frames = await extractFrames(recording, { interval: 2000 });
  
  // AI analyzes frames + original script
  const narration = await claude.analyze({
    model: 'claude-3-5-sonnet',
    images: frames,
    prompt: `
      You're creating narration for a product walkthrough video.
      
      Original script with scene markers:
      ${generatedScript}
      
      Review these frames from the actual recording.
      Generate a polished narration script with:
      - Exact timestamps for each line
      - Natural, conversational tone
      - Key value props highlighted
      
      Output format:
      [0:00] "Opening line..."
      [0:08] "Next line..."
      etc.
    `
  });
  
  return narration;
}
```

### Output: Final Narration Script

```markdown
# Starknet Swap Walkthrough - Final Narration

**Total length:** 68 seconds
**PR:** https://github.com/shapeshift/web/pull/456

---

[0:00] "Starknet just went live on ShapeShift. Let me show you how it works."

[0:05] "From the trade page, open the chain selector."

[0:10] "Starknet is right here — click to select it."

[0:17] "Now pick your destination token. I'll go with STRK."

[0:25] "For the source, I'm going to swap from Bitcoin. Not wrapped Bitcoin — actual native BTC."

[0:35] "Enter the amount. ShapeShift is finding the best route..."

[0:45] "Here's the route. You can see it's handling the cross-chain routing automatically."

[0:55] "BTC to Starknet. One transaction. Self-custodial all the way."

[1:02] "Try it at app.shapeshift.com."

---

## Key Moments for Screenshots

| Timestamp | Screenshot | Use For |
|-----------|------------|---------|
| 0:12 | Starknet in selector | X post graphic |
| 0:28 | BTC selected | Blog hero |
| 0:48 | Route visualization | Thread image |
| 1:00 | Final state | Discord embed |
```

---

## Step 5: Output Assets

### Full Output Structure

```
.gtm/STRK-456/walkthroughs/
├── recording/
│   ├── full-walkthrough.mp4          # Complete recording
│   ├── full-walkthrough.webm         # Web-optimized
│   └── full-walkthrough.srt          # Captions (from narration)
│
├── screenshots/
│   ├── 01-entry-point.png
│   ├── 02-chain-selector.png
│   ├── 03-starknet-selected.png      # Key moment
│   ├── 04-strk-selected.png
│   ├── 05-btc-source.png             # Key moment
│   ├── 06-amount-entered.png
│   ├── 07-route-view.png             # Key moment
│   └── 08-final-state.png            # Key moment
│
├── short-cuts/
│   ├── 15sec-highlight.mp4           # Best 15 seconds
│   ├── 30sec-summary.mp4             # Quick overview
│   └── swap-flow.gif                 # For X posts
│
├── scripts/
│   ├── generated-playwright.ts       # The executable script
│   ├── narration-script.md           # For voiceover
│   └── qt-prompts.md                 # Ready-to-use QT text
│
└── metadata.yaml                      # Timestamps, PR link, etc.
```

### metadata.yaml

```yaml
walkthrough:
  id: "STRK-456-walkthrough"
  pr_url: "https://github.com/shapeshift/web/pull/456"
  feature: "Starknet Support"
  generated_at: "2026-02-01T10:00:00Z"
  
recording:
  duration_seconds: 68
  resolution: "1280x720"
  format: "mp4"
  
key_moments:
  - timestamp: "0:12"
    description: "Starknet in chain selector"
    screenshot: "screenshots/03-starknet-selected.png"
    
  - timestamp: "0:48"
    description: "Route visualization"
    screenshot: "screenshots/07-route-view.png"

narration:
  script_path: "scripts/narration-script.md"
  word_count: 142
  reading_time_seconds: 68
  
qt_prompts:
  - "Starknet is live on ShapeShift. Quick walkthrough:"
  - "BTC → STRK in one tx. Here's how it works:"
  - "No bridges, no wrapped tokens. Just swap:"
```

---

## Mode 2: Screen Capture Walkthrough

### Prerequisites
- Staging environment with feature deployed
- Automated test script (Playwright/Cypress)
- Screen recording capability

### Process

```
1. Receive trigger (feature shipped)
   ↓
2. Run automated test flow on staging
   └─→ Playwright script executes user journey
   └─→ Screen + actions recorded
   ↓
3. Process recording
   ├─→ Identify key moments (clicks, transitions)
   ├─→ Extract screenshots at key frames
   └─→ Generate timestamps
   ↓
4. AI analyzes recording
   ├─→ Describe what's happening at each step
   ├─→ Generate narration script
   └─→ Identify highlights for short-form
   ↓
5. Output assets
   ├─→ Full recording (MP4)
   ├─→ Key screenshots (PNG)
   ├─→ Narration script (MD)
   └─→ Short-form cut suggestions
```

### Test Flow Script (Playwright Example)

```typescript
// tests/walkthroughs/starknet-swap.ts
import { test } from '@playwright/test';

test('Starknet swap walkthrough', async ({ page }) => {
  // Start recording
  await page.video().start();
  
  // Navigate to trade
  await page.goto('https://staging.app.shapeshift.com/trade');
  await page.waitForTimeout(2000); // Let page settle
  
  // Open chain selector
  await page.click('[data-testid="chain-selector"]');
  await page.waitForTimeout(1000);
  
  // Select Starknet
  await page.click('[data-testid="chain-starknet"]');
  await page.waitForTimeout(1000);
  
  // Select STRK
  await page.click('[data-testid="asset-selector-dest"]');
  await page.click('[data-testid="asset-STRK"]');
  await page.waitForTimeout(1000);
  
  // Select source (BTC)
  await page.click('[data-testid="asset-selector-source"]');
  await page.click('[data-testid="asset-BTC"]');
  await page.waitForTimeout(1000);
  
  // Enter amount
  await page.fill('[data-testid="amount-input"]', '0.01');
  await page.waitForTimeout(2000); // Wait for quote
  
  // Show route
  await page.click('[data-testid="show-route"]');
  await page.waitForTimeout(2000);
  
  // Stop recording
  await page.video().stop();
});
```

### Recording Analysis (AI)

```typescript
async function analyzeRecording(videoPath: string): Promise<WalkthroughAnalysis> {
  // Extract frames at key moments
  const frames = await extractKeyFrames(videoPath);
  
  // Send to vision model
  const analysis = await claude.analyze({
    model: 'claude-3-5-sonnet',
    images: frames,
    prompt: `
      Analyze this product walkthrough recording.
      
      For each frame, describe:
      1. What the user is doing
      2. What's visible on screen
      3. Suggested narration
      
      Output as JSON with timestamps.
    `
  });
  
  return analysis;
}
```

---

## Output Assets

### 1. Full Recording
```
.gtm/STRK-456/walkthroughs/
├── full-recording.mp4       # Complete flow
├── full-recording.srt       # Auto-generated captions
└── full-recording-script.md # Narration script
```

### 2. Screenshots
```
.gtm/STRK-456/walkthroughs/screenshots/
├── 01-trade-page.png
├── 02-chain-selector.png
├── 03-starknet-selected.png
├── 04-source-btc.png
├── 05-route-view.png
└── 06-confirmation.png
```

### 3. Short-Form Cuts
```
.gtm/STRK-456/walkthroughs/shorts/
├── 15sec-highlight.mp4      # Best 15 seconds
├── 30sec-summary.mp4        # Quick overview
└── gif-swap-flow.gif        # Animated GIF for X
```

### 4. Narration Script
```markdown
# Starknet Swap Walkthrough - Narration Script

## For Contributor Recording

**Total length:** ~60 seconds

---

**[0:00-0:05]** 
"Starknet just went live on ShapeShift. Let me show you how it works."

**[0:05-0:15]**
"From the trade page, open the chain selector. Starknet is right here."

**[0:15-0:25]**
"I'm going to swap Bitcoin to STRK. Not wrapped Bitcoin — actual native BTC."

**[0:25-0:35]**
"Enter the amount, and ShapeShift finds the best route automatically."

**[0:35-0:50]**
"You can see the route here — it's handling everything: the BTC transaction, the cross-chain routing, landing in STRK on Starknet."

**[0:50-0:60]**
"Confirm in your wallet, and that's it. BTC to Starknet, one transaction, self-custodial all the way."

---

## Suggested QT Text

> Quick look at the new Starknet integration on ShapeShift. 
> 
> BTC → STRK, one tx, no bridges. 
> 
> [video]
```

---

## Integration Points

### With GitHub Watcher
```
GitHub Watcher detects PR merge
  ↓
Triggers Walkthrough Generator
  ↓
Generator creates assets
  ↓
Assets saved to .gtm/{id}/walkthroughs/
  ↓
Notification includes walkthrough links
```

### With Content Worker
```
Content Worker can reference walkthroughs:
  ↓
Blog post includes screenshots
  ↓
X post includes GIF
  ↓
Discord post links to full video
```

---

## Configuration

```yaml
# config/walkthrough.yaml
recording:
  staging_url: "https://staging.app.shapeshift.com"
  viewport: { width: 1280, height: 720 }
  format: "mp4"
  
analysis:
  model: "claude-3-5-sonnet"
  extract_frames_every: 2000  # ms
  
outputs:
  full_recording: true
  screenshots: true
  short_cuts: [15, 30, 60]  # seconds
  gif: true
  
test_flows:
  starknet_swap: "tests/walkthroughs/starknet-swap.ts"
  # Add more flows as needed
```

---

## Commands

```bash
# Full pipeline: Analyze PR → Generate script → Record → Process
walkthrough-gen create --pr https://github.com/shapeshift/web/pull/456

# With custom staging URL
walkthrough-gen create --pr <url> --staging https://staging.app.shapeshift.com

# Just analyze PR (no recording)
walkthrough-gen analyze --pr https://github.com/shapeshift/web/pull/456

# Just generate script from analysis
walkthrough-gen script --analysis .gtm/STRK-456/analysis.json

# Just record from existing script
walkthrough-gen record --script .gtm/STRK-456/scripts/generated-playwright.ts

# Just process existing recording
walkthrough-gen process --video ./recording.mp4 --script ./script.ts

# Generate short cuts from full recording
walkthrough-gen shorts --video .gtm/STRK-456/recording/full-walkthrough.mp4

# Dry run (show what would happen, don't execute)
walkthrough-gen create --pr <url> --dry-run
```

---

## Full Pipeline Example

```bash
$ walkthrough-gen create --pr https://github.com/shapeshift/web/pull/456

[1/5] Fetching PR data...
      Title: feat: Add Starknet chain support
      Files changed: 23
      
[2/5] Analyzing code changes...
      Feature: Starknet chain integration
      Entry point: /trade
      User flow: 8 steps identified
      
[3/5] Generating Playwright script...
      Script saved: .gtm/STRK-456/scripts/generated-playwright.ts
      Estimated duration: 68 seconds
      
[4/5] Recording walkthrough...
      Browser: Chromium (visible)
      Viewport: 1280x720
      Recording...
      ████████████████████████████████ 100%
      Video saved: .gtm/STRK-456/recording/full-walkthrough.mp4
      Screenshots captured: 8
      
[5/5] Post-processing...
      Generating narration script...
      Creating short cuts (15s, 30s)...
      Creating GIF...
      Generating QT prompts...

✅ Walkthrough complete!

Output:
  📹 Video: .gtm/STRK-456/recording/full-walkthrough.mp4 (68s)
  📸 Screenshots: .gtm/STRK-456/screenshots/ (8 images)
  ✂️ Short cuts: .gtm/STRK-456/short-cuts/ (15s, 30s, GIF)
  📝 Narration: .gtm/STRK-456/scripts/narration-script.md
  💬 QT prompts: .gtm/STRK-456/scripts/qt-prompts.md
```

---

## Dependencies

### For Mode 1 (AI-Analyzed)
- GitHub API access
- LLM API (Claude)

### For Mode 2 (Screen Capture)
- Playwright or Puppeteer
- FFmpeg (video processing)
- Staging environment access
- LLM API with vision (Claude 3.5)

---

## Future Enhancements

- [ ] Auto-voice narration (TTS from script)
- [ ] Auto-captions (Whisper or similar)
- [ ] A/B variants (different emphasis)
- [ ] Mobile recordings
- [ ] Integration with Loom API (direct upload)
- [ ] Real-time recording during manual QA

---

## Implementation Files

### Available Now

| File | Description |
|------|-------------|
| `walkthrough-runner.ts` | Executable Playwright script with dual selector mode |
| `walkthrough-cli.md` | CLI documentation and usage guide |
| `app-interaction-map.md` | UI element mapping for ShapeShift trade page |

### For Future (Requires Code Change)

| File | Description |
|------|-------------|
| `shapeshift-testid-pr-template.md` | PR template to add `data-testid` attributes to ShapeShift/web |

### Quick Start

```bash
# Install Playwright
npm install playwright

# Run walkthrough with text-based selectors (works now)
npx ts-node worker-specs/walkthrough-runner.ts

# Run with data-testid selectors (after PR merged)
npx ts-node worker-specs/walkthrough-runner.ts --testids
```

---

*This worker turns shipped code into "show don't tell" content.*
