import { generateContent, generateJSON } from './openai.js';
import { fetchWebsiteContent, searchWeb, type WebSearchResult } from './webFetch.js';

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

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trimEnd() + '...';
}

async function buildCurrentEventsContext(
  kind: 'political' | 'technical',
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const category = analysis.category || 'DeFi';
  const query =
    kind === 'political'
      ? `${category} crypto regulation self custody policy enforcement 2026`
      : `${category} DeFi technical security infrastructure scaling interoperability 2026`;

  try {
    const results = await searchWeb(query, 5);
    const top = results.slice(0, 3);
    if (!top.length) return '';

    const pages = await Promise.all(
      top.map(async (r: WebSearchResult) => {
        try {
          const page = await fetchWebsiteContent(r.url);
          return {
            title: page.title || r.title,
            url: page.url || r.url,
            snippet: r.snippet || page.description,
          };
        } catch {
          return {
            title: r.title,
            url: r.url,
            snippet: r.snippet,
          };
        }
      })
    );

    const header =
      kind === 'political'
        ? `## Recent political/regulatory context (web)\nUse these as hook ideas; do not invent other events.`
        : `## Recent technical context (web)\nUse these as hook ideas; do not invent other events.`;

    const body = pages
      .map((p, i) => {
        const sn = p.snippet ? truncate(p.snippet, 240) : '';
        return `- ${i + 1}. ${truncate(p.title || `${protocolName} context`, 120)}\n  - URL: ${p.url}\n  - Snippet: ${sn || '[no snippet]'}\n`;
      })
      .join('\n');

    return truncate(`${header}\n\n${body}`, 1800);
  } catch {
    // Search can fail due to network restrictions or upstream changes; op-eds should still generate.
    return '';
  }
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

/** Program-mode constraints for rFOX (updated wiki Feb 2026) — inject when campaignType=program and protocol is rFOX */
const PROGRAM_RFOX_CONTEXT = `
**rFOX-SPECIFIC CONSTRAINTS (MUST FOLLOW):**
- Rewards are USDC (revenue share), NOT RUNE. Do NOT mention RUNE rewards or THORChain address for rewards.
- LP staking is NO LONGER supported. FOX-only staking. Instruct anyone with LP positions to unstake and move to FOX.
- Distribution is off-chain by DAO multisig, paid as USDC to staker's wallet.
- Do NOT promise APY or specific returns.

**rFOX MESSAGING (for Marketing Brief and key messages):**
- GTM one-sentence MUST be about rFOX: start with "rFOX" (e.g. "rFOX lets you stake FOX and earn USDC"). Do NOT lead with "ShapeShift lets you..." for the one-liner.
- Primary message / marketing brief: include launch framing (e.g. "rFOX is now live" or "rFOX is your place to stake FOX and earn USDC").
- Emphasize rFOX as the place to earn: in target audience, problem we're solving, aha moment, and key messages, highlight stake FOX → earn USDC.
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

/** Options for full-packet generation */
export interface FullPacketOptions {
  /** Additional context content (from --context-url or --context-file) merged with website content */
  contextContent?: string;
  /** Launch type: integration (external protocol) or program (ShapeShift product like rFOX) */
  campaignType?: 'integration' | 'program';
  /** Primary CTA URL (e.g. app.shapeshift.com/#/fox-ecosystem) */
  ctaUrl?: string;
  /** Number of weeks for content calendar */
  calendarWeeks?: number;
  /** Number of SEO articles to generate */
  seoCount?: number;
}

export interface FullPacketResults {
  protocol: ProtocolAnalysis;
  marketingBrief: MarketingBrief;
  marketingBriefMarkdown: string;  // Human-readable markdown version
  content: {
    // From @ShapeShift main
    xPostMain: string;
    xPostBlog: string;
    infoBotQT: string;
    discordPost: string;
    discordReminder: string;
    farcasterPost: string;
    followupEducational: string;
    followupMetrics: string;
    followupRecap: string;
    // From personal account
    xPostPersonal: string;
    personalWalkthrough: string;
    // Blog
    blogDraft: string;
    mediumPost: string;
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
  seoArticles: string[];
  contentCalendar: string;
}

// ============================================================================
// GENERATORS
// ============================================================================

function getCampaignWording(opts?: FullPacketOptions, protocolName?: string): { noun: string; verb: string; tagLine: string } {
  const isProgram = opts?.campaignType === 'program';
  const isRfox = protocolName ? /rfox/i.test(protocolName) : false;
  if (isProgram) {
    return {
      noun: 'program',
      verb: 'program',
      tagLine: isRfox ? 'Stake FOX. Earn USDC.' : `${protocolName} on ShapeShift`,
    };
  }
  return { noun: 'integration', verb: 'integration', tagLine: `${protocolName} integration` };
}

async function analyzeProtocol(protocolName: string, websiteContent: string): Promise<ProtocolAnalysis> {
  const systemPrompt = `You are a DeFi protocol analyst. Analyze the provided website content and extract key information.`;

  const userPrompt = `
Analyze this DeFi protocol or product and provide a structured analysis:

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

async function generateMarketingBrief(protocolName: string, analysis: ProtocolAnalysis, opts?: FullPacketOptions): Promise<MarketingBrief> {
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  const systemPrompt = `You are a marketing strategist creating a GTM brief for ShapeShift DAO.
${SHAPESHIFT_BRAND_CONTEXT}
${CUSTOMER_PROFILE}
${programContext}`;

  const isRfoxProgram = opts?.campaignType === 'program' && /rfox/i.test(protocolName);
  const userPrompt = `
Create a Marketing Brief for ShapeShift's ${w.noun} ${protocolName}.

Protocol Analysis:
${JSON.stringify(analysis, null, 2)}
${isRfoxProgram ? `
For rFOX program: The GTM one-sentence MUST start with "rFOX" (e.g. "rFOX lets you stake FOX and earn USDC"). The primary message MUST include launch framing like "rFOX is now live" and position rFOX as the place to stake FOX and earn USDC.` : ''}

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

async function generateMainTwitterThread(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief, opts?: FullPacketOptions): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  const cta = opts?.ctaUrl || 'app.shapeshift.com';
  const tagLine = opts?.campaignType === 'program'
    ? '5. Optional 🦊 (do NOT tag external protocol)'
    : `5. Tag @${protocolName.replace(/\s+/g, '').replace(/\./g, '_')}, optional 🦊`;
  
  const systemPrompt = `You are writing for @ShapeShift's main Twitter account.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

CRITICAL - You MUST follow these rules:
- NO hashtags at all
- NO emojis except 🦊 (max 1, only in final tweet if at all)
- NO banned phrases (game-changer, unlock possibilities, thrilled, excited, revolutionary, seamlessly)
- Use question hooks - they get 2x engagement
- Short, punchy sentences
- This is a ${protocolContext.category} protocol - use "${protocolContext.actionVerb}" not "swap"`;

  const userPrompt = `
Create a Twitter thread from @ShapeShift announcing the ${protocolName} ${w.noun}.

PROTOCOL TYPE: ${protocolContext.category} (primary action: ${protocolContext.primaryAction})
Key Message: ${brief.keyMessages.primary}
Value Prop: ${analysis.valueProposition}
Target: ${brief.targetAudience.who}
CTA: ${cta}

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
4. How to try it (direct CTA - use ${cta})
${tagLine}

Format as:
**Tweet 1:**
[content]

**Tweet 2:**
[content]
...
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7 });
}

async function generateXBlogPromoTweet(
  protocolName: string,
  analysis: ProtocolAnalysis,
  brief: MarketingBrief,
  opts?: FullPacketOptions
): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';

  const systemPrompt = `You are writing for @ShapeShift's main Twitter account.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

CRITICAL:
- One tweet only (no thread)
- NO hashtags
- NO emojis except 🦊 (optional, max 1)
- NO banned phrases (thrilled, excited, game-changer, revolutionary, unlock, seamlessly)
- Use "${protocolContext.actionVerb}" not "swap" when appropriate`;

  const userPrompt = `
Write a single tweet that promotes the launch blog post for ${protocolName}.

Key message: ${brief.keyMessages.primary}
Value prop: ${analysis.valueProposition}

Rules:
- Under 280 characters
- Include placeholder [BLOG LINK] (do NOT invent a URL)
- Clear CTA to read

Format: Just the tweet text
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.6 });
}

async function generateDiscordReminder(
  protocolName: string,
  analysis: ProtocolAnalysis,
  brief: MarketingBrief,
  opts?: FullPacketOptions
): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  const cta = opts?.ctaUrl || 'app.shapeshift.com';

  const systemPrompt = `You are writing a Discord reminder post for ShapeShift's community.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

Discord allows slightly more casual tone but still professional.
NO hashtags. Only 🦊 emoji allowed (use once in headline).`;

  const userPrompt = `
Write a short Discord #announcements reminder about the ${protocolName} ${w.noun}.

Protocol type: ${protocolContext.category}
Key message: ${brief.keyMessages.primary}
CTA: ${cta}

Requirements:
- Keep it short (max ~900 characters)
- Include: Hook/theme (1 line), CTA (1 line), and suggested copy that can be pasted as-is
- Include placeholder [X THREAD LINK] for the main X thread
- Ask for feedback/questions at the end
- Only 🦊 emoji allowed (headline only)
- Use "${protocolContext.actionVerb}" not "swap" (this is a ${protocolContext.category} protocol)

Format: Just the Discord message text (no markdown headings like \"#\")
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.6 });
}

async function generatePersonalTwitterPost(protocolName: string, analysis: ProtocolAnalysis, _opts?: FullPacketOptions): Promise<string> {
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

async function generateDiscordPost(protocolName: string, analysis: ProtocolAnalysis, opts?: FullPacketOptions): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  
  const systemPrompt = `You are writing a Discord announcement for ShapeShift's community.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

Discord allows slightly more casual tone but still professional.
NO hashtags. Only 🦊 emoji allowed (use once in headline).`;

  const userPrompt = `
Create a Discord #announcements post for ${protocolName} ${w.noun}.

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

async function generateFollowupRecap(protocolName: string, analysis: ProtocolAnalysis, protocolContext: ProtocolContext, opts?: FullPacketOptions): Promise<string> {
  const cta = opts?.ctaUrl || 'app.shapeshift.com';
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
Try it: ${cta}

---

*Recap for people who missed the original. NO hashtags. Only emoji is the 🦊 in tweet 1.*`;
}

async function generateBlogDraft(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief, opts?: FullPacketOptions): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  
  const systemPrompt = `You are writing a blog post for shapeshift.com.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

Write for Strapi CMS. Use markdown formatting.
Professional but accessible tone. Educational, not salesy.`;

  const userPrompt = `
Write a blog post announcing ${protocolName} ${w.noun} on ShapeShift.

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

async function generateMediumPost(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief, opts?: FullPacketOptions): Promise<string> {
  const protocolContext = getProtocolContext(analysis.category);
  const w = getCampaignWording(opts, protocolName);
  const programContext = opts?.campaignType === 'program' && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  const cta = opts?.ctaUrl || 'app.shapeshift.com';

  const systemPrompt = `You are writing a Medium post for ShapeShift.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

Write in markdown. Medium-friendly formatting. Educational, not salesy.`;

  const userPrompt = `
Write a Medium post announcing ${protocolName} ${w.noun} on ShapeShift.

Protocol type: ${protocolContext.category}
Tagline: ${analysis.tagline}
Key features: ${analysis.keyFeatures.join(', ')}
Value proposition: ${analysis.valueProposition}
Primary message: ${brief.keyMessages.primary}
CTA: ${cta}

Rules:
- NO hashtags
- NO: "thrilled", "excited", "game-changer", "revolutionary", "unlock"
- Scannable: short paragraphs, good headings
- Include a short TL;DR section near the top
- Include \"How to get started\" steps
- End with a clear CTA

Use [IMAGE: description] placeholders.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.65, maxTokens: 4096 });
}

async function generateSeoArticle(
  protocolName: string,
  analysis: ProtocolAnalysis,
  brief: MarketingBrief,
  opts: FullPacketOptions
): Promise<string> {
  const isProgram = opts.campaignType === 'program';
  const programContext = isProgram && /rfox/i.test(protocolName) ? PROGRAM_RFOX_CONTEXT : '';
  const cta = opts.ctaUrl || 'app.shapeshift.com';

  const systemPrompt = `You are writing an SEO-optimized article for shapeshift.com.
${SHAPESHIFT_BRAND_CONTEXT}
${programContext}

Target intent: "how rFOX works", "stake FOX on Arbitrum earn", "rFOX staking guide".
Use markdown. Include disclaimer: rewards distribution is off-chain; do not promise APY.`;

  const userPrompt = `
Write an SEO article (800-1200 words) about ${protocolName}${isProgram ? ' program' : ' integration'} on ShapeShift.

Protocol: ${analysis.name}
Tagline: ${analysis.tagline}
Value: ${analysis.valueProposition}
Key features: ${analysis.keyFeatures.join(', ')}

RULES:
- NO: "game-changer", "revolutionary", "unlock"
- Be educational, scannable, keyword-rich
- Include: what it is, how to stake, how rewards work (general), epoch/cooldown mechanics if applicable
- CTA: ${cta}
- Use [IMAGE: description] placeholders
${programContext ? '- DO NOT mention RUNE rewards or LP staking. Rewards = USDC revenue share. LP stakers: unstake and move to FOX.' : ''}
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 4096 });
}

function generateContentCalendar(
  protocolName: string,
  analysis: ProtocolAnalysis,
  brief: MarketingBrief,
  opts: FullPacketOptions,
  extra?: { discordReminder?: string }
): string {
  const weeks = opts.calendarWeeks ?? 4;
  const cta = opts.ctaUrl || 'app.shapeshift.com';
  const protocolContext = getProtocolContext(analysis.category);
  const start = new Date();

  const supporting = brief.keyMessages.supporting?.length ? brief.keyMessages.supporting : [brief.keyMessages.primary];
  let xPostCount = 0;

  function hookForTheme(theme: string): string {
    const idx = xPostCount % supporting.length;
    const feature = analysis.keyFeatures?.[xPostCount % Math.max(1, analysis.keyFeatures.length)] || analysis.valueProposition;

    if (theme === 'Educational how-to') {
      return `How to ${protocolContext.primaryAction} with ${protocolName} (self-custody)`;
    }
    if (theme === 'Benefit/value') {
      return truncate(supporting[idx] || analysis.valueProposition, 80);
    }
    // Community/engagement
    return `What would you try first? ${truncate(feature, 60)}`;
  }

  const lines: string[] = [
    `# Content Calendar: ${protocolName}`,
    '',
    `**Start date:** ${start.toISOString().split('T')[0]}`,
    `**Weeks:** ${weeks}`,
    `**CTA:** ${cta}`,
    '',
    '| Date | Channel | Goal | Hook/Theme | CTA (channel-specific) | Copy |',
    '|------|---------|------|------------|------------------------|------|',
  ];

  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() + w * 7);
    for (let d = 0; d < 7; d++) {
      const dte = new Date(weekStart);
      dte.setDate(dte.getDate() + d);
      const dow = dte.getDay();
      if (dow === 1 || dow === 3 || dow === 5) {
        const theme = dow === 1 ? 'Educational how-to' : dow === 3 ? 'Benefit/value' : 'Community/engagement';
        const hook = hookForTheme(theme);
        const copyRef =
          xPostCount === 0 ? 'drafts/x_post_main.md' : theme === 'Educational how-to' ? 'drafts/followup_educational.md' : 'Pick a 1-liner from Hook/Theme';
        lines.push(`| ${dte.toISOString().split('T')[0]} | X | ${theme} | ${hook} | ${cta} | ${copyRef} |`);
        xPostCount++;
      }
      if (dow === 2 && w < 2) {
        const hook = `Reminder: ${truncate(brief.keyMessages.primary, 70)}`;
        const discordCta = `Read X thread: [X THREAD LINK] + try: ${cta}`;
        lines.push(`| ${dte.toISOString().split('T')[0]} | Discord | Update/reminder | ${hook} | ${discordCta} | drafts/discord_reminder.md |`);
      }
    }
    if (w === 0) {
      const day0 = weekStart.toISOString().split('T')[0];
      lines.push(`| ${day0} | Blog | Launch post | Publish launch blog | ${cta} | drafts/blog_draft.md |`);
      lines.push(`| ${day0} | X | Blog promo | Promote the blog post | [BLOG LINK] | drafts/x_post_blog.md |`);
      lines.push(`| ${day0} | Medium | Cross-post | Publish on Medium | ${cta} | drafts/medium_post.md |`);
    }
  }

  if (extra?.discordReminder?.trim()) {
    lines.push('', '---', '', '## Discord reminder copy (paste-ready)', '', `\`\`\`\n${extra.discordReminder.trim()}\n\`\`\``);
  } else {
    lines.push('', '---', '', '## Discord reminder copy', '', 'Use `drafts/discord_reminder.md`.');
  }

  lines.push('', '---', '', '## Notes', '', '- CTAs are channel-specific. Replace placeholders like `[BLOG LINK]` and `[X THREAD LINK]` before posting.');

  return lines.join('\n');
}

function generateMarketingBriefMarkdown(protocolName: string, brief: MarketingBrief, analysis: ProtocolAnalysis, opts?: FullPacketOptions): string {
  const w = getCampaignWording(opts, protocolName);
  return `# Marketing Brief: ${protocolName} ${w.noun.charAt(0).toUpperCase() + w.noun.slice(1)}

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

async function generatePartnerKit(protocolName: string, analysis: ProtocolAnalysis, brief: MarketingBrief, opts?: FullPacketOptions): Promise<string> {
  const isProgram = opts?.campaignType === 'program';
  const cta = opts?.ctaUrl || 'app.shapeshift.com';

  if (isProgram) {
    return `# ${protocolName} - Community / Internal Brief

**Type:** Program launch (ShapeShift product)
**CTA:** ${cta}
**Contact:** [YOUR DISCORD/TELEGRAM]

---

## What We're Announcing

${brief.gtmOneSentence}

**Key Messages:**
${brief.keyMessages.supporting.map(m => `- ${m}`).join('\n')}

---

## Launch Checklist (Internal)

| Day | Action | Platform |
|-----|--------|----------|
| 0 | Main tweet thread, then Discord, then Strapi blog, blog promo tweet, Medium | Twitter, Discord, Blog, Medium |
| 1 | Educational thread | Twitter |
| 2-3 | User content, metrics | Twitter |
| 7 | Recap thread | Twitter |

---

## Ready-to-Use Copy

Use the drafts in this packet: x_post_main.md, discord_post.md, discord_reminder.md, blog_draft.md, x_post_blog.md, medium_post.md.
CTA: ${cta}
`;
  }

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
| 0 | Main tweet thread, then Discord, then Strapi blog, blog promo tweet, Medium | Twitter, Discord, Blog, Medium |
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

async function generateOpEdPolitical(
  protocolName: string,
  analysis: ProtocolAnalysis,
  currentEventsContext?: string
): Promise<string> {
  const systemPrompt = `You are writing an op-ed template with a political/regulatory angle.
Focus on self-custody rights, financial freedom, regulatory landscape.`;

  const userPrompt = `
Write an op-ed template about ${protocolName} integration from a political/regulatory angle.

Protocol: ${analysis.name}
Category: ${analysis.category}

${currentEventsContext ? `${currentEventsContext}\n` : ''}

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

async function generateOpEdTechnical(
  protocolName: string,
  analysis: ProtocolAnalysis,
  currentEventsContext?: string
): Promise<string> {
  const systemPrompt = `You are writing an op-ed template with a technical/builder angle.
Focus on architecture decisions, DeFi infrastructure, why this matters for builders.`;

  const userPrompt = `
Write an op-ed template about ${protocolName} integration from a technical angle.

Protocol: ${analysis.name}
Technical highlights: ${analysis.technicalHighlights.join(', ')}

${currentEventsContext ? `${currentEventsContext}\n` : ''}

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
- suggestedDM: A DM template (NO links in first message, first 30 chars = value, NO emojis, human tone)

Remember DM best practices:
- No links in first DM (looks like spam)
- First 30 characters should hook them (shows in preview)
- Ask if they want the link (gets response first)
- Personalize the opener
- Avoid salesy openers like "Exciting news!" / "Boost your gains!" / "New opportunity!"
- Keep punctuation normal (no !!!). Write like a real person.

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

function generateChecklist(protocolName: string, tier: number, analysis: ProtocolAnalysis, brief: MarketingBrief, opts?: FullPacketOptions): string {
  const today = new Date().toISOString().split('T')[0];
  const isProgram = opts?.campaignType === 'program';
  const slug = protocolName.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-');
  
  const partnerSection = isProgram ? '' : `
## Day -7 to -5: Partner Coordination — 30 min
- [ ] Send partner kit to ${protocolName} team (partner/partner_kit.md)
- [ ] Request feedback by Day -3
- [ ] Identify partner contact for launch day

## Day -3: Feedback Integration — 20 min
- [ ] Review partner feedback (if received)
- [ ] Confirm launch timing with partner
- [ ] If no response: ping again, then proceed without

`;

  const partnerDay0Rows = isProgram ? '' : `| 09:12 | DM partner: "We're live!" | — |
| 09:40 | Confirm partner QT'd | — |
`;
  const partnerConfirmRow = isProgram ? '' : '- [ ] Confirm partner is ready to QT\n';

  return `# ${protocolName} Launch Checklist

**Generated:** ${today}
**Tier:** ${tier}
**Type:** ${isProgram ? 'Program' : 'Integration'}
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
| **1** | New feature, ${isProgram ? 'program' : 'integration'} | 2-3 hours over 7 days |
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
${partnerSection}
## Day -1: Final Review — 30 min
- [ ] Review blog draft (drafts/blog_draft.md)
- [ ] Review tweet thread (drafts/x_post_main.md)
- [ ] Review blog promo tweet (drafts/x_post_blog.md)
- [ ] Review personal tweet (drafts/x_post_personal.md)
- [ ] Review Discord announcement + reminder (drafts/discord_post.md, drafts/discord_reminder.md)
- [ ] Review Medium post (drafts/medium_post.md)
- [ ] Generate images if needed (design/ai_prompts.txt)
${partnerConfirmRow}
---



# LAUNCH PHASE

## Launch Day (Day 0) — 60 min

| Time | Task | File |
|------|------|------|
| 09:00 | Post main tweet thread (@ShapeShift) | drafts/x_post_main.md |
| 09:05 | QT from your personal account | drafts/x_post_personal.md |
| 09:10 | Post Discord announcement | drafts/discord_post.md |
| 09:20 | Publish blog to Strapi | drafts/blog_draft.md |
| 09:30 | Post blog promo tweet (add the Strapi link) | drafts/x_post_blog.md |
| 09:35 | Cross-post to Medium | drafts/medium_post.md |
${partnerDay0Rows}| 09:50 | Start sending DMs | outreach/dm_targets.md |
| 10:15 | Cross-post to Farcaster | drafts/farcaster_post.md |
| 12:00 | Check replies, respond | — |
| 15:00 | QT @ShapeShiftInfoBot showing swap | drafts/infobot_qt.md |

## Press (Optional, Tier 2-ish) — 20 min
- [ ] Skim press release (press/press_release.md) and fix anything inaccurate
- [ ] Skim PR brief (press/pr_brief.md) so you can answer questions
- [ ] Pick ONE op-ed angle and personalize it (press/op_ed_political.md or press/op_ed_technical.md)
- [ ] If sending pitches: include the press release + PR brief, and offer an interview

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
- [ ] Blog draft reviewed (blog_draft.md, medium_post.md)
- [ ] Tweet thread + blog promo tweet reviewed (x_post_main.md, x_post_blog.md)
- [ ] Discord post + reminder reviewed (discord_post.md, discord_reminder.md)

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

// ShapeShift fox logo SVG (from shapeshift/web repo)
const SHAPESHIFT_FOX_SVG = `<svg viewBox="0 0 218 231" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M109 0L0 65.5V165.5L109 231L218 165.5V65.5L109 0Z" fill="#3761F9"/>
  <path d="M109 30L30 75V155L109 200L188 155V75L109 30Z" fill="#10151E"/>
  <path d="M109 55L55 87V143L109 175L163 143V87L109 55Z" fill="#3761F9"/>
  <path d="M109 75L75 95V135L109 155L143 135V95L109 75Z" fill="#00CD98"/>
</svg>`;

function generateIndexHtml(
  protocolName: string,
  tier: number,
  analysis: ProtocolAnalysis,
  brief: MarketingBrief,
  extra?: { seoArticles: string[]; contentCalendar: string; opts?: FullPacketOptions }
): string {
  const tierLabel = tier === 0 ? 'Tier 0 (Quick)' : tier === 1 ? 'Tier 1 (Standard)' : 'Tier 2 (Major)';
  const noun = extra?.opts ? getCampaignWording(extra.opts, protocolName).noun : 'integration';
  const titleNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
  const tierColor = tier === 0 ? '#718096' : tier === 1 ? '#3761F9' : '#00CD98';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${protocolName} GTM Packet | ShapeShift</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Work+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ShapeShift Theme - from shapeshift/web GitHub */
    :root {
      --blue-500: #3761F9;
      --blue-600: #2D4EC9;
      --blue-700: #243EA1;
      --green-500: #00CD98;
      --green-400: #16D1A1;
      --gray-950: #090B11;
      --gray-900: #10151E;
      --gray-850: #191d28;
      --gray-800: #141A25;
      --gray-700: #2D3748;
      --gray-600: #4A5568;
      --gray-500: #718096;
      --gray-400: #A0AEC0;
      --gray-300: #CBD5E0;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body { 
      font-family: 'Inter', system-ui, sans-serif; 
      line-height: 1.6; 
      color: var(--gray-300);
      background: var(--gray-900);
      min-height: 100vh;
    }
    
    /* Hero gradient background - matches ShapeShift app */
    .hero {
      background: radial-gradient(94.32% 94.6% at 4.04% -44.6%, rgba(45, 78, 201, 0.4) 0%, rgba(16, 21, 30, 0) 100%), 
                  linear-gradient(0deg, var(--gray-900), var(--gray-900));
      padding: 3rem 2rem;
      border-bottom: 1px solid var(--gray-700);
    }
    
    .hero-content {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .logo-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .fox-logo {
      width: 48px;
      height: 48px;
    }
    
    .brand-text {
      font-family: 'Work Sans', system-ui, sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    h1 { 
      font-family: 'Work Sans', system-ui, sans-serif;
      font-weight: 700;
      font-size: 2.5rem;
      color: #fff; 
      margin-bottom: 0.75rem;
      line-height: 1.2;
    }
    
    .tagline { 
      color: var(--gray-400); 
      font-size: 1.125rem; 
      margin-bottom: 1.5rem;
      max-width: 600px;
    }
    
    .meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--gray-500);
    }
    
    .tier-badge {
      background: ${tierColor}22;
      color: ${tierColor};
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 500;
      font-size: 0.75rem;
    }
    
    .cta-row {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .cta-primary {
      background: var(--blue-500);
      color: #fff;
      padding: 0.875rem 1.75rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }
    
    .cta-primary:hover {
      background: var(--blue-600);
    }
    
    .cta-secondary {
      background: transparent;
      color: var(--gray-300);
      padding: 0.875rem 1.75rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 500;
      border: 1px solid var(--gray-700);
      transition: border-color 0.2s;
    }
    
    .cta-secondary:hover {
      border-color: var(--gray-500);
    }
    
    /* Main content */
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 2rem;
    }
    
    h2 { 
      font-family: 'Work Sans', system-ui, sans-serif;
      font-weight: 600;
      font-size: 1.25rem;
      color: #fff; 
      margin: 2.5rem 0 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    h2::before {
      content: '';
      width: 4px;
      height: 1.25rem;
      background: var(--blue-500);
      border-radius: 2px;
    }
    
    h3 { 
      color: var(--gray-400); 
      font-weight: 500;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 1.5rem 0 0.75rem;
    }
    
    .card { 
      background: var(--gray-850);
      border: 1px solid var(--gray-700);
      border-radius: 12px; 
      padding: 1.25rem; 
      margin: 0.75rem 0;
    }
    
    .card-title {
      color: #fff;
      font-weight: 600;
      font-size: 0.9375rem;
      margin-bottom: 0.5rem;
    }
    
    .card p { 
      color: var(--gray-400);
      font-size: 0.9375rem;
    }
    
    .card strong {
      color: var(--gray-300);
    }
    
    .highlight-box {
      background: linear-gradient(135deg, rgba(55, 97, 249, 0.1) 0%, rgba(0, 205, 152, 0.05) 100%);
      border: 1px solid var(--blue-500);
      border-radius: 12px;
      padding: 1.25rem;
      margin: 1rem 0;
    }
    
    .highlight-box .label {
      color: var(--blue-500);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    
    .highlight-box .value {
      color: #fff;
      font-size: 1.0625rem;
      font-weight: 500;
    }
    
    ul { 
      margin-left: 1.25rem; 
      margin-bottom: 0.75rem;
    }
    
    li { 
      margin: 0.25rem 0;
      color: var(--gray-400);
    }
    
    /* File grid */
    .files { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
      gap: 0.75rem;
    }
    
    .file { 
      background: var(--gray-800);
      border: 1px solid var(--gray-700);
      padding: 1rem; 
      border-radius: 10px;
      transition: border-color 0.2s, transform 0.2s;
      cursor: pointer;
    }
    
    .file:hover {
      border-color: var(--blue-500);
      transform: translateY(-2px);
    }
    
    .file-name { 
      font-weight: 600;
      font-size: 0.875rem;
      color: #fff;
      margin-bottom: 0.25rem;
    }
    
    .file-desc { 
      font-size: 0.8125rem; 
      color: var(--gray-500);
    }
    
    /* Footer */
    footer { 
      margin-top: 3rem; 
      padding: 2rem;
      border-top: 1px solid var(--gray-700);
      text-align: center;
    }
    
    .footer-content {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .footer-brand svg {
      width: 24px;
      height: 24px;
    }
    
    .footer-text {
      color: var(--gray-600);
      font-size: 0.8125rem;
    }
    
    a { color: var(--blue-500); text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="logo-row">
        <div class="fox-logo">${SHAPESHIFT_FOX_SVG}</div>
        <span class="brand-text">GTM Packet</span>
      </div>
      
      <h1>${protocolName} ${titleNoun}</h1>
      <p class="tagline">${brief.gtmOneSentence}</p>
      
      <div class="meta">
        <div class="meta-item">
          <span class="tier-badge">${tierLabel}</span>
        </div>
        <div class="meta-item">
          Generated ${new Date().toISOString().split('T')[0]}
        </div>
        <div class="meta-item">
          Status: Ready
        </div>
      </div>
      
      <div class="cta-row">
        <a href="checklist.md" class="cta-primary">
          Start Checklist
        </a>
        <a href="partner/partner_kit.md" class="cta-secondary">
          Partner Kit
        </a>
      </div>
    </div>
  </div>

  <div class="container">
    <h2>Marketing Brief</h2>
    
    <div class="highlight-box">
      <div class="label">Key Message</div>
      <div class="value">${brief.keyMessages.primary}</div>
    </div>
    
    <div class="card">
      <div class="card-title">Target Audience</div>
      <p>${brief.targetAudience.who}</p>
      <p style="margin-top: 0.5rem; font-style: italic; color: var(--gray-500);">${brief.targetAudience.psychographics}</p>
    </div>
    
    <div class="card">
      <div class="card-title">Problem We're Solving</div>
      <p>${brief.problemSolved.problem}</p>
      <p style="margin-top: 0.5rem;"><strong>Aha moment:</strong> ${brief.problemSolved.ahaMonent}</p>
    </div>
    
    <div class="card">
      <div class="card-title">Tweet-Ready</div>
      <p>"${brief.keyMessages.tweetReady}"</p>
    </div>

    <h2>Content Drafts</h2>

    <h3>Social Media</h3>
    <div class="files">
      <div class="file" onclick="window.location='drafts/x_post_main.md'">
        <div class="file-name">x_post_main.md</div>
        <div class="file-desc">Main Twitter thread (@ShapeShift)</div>
      </div>
      <div class="file" onclick="window.location='drafts/x_post_blog.md'">
        <div class="file-name">x_post_blog.md</div>
        <div class="file-desc">Blog promo tweet (@ShapeShift)</div>
      </div>
      <div class="file" onclick="window.location='drafts/x_post_personal.md'">
        <div class="file-name">x_post_personal.md</div>
        <div class="file-desc">Your personal QT</div>
      </div>
      <div class="file" onclick="window.location='drafts/discord_post.md'">
        <div class="file-name">discord_post.md</div>
        <div class="file-desc">Discord #announcements</div>
      </div>
      <div class="file" onclick="window.location='drafts/discord_reminder.md'">
        <div class="file-name">discord_reminder.md</div>
        <div class="file-desc">Discord reminder/update</div>
      </div>
      <div class="file" onclick="window.location='drafts/blog_draft.md'">
        <div class="file-name">blog_draft.md</div>
        <div class="file-desc">Full blog for Strapi</div>
      </div>
      <div class="file" onclick="window.location='drafts/medium_post.md'">
        <div class="file-name">medium_post.md</div>
        <div class="file-desc">Medium cross-post</div>
      </div>
    </div>

    <h3>Follow-ups (Days 1-7)</h3>
    <div class="files">
      <div class="file" onclick="window.location='drafts/followup_educational.md'">
        <div class="file-name">followup_educational.md</div>
        <div class="file-desc">Day 1 educational thread</div>
      </div>
      <div class="file" onclick="window.location='drafts/followup_metrics.md'">
        <div class="file-name">followup_metrics.md</div>
        <div class="file-desc">Day 4-6 metrics thread</div>
      </div>
      <div class="file" onclick="window.location='drafts/followup_recap.md'">
        <div class="file-name">followup_recap.md</div>
        <div class="file-desc">Day 7 recap</div>
      </div>
    </div>
${extra?.seoArticles?.length ? `
    <h3>SEO Articles</h3>
    <div class="files">
      ${extra.seoArticles.map((_, i) => `
      <div class="file" onclick="window.location='seo/seo_article_${String(i + 1).padStart(2, '0')}.md'">
        <div class="file-name">seo_article_${String(i + 1).padStart(2, '0')}.md</div>
        <div class="file-desc">SEO article ${i + 1}</div>
      </div>`).join('')}
    </div>
` : ''}${extra?.contentCalendar ? `
    <h3>Content Calendar</h3>
    <div class="files">
      <div class="file" onclick="window.location='calendar/content_calendar.md'">
        <div class="file-name">content_calendar.md</div>
        <div class="file-desc">4-week content calendar</div>
      </div>
    </div>
` : ''}

    <h2>Partner & Press</h2>
    
    <h3>Partner Materials</h3>
    <div class="files">
      <div class="file" onclick="window.location='partner/partner_kit.md'">
        <div class="file-name">partner_kit.md</div>
        <div class="file-desc">Send to ${protocolName} team</div>
      </div>
    </div>

    <h3>Press Materials</h3>
    <div class="files">
      <div class="file" onclick="window.location='press/press_release.md'">
        <div class="file-name">press_release.md</div>
        <div class="file-desc">Formal press release</div>
      </div>
      <div class="file" onclick="window.location='press/pr_brief.md'">
        <div class="file-name">pr_brief.md</div>
        <div class="file-desc">Talking points</div>
      </div>
      <div class="file" onclick="window.location='press/op_ed_political.md'">
        <div class="file-name">op_ed_political.md</div>
        <div class="file-desc">Political/regulatory angle</div>
      </div>
      <div class="file" onclick="window.location='press/op_ed_technical.md'">
        <div class="file-name">op_ed_technical.md</div>
        <div class="file-desc">Technical/builder angle</div>
      </div>
    </div>

    <h2>Design & Outreach</h2>
    
    <h3>Design</h3>
    <div class="files">
      <div class="file" onclick="window.location='design/design_brief.md'">
        <div class="file-name">design_brief.md</div>
        <div class="file-desc">For human designers</div>
      </div>
      <div class="file" onclick="window.location='design/ai_prompts.txt'">
        <div class="file-name">ai_prompts.txt</div>
        <div class="file-desc">Midjourney/DALL-E prompts</div>
      </div>
    </div>

    <h3>Outreach</h3>
    <div class="files">
      <div class="file" onclick="window.location='outreach/dm_targets.md'">
        <div class="file-name">dm_targets.md</div>
        <div class="file-desc">Who to DM + templates</div>
      </div>
    </div>

    <h2>Protocol Analysis</h2>
    <div class="card">
      <p><strong>Category:</strong> ${analysis.category}</p>
      <p><strong>Tagline:</strong> ${analysis.tagline}</p>
    </div>
    <div class="card">
      <div class="card-title">Key Features</div>
      <ul>
        ${analysis.keyFeatures.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    </div>
    <div class="card">
      <div class="card-title">Value Proposition</div>
      <p>${analysis.valueProposition}</p>
    </div>
  </div>

  <footer>
    <div class="footer-content">
      <div class="footer-brand">
        ${SHAPESHIFT_FOX_SVG}
        <span class="footer-text">ShapeShift GTM Coordinator</span>
      </div>
      <div class="footer-text">
        Questions? Ping <a href="https://discord.gg/shapeshift">Apotheosis on Discord</a>
      </div>
    </div>
  </footer>
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
  onProgress?: (step: string) => void,
  opts: FullPacketOptions = {}
): Promise<FullPacketResults> {
  const progress = onProgress || (() => {});
  const {
    contextContent = '',
    campaignType = 'integration',
    ctaUrl = 'app.shapeshift.com',
    calendarWeeks = 4,
    seoCount = 1,
  } = opts;
  const options: FullPacketOptions = { ...opts, campaignType, ctaUrl, calendarWeeks, seoCount };

  // Step 1: Fetch website and merge context
  progress('Fetching website content...');
  const { content: websiteContent } = await fetchWebsiteContent(websiteUrl);
  const mergedContent = contextContent
    ? `## Primary Source (${websiteUrl})\n\n${websiteContent}\n\n---\n\n## Additional Context\n\n${contextContent}`
    : websiteContent;

  // Step 2: Analyze protocol
  progress('Analyzing protocol...');
  const protocol = await analyzeProtocol(protocolName, mergedContent);

  // Step 3: Generate marketing brief
  progress('Generating marketing brief...');
  const marketingBrief = await generateMarketingBrief(protocolName, protocol, options);

  // Step 3.5: Pull in timely context for press angles (best-effort)
  progress('Fetching current events for press angles...');
  const [politicalContext, technicalContext] = await Promise.all([
    buildCurrentEventsContext('political', protocolName, protocol),
    buildCurrentEventsContext('technical', protocolName, protocol),
  ]);

  // Step 4: Generate all content in parallel
  progress('Generating content (this takes a moment)...');
  const [
    xPostMain,
    xPostBlog,
    xPostPersonal,
    discordPost,
    discordReminder,
    blogDraft,
    mediumPost,
    followupEducational,
    partnerKit,
    pressRelease,
    prBrief,
    opEdPolitical,
    opEdTechnical,
    dmTargets,
    wildCards,
  ] = await Promise.all([
    generateMainTwitterThread(protocolName, protocol, marketingBrief, options),
    generateXBlogPromoTweet(protocolName, protocol, marketingBrief, options),
    generatePersonalTwitterPost(protocolName, protocol, options),
    generateDiscordPost(protocolName, protocol, options),
    generateDiscordReminder(protocolName, protocol, marketingBrief, options),
    generateBlogDraft(protocolName, protocol, marketingBrief, options),
    generateMediumPost(protocolName, protocol, marketingBrief, options),
    generateFollowupEducational(protocolName, protocol),
    generatePartnerKit(protocolName, protocol, marketingBrief, options),
    generatePressRelease(protocolName, protocol, marketingBrief),
    generatePRBrief(protocolName, protocol, marketingBrief),
    generateOpEdPolitical(protocolName, protocol, politicalContext),
    generateOpEdTechnical(protocolName, protocol, technicalContext),
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
    generateFollowupRecap(protocolName, protocol, protocolContext, options),
    generateDesignBrief(protocolName, protocol),
    generateAIPrompts(protocolName, protocol),
  ]);

  // Step 6: Generate SEO articles and content calendar
  progress('Generating SEO article(s) and content calendar...');
  const seoArticles: string[] = [];
  for (let i = 0; i < seoCount; i++) {
    seoArticles.push(await generateSeoArticle(protocolName, protocol, marketingBrief, options));
  }
  const contentCalendar = generateContentCalendar(protocolName, protocol, marketingBrief, options, {
    discordReminder,
  });

  // Step 7: Generate checklist, index, and marketing brief markdown
  progress('Generating checklist and index...');
  const checklist = generateChecklist(protocolName, tier, protocol, marketingBrief, options);
  const indexHtml = generateIndexHtml(protocolName, tier, protocol, marketingBrief, { seoArticles, contentCalendar, opts: options });
  const marketingBriefMarkdown = generateMarketingBriefMarkdown(protocolName, marketingBrief, protocol, options);

  return {
    protocol,
    marketingBrief,
    marketingBriefMarkdown,
    content: {
      xPostMain,
      xPostBlog,
      infoBotQT,
      discordPost,
      discordReminder,
      farcasterPost: discordPost, // Similar format
      followupEducational,
      followupMetrics,
      followupRecap,
      xPostPersonal,
      personalWalkthrough: xPostPersonal, // Can be expanded
      blogDraft,
      mediumPost,
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
    seoArticles,
    contentCalendar,
  };
}
