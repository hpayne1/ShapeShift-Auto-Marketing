import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { generateFullPacket } from '../lib/fullPacketGenerator.js';

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const fullPacketCommand = new Command('full-packet')
  .description('Generate a complete GTM packet with all materials (v2)')
  .requiredOption('--protocol <name>', 'Protocol name (e.g., "Yield.xyz")')
  .requiredOption('--url <url>', 'Protocol website URL')
  .option('--tier <tier>', 'Tier level (0, 1, or 2)', '1')
  .option('--output <dir>', 'Output directory')
  .action(async (options) => {
    const { protocol, url, tier, output } = options;
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

    console.log(chalk.blue.bold(`\n🚀 Generating Full GTM Packet for ${protocol}...\n`));
    console.log(chalk.gray(`URL: ${url}`));
    console.log(chalk.gray(`Tier: ${tierNum}`));
    console.log();

    try {
      const startTime = Date.now();

      // Generate the full packet
      const results = await generateFullPacket(protocol, url, tierNum, (step) => {
        console.log(chalk.cyan(`  → ${step}`));
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(chalk.green(`\n✅ Packet generated in ${elapsed}s!\n`));

      // Determine output directory
      const outputDir = output || path.join(process.cwd(), 'research-output', protocol.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-'));

      // Create all directories
      const dirs = ['drafts', 'research', 'partner', 'press', 'design', 'outreach', 'intelligence'];
      ensureDir(outputDir);
      dirs.forEach(d => ensureDir(path.join(outputDir, d)));

      // Write all files
      console.log(chalk.blue('Writing files...\n'));

      // Core files
      fs.writeFileSync(path.join(outputDir, 'index.html'), results.indexHtml);
      console.log(chalk.gray('  → index.html'));

      fs.writeFileSync(path.join(outputDir, 'checklist.md'), results.checklist);
      console.log(chalk.green('  → checklist.md') + chalk.yellow(' ← START HERE'));

      fs.writeFileSync(path.join(outputDir, 'marketing_brief.md'), results.marketingBriefMarkdown);
      console.log(chalk.gray('  → marketing_brief.md'));

      // Research
      fs.writeFileSync(path.join(outputDir, 'research', 'protocol_analysis.json'), JSON.stringify(results.protocol, null, 2));
      console.log(chalk.gray('  → research/protocol_analysis.json'));

      // Drafts - Main account
      fs.writeFileSync(path.join(outputDir, 'drafts', 'x_post_main.md'), `# Main Twitter Thread (@ShapeShift)\n\n${results.content.xPostMain}`);
      console.log(chalk.gray('  → drafts/x_post_main.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'infobot_qt.md'), results.content.infoBotQT);
      console.log(chalk.gray('  → drafts/infobot_qt.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'discord_post.md'), `# Discord Announcement\n\n${results.content.discordPost}`);
      console.log(chalk.gray('  → drafts/discord_post.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'farcaster_post.md'), `# Farcaster Post\n\n${results.content.farcasterPost}`);
      console.log(chalk.gray('  → drafts/farcaster_post.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'followup_educational.md'), `# Day 1: Educational Thread\n\n${results.content.followupEducational}`);
      console.log(chalk.gray('  → drafts/followup_educational.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'followup_metrics.md'), results.content.followupMetrics);
      console.log(chalk.gray('  → drafts/followup_metrics.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'followup_recap.md'), results.content.followupRecap);
      console.log(chalk.gray('  → drafts/followup_recap.md'));

      // Drafts - Personal account
      fs.writeFileSync(path.join(outputDir, 'drafts', 'x_post_personal.md'), `# Personal Tweet (Your Account)\n\nQT the main @ShapeShift announcement with:\n\n${results.content.xPostPersonal}`);
      console.log(chalk.gray('  → drafts/x_post_personal.md'));

      // Drafts - Blog
      fs.writeFileSync(path.join(outputDir, 'drafts', 'blog_draft.md'), `# Blog Post for Strapi\n\n${results.content.blogDraft}`);
      console.log(chalk.gray('  → drafts/blog_draft.md'));

      fs.writeFileSync(path.join(outputDir, 'drafts', 'release_notes.md'), results.content.releaseNotes);
      console.log(chalk.gray('  → drafts/release_notes.md'));

      // Partner
      fs.writeFileSync(path.join(outputDir, 'partner', 'partner_kit.md'), results.partnerKit);
      console.log(chalk.green('  → partner/partner_kit.md') + chalk.yellow(' ← SEND TO PARTNER'));

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

      // Summary
      console.log(chalk.blue.bold('\n📋 Summary\n'));
      console.log(chalk.white(`Protocol: ${results.protocol.name}`));
      console.log(chalk.white(`Category: ${results.protocol.category}`));
      console.log(chalk.white(`GTM Idea: ${results.marketingBrief.gtmOneSentence}`));

      console.log(chalk.blue.bold('\n📁 Output Location\n'));
      console.log(chalk.white(outputDir));

      console.log(chalk.blue.bold('\n🚀 Next Steps\n'));
      console.log(chalk.white('1. Open ') + chalk.cyan('checklist.md') + chalk.white(' and follow the instructions'));
      console.log(chalk.white('2. Send ') + chalk.cyan('partner/partner_kit.md') + chalk.white(` to the ${protocol} team`));
      console.log(chalk.white('3. Review drafts and post when ready'));

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
