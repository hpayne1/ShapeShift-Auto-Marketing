import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { runResearch, type ResearchResults } from '../lib/researchAgent.js';
import { readPlan, writePlan, ensurePlanDir, ensureDraftsDir } from '../lib/io.js';
import { appendHistory } from '../lib/history.js';

// Helper to ensure directory exists
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const researchCommand = new Command('research')
  .description('Research a protocol and generate GTM content using AI')
  .requiredOption('--protocol <name>', 'Protocol name (e.g., "Yield.xyz")')
  .requiredOption('--url <url>', 'Protocol website URL')
  .option('--id <id>', 'GTM plan ID to update (creates new if not exists)')
  .option('--tier <tier>', 'Tier level (0, 1, or 2)', '1')
  .option('--output <dir>', 'Output directory (default: .gtm/<id> or ./research-output)')
  .action(async (options) => {
    const { protocol, url, id, tier, output } = options;

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

    console.log(chalk.blue.bold(`\n🔍 Researching ${protocol}...\n`));
    console.log(chalk.gray(`URL: ${url}`));
    console.log(chalk.gray(`Tier: ${tier}`));
    if (id) console.log(chalk.gray(`Plan ID: ${id}`));
    console.log();

    try {
      // Run research with progress updates
      const results = await runResearch(protocol, url, (step) => {
        console.log(chalk.cyan(`  → ${step}`));
      });

      console.log(chalk.green('\n✅ Research complete!\n'));

      // Determine output directory
      let outputDir: string;
      let draftsDir: string;
      let researchDir: string;

      if (id) {
        outputDir = path.join(process.cwd(), '.gtm', id);
        draftsDir = path.join(outputDir, 'drafts');
        researchDir = path.join(outputDir, 'research');
      } else if (output) {
        outputDir = output;
        draftsDir = path.join(outputDir, 'drafts');
        researchDir = path.join(outputDir, 'research');
      } else {
        outputDir = path.join(process.cwd(), 'research-output', protocol.toLowerCase().replace(/\s+/g, '-'));
        draftsDir = path.join(outputDir, 'drafts');
        researchDir = path.join(outputDir, 'research');
      }

      // Create directories
      ensureDir(outputDir);
      ensureDir(draftsDir);
      ensureDir(researchDir);

      // Write research outputs
      console.log(chalk.blue('Writing research files...'));
      
      // Protocol analysis
      fs.writeFileSync(
        path.join(researchDir, 'protocol_analysis.json'),
        JSON.stringify(results.protocol, null, 2)
      );
      console.log(chalk.gray(`  → research/protocol_analysis.json`));

      // GTM Strategy
      fs.writeFileSync(
        path.join(researchDir, 'gtm_strategy.md'),
        `# GTM Strategy: ${protocol}\n\n${results.strategy}`
      );
      console.log(chalk.gray(`  → research/gtm_strategy.md`));

      // Content drafts
      console.log(chalk.blue('\nWriting content drafts...'));

      const contentFiles = [
        { name: 'x_post.md', content: results.content.twitter, label: 'Twitter/X thread' },
        { name: 'discord_post.md', content: results.content.discord, label: 'Discord announcement' },
        { name: 'blog_outline.md', content: results.content.blogOutline, label: 'Blog outline' },
        { name: 'blog_draft.md', content: results.content.blogDraft, label: 'Blog draft' },
        { name: 'partner_brief.md', content: results.content.partnerBrief, label: 'Partner brief' },
        { name: 'release_notes_short.md', content: results.content.releaseNotesShort, label: 'Release notes (short)' },
        { name: 'release_notes_long.md', content: results.content.releaseNotesLong, label: 'Release notes (long)' },
      ];

      for (const file of contentFiles) {
        const header = `# ${file.label}: ${protocol}\n\n`;
        fs.writeFileSync(path.join(draftsDir, file.name), header + file.content);
        console.log(chalk.gray(`  → drafts/${file.name}`));
      }

      // Update plan if ID provided
      if (id) {
        try {
          const plan = readPlan(id);
          
          // Update content output paths
          plan.content_outputs.x_post.artifact_path = 'drafts/x_post.md';
          plan.content_outputs.x_post.status = 'generated';
          plan.content_outputs.discord_post.artifact_path = 'drafts/discord_post.md';
          plan.content_outputs.discord_post.status = 'generated';
          plan.content_outputs.blog_outline.artifact_path = 'drafts/blog_outline.md';
          plan.content_outputs.blog_outline.status = 'generated';
          plan.content_outputs.blog_draft.artifact_path = 'drafts/blog_draft.md';
          plan.content_outputs.blog_draft.status = 'generated';
          plan.content_outputs.partner_brief.artifact_path = 'drafts/partner_brief.md';
          plan.content_outputs.partner_brief.status = 'generated';
          plan.content_outputs.release_notes_short.artifact_path = 'drafts/release_notes_short.md';
          plan.content_outputs.release_notes_short.status = 'generated';
          plan.content_outputs.release_notes_long.artifact_path = 'drafts/release_notes_long.md';
          plan.content_outputs.release_notes_long.status = 'generated';

          // Add history entry
          appendHistory(plan, 'enrich', `AI research completed for ${protocol}`, {
            protocol_name: protocol,
            website_url: url,
            files_generated: contentFiles.length + 2,
          });

          writePlan(plan);
          console.log(chalk.green(`\n✅ Updated plan: ${id}`));
        } catch (e) {
          console.log(chalk.yellow(`\nNote: Could not update plan ${id} (may not exist yet)`));
        }
      }

      // Print summary
      console.log(chalk.blue.bold('\n📋 Summary\n'));
      console.log(chalk.white(`Protocol: ${results.protocol.name}`));
      console.log(chalk.white(`Category: ${results.protocol.category}`));
      console.log(chalk.white(`Tagline: ${results.protocol.tagline}`));
      console.log();
      console.log(chalk.white('Key Features:'));
      results.protocol.keyFeatures.forEach(f => console.log(chalk.gray(`  • ${f}`)));
      console.log();
      console.log(chalk.white('Integration Opportunities:'));
      results.protocol.integrationOpportunities.forEach(o => console.log(chalk.gray(`  • ${o}`)));

      console.log(chalk.blue.bold('\n📁 Output Location\n'));
      console.log(chalk.white(outputDir));
      console.log();
      console.log(chalk.green('Files ready for review:'));
      console.log(chalk.cyan('  • research/gtm_strategy.md') + ' - Full GTM strategy');
      console.log(chalk.cyan('  • drafts/x_post.md') + ' - Twitter thread');
      console.log(chalk.cyan('  • drafts/discord_post.md') + ' - Discord announcement');
      console.log(chalk.cyan('  • drafts/blog_draft.md') + ' - Blog post');
      console.log(chalk.cyan('  • drafts/partner_brief.md') + ' - Partner communication');

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
