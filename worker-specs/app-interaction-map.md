# ShapeShift App Interaction Map
## Human-readable test guide + Machine-readable selectors

---

## What Is This?

This document serves two purposes:

1. **For Humans:** Step-by-step instructions for testing features (QA, walkthroughs)
2. **For Automation:** Selectors that tell the AI which buttons to click

When someone tests a feature, they follow these steps. When the AI automates a walkthrough, it uses these same steps with the technical selectors.

---

## App Structure Overview

```
app.shapeshift.com/
├── /trade              ← Swap interface (main feature)
├── /dashboard          ← Portfolio overview
├── /earn               ← DeFi yields
├── /markets            ← Token prices
└── /settings           ← User preferences
```

---

## Actual UI (From Screenshot - Jan 2026)

Based on inspecting app.shapeshift.com/trade:

```
┌─────────────────────────────────────────────────────────────────┐
│  [🦊▼]  Trade  Explore  Earn  Ecosystem    [🔍] [⚙️] [Connect] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌─────────────────────────────────────────┐             │
│         │  Trade/Bridge   Limit   Buy   Sell  [⚙️]│             │
│         ├─────────────────────────────────────────┤             │
│         │                                         │             │
│         │  Pay With                               │             │
│         │  ┌──────────┐     ┌──────────────┐     │             │
│         │  │ ETH  ▼   │ on  │ Ethereum  ▼  │     │  ← SOURCE   │
│         │  └──────────┘     └──────────────┘     │    ASSET &  │
│         │  0                                     │    CHAIN    │
│         │  ≈ $0.00                               │             │
│         │                                         │             │
│         │            [ ↓ ]                        │  ← FLIP    │
│         │                                         │             │
│         │  You Get                                │             │
│         │  ┌──────────┐     ┌──────────────┐     │             │
│         │  │ BTC  ▼   │ on  │ Bitcoin   ▼  │     │  ← DEST     │
│         │  └──────────┘     └──────────────┘     │    ASSET &  │
│         │  0                                     │    CHAIN    │
│         │  ≈ $0.00                               │             │
│         │                                         │             │
│         │  Receive address                   [📋] │             │
│         │                                         │             │
│         │  ┌─────────────────────────────────┐   │             │
│         │  │        Connect Wallet           │   │  ← ACTION   │
│         │  └─────────────────────────────────┘   │             │
│         └─────────────────────────────────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Elements (What to Click)

| What You Want | Where It Is | What It Looks Like |
|---------------|-------------|-------------------|
| **Change source token** | "Pay With" → left dropdown | `[ETH ▼]` pill button |
| **Change source chain** | "Pay With" → right dropdown | `on [Ethereum ▼]` |
| **Enter amount** | "Pay With" → below dropdowns | Big "0" number field |
| **Flip source/dest** | Middle of card | `[↓]` arrow button |
| **Change dest token** | "You Get" → left dropdown | `[BTC ▼]` pill button |
| **Change dest chain** | "You Get" → right dropdown | `on [Bitcoin ▼]` |
| **Execute trade** | Bottom of card | Blue `[Connect Wallet]` button |
| **Paste address** | "Receive address" row | Clipboard icon on right |

### UI Notes

- **Asset + Chain are SEPARATE dropdowns** — you pick the chain first, then the asset
- **"Pay With" = SOURCE** (what you're swapping FROM)
- **"You Get" = DESTINATION** (what you're swapping TO)
- **Button changes:** "Connect Wallet" → "Swap" after wallet connected

---

## Core Flows

### Flow 1: Basic Swap

**Human instructions:**
```
1. Go to app.shapeshift.com/trade
2. Click the "destination" asset selector (right side)
3. Search for or scroll to find your destination token
4. Click the token to select it
5. Click the "source" asset selector (left side)
6. Search for or scroll to find your source token
7. Click the token to select it
8. Enter the amount you want to swap
9. Wait for the quote to load
10. Review the rate and route
11. Click "Swap" button
12. Confirm in your wallet
```

**Technical selectors:**
```yaml
flow: basic_swap
url: /trade

steps:
  - name: "Navigate to trade"
    action: goto
    target: "https://app.shapeshift.com/trade"
    wait_for: "page_load"
    
  - name: "Open destination selector"
    action: click
    human: "Click the destination asset box (shows 'Select asset' or current token)"
    selector: "[data-testid='asset-selector-dest']"
    # OR by text: "button:has-text('Select asset')"
    # OR by position: "The right-side asset picker"
    wait_for: "dropdown_visible"
    
  - name: "Search for destination token"
    action: type
    human: "Type the token name in the search box"
    selector: "[data-testid='asset-search-input']"
    # OR: "input[placeholder*='Search']"
    value: "{{destination_token}}"  # e.g., "STRK"
    
  - name: "Select destination token"
    action: click
    human: "Click on the token in the list"
    selector: "[data-testid='asset-option-{{destination_token}}']"
    # OR: "div:has-text('{{destination_token}}'):visible"
    wait_for: "dropdown_closed"
    
  - name: "Open source selector"
    action: click
    human: "Click the source asset box (left side)"
    selector: "[data-testid='asset-selector-source']"
    wait_for: "dropdown_visible"
    
  - name: "Search for source token"
    action: type
    human: "Type the token name in the search box"
    selector: "[data-testid='asset-search-input']"
    value: "{{source_token}}"  # e.g., "BTC"
    
  - name: "Select source token"
    action: click
    human: "Click on the token in the list"
    selector: "[data-testid='asset-option-{{source_token}}']"
    wait_for: "dropdown_closed"
    
  - name: "Enter amount"
    action: type
    human: "Click the amount field and enter how much to swap"
    selector: "[data-testid='amount-input']"
    # OR: "input[type='number']"
    value: "{{amount}}"  # e.g., "0.01"
    wait_for: "quote_loaded"  # Wait for rate to appear
    
  - name: "View route details"
    action: click
    human: "Click to expand route details (optional)"
    selector: "[data-testid='route-details-toggle']"
    # OR: "button:has-text('Route')"
    optional: true
    
  - name: "Click swap"
    action: click
    human: "Click the Swap button"
    selector: "[data-testid='swap-button']"
    # OR: "button:has-text('Swap')"
    wait_for: "wallet_prompt"
```

---

### Flow 2: Select a Specific Chain (e.g., Starknet)

**Human instructions:**
```
1. From the trade page, look for a chain selector dropdown
2. It might be near the asset selector or as a separate dropdown
3. Click to open the chain list
4. Find "Starknet" in the list
5. Click to select it
6. The asset list should now show Starknet tokens
```

**Technical selectors:**
```yaml
flow: select_chain
url: /trade

steps:
  - name: "Open chain selector"
    action: click
    human: "Click the chain/network dropdown"
    selector: "[data-testid='chain-selector']"
    # OR: "button:has-text('Ethereum')"  # If it shows current chain
    # OR: Look for a network icon/dropdown
    wait_for: "chain_list_visible"
    
  - name: "Select Starknet"
    action: click
    human: "Click 'Starknet' in the list"
    selector: "[data-testid='chain-option-starknet']"
    # OR: "div:has-text('Starknet'):visible"
    wait_for: "chain_selected"
```

---

### Flow 3: Connect Wallet

**Human instructions:**
```
1. Look for "Connect Wallet" button (usually top-right)
2. Click it
3. A modal appears with wallet options
4. Select your wallet type (MetaMask, WalletConnect, etc.)
5. Approve the connection in your wallet
6. Wait for connection confirmation
```

**Technical selectors:**
```yaml
flow: connect_wallet
url: any

steps:
  - name: "Click connect wallet"
    action: click
    human: "Click the 'Connect Wallet' button"
    selector: "[data-testid='connect-wallet-button']"
    # OR: "button:has-text('Connect')"
    wait_for: "wallet_modal_visible"
    
  - name: "Select wallet type"
    action: click
    human: "Click on your wallet provider (e.g., MetaMask)"
    selector: "[data-testid='wallet-option-metamask']"
    # OR: "button:has-text('MetaMask')"
    wait_for: "wallet_prompt"
    
  # Note: Actual wallet connection happens in the wallet extension
  # Automation would need to handle this separately or skip
```

---

### Flow 4: View Portfolio

**Human instructions:**
```
1. Click "Dashboard" in the navigation
2. Wait for portfolio to load
3. You should see your assets listed
4. Click on an asset to see details
```

**Technical selectors:**
```yaml
flow: view_portfolio
url: /dashboard

steps:
  - name: "Navigate to dashboard"
    action: click
    human: "Click 'Dashboard' in the navigation"
    selector: "[data-testid='nav-dashboard']"
    # OR: "a:has-text('Dashboard')"
    wait_for: "portfolio_loaded"
    
  - name: "View asset details"
    action: click
    human: "Click on an asset row to see details"
    selector: "[data-testid='asset-row-{{token}}']"
    # OR: "tr:has-text('{{token}}')"
    optional: true
```

---

## Selector Discovery Guide

### How to Find Selectors

**If you're a developer:**
1. Open browser DevTools (F12)
2. Use the element picker (top-left icon)
3. Click on the element you want
4. Look for `data-testid` attributes
5. If none, use class names or text content

**If you're not a developer:**
1. Describe what you see: "The blue button that says 'Swap'"
2. Describe where it is: "Top right corner"
3. Describe what it does: "Opens the wallet connection popup"

The AI can use either description.

---

## Starknet-Specific Flow

### Swap BTC → STRK on Starknet

**Human test script (matches actual UI):**
```
GOAL: Swap native Bitcoin to STRK on Starknet
URL: app.shapeshift.com/trade

══════════════════════════════════════════════════════════════════
STEP 1: CHANGE DESTINATION CHAIN TO STARKNET
══════════════════════════════════════════════════════════════════
WHERE: "You Get" section → right dropdown (currently says "Bitcoin")
ACTION: Click the chain dropdown → Find "Starknet" → Click it
VERIFY: Dropdown now shows "Starknet" instead of "Bitcoin"

══════════════════════════════════════════════════════════════════
STEP 2: SELECT STRK AS DESTINATION TOKEN  
══════════════════════════════════════════════════════════════════
WHERE: "You Get" section → left dropdown (currently says "BTC")
ACTION: Click the asset dropdown → Search "STRK" → Click it
VERIFY: Dropdown now shows "STRK" with Starknet logo

══════════════════════════════════════════════════════════════════
STEP 3: SELECT BTC AS SOURCE
══════════════════════════════════════════════════════════════════
WHERE: "Pay With" section → left dropdown (currently says "ETH")
ACTION: Click the asset dropdown → Search "BTC" → Click it
NOTE: Chain should auto-change to "Bitcoin" when you select BTC
VERIFY: Shows "BTC on Bitcoin"

══════════════════════════════════════════════════════════════════
STEP 4: ENTER AMOUNT
══════════════════════════════════════════════════════════════════
WHERE: "Pay With" section → number field (shows "0")
ACTION: Click the field → Type "0.01"
VERIFY: "You Get" field populates with STRK amount after quote loads

══════════════════════════════════════════════════════════════════
STEP 5: REVIEW ROUTE (OPTIONAL)
══════════════════════════════════════════════════════════════════
WHERE: Look for "Route" or expand arrow below the quote
ACTION: Click to expand route details
VERIFY: Shows path like BTC → THORChain → ... → STRK

══════════════════════════════════════════════════════════════════
STEP 6: EXECUTE (FOR WALKTHROUGH, STOP HERE)
══════════════════════════════════════════════════════════════════
WHERE: Blue button at bottom
BUTTON: "Connect Wallet" (if not connected) or "Swap" (if connected)
FOR DEMO: Stop before clicking - show the final state

══════════════════════════════════════════════════════════════════
EXPECTED FINAL STATE:
- Pay With: BTC on Bitcoin, amount = 0.01
- You Get: STRK on Starknet, amount = [calculated]
- Route visible showing cross-chain path
══════════════════════════════════════════════════════════════════
```

**What the AI would generate from this:**
```typescript
// Auto-generated walkthrough: BTC → STRK on Starknet
// Source: app-interaction-map.md + PR analysis

test('BTC to Starknet STRK walkthrough', async ({ page }) => {
  // Navigate
  await page.goto('https://app.shapeshift.com/trade');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Let viewer orient
  
  // STEP 1: Change destination chain to Starknet
  // "You Get" section → right dropdown
  await page.click('button:has-text("Bitcoin"):near(:text("You Get"))');
  await page.waitForTimeout(1000);
  await page.click('text=Starknet');
  await page.waitForTimeout(1500);
  
  // STEP 2: Select STRK as destination token
  // "You Get" section → left dropdown  
  await page.click('button:has-text("BTC"):near(:text("You Get"))');
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder*="Search"]', 'STRK');
  await page.waitForTimeout(500);
  await page.click('text=STRK');
  await page.waitForTimeout(1500);
  
  // STEP 3: Select BTC as source
  // "Pay With" section → left dropdown
  await page.click('button:has-text("ETH"):near(:text("Pay With"))');
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder*="Search"]', 'BTC');
  await page.waitForTimeout(500);
  await page.click('text=BTC >> nth=0');
  await page.waitForTimeout(1500);
  
  // STEP 4: Enter amount
  await page.fill('input:near(:text("Pay With"))', '0.01');
  await page.waitForTimeout(3000); // Wait for quote
  
  // STEP 5: Show final state (hold for recording)
  await page.waitForTimeout(3000);
  
  // Don't click Swap - this is just a demo
});

---

## How the AI Uses This

### Input to AI:
```
Feature: Starknet swap support
PR: https://github.com/shapeshift/web/pull/456

Using the app interaction map, generate a Playwright script that:
1. Navigates to the trade page
2. Selects Starknet as the destination chain
3. Selects STRK as the destination token
4. Selects BTC as the source
5. Enters 0.01 as the amount
6. Shows the route (but doesn't execute swap)

Use the selectors from the interaction map.
```

### AI Output:
```typescript
// Auto-generated from app interaction map + PR analysis
import { test } from '@playwright/test';

test('Starknet swap walkthrough', async ({ page }) => {
  // Navigate to trade (from interaction map)
  await page.goto('https://app.shapeshift.com/trade');
  await page.waitForLoadState('networkidle');
  
  // Select Starknet chain (from interaction map: select_chain flow)
  await page.click('[data-testid="chain-selector"]');
  await page.waitForTimeout(1000);
  await page.click('[data-testid="chain-option-starknet"]');
  
  // ... rest of steps from interaction map
});
```

---

## Filling Out This Map

### What You Need to Provide

1. **Confirm the flows are accurate**
   - Does the swap flow match how the app actually works?
   - Are there additional steps I'm missing?

2. **Provide actual selectors**
   - What `data-testid` attributes exist?
   - If none, what are the CSS classes/IDs?

3. **Note any edge cases**
   - Does the UI change based on wallet connection?
   - Are there different views for different chains?

### How to Discover Selectors

**Quick way:**
```
1. Open app.shapeshift.com/trade in Chrome
2. Right-click on the element you want
3. Click "Inspect"
4. Look at the HTML for that element
5. Find any data-testid, id, or class attributes
6. Send me what you find
```

**Example finding:**
```html
<!-- What you might see in DevTools -->
<button 
  class="chakra-button css-1abc123" 
  data-testid="swap-button"
>
  Swap
</button>

<!-- The selector would be: -->
<!-- data-testid="swap-button" ✅ (best) -->
<!-- .chakra-button (less reliable) -->
<!-- button:has-text('Swap') (works but fragile) -->
```

---

## Template for Adding New Flows

```yaml
# Copy this template for new features

flow: [flow_name]
description: "[What this flow does]"
url: [starting_url]

human_instructions: |
  [Step-by-step instructions a human would follow]
  1. First, do this...
  2. Then, do that...
  3. Finally, verify this...

steps:
  - name: "[Step name]"
    action: [click|type|goto|wait]
    human: "[Human-readable instruction]"
    selector: "[CSS selector or data-testid]"
    value: "[For type actions, what to type]"
    wait_for: "[What to wait for after action]"
    optional: [true|false]
```

---

---

## Source Code Analysis (from github.com/shapeshift/web)

### Key Findings

**No `data-testid` attributes** — The codebase uses Chakra UI components without test IDs. We'll use text-based and positional selectors.

### Component Structure (from actual code)

```
Trade Page Components:
├── SharedTradeInputBody
│   ├── SellAssetInput ("Pay With" section)
│   │   ├── TradeAssetSelect → asset dropdown
│   │   ├── AssetChainDropdown → chain dropdown
│   │   └── Amount input
│   │
│   ├── FormDivider (swap direction arrow)
│   │
│   └── BuyAssetInput ("You Get" section)
│       ├── TradeAssetSelect → asset dropdown
│       └── AssetChainDropdown → chain dropdown
│
└── TradeAssetSearch (modal when clicking asset)
    ├── Search input (placeholder: "Search name or address")
    ├── Chain filter (AllChainMenu)
    ├── Quick access asset buttons
    └── Virtualized asset list
```

### Reliable Selectors (from code analysis)

```yaml
# Based on actual Chakra UI structure and text labels

selectors:
  # Source section ("Pay With")
  source_section:
    label: "text='Pay With'"
    asset_button: "button:near(:text('Pay With')):has-text(/ETH|BTC|USDC/)"
    chain_button: "button:near(:text('Pay With')):has-text(/Ethereum|Bitcoin|Starknet/)"
    amount_input: "input:near(:text('Pay With'))"
  
  # Destination section ("You Get")  
  dest_section:
    label: "text='You Get'"
    asset_button: "button:near(:text('You Get')):has-text(/ETH|BTC|USDC/)"
    chain_button: "button:near(:text('You Get')):has-text(/Ethereum|Bitcoin|Starknet/)"
  
  # Asset search modal (when asset button clicked)
  asset_search:
    search_input: "input[placeholder*='Search']"
    chain_filter: "button:has-text('All'):near(input[placeholder*='Search'])"
    asset_row: "div:has-text('{{token}}'):visible"
  
  # Chain dropdown (when chain button clicked)
  chain_dropdown:
    chain_option: "div[role='menuitemradio']:has-text('{{chain}}')"
  
  # Action button
  action_button: "button:has-text('Connect Wallet'), button:has-text('Swap')"
  
  # Swap direction
  swap_arrow: "button:near(:text('Pay With')):near(:text('You Get'))"
```

### How Elements Are Identified

| Element | Code Component | Selector Strategy |
|---------|---------------|-------------------|
| Source Asset | `TradeAssetSelect` | Button showing current asset symbol near "Pay With" |
| Source Chain | `AssetChainDropdown` | Button showing chain name near "Pay With" |
| Dest Asset | `TradeAssetSelect` | Button showing current asset symbol near "You Get" |
| Dest Chain | `AssetChainDropdown` | Button showing chain name near "You Get" |
| Search | `TradeAssetSearch` | Input with "Search name or address" placeholder |
| Asset List | `Virtuoso` | Virtualized list of asset rows |
| Chain Menu | `AllChainMenu` | Button with "All" or chain name |

### Code References

**Chain Selection** (`AssetChainDropdown.tsx`):
```typescript
<Menu isLazy>
  <MenuButton as={Button} isDisabled={isButtonDisabled}>
    <AssetChainRow assetId={assetId} />
  </MenuButton>
  <MenuList>
    <MenuOptionGroup type='radio' value={assetId} onChange={handleChangeAsset}>
      {renderedChains}  // MenuItemOption for each chain
    </MenuOptionGroup>
  </MenuList>
</Menu>
```

**Asset Search** (`TradeAssetSearch.tsx`):
```typescript
<InputGroup>
  <InputLeftElement><SearchIcon /></InputLeftElement>
  <Input 
    placeholder={translate('common.searchNameOrAddress')}
    value={searchString}
    onChange={handleSearchChange}
  />
</InputGroup>
```

---

## Recommended Approach for Automation

Since there are no `data-testid` attributes, use this hierarchy:

1. **Primary:** Text content (most stable)
   - `button:has-text('Starknet')`
   - `text='Pay With'`

2. **Secondary:** Positional (`:near()`)
   - `button:near(:text('You Get'))`

3. **Tertiary:** ARIA roles
   - `div[role='menuitemradio']`
   - `input[role='searchbox']`

### Adding Test IDs (Recommended)

For production-quality automation, consider adding `data-testid` to the ShapeShift codebase:

```tsx
// In TradeAssetSelect
<Button data-testid="asset-selector-sell" onClick={handleClick}>
  {assetSymbol}
</Button>

// In AssetChainDropdown  
<MenuButton data-testid="chain-selector-buy" as={Button}>
  {chainName}
</MenuButton>
```

---

*This map is the bridge between "what a human does" and "what the AI automates."*
