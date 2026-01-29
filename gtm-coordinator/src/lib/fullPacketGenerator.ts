import { generateContent, generateJSON } from './openai.js';
import { fetchWebsiteContent } from './webFetch.js';

// ============================================================================
// SHAPESHIFT CONTEXT
// ============================================================================

const SHAPESHIFT_BRAND_CONTEXT = `
## ShapeShift Brand Context

**Vision:** A self-custodial future of sovereign finance that is open, borderless, and in your hands.

**Mission:** ShapeShift is a global community of high-quality builders accelerating access to a decentralized, self-sovereign financial system. With no custody, open code, and modular DeFi tools, we empower individuals to connect directly with the open protocols shaping the future.

**Brand Voice:**
- Speak in 3rd person omniscient (authoritative and trusted)
- Principled: Self-custody is king, privacy is a human right, open source transparency, no KYC, decentralization & free markets
- Empowering: Show users the value clearly, let users visualize themselves in control
- Community-minded: Highlight user journeys, spotlight contributors and partners
- Visionary: Post about macro trends, crosschain flows, and ecosystem shifts

**STRICT STYLE RULES (MUST FOLLOW):**
- NO hashtags. Ever. They look desperate and spammy.
- NO emojis EXCEPT the fox emoji (🦊) used sparingly - max 1-2 per entire thread, typically at the end only
- NO generic marketing phrases. BANNED WORDS/PHRASES:
  - "game-changer", "revolutionary", "unlock possibilities"
  - "empower your journey", "seamlessly", "excited to announce"
  - "thrilled to partner", "innovative solution", "cutting-edge"
  - "unlock the future", "next-level", "supercharge"
- Questions in hooks perform 2x better than statements - use them
- Be specific with numbers and data when available
- Short sentences. Punchy. Direct. No fluff.
- Never say "swap" for non-swap protocols (use correct terminology: stake, earn, bridge, lend)

**TONE EXAMPLES (Good - Write Like This):**
- "Yield.xyz is live on ShapeShift. Stake without giving up custody."
- "What if you could earn yield without handing over your keys?"
- "No KYC. No custody. Just yield."
- "10,000+ assets. One interface. Your keys."

**TONE EXAMPLES (Bad - NEVER Write Like This):**
- "We're thrilled to announce our exciting partnership! 🚀🎉💰"
- "Unlock the future of DeFi with our game-changing integration!"
- "Join the revolution! #DeFi #Crypto #Yield"
- "This innovative solution will empower your DeFi journey!"
`;

// Protocol type context for terminology
interface ProtocolContext {
  category: 'yield' | 'staking' | 'swap' | 'bridge' | 'lending' | 'dex' | 'other';
  primaryAction: string;  // "stake", "swap", "bridge", "lend", "earn"
  userBenefit: string;    // "earn yield", "trade assets", "move cross-chain"
  actionVerb: string;     // verb to use in content
}

function getProtocolContext(category: string): ProtocolContext {
  const cat = category.toLowerCase();
  
  if (cat.includes('yield') || cat.includes('staking') || cat.includes('stake')) {
    return {
      category: 'yield',
      primaryAction: 'stake',
      userBenefit: 'earn yield',
      actionVerb: 'stake'
    };
  }
  if (cat.includes('bridge') || cat.includes('cross-chain')) {
    return {
      category: 'bridge',
      primaryAction: 'bridge',
      userBenefit: 'move assets cross-chain',
      actionVerb: 'bridge'
    };
  }
  if (cat.includes('lend') || cat.includes('borrow')) {
    return {
      category: 'lending',
      primaryAction: 'lend',
      userBenefit: 'lend or borrow',
      actionVerb: 'lend'
    };
  }
  if (cat.includes('dex') || cat.includes('swap') || cat.includes('exchange') || cat.includes('trade')) {
    return {
      category: 'swap',
      primaryAction: 'swap',
      userBenefit: 'trade assets',
      actionVerb: 'swap'
    };
  }
  
  return {
    category: 'other',
    primaryAction: 'use',
    userBenefit: 'access DeFi',
    actionVerb: 'use'
  };
}

const CUSTOMER_PROFILE = `
## ShapeShift Customer Profile

### Primary Segments

1. **DeFi Power Users** - Experienced crypto users managing portfolios across multiple protocols
   - Uses 3+ DeFi protocols regularly
   - Values gas optimization and efficiency
   - Messaging: "Your keys, your crypto", "Best rates, no middleman"

2. **Yield Seekers** - Users focused on earning yield
   - Actively moves funds for best APY
   - Messaging: "Real yield, real returns", "Stake without giving up custody"

3. **Cross-Chain Traders** - Users moving assets between chains
   - Uses bridges regularly
   - Messaging: "Any chain, any asset", "Bridge without the headache"

4. **Privacy-Conscious Users** - Users prioritizing financial sovereignty
   - Avoids KYC platforms
   - Messaging: "No KYC. No custody. No compromise."
`;

// ============================================================================
// INTERFACES
// ============================================================================

interface ProtocolAnalysis {
  name: string;
  tagline: string;
  category: string;
  keyFeatures: string[];
  targetAudience: string[];
  valueProposition: string;
  technicalHighlights: string[];
  integrationOpportunities: string[];
  risks: string[];
  competitorComparison: string;
}

interface MarketingBrief {
  targetAudience: {
    who: string;
    whatWeKnow: string;
    psychographics: string;
  };
  problemSolved: {
    problem: string;
    ahaMonent: string;
    beforeAfter: string;
  };
  gtmOneSentence: string;
  businessOutcomes: {
    outcomes: string[];
    metrics: string[];
  };
  wildSuccess: {
    vision: string;
    indicators: string[];
  };
  uniqueVsCompetitors: {
    differentiators: string[];
    positioningStatement: string;
  };
  keyMessages: {
    primary: string;
    supporting: string[];
    tweetReady: string;
  };
}

interface DMTarget {
  handle: string;
  reason: string;
  openerAngle: string;
  suggestedDM: string;
}

interface WildCardIdea {
  title: string;
  description: string;
  estimatedBudget: string;
  timeToExecute: string;
  targetSegment: string;
  howToExecute: string;
}

export interface FullPacketResults {
  protocol: ProtocolAnalysis;
  marketingBrief: MarketingBrief;
  marketingBriefMarkdown: string;  // Human-readable markdown version
  content: {
    // From @ShapeShift main
    xPostMain: string;
    infoBotQT: string;
    discordPost: string;
    farcasterPost: string;
    followupEducational: string;
    followupMetrics: string;
    followupRecap: string;
    // From personal account
    xPostPersonal: string;
    personalWalkthrough: string;
    // Blog
    blogDraft: string;
    // Supporting
    userGuide: string;
    releaseNotes: string;
  };
  partnerKit: string;
  pressRelease: string;
  prBrief: string;
  opEdPolitical: string;
  opEdTechnical: string;
  dmTargets: DMTarget[];
  wildCards: WildCardIdea[];
  designBrief: string;
  aiPrompts: string;
  checklist: string;
  indexHtml: string;
}

// ============================================================================
// GENERATORS
// ============================================================================

async function analyzeProtocol(protocolName: string, websiteContent: string): Promise<ProtocolAnalysis> {
  const systemPrompt = `You are a DeFi protocol analyst. Analyze the provided website content and extract key information.`;

  const userPrompt = `
Analyze this DeFi protocol and provide a structured analysis:

Protocol Name: ${protocolName}

Website Content:
${websiteContent}

Provide analysis as JSON with these fields:
- name: Official protocol name
- tagline: One-line description
- category: Protocol category (DEX, Lending, Yield, Bridge, etc.)
- keyFeatures: Array of 3-5 key features
- targetAudience: Array of target user types
- valueProposition: Core value proposition
- technicalHighlights: Array of notable technical aspects
- integrationOpportunities: Array of integration opportunities for ShapeShift
- risks: Array of potential risks
- competitorComparison: Brief comparison to similar protocols
`;

  return generateJSON<ProtocolAnalysis>(systemPrompt, userPrompt, { temperature: 0.3 });
}

async function generateMarketingBrief(protocolName: string, analysis: ProtocolAnalysis): Promise<MarketingBrief> {
  const systemPrompt = `You are a marketing strategist creating a GTM brief for ShapeShift DAO.
${SHAPESHIFT_BRAND_CONTEXT}
${CUSTOMER_PROFILE}`;

  const userPrompt = `
Create a Marketing Brief for ShapeShift's integration with ${protocolName}.

Protocol Analysis:
${JSON.stringify(analysis, null, 2)}

Answer these questions in PLAIN LANGUAGE (no marketing jargon):

1. **Who are we speaking to?** Be specific about the audience segments.
2. **What problem are we solving?** What's the "aha" moment?
3. **GTM idea in one sentence** - Explain like you're talking to a smart 10-year-old.
4. **Business outcomes** - What changes? How will we measure?
5. **Wild success** - Best-case scenario.
6. **Unique vs competitors** - Why choose ShapeShift?
7. **Key messages** - Include a ready-to-post tweet.

Respond in JSON matching this structure:
{
  "targetAudience": { "who": "", "whatWeKnow": "", "psychographics": "" },
  "problemSolved": { "problem": "", "ahaMonent": "", "beforeAfter": "" },
  "gtmOneSentence": "",
  "businessOutcomes": { "outcomes": [], "metrics": [] },
  "wildSuccess": { "vision": "", "indicators": [] },
  "uniqueVsCompetitors": { "differentiators": [], "positioningStatement": "" },
  "keyMessages": { "primary": "", "supporting": [], "tweetReady": "" }
}
`;

  return generateJSON<MarketingBrief>(systemPrompt, userPrompt, { temperature: 0.5 });
}

async function generateMainTwitterThread(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  
  const systemPrompt = `You are writing for @ShapeShift's main Twitter account.
${SHAPESHIFT_BRAND_CONTEXT}

CRITICAL - You MUST follow these rules:
- NO hashtags at all
- NO emojis except 🦊 (max 1, only in final tweet if at all)
- NO banned phrases (game-changer, unlock possibilities, thrilled, excited, revolutionary, seamlessly)
- Use question hooks - they get 2x engagement
- Short, punchy sentences
- This is a ${protocolContext.category} protocol - use "${protocolContext.actionVerb}" not "swap"`;

  const userPrompt = `
Create a Twitter thread from @ShapeShift announcing the ${protocolName} integration.

PROTOCOL TYPE: ${protocolContext.category} (primary action: ${protocolContext.primaryAction})
Key Message: ${brief.keyMessages.primary}
Value Prop: ${analysis.valueProposition}
Target: ${brief.targetAudience.who}

STRICT RULES:
- NO hashtags
- NO emojis except 🦊 (max 1, only in tweet 5)
- NO: "thrilled", "excited", "game-changer", "unlock", "revolutionary", "seamlessly"
- Use "${protocolContext.actionVerb}" not "swap" (this is a ${protocolContext.category} protocol)
- Start Tweet 1 with a QUESTION (2x better engagement)
- Each tweet under 280 characters
- Short sentences. Punchy.

Generate a 4-5 tweet thread:
1. Question hook about the user benefit
2. What users can now do (specific)
3. Why it matters (self-custody angle)
4. How to try it (direct CTA)
5. Tag @${protocolName.replace(/\s+/g, '').replace('.', '_')}, optional 🦊

Format as:
**Tweet 1:**
[content]

**Tweet 2:**
[content]
...
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7 });
}

async function generatePersonalTwitterPost(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  
  const systemPrompt = `You are an engineer at ShapeShift writing a personal tweet to QT the main announcement.
Be authentic, add personal context about building it.

RULES:
- NO hashtags
- NO emojis (this is personal/authentic, not corporate)
- NO: "thrilled", "excited", "game-changer", "revolutionary"
- Sound like a real person, not marketing
- First person voice`;

  const userPrompt = `
Write a personal tweet for an engineer to QT @ShapeShift's ${protocolName} announcement.

What was built: ${analysis.valueProposition}
Protocol type: ${protocolContext.category}
Key features: ${analysis.keyFeatures.join(', ')}

RULES:
- NO hashtags
- NO emojis
- NO corporate speak
- Sound authentic and real
- First person ("I", "we")
- Under 280 characters

The tweet should:
- Sound like a real engineer talking
- Add context about the build (something technical but accessible)
- Be genuine, not salesy

Format: Just the tweet text
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.8 });
}

async function generateInfoBotQT(protocolName: string, protocolContext: ProtocolContext): Promise<string> {
  // Adapt content based on protocol type
  if (protocolContext.category === 'yield' || protocolContext.category === 'staking') {
    return `**QT @ShapeShiftInfoBot showing a yield position:**

${protocolName} in action 🦊

[Screenshot of staking/yield interface with ${protocolName}]

Self-custody yield. Your keys, your rewards.

---
*Post this as a QT of @ShapeShiftInfoBot when showing a live staking position or yield earning. NO other emojis.*`;
  }
  
  if (protocolContext.category === 'bridge') {
    return `**QT @ShapeShiftInfoBot showing a bridge:**

${protocolName} in action 🦊

[Screenshot of bridge interface with ${protocolName}]

Cross-chain. Self-custody. No middleman.

---
*Post this as a QT of @ShapeShiftInfoBot when showing a live bridge. NO other emojis.*`;
  }
  
  if (protocolContext.category === 'lending') {
    return `**QT @ShapeShiftInfoBot showing a lending position:**

${protocolName} in action 🦊

[Screenshot of lending interface with ${protocolName}]

Lend and borrow. Keep your keys.

---
*Post this as a QT of @ShapeShiftInfoBot when showing a live lending position. NO other emojis.*`;
  }
  
  // Default for swaps/DEX
  return `**QT @ShapeShiftInfoBot showing a trade:**

${protocolName} in action 🦊

[Screenshot of trade interface with ${protocolName}]

Self-custody trading. No KYC.

---
*Post this as a QT of @ShapeShiftInfoBot when showing a live trade. NO other emojis.*`;
}

async function generateDiscordPost(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  
  const systemPrompt = `You are writing a Discord announcement for ShapeShift's community.
${SHAPESHIFT_BRAND_CONTEXT}

Discord allows slightly more casual tone but still professional.
NO hashtags. Only 🦊 emoji allowed (use once in headline).`;

  const userPrompt = `
Create a Discord #announcements post for ${protocolName} integration.

Protocol type: ${protocolContext.category}
Protocol: ${analysis.tagline}
Features: ${analysis.keyFeatures.join(', ')}
Value: ${analysis.valueProposition}

RULES:
- Only 🦊 emoji allowed (in headline)
- NO hashtags
- NO: "thrilled", "excited", "game-changer"
- Use "${protocolContext.actionVerb}" not "swap" (this is a ${protocolContext.category} protocol)

Include:
1. Headline with 🦊 only
2. What users can now do (3-4 bullets, specific)
3. How to try it (simple steps)
4. Link placeholders [LINK]
5. Call for feedback (questions welcome)

Keep it clean and scannable.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7 });
}

async function generateFollowupEducational(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  
  const systemPrompt = `You are writing a Day 1 educational Twitter thread for @ShapeShift.
${SHAPESHIFT_BRAND_CONTEXT}

This is educational content - be helpful, direct, actionable.`;

  const userPrompt = `
Create an educational thread explaining how to ${protocolContext.primaryAction} with ${protocolName} on ShapeShift.

Protocol type: ${protocolContext.category}
Features: ${analysis.keyFeatures.join(', ')}
Audience: People who saw the announcement but haven't tried it yet

RULES:
- NO hashtags
- NO emojis except 🦊 (max 1, in last tweet)
- NO: "game-changer", "unlock", "revolutionary"
- Use "${protocolContext.actionVerb}" not "swap"

Create a 4-5 tweet thread:
1. Hook: "Here's how to ${protocolContext.primaryAction} with ${protocolName} on ShapeShift"
2-4. Step by step walkthrough (suggest [SCREENSHOT] placeholders)
5. CTA: link to try it, optional 🦊

Keep it simple, actionable, helpful.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7 });
}

async function generateFollowupMetrics(protocolName: string, protocolContext: ProtocolContext): Promise<string> {
  const actionLabel = protocolContext.category === 'yield' || protocolContext.category === 'staking' 
    ? 'positions opened' 
    : protocolContext.category === 'bridge' 
    ? 'bridges completed'
    : 'transactions';
    
  return `# Day 4-6 Metrics Thread Template

**Only post this if metrics look good. Otherwise skip.**

---

**Tweet 1:**
${protocolName} on ShapeShift - the numbers so far.

**Tweet 2:**
[X] ${actionLabel}
[Y] volume in first [Z] days
[W] unique users

All self-custody. No KYC.

**Tweet 3:**
${protocolContext.category === 'yield' || protocolContext.category === 'staking' 
  ? `Top assets staked:
• [ASSET 1]
• [ASSET 2]
• [ASSET 3]`
  : `Top pairs:
• [PAIR 1]
• [PAIR 2]
• [PAIR 3]`}

**Tweet 4:**
Questions? Drop them below.

---

*Fill in actual numbers before posting. Skip if numbers aren't impressive. NO emojis needed.*`;
}

async function generateFollowupRecap(protocolName: string, analysis: ProtocolAnalysis, protocolContext: ProtocolContext): Promise<string> {
  return `# Day 7 Recap Thread

**Tweet 1:**
In case you missed it: ${protocolName} is live on ShapeShift 🦊

**Tweet 2:**
What you can now ${protocolContext.primaryAction}:
${analysis.keyFeatures.slice(0, 3).map(f => `• ${f}`).join('\n')}

**Tweet 3:**
${analysis.valueProposition}

Self-custody. No KYC.

**Tweet 4:**
Try it: app.shapeshift.com

---

*Recap for people who missed the original. NO hashtags. Only emoji is the 🦊 in tweet 1.*`;
}

async function generateBlogDraft(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  
  const systemPrompt = `You are writing a blog post for shapeshift.com.
${SHAPESHIFT_BRAND_CONTEXT}

Write for Strapi CMS. Use markdown formatting.
Professional but accessible tone. Educational, not salesy.`;

  const userPrompt = `
Write a blog post announcing ${protocolName} integration on ShapeShift.

Protocol type: ${protocolContext.category}
Protocol name: ${analysis.name}
Tagline: ${analysis.tagline}
Key features: ${analysis.keyFeatures.join(', ')}
Value proposition: ${analysis.valueProposition}
Key Message: ${brief.keyMessages.primary}
Target Audience: ${brief.targetAudience.who}

RULES:
- NO: "game-changer", "revolutionary", "unlock possibilities", "thrilled", "excited"
- Use "${protocolContext.actionVerb}" not "swap" when discussing the protocol
- Be educational, not salesy
- Short paragraphs, scannable
- Include specific details and data where possible

Write 800-1200 words with:
1. Compelling headline (not clickbait)
2. Hook paragraph - what users can now do
3. What is ${protocolName}? (brief explainer)
4. What can you do now? (specific features)
5. Why this matters (self-custody, no KYC angle)
6. How to get started (step by step with numbered list)
7. Conclusion with clear CTA

Use [IMAGE: description] for image placeholders.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 4096 });
}

function generateMarketingBriefMarkdown(protocolName: string, brief: MarketingBrief, analysis: ProtocolAnalysis): string {
  return `# Marketing Brief: ${protocolName} Integration

## Who Are We Speaking To?

**Target Audience:** ${brief.targetAudience.who}

**What We Know About Them:** ${brief.targetAudience.whatWeKnow}

**Psychographics:** ${brief.targetAudience.psychographics}

---

## What Problem Are We Solving?

**The Problem:** ${brief.problemSolved.problem}

**The "Aha" Moment:** ${brief.problemSolved.ahaMonent}

**Before/After:**
${brief.problemSolved.beforeAfter}

---

## GTM Idea (One Sentence)

> ${brief.gtmOneSentence}

---

## Business Outcomes

**What Changes:**
${brief.businessOutcomes.outcomes.map(o => `- ${o}`).join('\n')}

**How We'll Measure:**
${brief.businessOutcomes.metrics.map(m => `- ${m}`).join('\n')}

---

## Wild Success (Best Case Scenario)

**Vision:** ${brief.wildSuccess.vision}

**Indicators:**
${brief.wildSuccess.indicators.map(i => `- ${i}`).join('\n')}

---

## Why ShapeShift? (vs Competitors)

**Differentiators:**
${brief.uniqueVsCompetitors.differentiators.map(d => `- ${d}`).join('\n')}

**Positioning Statement:** ${brief.uniqueVsCompetitors.positioningStatement}

---

## Key Messages

**Primary Message:**
> ${brief.keyMessages.primary}

**Supporting Messages:**
${brief.keyMessages.supporting.map(s => `- ${s}`).join('\n')}

**Tweet-Ready:**
> ${brief.keyMessages.tweetReady}

---

## Protocol Summary

| Field | Value |
|-------|-------|
| **Name** | ${analysis.name} |
| **Category** | ${analysis.category} |
| **Tagline** | ${analysis.tagline} |

**Key Features:**
${analysis.keyFeatures.map(f => `- ${f}`).join('\n')}

**Value Proposition:** ${analysis.valueProposition}
`;
}

async function generatePartnerKit(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief): Promise<string> {
  return `# ${protocolName} Integration - Partner Marketing Kit

**For:** ${protocolName} Marketing Team
**From:** ShapeShift DAO
**Launch:** [DATE TBD]
**Contact:** [YOUR DISCORD/TELEGRAM]

---

## 🎯 What We're Announcing

${brief.gtmOneSentence}

**Why This Matters for ${protocolName}:**
This integration exposes ${protocolName} to ShapeShift's user base - DeFi power users who value self-custody and cross-chain access. More users, more volume, more adoption.

**Key Messages:**
${brief.keyMessages.supporting.map(m => `- ${m}`).join('\n')}

---

## 📅 What ShapeShift Is Doing

| Day | Our Action | Platform |
|-----|------------|----------|
| 0 | Main announcement | Twitter, Discord, Blog |
| 0 | Tag ${protocolName} | Twitter |
| 1 | Educational thread | Twitter |
| 2-3 | User content, metrics | Twitter |
| 7 | Recap thread | Twitter |

---

## 🙏 Partner Asks

### High Impact (These really help!)

- [ ] **QT our main announcement**
  - When: Day 0, within 30 minutes of our post
  - We'll DM you when we're about to post
  
- [ ] **Post to your Discord**
  - Copy provided below
  - When: Day 0, after announcement

### Medium Impact

- [ ] **Include in newsletter** (if you have one)
- [ ] **Share to Telegram** (if applicable)

### Optional

- [ ] **Create a tutorial video**
- [ ] **Host a Twitter Space together**

---

## ✍️ Ready-to-Use Copy

### For ${protocolName}'s Twitter

\`\`\`
${protocolName} is now live on @ShapeShift 🦊

${analysis.valueProposition}

Self-custody. No KYC. Try it: app.shapeshift.com
\`\`\`

### For ${protocolName}'s Discord

\`\`\`
Hey ${protocolName} community! 

ShapeShift just shipped native ${protocolName} support.

What this means for you:
${analysis.keyFeatures.slice(0, 3).map(f => `• ${f}`).join('\n')}

Check it out: app.shapeshift.com
\`\`\`

---

## ⏰ Suggested Timeline

| When | Action | Owner |
|------|--------|-------|
| T-3 days | Partner kit sent | ShapeShift |
| T-1 day | Confirm launch timing | Both |
| Launch AM | ShapeShift posts | ShapeShift |
| Launch +30min | Partner QTs | **${protocolName}** |
| Launch +1hr | Discord posts | Both |

---

## 💬 Feedback

Have feedback on this kit? Need different assets? Want to adjust copy?

Reply to this message or reach out on Discord/Telegram.

We'll adapt the plan based on your input!

---

**Questions?** Reach [YOUR HANDLE] on Discord/Telegram.
`;
}

async function generatePressRelease(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief): Promise<string> {
  const systemPrompt = `You are writing a press release for ShapeShift DAO.
Professional tone, standard press release format.`;

  const userPrompt = `
Write a press release for ${protocolName} integration.

Protocol: ${JSON.stringify(analysis, null, 2)}
Key Message: ${brief.keyMessages.primary}

Format:
- Headline
- Subheadline
- Dateline (use [CITY, DATE])
- Lead paragraph (who, what, when, where, why)
- Body (2-3 paragraphs with details)
- Quote placeholder: "[NAME], [TITLE] at ShapeShift, said: [QUOTE]"
- About ShapeShift boilerplate
- Media contact placeholder

Keep it 400-600 words, professional, newsworthy angle.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.5 });
}

async function generatePRBrief(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief): Promise<string> {
  return `# PR Brief: ${protocolName} Integration

## Key Messages (Memorize These)

**Primary:** ${brief.keyMessages.primary}

**Supporting:**
${brief.keyMessages.supporting.map(m => `- ${m}`).join('\n')}

**Tweet-Ready:** "${brief.keyMessages.tweetReady}"

---

## Talking Points

1. **What is this?**
   ShapeShift now supports ${protocolName}, enabling users to ${analysis.valueProposition.toLowerCase()}

2. **Why does it matter?**
   - Self-custody: Users maintain control of their assets
   - No KYC: Privacy-preserving access to DeFi
   - ${analysis.keyFeatures[0]}

3. **Who is this for?**
   ${brief.targetAudience.who}

4. **How is this different from competitors?**
   ${brief.uniqueVsCompetitors.positioningStatement}

---

## Anticipated Questions & Answers

**Q: What makes this different from [competitor]?**
A: ShapeShift is fully self-custodial with no KYC requirements. Users connect their own wallet and maintain complete control.

**Q: Is this safe?**
A: ${protocolName} is [established/audited]. ShapeShift never takes custody of user funds.

**Q: When is this available?**
A: Available now at app.shapeshift.com

---

## Do NOT Say

- Don't make specific price or return predictions
- Don't compare directly to competitor security
- Don't promise features not yet shipped
- Don't speak for the ${protocolName} team

---

## Bridging Phrases

If asked something you can't answer:
- "What's really exciting about this is..."
- "The key thing to understand is..."
- "What users care about most is..."
`;
}

async function generateOpEdPolitical(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  const systemPrompt = `You are writing an op-ed template with a political/regulatory angle.
Focus on self-custody rights, financial freedom, regulatory landscape.`;

  const userPrompt = `
Write an op-ed template about ${protocolName} integration from a political/regulatory angle.

Protocol: ${analysis.name}
Category: ${analysis.category}

Create a template (600-800 words) with:
1. Hook options (2-3 alternatives tied to current events)
2. Main argument about self-custody rights
3. How this integration supports financial sovereignty
4. [PERSONALIZE] placeholders for the author to add their perspective
5. Call to action

Target publications: CoinDesk Opinion, Decrypt

Include at the end:
- Suitable authors: Founder, policy advisor, community leader
- How to personalize
- What to avoid
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 2000 });
}

async function generateOpEdTechnical(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  const systemPrompt = `You are writing an op-ed template with a technical/builder angle.
Focus on architecture decisions, DeFi infrastructure, why this matters for builders.`;

  const userPrompt = `
Write an op-ed template about ${protocolName} integration from a technical angle.

Protocol: ${analysis.name}
Technical highlights: ${analysis.technicalHighlights.join(', ')}

Create a template (600-800 words) with:
1. Hook about the technical problem being solved
2. How ${protocolName} works (simplified)
3. What the integration enables technically
4. [PERSONALIZE] placeholders
5. Why builders should care

Target: The Block, engineering blogs

Include suitable authors and personalization notes.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 2000 });
}

async function generateDMTargets(protocolName: string, analysis: ProtocolAnalysis): Promise<DMTarget[]> {
  const systemPrompt = `You are identifying high-value Twitter accounts to DM about a new feature.`;

  const userPrompt = `
Identify 8-10 types of Twitter accounts that would be interested in ${protocolName} integration on ShapeShift.

Protocol category: ${analysis.category}
Target audience: ${analysis.targetAudience.join(', ')}

For each, provide:
- handle: Example handle format (e.g., "@defi_whale_42")
- reason: Why they'd care (1 sentence)
- openerAngle: What to reference about them
- suggestedDM: A DM template (NO links in first message, first 30 chars = value, minimal emojis)

Remember DM best practices:
- No links in first DM (looks like spam)
- First 30 characters should hook them (shows in preview)
- Ask if they want the link (gets response first)
- Personalize the opener

Return as JSON object with "targets" array containing the items.
`;

  const result = await generateJSON<{ targets: DMTarget[] }>(systemPrompt, userPrompt, { temperature: 0.7 });
  return result.targets || [];
}

async function generateWildCards(protocolName: string, analysis: ProtocolAnalysis): Promise<WildCardIdea[]> {
  const systemPrompt = `You are generating scrappy, low-budget marketing ideas.
Max budget $10k per idea, most should be <$1k. Crypto-native, guerrilla tactics.`;

  const userPrompt = `
Generate 4-5 wild card marketing ideas for ${protocolName} integration.

Protocol: ${analysis.category}
Target: ${analysis.targetAudience.join(', ')}

Ideas should be:
- Under $10k (most under $1k)
- Executable by one person
- Crypto-native and scrappy
- High potential impact

Categories to consider:
- Meme bounties
- Community challenges
- Reply-guy campaigns
- Prediction markets
- Trading competitions

For each provide:
- title
- description
- estimatedBudget (e.g., "$0-200")
- timeToExecute (e.g., "2 hours")
- targetSegment (from customer profile)
- howToExecute (specific steps)

Return as JSON object with "ideas" array containing the items.
`;

  const result = await generateJSON<{ ideas: WildCardIdea[] }>(systemPrompt, userPrompt, { temperature: 0.9 });
  return result.ideas || [];
}

async function generateDesignBrief(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  return `# Design Brief: ${protocolName} Integration

## Concept
Announcement graphic for ${protocolName} integration on ShapeShift.

## Dimensions Needed
- Twitter: 1200x675
- Square (Discord/Instagram): 1080x1080
- Blog header: 1600x900

## Brand Guidelines

**Colors:**
- Primary: #3761F9 (ShapeShift blue)
- Background: #1a1a2e (dark)
- Accent: #00D395 (green for positive)
- Text: #FFFFFF

**Typography:**
- Headlines: Inter Bold
- Body: Space Grotesk

**Logo:**
- ShapeShift fox in corner (not center)
- ${protocolName} logo can be centered or prominent
- Never distort logos

## Visual Direction

Clean, minimalist, professional DeFi aesthetic.
- No gradients
- No 3D effects
- No stock photos
- High contrast

## Must Include
- ${protocolName} logo
- ShapeShift fox logo (subtle, corner)
- Key message: "${analysis.valueProposition}"

## References
Look at previous ShapeShift announcement graphics for style consistency.

---

## Designers

**Option 1: AI Generation**
See ai_prompts.txt for Midjourney/DALL-E prompts.

**Option 2: Freelancers**
- Hoff - [contact]
- Atlin - [contact]
`;
}

async function generateAIPrompts(protocolName: string, analysis: ProtocolAnalysis): Promise<string> {
  return `# AI Image Prompts for ${protocolName} Integration

## Midjourney / DALL-E Prompts

### Twitter Graphic (16:9)

\`\`\`
Minimalist crypto announcement graphic, dark background #1a1a2e, 
${protocolName} logo centered, ShapeShift fox logo subtle in corner, 
text "${analysis.valueProposition}", clean sans-serif font Inter, 
no gradients, professional DeFi aesthetic, high contrast, 
corporate tech announcement style --ar 16:9 --style raw
\`\`\`

### Square Graphic (1:1)

\`\`\`
Minimalist crypto announcement, dark background #1a1a2e, 
${protocolName} logo prominent, subtle ShapeShift branding, 
clean typography, professional DeFi style, no gradients, 
high contrast --ar 1:1 --style raw
\`\`\`

### Blog Header (16:9, more space for text overlay)

\`\`\`
Abstract DeFi background, dark blue #1a1a2e base, 
subtle geometric patterns, space for text overlay, 
${analysis.category} theme, professional tech aesthetic, 
minimal, clean --ar 16:9 --style raw
\`\`\`

---

## Tips

1. Generate 4-6 variations
2. Pick the cleanest one
3. Add text overlay in Figma/Canva if needed
4. Ensure logos are crisp (may need to composite separately)
`;
}

function generateChecklist(protocolName: string, tier: number, analysis: ProtocolAnalysis, brief: MarketingBrief): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `# ${protocolName} Launch Checklist

**Generated:** ${today}
**Tier:** ${tier}
**Owner:** [YOUR NAME]

---

# You Shipped Code. Now Tell People About It.

You merged a PR. A feature is live. This packet helps you announce it.

At ShapeShift, engineers own their launches. There's no marketing team.
Things don't blow up on their own. If you don't market it, no one will use it.

This isn't busywork. It's intentional storytelling for the tech you built.

---

## What Kind of Launch Is This?

**Your launch: TIER ${tier}**

| Tier | What It Is | Time Required |
|------|------------|---------------|
| **0** | Small update, bug fix | 30 min |
| **1** | New feature, integration | 2-3 hours over 7 days |
| **2** | Major launch, press-worthy | 4-5 hours over 14 days |

---

## Is This Mandatory?

**Yes.** If you want people to use what you built.

The minimum is 30 minutes. You can do that.

---

## Can I Bail?

**No.** But you can hand off.

Message **Apotheosis** (Head of Engineering): "Need to hand off ${protocolName} launch"

---

## Quick Paths

- **[I'M BUSY]** → Jump to "Minimum Viable Launch" below
- **[I'VE GOT TIME]** → Follow the full checklist
- **[I CAN'T DO THIS]** → Hand off to Apotheosis

---

# Operational Quick Start

## How to Post

| Platform | Access |
|----------|--------|
| **Blog (Strapi)** | cms.shapeshift.com - [Loom walkthrough by Fabio] |
| **Twitter/X** | @ShapeShift credentials in DAO 1Password |
| **Discord** | #announcements channel |

## Graphic Design Help

| Option | Contact |
|--------|---------|
| **Midjourney** | Use prompts in design/ai_prompts.txt |
| **Hoff** | [contact] |
| **Atlin** | [contact] |

## If Something Goes Wrong

- Tweet ratioed? → Don't delete. Respond or let it ride.
- Blog error? → Fix in Strapi, updates live.
- Major issue? → Ping Apotheosis

---

# PRE-LAUNCH PHASE

## Day -7 to -5: Partner Coordination — 30 min
- [ ] Send partner kit to ${protocolName} team (partner/partner_kit.md)
- [ ] Request feedback by Day -3
- [ ] Identify partner contact for launch day

## Day -3: Feedback Integration — 20 min
- [ ] Review partner feedback (if received)
- [ ] Confirm launch timing with partner
- [ ] If no response: ping again, then proceed without

## Day -1: Final Review — 30 min
- [ ] Review blog draft (drafts/blog_draft.md)
- [ ] Review tweet thread (drafts/x_post_main.md)
- [ ] Review personal tweet (drafts/x_post_personal.md)
- [ ] Generate images if needed (design/ai_prompts.txt)
- [ ] Confirm partner is ready to QT

---

# LAUNCH PHASE

## Launch Day (Day 0) — 60 min

| Time | Task | File |
|------|------|------|
| 08:30 | Publish blog to Strapi | drafts/blog_draft.md |
| 09:00 | Post main tweet thread (@ShapeShift) | drafts/x_post_main.md |
| 09:05 | QT from your personal account | drafts/x_post_personal.md |
| 09:10 | Post Discord announcement | drafts/discord_post.md |
| 09:15 | DM partner: "We're live!" | — |
| 09:30 | Confirm partner QT'd | — |
| 09:30 | Start sending DMs | outreach/dm_targets.md |
| 10:00 | Cross-post to Farcaster | drafts/farcaster_post.md |
| 12:00 | Check replies, respond | — |
| 15:00 | QT @ShapeShiftInfoBot showing swap | drafts/infobot_qt.md |

## Day 1 — 20 min
- [ ] Post educational thread (@ShapeShift) - drafts/followup_educational.md
- [ ] Reply to overnight comments
- [ ] DM anyone who engaged positively

## Day 2-3 — 15 min
- [ ] QT user testimonials (if any)
- [ ] Share partner cross-posts
- [ ] Continue engaging

## Day 4-6 — 10 min
- [ ] Post metrics thread if numbers look good - drafts/followup_metrics.md
- [ ] Continue engaging

## Day 7 — 30 min
- [ ] Post recap thread - drafts/followup_recap.md
- [ ] Collect metrics (see below)
- [ ] Run: \`gtm metrics --launch ${protocolName.toLowerCase().replace(/\s+/g, '-')}\`

---

# ⚡ MINIMUM VIABLE LAUNCH (If You're Slammed)

**30 minutes total:**

- [ ] Post tweet thread from @ShapeShift — 5 min
- [ ] Post Discord announcement — 2 min
- [ ] QT from your personal account — 3 min

**That's it. You shipped.**

Everything else is bonus. A shipped launch beats a perfect plan.

---

# ✅ PRE-FLIGHT CHECK

Run through before launching:

**CONTENT READY**
- [ ] Blog draft reviewed
- [ ] Tweet thread reviewed
- [ ] Discord post reviewed

**ACCESS VERIFIED**
- [ ] Can log into Strapi
- [ ] Can access @ShapeShift Twitter

**PARTNER STATUS**
- [ ] Partner contacted
- [ ] Partner confirmed (or launching without)

**READY TO LAUNCH?**
- [ ] YES → Execute checklist
- [ ] NOT YET → Fix it or go minimal

---

# 📊 METRICS (Day 7)

| Metric | Target (Tier ${tier}) | Actual |
|--------|----------------------|--------|
| Twitter Profile Visits | ${tier === 0 ? '>100' : tier === 1 ? '>500' : '>1500'} | _____ |
| Tweet Engagements | ${tier === 0 ? '>50' : tier === 1 ? '>200' : '>500'} | _____ |
| Website Traffic | ${tier === 0 ? 'any' : tier === 1 ? '+10%' : '+25%'} | _____ |
| Swap Volume | — | _____ |
| Onchain Txs | ${tier === 0 ? '>20' : tier === 1 ? '>100' : '>500'} | _____ |

**SUCCESS:** Hit targets + positive response
**OKAY:** Close to targets
**REVIEW:** Missed targets → log learnings

---

# 📚 GLOSSARY

| Term | Meaning |
|------|---------|
| GTM | Go-To-Market — announcing/marketing a feature |
| QT | Quote Tweet — retweet with your comment |
| KOL | Key Opinion Leader — influencer |
| Engagement | Likes, RTs, replies |
| Profile Visits | Clicks to your profile (conversion metric) |

---

**Questions?** Ping Apotheosis on Discord.
`;
}

function generateIndexHtml(protocolName: string, tier: number, analysis: ProtocolAnalysis, brief: MarketingBrief): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GTM Packet: ${protocolName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e0e0e0; background: #1a1a2e; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #fff; margin-bottom: 0.5rem; }
    h2 { color: #3761F9; margin: 2rem 0 1rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
    h3 { color: #00D395; margin: 1.5rem 0 0.5rem; }
    .tagline { color: #888; font-size: 1.1rem; margin-bottom: 1rem; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    .card { background: #252542; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
    .card h3 { margin-top: 0; }
    ul { margin-left: 1.5rem; margin-bottom: 1rem; }
    li { margin: 0.3rem 0; }
    a { color: #3761F9; }
    .files { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
    .file { background: #1e1e3a; padding: 1rem; border-radius: 6px; }
    .file-name { font-weight: bold; color: #00D395; }
    .file-desc { font-size: 0.85rem; color: #888; }
    .highlight { background: #3761F9; color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; }
    .cta { background: #3761F9; color: #fff; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: 1rem 0; }
    footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #333; color: #666; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🦊 ${protocolName} GTM Packet</h1>
    <p class="tagline">${brief.gtmOneSentence}</p>
    <p class="meta">Generated: ${new Date().toISOString().split('T')[0]} | Tier: ${tier} | Status: Ready</p>

    <a href="checklist.md" class="cta">📋 Start Here: Launch Checklist</a>

    <h2>📊 Marketing Brief</h2>
    <div class="card">
      <h3>Target Audience</h3>
      <p>${brief.targetAudience.who}</p>
      <p><em>${brief.targetAudience.psychographics}</em></p>
    </div>
    <div class="card">
      <h3>Problem We're Solving</h3>
      <p>${brief.problemSolved.problem}</p>
      <p><strong>Aha moment:</strong> ${brief.problemSolved.ahaMonent}</p>
    </div>
    <div class="card">
      <h3>Key Message</h3>
      <p><strong>${brief.keyMessages.primary}</strong></p>
      <p style="margin-top: 1rem;"><em>Tweet-ready:</em> "${brief.keyMessages.tweetReady}"</p>
    </div>

    <h2>📁 Generated Files</h2>

    <h3>Drafts (Content to Post)</h3>
    <div class="files">
      <div class="file">
        <div class="file-name">x_post_main.md</div>
        <div class="file-desc">Main Twitter thread (@ShapeShift)</div>
      </div>
      <div class="file">
        <div class="file-name">x_post_personal.md</div>
        <div class="file-desc">Your personal QT</div>
      </div>
      <div class="file">
        <div class="file-name">discord_post.md</div>
        <div class="file-desc">Discord #announcements</div>
      </div>
      <div class="file">
        <div class="file-name">blog_draft.md</div>
        <div class="file-desc">Full blog for Strapi</div>
      </div>
      <div class="file">
        <div class="file-name">followup_educational.md</div>
        <div class="file-desc">Day 1 educational thread</div>
      </div>
    </div>

    <h3>Partner Materials</h3>
    <div class="files">
      <div class="file">
        <div class="file-name">partner/partner_kit.md</div>
        <div class="file-desc">Send to ${protocolName} team</div>
      </div>
    </div>

    <h3>Press Materials</h3>
    <div class="files">
      <div class="file">
        <div class="file-name">press/press_release.md</div>
        <div class="file-desc">Formal press release</div>
      </div>
      <div class="file">
        <div class="file-name">press/pr_brief.md</div>
        <div class="file-desc">Talking points</div>
      </div>
      <div class="file">
        <div class="file-name">press/op_ed_political.md</div>
        <div class="file-desc">Political/regulatory angle</div>
      </div>
      <div class="file">
        <div class="file-name">press/op_ed_technical.md</div>
        <div class="file-desc">Technical/builder angle</div>
      </div>
    </div>

    <h3>Design</h3>
    <div class="files">
      <div class="file">
        <div class="file-name">design/design_brief.md</div>
        <div class="file-desc">For human designers</div>
      </div>
      <div class="file">
        <div class="file-name">design/ai_prompts.txt</div>
        <div class="file-desc">Midjourney/DALL-E prompts</div>
      </div>
    </div>

    <h3>Outreach</h3>
    <div class="files">
      <div class="file">
        <div class="file-name">outreach/dm_targets.md</div>
        <div class="file-desc">Who to DM + templates</div>
      </div>
    </div>

    <h2>🎯 Protocol Analysis</h2>
    <div class="card">
      <p><strong>Category:</strong> ${analysis.category}</p>
      <p><strong>Tagline:</strong> ${analysis.tagline}</p>
      <h3>Key Features</h3>
      <ul>
        ${analysis.keyFeatures.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
      <h3>Value Proposition</h3>
      <p>${analysis.valueProposition}</p>
    </div>

    <footer>
      <p>Generated by GTM Coordinator v1.0</p>
      <p>Questions? Ping Apotheosis on Discord.</p>
    </footer>
  </div>
</body>
</html>`;
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

export async function generateFullPacket(
  protocolName: string,
  websiteUrl: string,
  tier: number = 1,
  onProgress?: (step: string) => void
): Promise<FullPacketResults> {
  const progress = onProgress || (() => {});

  // Step 1: Fetch website
  progress('Fetching website content...');
  const { content: websiteContent } = await fetchWebsiteContent(websiteUrl);

  // Step 2: Analyze protocol
  progress('Analyzing protocol...');
  const protocol = await analyzeProtocol(protocolName, websiteContent);

  // Step 3: Generate marketing brief
  progress('Generating marketing brief...');
  const marketingBrief = await generateMarketingBrief(protocolName, protocol);

  // Step 4: Generate all content in parallel
  progress('Generating content (this takes a moment)...');
  const [
    xPostMain,
    xPostPersonal,
    discordPost,
    blogDraft,
    followupEducational,
    partnerKit,
    pressRelease,
    prBrief,
    opEdPolitical,
    opEdTechnical,
    dmTargets,
    wildCards,
  ] = await Promise.all([
    generateMainTwitterThread(protocolName, protocol, marketingBrief),
    generatePersonalTwitterPost(protocolName, protocol),
    generateDiscordPost(protocolName, protocol),
    generateBlogDraft(protocolName, protocol, marketingBrief),
    generateFollowupEducational(protocolName, protocol),
    generatePartnerKit(protocolName, protocol, marketingBrief),
    generatePressRelease(protocolName, protocol, marketingBrief),
    generatePRBrief(protocolName, protocol, marketingBrief),
    generateOpEdPolitical(protocolName, protocol),
    generateOpEdTechnical(protocolName, protocol),
    generateDMTargets(protocolName, protocol),
    generateWildCards(protocolName, protocol),
  ]);

  // Get protocol context for terminology
  const protocolContext = getProtocolContext(protocol.category);

  // Step 5: Generate remaining content
  progress('Generating follow-up content...');
  const [infoBotQT, followupMetrics, followupRecap, designBrief, aiPrompts] = await Promise.all([
    generateInfoBotQT(protocolName, protocolContext),
    generateFollowupMetrics(protocolName, protocolContext),
    generateFollowupRecap(protocolName, protocol, protocolContext),
    generateDesignBrief(protocolName, protocol),
    generateAIPrompts(protocolName, protocol),
  ]);

  // Step 6: Generate checklist, index, and marketing brief markdown
  progress('Generating checklist and index...');
  const checklist = generateChecklist(protocolName, tier, protocol, marketingBrief);
  const indexHtml = generateIndexHtml(protocolName, tier, protocol, marketingBrief);
  const marketingBriefMarkdown = generateMarketingBriefMarkdown(protocolName, marketingBrief, protocol);

  return {
    protocol,
    marketingBrief,
    marketingBriefMarkdown,
    content: {
      xPostMain,
      infoBotQT,
      discordPost,
      farcasterPost: discordPost, // Similar format
      followupEducational,
      followupMetrics,
      followupRecap,
      xPostPersonal,
      personalWalkthrough: xPostPersonal, // Can be expanded
      blogDraft,
      userGuide: followupEducational, // Similar content
      releaseNotes: `# ${protocolName} Integration\n\n${protocol.valueProposition}\n\n## What's New\n\n${protocol.keyFeatures.map(f => `- ${f}`).join('\n')}`,
    },
    partnerKit,
    pressRelease,
    prBrief,
    opEdPolitical,
    opEdTechnical,
    dmTargets,
    wildCards,
    designBrief,
    aiPrompts,
    checklist,
    indexHtml,
  };
}
