import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { validatePlan, validateForMarketingApproval, formatValidationResult, validatePlanUrls } from '../lib/validators.js';
import { getTierDefaults, getRiskDefaults } from '../lib/defaults.js';
import { getStatusEmoji, getRiskLevelEmoji, getQASignalEmoji } from '../lib/status.js';

export const validateCommand = new Command('validate')
  .description('Validate a GTM plan against tier and risk requirements')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .option('--for-approval', 'Validate for marketing approval (stricter)', false)
  .option('--json', 'Output as JSON', false)
  .option('--verbose', 'Show detailed validation info', false)
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      
      // Get defaults for display
      const tierDefaults = getTierDefaults(plan.tier);
      const riskDefaults = getRiskDefaults(plan.risk.level);
      
      // Run validation
      const result = options.forApproval 
        ? validateForMarketingApproval(plan)
        : validatePlan(plan);
      
      // URL validation
      const urlValidation = validatePlanUrls(plan);
      
      if (options.json) {
        console.log(JSON.stringify({
          id: plan.id,
          tier: plan.tier,
          risk: plan.risk.level,
          validation: result,
          url_validation: urlValidation,
          tier_requirements: tierDefaults.requires,
          risk_requirements: {
            required_approvals: riskDefaults.required_approvals,
            requires_smoke_test: riskDefaults.requires_smoke_test,
            requires_rollback_plan: riskDefaults.requires_rollback_plan,
          },
        }, null, 2));
        return;
      }
      
      // Header
      console.log(chalk.bold(`Validation for ${plan.id}`));
      console.log('');
      
      // Summary
      console.log(chalk.dim('Plan Configuration:'));
      console.log(`  Tier:             ${plan.tier}`);
      console.log(`  Risk:             ${getRiskLevelEmoji(plan.risk.level)} ${plan.risk.level}`);
      console.log(`  QA Signal:        ${getQASignalEmoji(plan.qa.signal)} ${plan.qa.signal || 'pending'}`);
      console.log(`  Marketing Gate:   ${plan.gates.marketing_gate.status}`);
      console.log(`  Approvals:        ${plan.gates.marketing_gate.approvals.length}/${riskDefaults.required_approvals} required`);
      console.log('');
      
      // Tier requirements
      if (options.verbose) {
        console.log(chalk.dim('Tier Requirements:'));
        console.log(`  Blog required:        ${tierDefaults.requires.blog ? '✓' : '✗'}`);
        console.log(`  Tracking URL:         ${tierDefaults.requires.tracking_url ? '✓' : '✗'}`);
        console.log(`  Dashboard URL:        ${tierDefaults.requires.dashboard_url ? '✓' : '✗'}`);
        console.log(`  In-app explicit:      ${tierDefaults.requires.in_app_explicit ? '✓' : '✗'}`);
        console.log(`  Partner brief:        ${tierDefaults.requires.partner_brief ? '✓' : '✗'}`);
        console.log(`  Hero asset:           ${tierDefaults.requires.hero_asset ? '✓' : '✗'}`);
        console.log('');
        
        console.log(chalk.dim('Risk Requirements:'));
        console.log(`  Required approvals:   ${riskDefaults.required_approvals}`);
        console.log(`  Smoke test required:  ${riskDefaults.requires_smoke_test ? '✓' : '✗'}`);
        console.log(`  Rollback plan:        ${riskDefaults.requires_rollback_plan ? '✓' : '✗'}`);
        console.log(`  QA cannot be red:     ${riskDefaults.qa_cannot_be_red ? '✓' : '✗'}`);
        console.log('');
      }
      
      // Validation result
      console.log(formatValidationResult(result));
      
      // URL validation summary
      if (urlValidation.invalid.length > 0) {
        console.log('');
        console.log(chalk.yellow(`⚠ ${urlValidation.invalid.length} invalid URL(s) found`));
        if (options.verbose) {
          for (const url of urlValidation.invalid) {
            console.log(`   ${url}`);
          }
        }
      }
      
      // Exit with error if validation failed
      if (!result.valid) {
        console.log('');
        console.log(chalk.yellow('Fix the errors above before proceeding.'));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
