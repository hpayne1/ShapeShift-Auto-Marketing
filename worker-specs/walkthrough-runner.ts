/**
 * Walkthrough Runner
 * 
 * Executes walkthrough scripts on the live ShapeShift app and records the screen.
 * Uses text-based selectors (fallback) or data-testid (preferred when available).
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CONFIGURATION
// =============================================================================

interface WalkthroughConfig {
  baseUrl: string;
  outputDir: string;
  viewport: { width: number; height: number };
  defaultWaitTime: number;
  useTestIds: boolean; // Toggle between testid and text selectors
}

const DEFAULT_CONFIG: WalkthroughConfig = {
  baseUrl: 'https://app.shapeshift.com',
  outputDir: './.gtm/walkthroughs',
  viewport: { width: 1280, height: 720 },
  defaultWaitTime: 1500,
  useTestIds: false, // Set to true once data-testid PR is merged
};

// =============================================================================
// SELECTORS (Dual mode: testid or text-based)
// =============================================================================

interface SelectorMap {
  // Sell section ("Pay With")
  sellAssetButton: string;
  sellChainButton: string;
  sellAmountInput: string;
  
  // Buy section ("You Get")
  buyAssetButton: string;
  buyChainButton: string;
  
  // Search modal
  assetSearchInput: string;
  assetOption: (symbol: string) => string;
  
  // Chain dropdown
  chainOption: (chainName: string) => string;
  
  // Actions
  swapDirectionButton: string;
  executeButton: string;
}

// Text-based selectors (works without code changes)
const TEXT_SELECTORS: SelectorMap = {
  sellAssetButton: 'button:near(:text("Pay With")):has([class*="chakra"])',
  sellChainButton: 'button:near(:text("Pay With")):has-text(/Ethereum|Bitcoin|Starknet/i)',
  sellAmountInput: 'input:near(:text("Pay With"))',
  
  buyAssetButton: 'button:near(:text("You Get")):has([class*="chakra"])',
  buyChainButton: 'button:near(:text("You Get")):has-text(/Ethereum|Bitcoin|Starknet/i)',
  
  assetSearchInput: 'input[placeholder*="Search"]',
  assetOption: (symbol: string) => `div:has-text("${symbol}"):visible >> nth=0`,
  
  chainOption: (chainName: string) => `div[role="menuitemradio"]:has-text("${chainName}")`,
  
  swapDirectionButton: 'button:has(svg):near(:text("Pay With")):near(:text("You Get"))',
  executeButton: 'button:has-text(/Connect Wallet|Swap|Preview/i)',
};

// data-testid selectors (requires PR to be merged)
const TESTID_SELECTORS: SelectorMap = {
  sellAssetButton: '[data-testid="asset-selector-sell"]',
  sellChainButton: '[data-testid="chain-selector-sell"]',
  sellAmountInput: '[data-testid="amount-input-sell"]',
  
  buyAssetButton: '[data-testid="asset-selector-buy"]',
  buyChainButton: '[data-testid="chain-selector-buy"]',
  
  assetSearchInput: '[data-testid="asset-search-input"]',
  assetOption: (symbol: string) => `[data-testid^="asset-option-"]:has-text("${symbol}")`,
  
  chainOption: (chainName: string) => `[data-testid^="chain-option-"]:has-text("${chainName}")`,
  
  swapDirectionButton: '[data-testid="swap-direction-toggle"]',
  executeButton: '[data-testid="trade-execute-button"]',
};

function getSelectors(useTestIds: boolean): SelectorMap {
  return useTestIds ? TESTID_SELECTORS : TEXT_SELECTORS;
}

// =============================================================================
// WALKTHROUGH STEPS
// =============================================================================

interface WalkthroughStep {
  name: string;
  narration: string;
  action: (page: Page, selectors: SelectorMap) => Promise<void>;
  screenshotName?: string;
  waitAfter?: number;
}

// Example: BTC → STRK on Starknet walkthrough
const BTC_TO_STARKNET_STEPS: WalkthroughStep[] = [
  {
    name: 'navigate',
    narration: "Let's check out the new Starknet integration on ShapeShift.",
    action: async (page) => {
      await page.goto('https://app.shapeshift.com/trade');
      await page.waitForLoadState('networkidle');
    },
    screenshotName: '01-trade-page',
    waitAfter: 3000,
  },
  {
    name: 'open-dest-chain',
    narration: "Starknet is now in the chain selector.",
    action: async (page, selectors) => {
      await page.click(selectors.buyChainButton);
    },
    screenshotName: '02-chain-dropdown-open',
    waitAfter: 1500,
  },
  {
    name: 'select-starknet',
    narration: "Just click to select it.",
    action: async (page, selectors) => {
      await page.click(selectors.chainOption('Starknet'));
    },
    screenshotName: '03-starknet-selected',
    waitAfter: 2000,
  },
  {
    name: 'open-dest-asset',
    narration: "Now pick your destination token. I'll go with STRK.",
    action: async (page, selectors) => {
      await page.click(selectors.buyAssetButton);
    },
    screenshotName: '04-asset-search-open',
    waitAfter: 1500,
  },
  {
    name: 'search-strk',
    narration: "Search for STRK...",
    action: async (page, selectors) => {
      await page.fill(selectors.assetSearchInput, 'STRK');
    },
    waitAfter: 1000,
  },
  {
    name: 'select-strk',
    narration: "And select it.",
    action: async (page, selectors) => {
      await page.click(selectors.assetOption('STRK'));
    },
    screenshotName: '05-strk-selected',
    waitAfter: 2000,
  },
  {
    name: 'open-source-asset',
    narration: "For the source, I'm going to swap from Bitcoin. Not wrapped Bitcoin — actual native BTC.",
    action: async (page, selectors) => {
      await page.click(selectors.sellAssetButton);
    },
    waitAfter: 1500,
  },
  {
    name: 'search-btc',
    narration: "",
    action: async (page, selectors) => {
      await page.fill(selectors.assetSearchInput, 'BTC');
    },
    waitAfter: 1000,
  },
  {
    name: 'select-btc',
    narration: "",
    action: async (page, selectors) => {
      await page.click(selectors.assetOption('BTC'));
    },
    screenshotName: '06-btc-selected',
    waitAfter: 2000,
  },
  {
    name: 'enter-amount',
    narration: "Enter the amount. ShapeShift is finding the best route...",
    action: async (page, selectors) => {
      await page.fill(selectors.sellAmountInput, '0.01');
    },
    screenshotName: '07-amount-entered',
    waitAfter: 4000, // Wait for quote to load
  },
  {
    name: 'final-state',
    narration: "BTC to Starknet. One transaction. Self-custodial all the way.",
    action: async () => {
      // Just hold on final state
    },
    screenshotName: '08-final-state',
    waitAfter: 3000,
  },
];

// =============================================================================
// WALKTHROUGH RUNNER
// =============================================================================

class WalkthroughRunner {
  private config: WalkthroughConfig;
  private selectors: SelectorMap;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor(config: Partial<WalkthroughConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.selectors = getSelectors(this.config.useTestIds);
  }

  async initialize(): Promise<void> {
    // Create output directory
    fs.mkdirSync(this.config.outputDir, { recursive: true });
    fs.mkdirSync(path.join(this.config.outputDir, 'screenshots'), { recursive: true });
    fs.mkdirSync(path.join(this.config.outputDir, 'recordings'), { recursive: true });

    // Launch browser
    this.browser = await chromium.launch({
      headless: false, // Need visible browser for recording
    });

    this.context = await this.browser.newContext({
      viewport: this.config.viewport,
      recordVideo: {
        dir: path.join(this.config.outputDir, 'recordings'),
        size: this.config.viewport,
      },
    });

    this.page = await this.context.newPage();
  }

  async runSteps(steps: WalkthroughStep[]): Promise<void> {
    if (!this.page) throw new Error('Runner not initialized');

    const narrationScript: string[] = [];
    let timestamp = 0;

    for (const step of steps) {
      console.log(`[${step.name}] ${step.narration || '...'}`);
      
      // Record narration timing
      if (step.narration) {
        narrationScript.push(`[${this.formatTime(timestamp)}] "${step.narration}"`);
      }

      try {
        // Execute the action
        await step.action(this.page, this.selectors);

        // Take screenshot if specified
        if (step.screenshotName) {
          await this.page.screenshot({
            path: path.join(this.config.outputDir, 'screenshots', `${step.screenshotName}.png`),
          });
        }

        // Wait after action
        const waitTime = step.waitAfter ?? this.config.defaultWaitTime;
        await this.page.waitForTimeout(waitTime);
        timestamp += waitTime;

      } catch (error) {
        console.error(`Failed at step [${step.name}]:`, error);
        
        // Take error screenshot
        await this.page.screenshot({
          path: path.join(this.config.outputDir, 'screenshots', `ERROR-${step.name}.png`),
        });
        
        throw error;
      }
    }

    // Save narration script
    fs.writeFileSync(
      path.join(this.config.outputDir, 'narration-script.md'),
      this.generateNarrationMarkdown(narrationScript, steps)
    );
  }

  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private generateNarrationMarkdown(script: string[], steps: WalkthroughStep[]): string {
    const totalDuration = steps.reduce((acc, s) => acc + (s.waitAfter ?? this.config.defaultWaitTime), 0);
    
    return `# Walkthrough Narration Script

**Total Duration:** ${this.formatTime(totalDuration)}
**Generated:** ${new Date().toISOString()}

---

## Narration

${script.join('\n\n')}

---

## Screenshots

${steps
  .filter(s => s.screenshotName)
  .map(s => `- \`${s.screenshotName}.png\` — ${s.narration || s.name}`)
  .join('\n')}

---

## QT Prompts

- "Starknet is live on ShapeShift. Quick walkthrough:"
- "BTC → STRK in one tx. Here's how it works:"
- "No bridges, no wrapped tokens. Just swap:"
`;
  }

  async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Get video path after recording
  async getVideoPath(): Promise<string | null> {
    if (!this.page) return null;
    const video = this.page.video();
    if (!video) return null;
    return await video.path();
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const useTestIds = args.includes('--testids');
  const outputDir = args.find(a => a.startsWith('--output='))?.split('=')[1] || './.gtm/walkthroughs';

  console.log('🎬 Walkthrough Runner');
  console.log(`   Mode: ${useTestIds ? 'data-testid selectors' : 'text-based selectors'}`);
  console.log(`   Output: ${outputDir}`);
  console.log('');

  const runner = new WalkthroughRunner({
    useTestIds,
    outputDir,
  });

  try {
    await runner.initialize();
    console.log('✅ Browser initialized\n');

    await runner.runSteps(BTC_TO_STARKNET_STEPS);
    console.log('\n✅ Walkthrough complete!');

    const videoPath = await runner.getVideoPath();
    if (videoPath) {
      console.log(`📹 Video saved: ${videoPath}`);
    }

  } catch (error) {
    console.error('\n❌ Walkthrough failed:', error);
    process.exit(1);
  } finally {
    await runner.cleanup();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { WalkthroughRunner, WalkthroughStep, WalkthroughConfig, BTC_TO_STARKNET_STEPS };
