import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan, writeDraft, listDrafts } from '../lib/io.js';
import { appendHistory } from '../lib/history.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';

export const enrichCommand = new Command('enrich')
  .description('Enrich a GTM plan with draft content placeholders')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .option('--pr <urls...>', 'PR URL(s)')
  .option('--preview <url>', 'Preview URL')
  .option('--what-changed <bullets...>', 'What changed bullets')
  .option('--canonical-url <url>', 'Canonical tracking URL')
  .option('--dashboard <urls...>', 'Dashboard URL(s)')
  .action((options) => {
    try {
      // Read existing plan
      const plan = readPlan(options.id);
      const changes: string[] = [];
      
      // Add PR links to provenance
      if (options.pr && options.pr.length > 0) {
        for (const prUrl of options.pr) {
          const exists = plan.provenance.git.prs.some(p => p.url === prUrl);
          if (!exists) {
            plan.provenance.git.prs.push({ url: prUrl });
            plan.provenance.inputs.push({ type: 'pr', url: prUrl });
          }
        }
        changes.push(`Added ${options.pr.length} PR link(s)`);
        console.log(chalk.green(`✅ Added ${options.pr.length} PR link(s)`));
      }
      
      // Add preview URL to inputs
      if (options.preview) {
        const exists = plan.provenance.inputs.some(i => i.url === options.preview);
        if (!exists) {
          plan.provenance.inputs.push({ type: 'other', url: options.preview, notes: 'Preview URL' });
        }
        changes.push('Added preview URL');
        console.log(chalk.green(`✅ Added preview URL`));
      }
      
      // Set canonical URL
      if (options.canonicalUrl) {
        plan.tracking.canonical_url = options.canonicalUrl;
        changes.push('Set canonical URL');
        console.log(chalk.green(`✅ Set canonical URL`));
      }
      
      // Add dashboard URLs
      if (options.dashboard && options.dashboard.length > 0) {
        for (const url of options.dashboard) {
          if (!plan.tracking.dashboard_urls.includes(url)) {
            plan.tracking.dashboard_urls.push(url);
          }
        }
        changes.push(`Added ${options.dashboard.length} dashboard URL(s)`);
        console.log(chalk.green(`✅ Added ${options.dashboard.length} dashboard URL(s)`));
      }
      
      // What changed bullets (used for draft generation)
      const whatChanged = options.whatChanged || [];
      
      // Generate draft files for enabled channels
      const existingDrafts = listDrafts(options.id);
      
      // Release notes
      if (plan.channels.release_notes.enabled || plan.channels.changelog.enabled) {
        if (!existingDrafts.includes('release_notes_short.md')) {
          const content = generateReleaseNotesShort(plan.title, whatChanged);
          const path = writeDraft(options.id, 'release_notes_short.md', content);
          plan.content_outputs.release_notes_short.artifact_path = path;
          plan.content_outputs.release_notes_short.status = 'generated';
          plan.channels.release_notes.artifact_path = path;
          console.log(chalk.yellow(`📝 Generated release notes (short)`));
        }
        
        if (!existingDrafts.includes('release_notes_long.md')) {
          const content = generateReleaseNotesLong(plan.title, whatChanged);
          const path = writeDraft(options.id, 'release_notes_long.md', content);
          plan.content_outputs.release_notes_long.artifact_path = path;
          plan.content_outputs.release_notes_long.status = 'generated';
          console.log(chalk.yellow(`📝 Generated release notes (long)`));
        }
      }
      
      // App store notes
      if (plan.channels.app_store_ios.enabled) {
        if (!existingDrafts.includes('app_store_ios.md')) {
          const content = generateAppStoreNotes(plan.title, 'iOS', whatChanged);
          const path = writeDraft(options.id, 'app_store_ios.md', content);
          plan.content_outputs.app_store_ios.artifact_path = path;
          plan.content_outputs.app_store_ios.status = 'generated';
          plan.channels.app_store_ios.artifact_path = path;
          console.log(chalk.yellow(`📝 Generated iOS app store notes`));
        }
      }
      
      if (plan.channels.app_store_android.enabled) {
        if (!existingDrafts.includes('app_store_android.md')) {
          const content = generateAppStoreNotes(plan.title, 'Android', whatChanged);
          const path = writeDraft(options.id, 'app_store_android.md', content);
          plan.content_outputs.app_store_android.artifact_path = path;
          plan.content_outputs.app_store_android.status = 'generated';
          plan.channels.app_store_android.artifact_path = path;
          console.log(chalk.yellow(`📝 Generated Android app store notes`));
        }
      }
      
      // Social drafts
      if (plan.channels.discord.enabled && !existingDrafts.includes('discord_post.md')) {
        const content = generateSocialDraft(plan.title, 'discord', whatChanged);
        const path = writeDraft(options.id, 'discord_post.md', content);
        plan.content_outputs.discord_post.artifact_path = path;
        plan.content_outputs.discord_post.status = 'generated';
        plan.channels.discord.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated Discord post`));
      }
      
      if (plan.channels.x.enabled && !existingDrafts.includes('x_post.md')) {
        const content = generateSocialDraft(plan.title, 'x', whatChanged);
        const path = writeDraft(options.id, 'x_post.md', content);
        plan.content_outputs.x_post.artifact_path = path;
        plan.content_outputs.x_post.status = 'generated';
        plan.channels.x.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated X/Twitter post`));
      }
      
      if (plan.channels.reddit.enabled && !existingDrafts.includes('reddit_post.md')) {
        const content = generateSocialDraft(plan.title, 'reddit', whatChanged);
        const path = writeDraft(options.id, 'reddit_post.md', content);
        plan.content_outputs.reddit_post.artifact_path = path;
        plan.content_outputs.reddit_post.status = 'generated';
        plan.channels.reddit.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated Reddit post`));
      }
      
      if (plan.channels.farcaster.enabled && !existingDrafts.includes('farcaster_post.md')) {
        const content = generateSocialDraft(plan.title, 'farcaster', whatChanged);
        const path = writeDraft(options.id, 'farcaster_post.md', content);
        plan.content_outputs.farcaster_post.artifact_path = path;
        plan.content_outputs.farcaster_post.status = 'generated';
        plan.channels.farcaster.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated Farcaster post`));
      }
      
      // Blog
      if (plan.channels.blog.enabled) {
        if (!existingDrafts.includes('blog_outline.md')) {
          const content = generateBlogOutline(plan.title, whatChanged);
          const path = writeDraft(options.id, 'blog_outline.md', content);
          plan.content_outputs.blog_outline.artifact_path = path;
          plan.content_outputs.blog_outline.status = 'generated';
          console.log(chalk.yellow(`📝 Generated blog outline`));
        }
        
        if (!existingDrafts.includes('blog_draft.md')) {
          const content = generateBlogDraft(plan.title, whatChanged);
          const path = writeDraft(options.id, 'blog_draft.md', content);
          plan.content_outputs.blog_draft.artifact_path = path;
          plan.content_outputs.blog_draft.status = 'generated';
          plan.channels.blog.artifact_path = path;
          console.log(chalk.yellow(`📝 Generated blog draft`));
        }
      }
      
      // Partner brief
      if (plan.channels.partner_outbounds.enabled && !existingDrafts.includes('partner_brief.md')) {
        const content = generatePartnerBrief(plan.title, whatChanged);
        const path = writeDraft(options.id, 'partner_brief.md', content);
        plan.content_outputs.partner_brief.artifact_path = path;
        plan.content_outputs.partner_brief.status = 'generated';
        plan.channels.partner_outbounds.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated partner brief`));
      }
      
      // Email template
      if (plan.channels.email.enabled && !existingDrafts.includes('email_template.md')) {
        const content = generateEmailTemplate(plan.title, whatChanged);
        const path = writeDraft(options.id, 'email_template.md', content);
        plan.content_outputs.email_template.artifact_path = path;
        plan.content_outputs.email_template.status = 'generated';
        plan.channels.email.artifact_path = path;
        console.log(chalk.yellow(`📝 Generated email template`));
      }
      
      // Add asset placeholders for required assets
      for (const requiredAsset of plan.assets.required) {
        const exists = plan.assets.items.some(a => a.type === requiredAsset);
        if (!exists) {
          plan.assets.items.push({
            type: requiredAsset as any,
            status: 'pending',
            url: null,
            notes: `[PLACEHOLDER] Required ${requiredAsset}`,
            pii_safe: true,
          });
          console.log(chalk.yellow(`📝 Added ${requiredAsset} asset placeholder`));
        }
      }
      
      // Append history
      appendHistory(plan, 'enrich', `Enriched plan with drafts and inputs`, {
        prs_added: options.pr?.length || 0,
        drafts_generated: listDrafts(options.id).length,
      });
      
      // Write updated plan
      writePlan(plan);
      
      console.log('');
      console.log(chalk.green(`✅ Enriched plan: ${options.id}`));
      console.log('');
      console.log(chalk.dim('Draft files:'));
      for (const draft of listDrafts(options.id)) {
        console.log(`  .gtm/${options.id}/drafts/${draft}`);
      }
      console.log('');
      console.log(chalk.cyan('Next steps:'));
      console.log(`  1. Review and edit drafts in .gtm/${options.id}/drafts/`);
      console.log(`  2. gtm lock --id ${options.id} --sha <commit-sha>`);
      console.log(`  3. gtm set-status --id ${options.id} --field channels.discord.status --value needs_review`);
      console.log(`  4. gtm packet --id ${options.id}`);
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// ============================================================================
// DRAFT GENERATION FUNCTIONS
// ============================================================================

function generateReleaseNotesShort(title: string, whatChanged: string[]): string {
  const bullets = whatChanged.length > 0 
    ? whatChanged.map(b => `• ${b}`).join('\n')
    : '• [PLACEHOLDER: Add key changes]';
    
  return `**${title}**

${bullets}

[PLACEHOLDER: Review and finalize for changelog]`;
}

function generateReleaseNotesLong(title: string, whatChanged: string[]): string {
  const bullets = whatChanged.length > 0 
    ? whatChanged.map(b => `- ${b}`).join('\n')
    : '- [PLACEHOLDER: Add detailed changes]';
    
  return `# ${title}

## Overview
[PLACEHOLDER: Brief description of what this release includes]

## What's New
${bullets}

## How to Use
[PLACEHOLDER: Quick start instructions]

## Technical Details
[PLACEHOLDER: Any relevant technical information]

---
[PLACEHOLDER: Review and finalize before release]`;
}

function generateAppStoreNotes(title: string, platform: string, whatChanged: string[]): string {
  const bullets = whatChanged.length > 0 
    ? whatChanged.map(b => `• ${b}`).join('\n')
    : '• [Key feature 1]\n• [Key feature 2]';

  return `# ${title}

## ${platform} App Store Release Notes

${bullets}
• Bug fixes and performance improvements

---
**Character limit reminder:** 4000 chars for ${platform}

[PLACEHOLDER: Review and ensure compliance with ${platform} guidelines]`;
}

function generateSocialDraft(title: string, platform: string, whatChanged: string[]): string {
  const highlights = whatChanged.length > 0 
    ? whatChanged.slice(0, 3).map(b => `✨ ${b}`).join('\n')
    : '✨ [PLACEHOLDER: Key highlight]';

  const templates: Record<string, string> = {
    discord: `# 🚀 ${title}

${highlights}

[PLACEHOLDER: Add more details, links, and CTAs for Discord]

📖 **Read more:** [link]
💬 **Questions?** Drop them below!

---
**UTM Link:** [Will be generated with \`gtm utm\`]`,

    x: `🚀 ${title}

${highlights}

[PLACEHOLDER: Keep under 280 chars, add relevant hashtags]

Try it now 👇

---
**Note:** Run \`gtm utm --id INIT-#### --channel x\` to generate tracked link`,

    reddit: `# ${title}

${highlights}

[PLACEHOLDER: Reddit-style post - be authentic, add context]

**Links:**
- [Documentation]
- [Try it out]

---
*Suggested flair: [PLACEHOLDER]*
*Subreddit: [PLACEHOLDER]*`,

    farcaster: `${title} is here 🎉

${highlights}

[PLACEHOLDER: Farcaster-optimized content - consider frames]`,
  };

  return templates[platform] || `# ${title}\n\n[PLACEHOLDER: ${platform} draft]`;
}

function generateBlogOutline(title: string, whatChanged: string[]): string {
  const features = whatChanged.length > 0 
    ? whatChanged.map((b, i) => `   ${i + 1}. ${b}`).join('\n')
    : '   1. [PLACEHOLDER: Feature 1]\n   2. [PLACEHOLDER: Feature 2]';

  return `# Blog Post Outline: ${title}

## 1. Hook / Introduction
   - [PLACEHOLDER: Opening hook - why readers should care]
   - Brief context about the problem being solved

## 2. The Problem
   - [PLACEHOLDER: Pain point description]
   - How users experienced this before

## 3. The Solution: ${title}
${features}

## 4. How It Works
   - [PLACEHOLDER: Technical overview (accessible)]
   - Step-by-step usage guide

## 5. Use Cases / Examples
   - [PLACEHOLDER: Real-world scenario 1]
   - [PLACEHOLDER: Real-world scenario 2]

## 6. What's Next
   - [PLACEHOLDER: Future roadmap hints]
   - Call to action

## 7. Resources
   - Documentation link
   - Support channels
   - Related posts

---
**Target length:** 800-1200 words
**SEO keywords:** [PLACEHOLDER]
**Hero image:** [PLACEHOLDER - required for Tier 2]`;
}

function generateBlogDraft(title: string, whatChanged: string[]): string {
  const features = whatChanged.length > 0 
    ? whatChanged.map(b => `### ${b}\n\n[PLACEHOLDER: Expand on this feature]\n`).join('\n')
    : '### [Feature Name]\n\n[PLACEHOLDER: Feature description]\n';

  return `# ${title}

*[PLACEHOLDER: Publication date] • X min read*

![Hero Image](PLACEHOLDER_HERO_IMAGE_URL)

## Introduction

[PLACEHOLDER: Write a compelling introduction that hooks the reader. Explain why this matters and what problem it solves.]

## The Challenge

[PLACEHOLDER: Describe the problem or limitation that users faced before this feature.]

## Introducing ${title}

We're excited to announce ${title.toLowerCase()}. [PLACEHOLDER: Brief announcement statement]

${features}

## How to Get Started

[PLACEHOLDER: Step-by-step guide]

1. **Step 1**: [PLACEHOLDER]
2. **Step 2**: [PLACEHOLDER]
3. **Step 3**: [PLACEHOLDER]

## What's Next

[PLACEHOLDER: Hint at future developments]

## Try It Now

[PLACEHOLDER: Call to action with tracked links - run \`gtm utm\` to generate]

---

*Have questions? Join our [Discord](link) or reach out on [Twitter](link).*

---
**Author:** [PLACEHOLDER]
**Reviewed by:** [PLACEHOLDER]`;
}

function generatePartnerBrief(title: string, whatChanged: string[]): string {
  const features = whatChanged.length > 0 
    ? whatChanged.map(b => `- ${b}`).join('\n')
    : '- [PLACEHOLDER: Key feature 1]\n- [PLACEHOLDER: Key feature 2]';

  return `# Partner Brief: ${title}

## Executive Summary
[PLACEHOLDER: 2-3 sentence summary for partners]

## Key Features
${features}

## Partner Benefits
- [PLACEHOLDER: How this benefits partners]
- [PLACEHOLDER: Integration opportunities]
- [PLACEHOLDER: Co-marketing possibilities]

## Technical Requirements
- [PLACEHOLDER: Any integration requirements]
- [PLACEHOLDER: API changes if applicable]

## Timeline
- **Announcement:** [DATE]
- **General Availability:** [DATE]

## Co-Marketing Opportunities
- [PLACEHOLDER: Joint announcement]
- [PLACEHOLDER: Case study opportunity]
- [PLACEHOLDER: Social amplification]

## Assets Available
- Logo lockup: [PLACEHOLDER]
- Screenshots: [PLACEHOLDER]
- Demo video: [PLACEHOLDER]

## Contact
[PLACEHOLDER: Partner contact information]

---
*Confidential - For partner use only*`;
}

function generateEmailTemplate(title: string, whatChanged: string[]): string {
  const highlights = whatChanged.length > 0 
    ? whatChanged.map(b => `• ${b}`).join('\n')
    : '• [PLACEHOLDER: Key highlight 1]\n• [PLACEHOLDER: Key highlight 2]';

  return `# Email Template: ${title}

## Subject Line Options
1. [PLACEHOLDER: Option 1]
2. [PLACEHOLDER: Option 2]
3. [PLACEHOLDER: Option 3]

## Preview Text
[PLACEHOLDER: Preview text that shows in inbox]

---

## Email Body

Hi [First Name],

[PLACEHOLDER: Opening line - personalized hook]

We're excited to share ${title.toLowerCase()} with you.

**What's New:**
${highlights}

[PLACEHOLDER: Brief explanation of benefits]

**[Primary CTA Button Text]**
[UTM Link - run \`gtm utm --channel email\` to generate]

[PLACEHOLDER: Secondary information or social proof]

Best,
[Team/Signature]

---

## Segmentation Notes
- **Audience:** [PLACEHOLDER]
- **Send time:** [PLACEHOLDER]
- **A/B test:** [PLACEHOLDER]

## Compliance
- [ ] Unsubscribe link included
- [ ] Physical address included
- [ ] GDPR compliant`;
}
