# GTM Gap Resolution — ShapeShift Repo Prompts

**Purpose:** After the discovery questionnaire is filled and the gap analysis is complete, use these prompts against your locally indexed ShapeShift repo to resolve gaps that only the codebase/product can answer.

**When to use:** Open a chat with the ShapeShift repo indexed (e.g. shapeshift/web or your product repo). Paste the relevant prompt(s) below.

---

## Step 1: Protocol Roster by Chain

**Gap:** Discovery answers have protocol counts for some chains but no protocol names (BSC, Avalanche, Gnosis, Cosmos, Sui, Monad, Tron, Hyperevm, NEAR, Plasma, Katana).

**Prompt to ask ShapeShift repo:**

```
For the yields/earn feature, which protocols are configured per chain? I need the protocol names for each of these chains:

- BSC (BNB Chain)
- Avalanche
- Gnosis
- Cosmos
- Sui
- Monad
- Tron
- Hyperevm
- NEAR
- Plasma
- Katana

Please list: chain → protocol(s), similar to what exists for Ethereum/Arbitrum (Lido, Aave, Morpho) and Solana (Kamino). Look in yield config, adapter config, or wherever yield opportunities are defined per chain.
```

---

## Step 2: Supported Chains and Networks

**Gap:** Confirm the canonical list of chains/networks supported by yields at launch.

**Prompt to ask ShapeShift repo:**

```
What chains or networks does the yields/earn feature support? Give me the full list of chain IDs or names that have yield opportunities enabled. I need this for GTM messaging (e.g. "X chains" and listing them).
```

---

## Step 3: Yield Types and Feature Flags

**Gap:** Verify which yield types (staking, native-staking, liquid-staking, restaking, vault, lending) are actually enabled.

**Prompt to ask ShapeShift repo:**

```
Which yield types are supported in the yields feature? The options are: staking, native-staking, pooled-staking, liquid-staking, restaking, vault, lending. For each type, which chains or protocols enable it? Where is this configured (feature flags, adapter registry, etc.)?
```

---

## Step 4: CTA and Routing

**Gap:** Confirm the correct CTA path for yields (e.g. `#/yields` vs `#/earn`).

**Prompt to ask ShapeShift repo:**

```
What is the correct route or path for the yields/earn experience in the app? Is it #/yields, #/earn, or something else? Where is this route defined?
```

---

## Step 5: Differentiation and Product Claims

**Gap:** Validate the differentiation statement ("More breadth of support, native asset staking for many networks coming online").

**Prompt to ask ShapeShift repo:**

```
For the yields feature, what networks support native asset staking (vs only DeFi/lending)? Which chains have native staking enabled in the yields UI or adapters? I need to verify a GTM claim: "native asset staking for many networks coming online at ShapeShift."
```

---

## Consolidated Prompt (All-in-One)

If you prefer one prompt that covers multiple gaps:

```
I'm building a GTM packet for the ShapeShift yields feature. I need product-level answers from the codebase:

1. **Protocol roster by chain:** For BSC, Avalanche, Gnosis, Cosmos, Sui, Monad, Tron, Hyperevm, NEAR, Plasma, and Katana — which protocols are configured for yields on each chain? (Ethereum/Arbitrum/Base have Lido, Aave, Morpho; Solana has Kamino.)

2. **Full chain list:** What is the complete list of chains/networks that support yields at launch?

3. **Yield types:** Which yield types (staking, native-staking, liquid-staking, restaking, vault, lending) are enabled, and where?

4. **CTA route:** What is the correct app route for yields — #/yields, #/earn, or other?

5. **Native staking:** Which chains have native asset staking (vs DeFi-only) enabled?

Please cite file paths or config locations where you find each answer.
```

---

## Output Format for Repo Answers

When you get answers from the ShapeShift repo, add them to:
- [`discovery_answers_2026-02-19.md`](discovery_answers_2026-02-19.md) — update the protocol roster table
- [`gtm_gap_analysis.md`](gtm_gap_analysis.md) — mark resolved gaps

Then proceed to materials refresh (marketing_brief, partner_kit, drafts, press).
