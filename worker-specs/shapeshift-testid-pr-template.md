# PR Template: Add data-testid Attributes for Automation

## Overview

This PR adds `data-testid` attributes to key UI components to enable automated testing and walkthrough generation.

**Why:** The auto-marketing system needs reliable selectors to record product walkthroughs when new features ship. Text-based selectors are fragile; `data-testid` attributes are the industry standard for automation.

**Impact:** Zero user-facing changes. Only adds HTML attributes.

---

## Files Changed

### 1. `src/components/AssetSelection/components/AssetChainDropdown/AssetChainDropdown.tsx`

```diff
  return (
    <Menu isLazy>
      <Tooltip isDisabled={isTooltipExplainerDisabled} label={buttonTooltipText}>
-       <MenuButton as={Button} isDisabled={isButtonDisabled} {...buttonProps}>
+       <MenuButton 
+         as={Button} 
+         isDisabled={isButtonDisabled} 
+         data-testid={`chain-selector-${position}`}
+         {...buttonProps}
+       >
          <AssetChainRow
            assetId={assetId}
            mainImplementationAssetId={assetId}
            hideBalances
            hideSymbol
            flexProps={flexProps}
          />
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList zIndex={modalChildZIndex} overflowY='auto' maxHeight='300px'>
          <MenuOptionGroup type='radio' value={assetId} onChange={handleChangeAsset}>
-           {renderedChains}
+           {filteredRelatedAssetIds.map(relatedAssetId => {
+             const { chainId } = fromAssetId(relatedAssetId)
+             return (
+               <MenuItemOption 
+                 value={relatedAssetId} 
+                 key={relatedAssetId}
+                 data-testid={`chain-option-${chainId}`}
+                 isDisabled={isAssetChainIdDisabled(relatedAssetId)}
+               >
+                 {/* ... existing content ... */}
+               </MenuItemOption>
+             )
+           })}
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  )
```

### 2. `src/components/MultiHopTrade/components/SharedTradeInput/SharedTradeInputBody.tsx`

```diff
  const sellTradeAssetSelect = useMemo(
    () => (
      <TradeAssetSelect
        assetId={sellAsset.assetId}
        onAssetClick={handleSellAssetClick}
        onAssetChange={setSellAsset}
        onlyConnectedChains={true}
        assetFilterPredicate={assetFilterPredicate}
        chainIdFilterPredicate={chainIdFilterPredicate}
        showChainDropdown={!isSmallerThanMd}
        buttonProps={assetSelectButtonProps}
        mb={isSmallerThanMd ? 0 : 4}
+       data-testid="asset-selector-sell"
+       chainSelectorTestId="chain-selector-sell"
      />
    ),
    [/* deps */],
  )
```

### 3. `src/components/TradeAssetSearch/TradeAssetSearch.tsx`

```diff
  <InputGroup>
    <InputLeftElement pointerEvents='none' zIndex={1}>
      <SearchIcon color='gray.300' />
    </InputLeftElement>
-   <Input {...inputProps} />
+   <Input {...inputProps} data-testid="asset-search-input" />
  </InputGroup>
```

### 4. `src/components/AssetSelection/components/AssetMenuButton.tsx`

```diff
  return (
    <Button
      onClick={handleClick}
      isDisabled={isDisabled}
+     data-testid={`asset-option-${assetId}`}
      {...buttonProps}
    >
      {/* ... */}
    </Button>
  )
```

### 5. Trade Input Components

```diff
// In BuyAssetInput or equivalent
  <TradeAssetSelect
    assetId={buyAsset.assetId}
    onAssetClick={handleBuyAssetClick}
+   data-testid="asset-selector-buy"
+   chainSelectorTestId="chain-selector-buy"
  />
```

---

## Test ID Naming Convention

```
Pattern: {component}-{type}-{position}

Examples:
- asset-selector-sell      → Sell asset picker button
- asset-selector-buy       → Buy asset picker button
- chain-selector-sell      → Sell chain dropdown
- chain-selector-buy       → Buy chain dropdown
- chain-option-starknet    → Starknet option in chain menu
- asset-option-{assetId}   → Asset row in search results
- asset-search-input       → Search input field
- swap-direction-toggle    → Swap source/dest button
- trade-execute-button     → Main action button
```

---

## Complete Test ID Map

```yaml
# Trade Page Elements
trade-page:
  # Sell Section ("Pay With")
  sell:
    asset-selector: "asset-selector-sell"
    chain-selector: "chain-selector-sell"
    amount-input: "amount-input-sell"
    balance-display: "balance-display-sell"
    max-button: "max-button-sell"
  
  # Buy Section ("You Get")
  buy:
    asset-selector: "asset-selector-buy"
    chain-selector: "chain-selector-buy"
    amount-display: "amount-display-buy"
  
  # Controls
  swap-direction: "swap-direction-toggle"
  execute-button: "trade-execute-button"
  slippage-settings: "slippage-settings-button"
  
  # Route Info
  route-details: "route-details-toggle"
  route-steps: "route-steps-container"

# Asset Search Modal
asset-search:
  input: "asset-search-input"
  chain-filter: "chain-filter-dropdown"
  results-list: "asset-results-list"
  asset-row: "asset-option-{assetId}"
  loading-skeleton: "asset-search-loading"
  no-results: "asset-search-no-results"

# Chain Dropdown
chain-dropdown:
  option: "chain-option-{chainId}"
  # e.g., chain-option-eip155:1 (Ethereum)
  # e.g., chain-option-starknet:SN_MAIN (Starknet)
```

---

## Usage Example (Playwright)

```typescript
// With data-testid attributes:
await page.click('[data-testid="chain-selector-buy"]');
await page.click('[data-testid="chain-option-starknet:SN_MAIN"]');
await page.click('[data-testid="asset-selector-buy"]');
await page.fill('[data-testid="asset-search-input"]', 'STRK');
await page.click('[data-testid="asset-option-starknet:SN_MAIN/slip44:9004"]');

// vs. without (fragile):
await page.click('button:near(:text("You Get")):has-text("Bitcoin")');
await page.click('div[role="menuitemradio"]:has-text("Starknet")');
```

---

## Benefits

1. **Reliable automation** — Selectors won't break when text changes
2. **Faster test development** — Clear, predictable IDs
3. **Self-documenting** — Test IDs describe element purpose
4. **Industry standard** — Used by React Testing Library, Playwright, Cypress
5. **Zero runtime cost** — Just HTML attributes

---

## Checklist

- [ ] Added `data-testid` to sell asset selector
- [ ] Added `data-testid` to buy asset selector
- [ ] Added `data-testid` to sell chain selector
- [ ] Added `data-testid` to buy chain selector
- [ ] Added `data-testid` to search input
- [ ] Added `data-testid` to asset options in search
- [ ] Added `data-testid` to chain options in dropdown
- [ ] Added `data-testid` to swap direction button
- [ ] Added `data-testid` to execute button
- [ ] Updated TypeScript types to accept testid props
- [ ] Documented naming convention

---

## Related

- Auto-marketing walkthrough generator: Uses these IDs to record product demos
- E2E test suite: Can use these for regression testing
- Accessibility: `data-testid` doesn't affect a11y, but could add `aria-label` in same PR

---

*This PR enables automated walkthrough generation for marketing when new features ship.*
