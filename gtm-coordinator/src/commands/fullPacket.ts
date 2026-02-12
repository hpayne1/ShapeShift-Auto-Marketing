import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { generateFullPacket, type FullPacketOptions } from '../lib/fullPacketGenerator.js';
import { fetchWebsiteContent } from '../lib/webFetch.js';
import { extractPr, type PRExtraction } from '../lib/prExtractor.js';
import { enrichProtocol, type ProtocolEnrichment } from '../lib/protocolEnricher.js';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function extractTweetsFromLabeledThread(text: string): string[] {
  // Parses content formatted like:
  // **Tweet 1:**
  // ...
  // **Tweet 2:**
  // ...
  const parts = text.split(/\*\*Tweet\s+\d+:\*\*\s*/g).map(p => p.trim()).filter(Boolean);
  if (!parts.length) return [];
  return parts.map(p => p.replace(/\s+$/g, '').trim());
}

function toCopyPasteSection(title: string, body: string): string {
  return `## ${title}\n\n\`\`\`\n${body.trim()}\n\`\`\`\n`;
}

export const fullPacketCommand = new Command('full-packet')
  .description('Generate a complete GTM packet with all materials (v2)')
  .requiredOption('--protocol <name>', 'Protocol name (e.g., "Yield.xyz" or "rFOX")')
  .requiredOption('--url <url>', 'Protocol website URL')
  .option('--pr <url>', 'ShapeShift GitHub PR URL (source of truth for what shipped)')
  .option('--protocol-twitter <url>', 'Protocol Twitter/X URL (for branding, tone)')
  .option('--protocol-farcaster <url>', 'Protocol Farcaster URL (for branding, tone)')
  .option('--tier <tier>', 'Tier level (0, 1, or 2)', '1')
  .option('--output <dir>', 'Output directory')
  .option('--campaign-type <type>', 'Launch type: integration (external protocol) or program (ShapeShift product)', 'integration')
  .option('--context-url <url>', 'Additional context URL (e.g. wiki). Repeatable.', (v: string, acc: string[]) => [...(acc || []), v], [] as string[])
  .option('--context-file <path>', 'Additional context file path. Repeatable.', (v: string, acc: string[]) => [...(acc || []), v], [] as string[])
  .option('--cta <url>', 'Primary CTA URL (e.g. app.shapeshift.com/#/fox-ecosystem)')
  .option('--calendar-weeks <n>', 'Number of weeks for content calendar', '4')
  .option('--seo-count <n>', 'Number of SEO articles to generate', '1')
  .action(async (options) => {
    const { protocol, url, tier, output, campaignType, contextUrl, contextFile, cta, calendarWeeks, seoCount, pr: prUrl, protocolTwitter, protocolFarcaster } = options;
    const tierNum = parseInt(tier, 10);

    // Validate URL
    try {
      new URL(url);
    } catch {
      console.error(chalk.red(`Error: Invalid URL: ${url}`));
      process.exit(1);
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error(chalk.red('Error: OPENAI_API_KEY environment variable is required.'));
      console.error(chalk.yellow('Set it with: export OPENAI_API_KEY="sk-..."'));
      process.exit(1);
    }

    const contextUrls = Array.isArray(contextUrl) ? contextUrl : contextUrl ? [contextUrl] : [];
    const contextFiles = Array.isArray(contextFile) ? contextFile : contextFile ? [contextFile] : [];

    console.log(chalk.blue.bold(`\n🚀 Generating Full GTM Packet for ${protocol}...\n`));
    console.log(chalk.gray(`URL: ${url}`));
    console.log(chalk.gray(`Tier: ${tierNum}`));
    console.log(chalk.gray(`Campaign type: ${campaignType}`));
    if (prUrl) console.log(chalk.gray(`PR (source of truth): ${prUrl}`));
    if (protocolTwitter) console.log(chalk.gray(`Protocol Twitter: ${protocolTwitter}`));
    if (protocolFarcaster) console.log(chalk.gray(`Protocol Farcaster: ${protocolFarcaster}`));
    if (contextUrls.length) console.log(chalk.gray(`Context URLs: ${contextUrls.join(', ')}`));
    if (contextFiles.length) console.log(chalk.gray(`Context files: ${contextFiles.join(', ')}`));
    if (cta) console.log(chalk.gray(`CTA: ${cta}`));
    console.log();

    try {
      const startTime = Date.now();

      // PR extraction (source of truth)
      let prExtraction: PRExtraction | undefined;
      if (prUrl) {
        console.log(chalk.cyan('  → Extracting PR (source of truth)...'));
        try {
          prExtraction = await extractPr(prUrl);
          console.log(chalk.gray(`    PR: ${prExtraction.title}`));
        } catch (e) {
          console.warn(chalk.yellow(`  ⚠ PR extraction failed: ${(e as Error).message}`));
        }
      }

      // Protocol enrichment (website + Twitter + Farcaster)
      let protocolEnrichment: ProtocolEnrichment | undefined;
      if (protocolTwitter || protocolFarcaster) {
        console.log(chalk.cyan('  → Enriching from protocol social...'));
        try {
          protocolEnrichment = await enrichProtocol({
            websiteUrl: url,
            twitterUrl: protocolTwitter,
            farcasterUrl: protocolFarcaster,
          });
          if (protocolEnrichment.twitter) console.log(chalk.gray('    Twitter: OK'));
          if (protocolEnrichment.farcaster) console.log(chalk.gray('    Farcaster: OK'));
        } catch (e) {
          console.warn(chalk.yellow(`  ⚠ Protocol enrichment failed: ${(e as Error).message}`));
        }
      }

      // Build context content from PR, enrichment, URLs and files
      let contextContent = '';
      if (prExtraction) {
        contextContent += `
## PR (Source of Truth: ${prExtraction.url})

**Title:** ${prExtraction.title}

**Feature Summary:** ${prExtraction.featureSummary}

**Description:**
${prExtraction.description || '(none)'}

**Files Changed:** ${prExtraction.filesChanged.join(', ') || '(none)'}
**Labels:** ${prExtraction.labels.join(', ') || '(none)'}
`;
      }
      if (protocolEnrichment?.website) {
        contextContent += `
## Protocol Website Enrichment
**Tagline:** ${protocolEnrichment.website.tagline || '(none)'}
**Hero:** ${protocolEnrichment.website.heroCopy || '(none)'}
**Terminology:** ${protocolEnrichment.website.terminology?.join(', ') || '(none)'}
`;
      }
      if (protocolEnrichment?.twitter) {
        contextContent += `
## Protocol Twitter Tone / Recent Posts
${protocolEnrichment.twitter.recentPosts?.slice(0, 5).map((p) => `- ${p}`).join('\n') || '(none)'}
`;
      }
      if (protocolEnrichment?.farcaster) {
        contextContent += `
## Protocol Farcaster Tone / Recent Casts
${protocolEnrichment.farcaster.recentCasts?.slice(0, 5).map((c) => `- ${c}`).join('\n') || '(none)'}
`;
      }
      for (const u of contextUrls) {
        try {
          const { content } = await fetchWebsiteContent(u);
          contextContent += `\n\n## Context from ${u}\n\n${content}`;
        } catch (e) {
          console.warn(chalk.yellow(`  ⚠ Could not fetch context URL ${u}`));
        }
      }
      for (const f of contextFiles) {
        try {
          const content = fs.readFileSync(f, 'utf-8');
          contextContent += `\n\n## Context from file: ${f}\n\n${content}`;
        } catch (e) {
          console.warn(chalk.yellow(`  ⚠ Could not read context file ${f}`));
        }
      }

      const packetOpts: FullPacketOptions = {
        contextContent: contextContent.trim() || undefined,
        campaignType: campaignType === 'program' ? 'program' : 'integration',
        ctaUrl: cta,
        calendarWeeks: parseInt(calendarWeeks, 10) || 4,
        seoCount: parseInt(seoCount, 10) || 1,
      };

      // Generate the full packet
      const results = await generateFullPacket(protocol, url, tierNum, (step) => {
        console.log(chalk.cyan(`  → ${step}`));
      }, packetOpts);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(chalk.green(`\n✅ Packet generated in ${elapsed}s!\n`));

      // Determine output directory
      const outputDir = output || path.join(process.cwd(), 'research-output', protocol.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-'));

      // Create all directories
      const dirs = ['drafts', 'research', 'partner', 'press', 'design', 'outreach', 'intelligence', 'seo', 'calendar'];
      ensureDir(outputDir);
      dirs.forEach(d => ensureDir(path.join(outputDir, d)));

      // Write all files
      console.log(chalk.blue('Writing files...\n'));

      // Core files
      fs.writeFileSync(path.join(outputDir, 'index.html'), results.indexHtml);
      console.log(chalk.gray('  → index.html'));

      fs.writeFileSync(path.join(outputDir, 'checklist.md'), results.checklist);
      console.log(chalk.gray('  → checklist.md'));
      fs.writeFileSync(path.join(outputDir, 'checklist.html'), results.checklistHtml);
      console.log(chalk.green('  → checklist.html') + chalk.yellow(' ← START HERE (open in browser)'));

      const viewTemplatePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'view.html');
      if (fs.existsSync(viewTemplatePath)) {
        const packetData: { drafts: Record<string, string>; paths: Record<string, string> } = { drafts: {}, paths: {} };
        const draftsDir = path.join(outputDir, 'drafts');
        if (fs.existsSync(draftsDir)) {
          for (const name of fs.readdirSync(draftsDir)) {
            if (name.endsWith('.md')) {
              const id = name.slice(0, -3);
              packetData.drafts[id] = fs.readFileSync(path.join(draftsDir, name), 'utf8');
            }
          }
        }
        const pathDirs: { dir: string; files: string[] }[] = [{ dir: '', files: ['README.md'] }];
        for (const sub of ['partner', 'press', 'design', 'outreach', 'seo', 'calendar'] as const) {
          const subPath = path.join(outputDir, sub);
          if (fs.existsSync(subPath))
            pathDirs.push({ dir: sub, files: fs.readdirSync(subPath) });
        }
        for (const { dir, files } of pathDirs) {
          const dirPath = dir ? path.join(outputDir, dir) : outputDir;
          if (!fs.existsSync(dirPath)) continue;
          for (const name of files) {
            if (!name.endsWith('.md') && !name.endsWith('.txt')) continue;
            const rel = dir ? `${dir}/${name}` : name;
            const fpath = path.join(dirPath, name);
            try {
              if (fs.statSync(fpath).isFile())
                packetData.paths[rel] = fs.readFileSync(fpath, 'utf8');
            } catch (_) { /* skip */ }
          }
        }
        let viewHtml = fs.readFileSync(viewTemplatePath, 'utf8');
        const script = `<script>window.__PACKET_DATA__=${JSON.stringify(packetData)};</script>`;
        viewHtml = viewHtml.replace('</body>', `${script}\n</body>`);
        fs.writeFileSync(path.join(outputDir, 'view.html'), viewHtml);
        console.log(chalk.gray('  → view.html (with embedded drafts for file://)'));
      }

      const shippedTemplatePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'SHIPPED.md');
      if (fs.existsSync(shippedTemplatePath)) {
        fs.copyFileSync(shippedTemplatePath, path.join(outputDir, 'SHIPPED.md'));
        console.log(chalk.gray('  → SHIPPED.md (fill after launch)'));
      }

      fs.writeFileSync(path.join(outputDir, 'marketing_brief.md'), results.marketingBriefMarkdown);
      console.log(chalk.gray('  → marketing_brief.md'));

      // Research
      const protocolWithSource = prExtraction
        ? { ...results.protocol, sourceOfTruth: prExtraction.url }
        : results.protocol;
      fs.writeFileSync(path.join(outputDir, 'research', 'protocol_analysis.json'), JSON.stringify(protocolWithSource, null, 2));
      console.log(chalk.gray('  → research/protocol_analysis.json'));
      if (prExtraction) {
        fs.writeFileSync(path.join(outputDir, 'research', 'pr_extraction.json'), JSON.stringify(prExtraction, null, 2));
        console.log(chalk.gray('  → research/pr_extraction.json'));
      }
      if (protocolEnrichment && (protocolEnrichment.twitter || protocolEnrichment.farcaster || protocolEnrichment.website)) {
        fs.writeFileSync(path.join(outputDir, 'research', 'protocol_enrichment.json'), JSON.stringify(protocolEnrichment, null, 2));
        console.log(chalk.gray('  → research/protocol_enrichment.json'));
      }

      // Drafts - Main account
      {
        const tweets = extractTweetsFromLabeledThread(results.content.xPostMain);
        const copy = tweets.length ? tweets.join('\n\n') : results.content.xPostMain;
        fs.writeFileSync(
          path.join(outputDir, 'drafts', 'x_post_main.md'),
          `# Main Twitter Thread (@ShapeShift)\n\n${results.content.xPostMain}\n\n---\n\n${toCopyPasteSection('Copy/paste (thread)', copy)}`
        );
      }
      console.log(chalk.gray('  → drafts/x_post_main.md'));

      fs.writeFileSync(
        path.join(outputDir, 'drafts', 'x_post_blog.md'),
        `# Blog Promo Tweet (@ShapeShift)\n\n${results.content.xPostBlog}\n\n---\n\n${toCopyPasteSection('Copy/paste', results.content.xPostBlog)}`
      );
      console.log(chalk.gray('  → drafts/x_post_blog.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'infobot_qt.md'), results.content.infoBotQT);
      console.log(chalk.gray('  → drafts/infobot_qt.md'));

      fs.writeFileSync(
        path.join(outputDir, 'drafts', 'discord_post.md'),
        `# Discord Announcement\n\n${results.content.discordPost}\n\n---\n\n${toCopyPasteSection('Copy/paste', results.content.discordPost)}`
      );
      console.log(chalk.gray('  → drafts/discord_post.md'));

      fs.writeFileSync(
        path.join(outputDir, 'drafts', 'discord_reminder.md'),
        `# Discord Reminder (Update)\n\n${results.content.discordReminder}\n\n---\n\n${toCopyPasteSection('Copy/paste', results.content.discordReminder)}`
      );
      console.log(chalk.gray('  → drafts/discord_reminder.md'));

      fs.writeFileSync(
        path.join(outputDir, 'drafts', 'farcaster_post.md'),
        `# Farcaster Post\n\n${results.content.farcasterPost}\n\n---\n\n${toCopyPasteSection('Copy/paste', results.content.farcasterPost)}`
      );
      console.log(chalk.gray('  → drafts/farcaster_post.md'));

      {
        const tweets = extractTweetsFromLabeledThread(results.content.followupEducational);
        const copy = tweets.length ? tweets.join('\n\n') : results.content.followupEducational;
        fs.writeFileSync(
          path.join(outputDir, 'drafts', 'followup_educational.md'),
          `# Day 1: Educational Thread\n\n${results.content.followupEducational}\n\n---\n\n${toCopyPasteSection('Copy/paste (thread)', copy)}`
        );
      }
      console.log(chalk.gray('  → drafts/followup_educational.md'));

      {
        const tweets = extractTweetsFromLabeledThread(results.content.followupMetrics);
        const copy = tweets.length ? tweets.join('\n\n') : results.content.followupMetrics;
        fs.writeFileSync(
          path.join(outputDir, 'drafts', 'followup_metrics.md'),
          `${results.content.followupMetrics}\n\n---\n\n${toCopyPasteSection('Copy/paste (thread template)', copy)}`
        );
      }
      console.log(chalk.gray('  → drafts/followup_metrics.md'));

      {
        const tweets = extractTweetsFromLabeledThread(results.content.followupRecap);
        const copy = tweets.length ? tweets.join('\n\n') : results.content.followupRecap;
        fs.writeFileSync(
          path.join(outputDir, 'drafts', 'followup_recap.md'),
          `${results.content.followupRecap}\n\n---\n\n${toCopyPasteSection('Copy/paste (thread template)', copy)}`
        );
      }
      console.log(chalk.gray('  → drafts/followup_recap.md'));

      // Drafts - Personal account
      fs.writeFileSync(
        path.join(outputDir, 'drafts', 'x_post_personal.md'),
        `# Personal Tweet (Your Account)\n\nQT the main @ShapeShift announcement with:\n\n${results.content.xPostPersonal}\n\n---\n\n${toCopyPasteSection('Copy/paste', results.content.xPostPersonal)}`
      );
      console.log(chalk.gray('  → drafts/x_post_personal.md'));

      // Drafts - Blog
      fs.writeFileSync(path.join(outputDir, 'drafts', 'blog_draft.md'), `# Blog Post for Strapi\n\n${results.content.blogDraft}`);
      console.log(chalk.gray('  → drafts/blog_draft.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'medium_post.md'), `# Medium Post\n\n${results.content.mediumPost}`);
      console.log(chalk.gray('  → drafts/medium_post.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'release_notes.md'), results.content.releaseNotes);
      console.log(chalk.gray('  → drafts/release_notes.md'));

      // Partner (or Community Brief for program launches)
      fs.writeFileSync(path.join(outputDir, 'partner', 'partner_kit.md'), results.partnerKit);
      console.log(chalk.gray('  → partner/partner_kit.md') + (campaignType !== 'program' ? chalk.yellow(' ← SEND TO PARTNER') : chalk.yellow(' (Community Brief)')));

      // Press
      fs.writeFileSync(path.join(outputDir, 'press', 'press_release.md'), `# Press Release\n\n${results.pressRelease}`);
      console.log(chalk.gray('  → press/press_release.md'));

      fs.writeFileSync(path.join(outputDir, 'press', 'pr_brief.md'), results.prBrief);
      console.log(chalk.gray('  → press/pr_brief.md'));

      fs.writeFileSync(path.join(outputDir, 'press', 'op_ed_political.md'), `# Op-Ed: Political/Regulatory Angle\n\n${results.opEdPolitical}`);
      console.log(chalk.gray('  → press/op_ed_political.md'));

      fs.writeFileSync(path.join(outputDir, 'press', 'op_ed_technical.md'), `# Op-Ed: Technical/Builder Angle\n\n${results.opEdTechnical}`);
      console.log(chalk.gray('  → press/op_ed_technical.md'));

      // Design
      fs.writeFileSync(path.join(outputDir, 'design', 'design_brief.md'), results.designBrief);
      console.log(chalk.gray('  → design/design_brief.md'));

      fs.writeFileSync(path.join(outputDir, 'design', 'ai_prompts.txt'), results.aiPrompts);
      console.log(chalk.gray('  → design/ai_prompts.txt'));

      // Outreach
      const dmTargetsMd = `# DM Targets\n\n**Best Practices:**\n- No links in first DM\n- First 30 chars = value hook\n- Ask "want the link?" to get response first\n\n---\n\n${results.dmTargets.map((t, i) => `## ${i + 1}. ${t.handle}\n\n**Why:** ${t.reason}\n\n**Opener angle:** ${t.openerAngle}\n\n**Suggested DM:**\n\`\`\`\n${t.suggestedDM}\n\`\`\`\n`).join('\n---\n\n')}`;
      fs.writeFileSync(path.join(outputDir, 'outreach', 'dm_targets.md'), dmTargetsMd);
      console.log(chalk.gray('  → outreach/dm_targets.md'));

      // Intelligence - Wild Cards
      const wildCardsMd = `# Wild Card Ideas\n\n*Scrappy, low-budget, high-impact marketing ideas.*\n\n---\n\n${results.wildCards.map((w, i) => `## ${i + 1}. ${w.title}\n\n${w.description}\n\n- **Budget:** ${w.estimatedBudget}\n- **Time:** ${w.timeToExecute}\n- **Target:** ${w.targetSegment}\n\n**How to Execute:**\n${w.howToExecute}\n`).join('\n---\n\n')}`;
      fs.writeFileSync(path.join(outputDir, 'intelligence', 'wild_cards.md'), wildCardsMd);
      console.log(chalk.gray('  → intelligence/wild_cards.md'));

      // SEO articles
      results.seoArticles.forEach((content, i) => {
        const name = `seo_article_${String(i + 1).padStart(2, '0')}.md`;
        fs.writeFileSync(path.join(outputDir, 'seo', name), `# SEO Article ${i + 1}: ${protocol}\n\n${content}`);
        console.log(chalk.gray(`  → seo/${name}`));
      });

      // Content calendar
      fs.writeFileSync(path.join(outputDir, 'calendar', 'content_calendar.md'), results.contentCalendar);
      console.log(chalk.gray('  → calendar/content_calendar.md'));

      // Summary
      console.log(chalk.blue.bold('\n📋 Summary\n'));
      console.log(chalk.white(`Protocol: ${results.protocol.name}`));
      console.log(chalk.white(`Category: ${results.protocol.category}`));
      console.log(chalk.white(`GTM Idea: ${results.marketingBrief.gtmOneSentence}`));

      console.log(chalk.blue.bold('\n📁 Output Location\n'));
      console.log(chalk.white(outputDir));

      console.log(chalk.blue.bold('\n🚀 Next Steps\n'));
      console.log(chalk.white('1. Open ') + chalk.cyan('index.html') + chalk.white(' in a browser, then click Start Checklist (or open checklist.html directly)'));
      if (campaignType !== 'program') {
        console.log(chalk.white('2. Send ') + chalk.cyan('partner/partner_kit.md') + chalk.white(` to the ${protocol} team`));
      }
      const stepNum = campaignType === 'program' ? '2' : '3';
      console.log(chalk.white(`${stepNum}. Review drafts (blog, X threads, SEO, calendar) and post when ready`));

      console.log(chalk.green.bold('\n✅ Done! Good luck with the launch!\n'));

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`\nError: ${message}`));
      
      if (message.includes('API key')) {
        console.error(chalk.yellow('\nMake sure OPENAI_API_KEY is set correctly.'));
      } else if (message.includes('fetch')) {
        console.error(chalk.yellow('\nCould not fetch website. Check the URL is accessible.'));
      }
      
      process.exit(1);
    }
  });
