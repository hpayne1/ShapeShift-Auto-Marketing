# SEO Article 1: rFOX

# Understanding the rFOX Program on ShapeShift: A Comprehensive Guide

In the rapidly evolving landscape of decentralized finance (DeFi), ShapeShift stands out as a beacon for self-sovereign finance. With its latest offering, the rFOX program, ShapeShift continues to empower individuals with the tools they need to participate in a decentralized financial ecosystem. This article covers the rFOX program, the staking process, and how rewards are distributed. 

## What is the rFOX Program?

The rFOX program is a staking initiative on ShapeShift that allows users to stake their FOX tokens and earn USDC rewards. Unlike traditional staking protocols that may offer volatile reward tokens, rFOX ensures that earnings are distributed in a stable currency, USDC, providing users with a predictable return. This program is designed to align with ShapeShift’s mission of fostering open, borderless finance where users maintain control over their assets.

### Key Features of the rFOX Program

- **Stake FOX, Earn USDC**: Participants can stake their FOX tokens and receive rewards in USDC, the stablecoin, ensuring a consistent value.
- **No Custody, No KYC**: True to ShapeShift’s principles, the rFOX program requires no custody of your assets and no Know Your Customer (KYC) processes. Your keys, your control.
- **Monthly Rewards**: Rewards are sent to your wallet on the **15th of each month** for the preceding month (or next business day if the 15th falls on a weekend or holiday).
- **Stake on Arbitrum**: FOX must be bridged to Arbitrum before staking (via the ShapeShift UI); mainnet FOX cannot be staked directly.
- **Transparency**: Accounting is published to IPFS and the forum each epoch; you can verify with the open source CLI in the [rFOX repo](https://github.com/shapeshift/rFOX).

[IMAGE: Diagram of the rFOX staking process]

## How to Stake FOX in the rFOX Program

Staking FOX tokens in the rFOX program is a straightforward process. Here’s a step-by-step guide to help you get started:

1. **Visit the ShapeShift Platform**: Navigate to [ShapeShift's FOX Ecosystem](https://app.shapeshift.com/#/fox-ecosystem) to access the rFOX staking interface.
   
2. **Bridge FOX to Arbitrum**: If your FOX is on mainnet, bridge it to Arbitrum in the ShapeShift UI—mainnet FOX cannot be staked directly.
   
3. **Connect Your Wallet**: Ensure a Web3-compatible wallet (e.g. MetaMask, WalletConnect) is connected.
   
4. **Stake Your FOX**: Select the amount to stake and confirm. When you unstake, you enter a **28-day cooldown** before you can claim your FOX back.

[IMAGE: Screenshot of the staking interface on ShapeShift]

## Understanding the Rewards System

The rFOX program rewards participants with USDC, sent directly to their wallets on the **15th of each month** for the preceding month. Rewards come from a share of the ShapeShift DAO's total revenue from **affiliate fees** each epoch. Distribution is handled off-chain by the DAO multisig (not part of the on-chain contract). The program does not promise specific APY or returns.

### How Rewards Are Calculated

Rewards are calculated from staked balances and reward units tracked in the contract; a multiplier translates to a USDC amount for off-chain distribution. At the end of each epoch, accounting is posted to IPFS and linked on the forum; users can verify with the open source CLI in the [rFOX repo](https://github.com/shapeshift/rFOX).

## Epoch and Cooldown Mechanics

The rFOX program operates with specific epoch and cooldown mechanics to manage staking and reward distribution effectively:

- **Epoch Duration**: The program operates on a monthly epoch basis, meaning rewards are calculated and distributed every month. This regular cycle ensures participants receive their earnings promptly.
  
- **Cooldown Period**: When you unstake, you immediately stop earning rewards and enter a **28-day cooldown** (configurable by the DAO) before you can claim your FOX back. Multiple concurrent unstakes are supported.

[IMAGE: Timeline of epoch and cooldown periods]

## Benefits of Participating in the rFOX Program

Participating in the rFOX program offers several advantages:

- **Predictable Earnings**: By earning rewards in USDC, participants avoid the volatility associated with other reward tokens, ensuring stable and predictable earnings.
- **Self-Custody**: Maintain control over your assets without the need for third-party custody, aligning with ShapeShift’s vision of self-sovereign finance.
- **No Barriers**: With no KYC requirements, the program is accessible to anyone, anywhere, reinforcing the open and borderless nature of DeFi.

## Conclusion

The rFOX program on ShapeShift is a compelling opportunity for individuals looking to participate in the DeFi space while maintaining control over their assets. By staking FOX tokens, users can earn stable USDC rewards, benefiting from a transparent and decentralized system. As ShapeShift continues to innovate and expand its offerings, the rFOX program represents a significant step towards a self-custodial future of sovereign finance.

For those ready to take control and earn rewards, visit the [ShapeShift FOX Ecosystem](https://app.shapeshift.com/#/fox-ecosystem) to start staking today.

_Disclaimer: Rewards distribution is off-chain; do not promise APY._