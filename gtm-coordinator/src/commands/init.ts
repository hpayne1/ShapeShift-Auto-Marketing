import { Command } from 'commander';
import chalk from 'chalk';
import { createDefaultPlan } from '../lib/defaults.js';
import { writePlan, planExists, ensureDraftsDir } from '../lib/io.js';
import { validatePlan, formatValidationResult } from '../lib/validators.js';
import type { RiskLevel } from '../schema/gtmPlan.js';

export const initCommand = new Command('init')
  .description('Initialize a new GTM plan')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--title <title>', 'Initiative title')
  .option('--tier <tier>', 'Tier level (0, 1, or 2)', '1')
  .option('--risk <level>', 'Risk level (low, medium, high)', 'low')
  .option('--release <date>', 'Release date/window start (e.g., 2026-02-01)')
  .option('--release-end <date>', 'Release date/window end (optional)')
  .option('--description <desc>', 'Initiative description')
  .option('--canonical-url <url>', 'Canonical tracking URL')
  .option('--force', 'Overwrite existing plan', false)
  .action((options) => {
    try {
      // Validate ID format
      if (!/^INIT-\d+$/.test(options.id)) {
        console.error(chalk.red('Error: ID must be in format INIT-#### (e.g., INIT-1234)'));
        process.exit(1);
      }
      
      // Check if plan already exists
      if (planExists(options.id) && !options.force) {
        console.error(chalk.red(`Error: Plan ${options.id} already exists. Use --force to overwrite.`));
        process.exit(1);
      }
      
      // Parse tier
      const tier = parseInt(options.tier, 10);
      if (isNaN(tier) || tier < 0 || tier > 2) {
        console.error(chalk.red('Error: Tier must be 0, 1, or 2'));
        process.exit(1);
      }
      
      // Validate risk level
      const validRiskLevels: RiskLevel[] = ['low', 'medium', 'high'];
      if (!validRiskLevels.includes(options.risk)) {
        console.error(chalk.red('Error: Risk must be low, medium, or high'));
        process.exit(1);
      }
      
      // Create plan
      const plan = createDefaultPlan(
        options.id,
        options.title,
        tier,
        options.release,
        options.risk as RiskLevel
      );
      
      // Set optional fields
      if (options.description) {
        plan.description = options.description;
      }
      
      if (options.releaseEnd) {
        plan.timing.release_window.end = options.releaseEnd;
      }
      
      if (options.canonicalUrl) {
        plan.tracking.canonical_url = options.canonicalUrl;
      }
      
      // Create drafts directory
      ensureDraftsDir(options.id);
      
      // Write plan
      writePlan(plan);
      
      console.log(chalk.green(`✅ Created GTM plan: ${options.id}`));
      console.log('');
      console.log(chalk.dim('Plan details:'));
      console.log(`  ID:           ${plan.id}`);
      console.log(`  Title:        ${plan.title}`);
      console.log(`  Tier:         ${plan.tier}`);
      console.log(`  Risk:         ${plan.risk.level}`);
      console.log(`  Release:      ${plan.timing.release_window.start || 'TBD'}`);
      console.log(`  Approvals:    ${plan.gates.marketing_gate.required_approvals} required`);
      console.log('');
      
      // Show enabled channels
      const enabledChannels = Object.entries(plan.channels)
        .filter(([_, ch]) => ch.enabled)
        .map(([name]) => name);
      console.log(chalk.dim('Enabled channels:'));
      console.log(`  ${enabledChannels.join(', ')}`);
      console.log('');
      
      // Show required assets
      if (plan.assets.required.length > 0) {
        console.log(chalk.dim('Required assets:'));
        console.log(`  ${plan.assets.required.join(', ')}`);
        console.log('');
      }
      
      // Show validation
      const validation = validatePlan(plan);
      console.log(chalk.dim('Validation:'));
      console.log(formatValidationResult(validation));
      console.log('');
      
      // Show file locations
      console.log(chalk.dim('Files created:'));
      console.log(`  Plan:   .gtm/${options.id}/plan.yaml`);
      console.log(`  Drafts: .gtm/${options.id}/drafts/`);
      console.log('');
      
      // Next steps
      console.log(chalk.cyan('Next steps:'));
      console.log(`  1. gtm enrich --id ${options.id} --pr <pr-url>`);
      console.log(`  2. gtm lock --id ${options.id} --sha <commit-sha>`);
      console.log(`  3. gtm packet --id ${options.id}`);
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
