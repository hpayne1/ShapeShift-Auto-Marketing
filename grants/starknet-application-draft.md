# Starknet Grant Application Draft
## ShapeShift - $150,000 Request

---

## 📋 General Project Information

**Project name:** ShapeShift

**One liner:**
> ShapeShift DAO is a community-owned, self-custodial, multichain DeFi platform that addresses fragmented onchain liquidity by aggregating the best swap and yield routes (including on Starknet) into a single, non-custodial user experience.

**Project category:** DeFi, Infrastructure, Wallet, AI

**Website URLs:**
- app.shapeshift.com (Wallet + DeFi + Swapper)
- agent.shapeshift.com (AI)
- api.shapeshift.com/docs (Infrastructure)
- shapeshift.com (Info pages, blogs)

**Project GitHub:** https://github.com/shapeshift/web

**Project social URLs:**
- https://x.com/ShapeShift
- https://discord.gg/shapeshift

---

## 📍 Team & Location

**Country:** Australia / United States  
*(Various LLCs throughout the world. Foundation is based in Liechtenstein)*

**City:** Los Angeles

**Team:**
- https://github.com/twblack88
- https://github.com/0xApotheosis

---

## 🔎 Project Details

**Project overview:**
App.shapeshift.com is a DEX aggregator that enables users to swap, bridge, and earn yield across 26+ chains through a single interface. We aggregate 14+ swap sources to find optimal routes, including cross-chain swaps.

**Current phase:** Live/Production

**Traction:**
- $30-70K/month in revenue
- 25% split to FOX stakers, 5% burn
- Cumulative volume: $2.5 Billion traded since 2023

---

## ⚙️ Technical Information

**Integrated chains (26):**
Ethereum, Avalanche, Optimism, BNB Smart Chain, Polygon, Gnosis, Arbitrum, Arbitrum Nova, Base, Monad, HyperEVM, Plasma, Bitcoin, Bitcoin Cash, Dogecoin, Litecoin, Zcash, Cosmos, THORChain, MAYAChain, Solana, Tron, SUI, NEAR, Starknet

**Swappers (14):**
THORChain, MAYAChain, CoW Swap, 0x, Arbitrum Bridge, Portals, Chainflip, Jupiter, Relay, ButterSwap, Bebop, NEAR Intents, Cetus, Sun.io

**Project live:** Yes

**Starknet Testnet or Mainnet:** Yes - Mainnet

**Tools, infrastructure & frameworks:**
We are integrating Starknet via standard RPC endpoints and wallet connection protocols. Our architecture is chain-agnostic—we wrap chain-specific logic in adapters that conform to our unified interface. For Starknet, this includes account abstraction handling, STRK fee estimation, and integration with Starknet-native swap protocols.

**Starknet specifics:**
Integration of another chain + Starknet DeFi and swappers. We're adding Starknet as a first-class chain alongside our existing 25 chains.

**Starknet language:**
No Cairo experience yet. We're new to the ecosystem but are integrating via standard interfaces rather than deploying custom contracts.

**Starknet contributions:**
- Product lead was a delegate who voted on the Starknet MIP at MakerDAO
- ShapeShift is a completely open source project (MIT license)

**Proposed solution:**
ShapeShift provides another venue for users to get to-and-from Starknet and manage their multichain assets. With ShapeShift's pioneering native BTC access (via THORChain, MAYAChain, Chainflip), we see synergistic potential with Starknet's BTCfi focus. Users can swap native BTC → Starknet assets in a single transaction, opening Starknet DeFi to Bitcoin holders without bridges or wrapped assets.

---

## ♟️ Strategy & Execution

**Project KPIs:**
We evaluate growth across acquisition, activation, conversion, retention, and volume using:
- DAUs/MAUs and unique visitors (top-of-funnel reach)
- Wallet connect rate and connect→swap conversion (activation)
- Transactors, swap count, repeat transactors (engagement/retention)
- Trading/DeFi volume, protocol revenue, volume per user (throughput)
- Funnel drop-off, time-to-first-swap, error rates (product health)

We maintain dashboards segmented by chain, asset, route/source, device, and entry point.

**User acquisition strategy:**
Product-led, co-marketed launch supported by creator education, partner distribution, and conversion-focused community programming:
- Co-market with Starknet team around "Starknet on ShapeShift" rollout
- Sponsor creators to publish Starknet walkthrough content
- Drive adoption through referral program and ecosystem partnerships
- Amplify through office hours, AMAs, and targeted press
- Measure via Starknet-specific funnel analytics (visitor→connect→swap)

---

## 🗂️ Business & Financials

**Business model:**
- 55 BPS fee on swaps and bridges
- Integrating yield.xyz with performance fees on DeFi yields
- Example: BTCfi staking via ShapeShift includes a clearly displayed fee baked into the return

**Project cost components:**
Salaries and infrastructure. We've spent Q4 2025 reducing infra and staffing costs by 46% while continuing to add chains and features.

**Security and audits:**
Onchain revenue sharing contract & CLI tooling (rFOX) received audit on 6/3/2024.

---

## ✏️ Project Plan & Milestones

### M1: App, Wallet, and Swapper Integration — $25,000

**Description:**
Full Starknet chain support in app.shapeshift.com:
- Account derivation and STRK account deployment
- Assets available on network (display, balances, market data)
- Swap from any chain to STRK (cross-chain)
- Swap any↔any Starknet assets (same-chain)
- Send STRK and Starknet assets
- Transaction parsing and history
- Fee estimation and balance updates

**Status:** In progress  
**Date of completion:** Imminent (Q1 2026)

---

### M2: Agent.ShapeShift Chain + Swapper + DeFi Integration — $25,000

**Description:**
Starknet support in agent.shapeshift.com (AI interface):
- Connect Starknet wallets
- Interact with Starknet assets via natural language ("What's my STRK balance?")
- Execute Starknet swaps via natural language ("Swap 100 USDC to STRK")
- Interact with Starknet DeFi via natural language ("Stake my STRK on Vesu")
- Cross-chain operations ("Swap my ETH on Mainnet to STRK on Starknet")

**Date of completion:** Q1 2026 (2-4 weeks after M1)

---

### M3: API Chain + Quote Support — $25,000

**Description:**
Starknet swap quotes available via ShapeShift API (api.shapeshift.com):
- Same-chain Starknet quotes
- Cross-chain quotes (any chain → Starknet, Starknet → any chain)
- Standardized quote response format matching existing API
- Documentation and integration guides
- Enables third-party apps to offer Starknet swaps via ShapeShift

**Date of completion:** Q2 2026

---

### M4: GTM for App + Wallet — $25,000

**Description:**
6-month go-to-market campaign for Starknet support in app.shapeshift.com:

**Budget allocation:**
- $9,000 — Human oversight (campaign execution, QA, reporting @ $1,500/mo)
- $15,000 — Paid amplification (X ads, sponsored content, influencer partnerships)
- $1,000 — Tooling and creative assets

**Deliverables:**
- 50+ content pieces (X posts, Discord announcements, blog posts, tutorials)
- Launch announcement campaign (co-marketed with Starknet)
- Tutorial content: "How to swap to Starknet via ShapeShift"
- Ongoing feature announcements as M1 ships
- UTM-tracked links for attribution
- Weekly performance reports
- Monthly summary reports to Starknet Foundation

**KPIs:**
- Starknet-specific visitors and wallet connects
- Connect→swap conversion rate
- Starknet trading volume via ShapeShift
- First-time and repeat Starknet transactors

**Date of completion:** 6 months post-M1 completion

---

### M5: GTM for Agent — $25,000

**Description:**
6-month go-to-market campaign positioning Starknet as a premiere use case for agent.shapeshift.com:

**Budget allocation:**
- $9,000 — Human oversight (campaign execution, QA, reporting @ $1,500/mo)
- $15,000 — Paid amplification (X ads, AI/crypto influencers, sponsored content)
- $1,000 — Tooling and creative assets

**Deliverables:**
- 50+ content pieces focused on AI + Starknet narrative
- Launch campaign: "Your AI agent now speaks Starknet"
- Demo videos showing natural language Starknet interactions
- Tutorial threads: "How to DeFi on Starknet using plain English"
- Creator partnerships (AI/crypto intersection influencers)
- Integration with Starknet ecosystem projects (Vesu, etc.)
- Weekly performance reports

**Narrative angle:**
Starknet's account abstraction + ShapeShift's AI agent = the most accessible way to interact with L2 DeFi. No wallet UX friction, just conversation.

**KPIs:**
- Agent sessions involving Starknet actions
- Starknet transactions initiated via agent
- Content engagement and reach
- Creator/influencer amplification metrics

**Date of completion:** 6 months post-M2 completion

---

### M6: BTCfi Multi-Hop — $25,000

**Description:**
Advanced multi-hop routing enabling seamless BTC → Starknet DeFi access:
- Native BTC → STRK swaps (via THORChain/Chainflip → Starknet bridge)
- BTC → Starknet DeFi positions in single transaction flow
- Integration with Starknet BTCfi protocols (pending ecosystem alignment)
- Leverages ShapeShift's unique native BTC access

**Why this matters:**
ShapeShift is one of the few platforms offering true native BTC swaps (not wrapped). Combined with Starknet's BTCfi focus, this creates a unique value proposition: Bitcoin holders can access Starknet yields without touching bridges or wrapped assets.

**Date of completion:** Q2-Q3 2026 (dependent on ecosystem coordination)

---

## 💰 Total Funding Request: $150,000

| Milestone | Amount | Timeline |
|-----------|--------|----------|
| M1: App/Wallet Integration | $25,000 | Q1 2026 |
| M2: Agent Integration | $25,000 | Q1 2026 |
| M3: API Support | $25,000 | Q2 2026 |
| M4: GTM App/Wallet | $25,000 | 6 months |
| M5: GTM Agent | $25,000 | 6 months |
| M6: BTCfi Multi-Hop | $25,000 | Q2-Q3 2026 |

---

## 📄 Past Work & Grants

**Track record (Mixpanel data):**

*app.shapeshift.com:*
- MAUs (onchain action): 700
- Active Visitors: 2,500

*api.shapeshift.com:*
- Soft-launched beta Jan 1, 2026 (gathering usage data)

*agent.shapeshift.com:*
- In beta testing

**Starknet Foundation Seed Grant:** No (first application)

**Other grants received:**
- zCash Community Development Grant
- Optimism Cycle 10-11 Growth

---

## 🐺 Collaboration & Support

**Starknet collaborations:**
- **Vesu:** High-caliber team aligned with our BTCfi focus. Great opportunity for users to earn yield on assets via ShapeShift.
- **Wallet integrations:** ShapeShift API could enhance cross-chain swapping for Ready Wallet, Keplr Wallet, xVerse.

**Extra support requested:**

*Co-marketing:*
- Backlinks from starknet.io
- Blog features
- Connections to Starknet KOLs/builders for X Spaces
- Updates on new Starknet developments

*API/Integration:*
- Connections to Starknet-native swap teams
- Developer page listing on starknet.io

*Ecosystem:*
- Connections to Starknet wallets, swappers, DeFi protocols
- Feedback from builders and users

*Visibility:*
- Ecosystem page listing for app.shapeshift.com / agent.shapeshift.com

---

## ✏️ Other Details

**Source license:** Open Source MIT license

**How did you hear about this program:** Starknet Website

**Referral:** N/A

**Compliance:** Product @ SS email. Tim will fill out for KYB as feedback loops.

---

## Notes for Application

**Strengths to emphasize:**
1. Live product with $2.5B cumulative volume
2. 26 chains already integrated (Starknet = 27th)
3. Unique native BTC access (synergy with BTCfi)
4. Open source, DAO-governed
5. Clear revenue model (55 BPS)
6. Previous grant track record (Optimism, zCash)

**Potential concerns to address:**
- MAUs are modest (700) — but quality over quantity, these are actual transactors
- New to Starknet ecosystem — but proven track record integrating chains
- No Cairo experience — but integrating via standard interfaces, not deploying contracts

**GTM differentiation:**
The marketing milestones (M4/M5) aren't typical agency work. We're using an AI-assisted content system that generates more output at lower cost, with full UTM tracking and transparent reporting.
