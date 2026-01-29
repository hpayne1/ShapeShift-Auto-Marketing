import { generateContent, generateJSON } from './openai.js';
import { fetchWebsiteContent } from './webFetch.js';

// ============================================================================
// SHAPESHIFT BRAND CONTEXT
// ============================================================================

const SHAPESHIFT_BRAND_CONTEXT = `
## ShapeShift Brand Context

**Vision:** A world where anyone, anywhere can seamlessly access decentralized finance. A self-custodial future of sovereign finance that is open, borderless, and in your hands.

**Mission:** ShapeShift is a global community of high-quality builders accelerating access to a decentralized, self-sovereign financial system. With no custody, open code, and modular DeFi tools, we empower individuals to connect directly with the open protocols shaping the future.

**Brand Voice:**
- Speak in 3rd person omniscient (authoritative and trusted)
- Principled: Self-custody is king, privacy is a human right, open source transparency, no KYC, decentralization & free markets
- Empowering: Show users the value clearly, let users visualize themselves in control
- Community-minded: Highlight user journeys, spotlight contributors and partners
- Visionary: Post about macro trends, crosschain flows, and ecosystem shifts

**Content Guidelines:**
- Clean, simple messaging that highlights user value
- CTAs should incite curiosity, pose questions, and drive action
- Use data and metrics when available
- Educational but not condescending
- Never post faces from main account - faces belong to humans, not brands
- Product posts should be quotable by contributors with added context
`;

// ============================================================================
// PROTOCOL ANALYSIS
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

export async function analyzeProtocol(
  protocolName: string,
  websiteContent: string
): Promise<ProtocolAnalysis> {
  const systemPrompt = `You are a DeFi protocol analyst. Analyze the provided website content and extract key information about the protocol. Be thorough but concise.`;

  const userPrompt = `
Analyze this DeFi protocol and provide a structured analysis:

Protocol Name: ${protocolName}

Website Content:
${websiteContent}

Provide analysis as JSON with these fields:
- name: Official protocol name
- tagline: One-line description of what they do
- category: Protocol category (DEX, Lending, Yield, Bridge, etc.)
- keyFeatures: Array of 3-5 key features
- targetAudience: Array of target user types
- valueProposition: Core value proposition in 1-2 sentences
- technicalHighlights: Array of notable technical aspects
- integrationOpportunities: Array of ways ShapeShift could integrate or partner
- risks: Array of potential risks or concerns
- competitorComparison: Brief comparison to similar protocols
`;

  return generateJSON<ProtocolAnalysis>(systemPrompt, userPrompt, { temperature: 0.3 });
}

// ============================================================================
// GTM STRATEGY GENERATION
// ============================================================================

export async function generateGTMStrategy(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const systemPrompt = `You are a crypto marketing strategist working for ShapeShift DAO. Create comprehensive go-to-market strategies for protocol integrations.

${SHAPESHIFT_BRAND_CONTEXT}`;

  const userPrompt = `
Create a comprehensive Go-To-Market strategy for ShapeShift's integration with ${protocolName}.

Protocol Analysis:
${JSON.stringify(analysis, null, 2)}

Generate a GTM strategy document in markdown format with:

1. **Executive Summary** - 2-3 sentence overview
2. **Integration Overview** - What the integration enables for ShapeShift users
3. **Key Messages** - 3-5 core messages to communicate
4. **Target Audiences** - Who we're reaching and why they care
5. **Marketing Activations** - Specific campaigns and tactics:
   - Launch day activities
   - Social media strategy
   - Community engagement
   - Partner co-marketing opportunities
   - Educational content ideas
6. **Success Metrics** - What we'll measure
7. **Timeline** - Suggested rollout phases
8. **Risks & Mitigations** - Potential issues and how to address them
9. **Talking Points** - Key points for calls/meetings with the protocol team

Be specific and actionable. Use ShapeShift's brand voice throughout.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 4096 });
}

// ============================================================================
// CONTENT GENERATION
// ============================================================================

export async function generateTwitterThread(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const systemPrompt = `You are a crypto social media expert writing for ShapeShift's main Twitter/X account.

${SHAPESHIFT_BRAND_CONTEXT}

Twitter-specific guidelines:
- Write in 3rd person omniscient (ShapeShift announces, ShapeShift now supports)
- Each tweet should be under 280 characters
- Use relevant emojis sparingly
- Include a clear CTA in the final tweet
- Make it quotable by contributors who can add personal context
- Focus on user benefits, not technical features`;

  const userPrompt = `
Create a Twitter/X thread announcing ShapeShift's integration with ${protocolName}.

Protocol Info:
- Name: ${analysis.name}
- Tagline: ${analysis.tagline}
- Key Features: ${analysis.keyFeatures.join(', ')}
- Value Proposition: ${analysis.valueProposition}

Generate a 4-6 tweet thread in this format:
- Tweet 1: Hook/announcement (generate excitement)
- Tweet 2-4: Key benefits for users
- Tweet 5: How to use it (simple CTA)
- Tweet 6: Tag the protocol, invite community engagement

Format each tweet clearly numbered. Include suggested hashtags at the end.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.8 });
}

export async function generateDiscordAnnouncement(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const systemPrompt = `You are writing Discord announcements for ShapeShift DAO's community.

${SHAPESHIFT_BRAND_CONTEXT}

Discord-specific guidelines:
- More detailed than Twitter, but still scannable
- Use Discord formatting (bold, bullet points)
- Include relevant links placeholders
- Encourage community discussion
- Celebratory but informative tone`;

  const userPrompt = `
Create a Discord announcement for ShapeShift's integration with ${protocolName}.

Protocol Info:
${JSON.stringify(analysis, null, 2)}

Generate a Discord announcement with:
1. Exciting headline with emoji
2. What this integration means for users (3-4 bullet points)
3. How to try it (simple steps)
4. Links section (use [LINK] placeholders)
5. Call for community feedback/questions
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7 });
}

export async function generateBlogOutline(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const systemPrompt = `You are a crypto content writer creating blog outlines for ShapeShift.

${SHAPESHIFT_BRAND_CONTEXT}

Blog guidelines:
- Educational but engaging
- Help readers understand both the protocol AND why the integration matters
- Include sections for different reader levels (newcomers and experienced)
- SEO-friendly structure`;

  const userPrompt = `
Create a blog post outline for announcing ShapeShift's integration with ${protocolName}.

Protocol Info:
${JSON.stringify(analysis, null, 2)}

Generate a detailed blog outline with:
1. Title options (3 alternatives)
2. Meta description (under 160 chars)
3. Introduction hook
4. Section breakdown with bullet points for each section:
   - What is ${protocolName}?
   - What does this integration enable?
   - How to use it (with screenshots suggestions)
   - Why this matters for DeFi
   - Getting started guide
5. Conclusion with CTA
6. Suggested tags/categories
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.6 });
}

export async function generateBlogDraft(
  protocolName: string,
  analysis: ProtocolAnalysis,
  outline: string
): Promise<string> {
  const systemPrompt = `You are a crypto content writer creating blog posts for ShapeShift.

${SHAPESHIFT_BRAND_CONTEXT}

Blog guidelines:
- Engaging, educational tone
- Break up text with headers, bullets, and short paragraphs
- Include placeholders for images/screenshots
- Natural integration of keywords for SEO
- Clear CTAs throughout`;

  const userPrompt = `
Write a full blog post based on this outline:

${outline}

Protocol Info:
${JSON.stringify(analysis, null, 2)}

Write a complete blog post (800-1200 words) that:
- Hooks readers in the first paragraph
- Explains the protocol simply
- Highlights user benefits
- Includes a step-by-step guide section
- Ends with a strong CTA

Use [IMAGE: description] placeholders for suggested visuals.
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 4096 });
}

export async function generatePartnerBrief(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<string> {
  const systemPrompt = `You are writing internal partner communication briefs for ShapeShift.

${SHAPESHIFT_BRAND_CONTEXT}

Partner brief guidelines:
- Professional but friendly tone
- Focus on mutual benefits
- Include clear asks and offers
- Highlight co-marketing opportunities`;

  const userPrompt = `
Create a partner communication brief for the ${protocolName} team.

Protocol Info:
${JSON.stringify(analysis, null, 2)}

Generate a partner brief with:
1. Introduction (who ShapeShift is, why we're excited)
2. Integration overview (what we're proposing/have built)
3. Co-marketing opportunities:
   - Joint announcements
   - Social media coordination
   - Community events
   - Content collaboration
4. What we need from them:
   - Technical support
   - Marketing assets
   - Review/approval timeline
5. Proposed timeline
6. Contact/next steps
`;

  return generateContent(systemPrompt, userPrompt, { temperature: 0.6 });
}

export async function generateReleaseNotes(
  protocolName: string,
  analysis: ProtocolAnalysis
): Promise<{ short: string; long: string }> {
  const systemPrompt = `You are writing release notes for ShapeShift product updates.

${SHAPESHIFT_BRAND_CONTEXT}

Release notes guidelines:
- Concise and scannable
- Focus on what users can now DO
- Technical accuracy
- Professional tone`;

  const shortPrompt = `
Write SHORT release notes (2-3 sentences) for ${protocolName} integration.
Protocol: ${analysis.tagline}
Key features: ${analysis.keyFeatures.slice(0, 3).join(', ')}

Format: Brief announcement suitable for changelog or app update notes.
`;

  const longPrompt = `
Write DETAILED release notes for ${protocolName} integration.

Protocol Info:
${JSON.stringify(analysis, null, 2)}

Include:
- What's new (bullet points)
- How to use it
- Technical details (if relevant)
- Known limitations (if any)
- Links placeholders
`;

  const [short, long] = await Promise.all([
    generateContent(systemPrompt, shortPrompt, { temperature: 0.5, maxTokens: 500 }),
    generateContent(systemPrompt, longPrompt, { temperature: 0.5, maxTokens: 1500 }),
  ]);

  return { short, long };
}

// ============================================================================
// MAIN RESEARCH ORCHESTRATOR
// ============================================================================

export interface ResearchResults {
  protocol: ProtocolAnalysis;
  strategy: string;
  content: {
    twitter: string;
    discord: string;
    blogOutline: string;
    blogDraft: string;
    partnerBrief: string;
    releaseNotesShort: string;
    releaseNotesLong: string;
  };
}

export async function runResearch(
  protocolName: string,
  websiteUrl: string,
  onProgress?: (step: string) => void
): Promise<ResearchResults> {
  const progress = onProgress || (() => {});

  // Step 1: Fetch website content
  progress('Fetching website content...');
  const { content: websiteContent } = await fetchWebsiteContent(websiteUrl);

  // Step 2: Analyze protocol
  progress('Analyzing protocol...');
  const protocol = await analyzeProtocol(protocolName, websiteContent);

  // Step 3: Generate GTM strategy
  progress('Generating GTM strategy...');
  const strategy = await generateGTMStrategy(protocolName, protocol);

  // Step 4: Generate all content in parallel
  progress('Generating content drafts...');
  const [twitter, discord, blogOutline, partnerBrief, releaseNotes] = await Promise.all([
    generateTwitterThread(protocolName, protocol),
    generateDiscordAnnouncement(protocolName, protocol),
    generateBlogOutline(protocolName, protocol),
    generatePartnerBrief(protocolName, protocol),
    generateReleaseNotes(protocolName, protocol),
  ]);

  // Step 5: Generate blog draft (needs outline first)
  progress('Generating blog draft...');
  const blogDraft = await generateBlogDraft(protocolName, protocol, blogOutline);

  return {
    protocol,
    strategy,
    content: {
      twitter,
      discord,
      blogOutline,
      blogDraft,
      partnerBrief,
      releaseNotesShort: releaseNotes.short,
      releaseNotesLong: releaseNotes.long,
    },
  };
}
