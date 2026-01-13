import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { QASignalEnum, CheckResultEnum } from '../schema/gtmPlan.js';
import { appendHistory } from '../lib/history.js';
import { getQASignalEmoji } from '../lib/status.js';
import { getRiskDefaults } from '../lib/defaults.js';

export const qaPassCommand = new Command('qa-pass')
  .description('Record QA gate signal and checks')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--signal <signal>', 'QA signal (green, yellow, red)')
  .option('--owner <owner>', 'QA owner')
  .option('--notes <notes>', 'QA notes')
  .option('--smoke-test <result>', 'Smoke test result (pass, fail, na)')
  .option('--rollback-plan', 'Mark rollback plan as present', false)
  .option('--evidence <urls...>', 'Evidence link URLs')
  .action((options) => {
    try {
      // Validate signal
      const signalResult = QASignalEnum.safeParse(options.signal);
      if (!signalResult.success) {
        console.error(chalk.red(`Error: Invalid signal "${options.signal}"`));
        console.error(chalk.dim('Valid values: green, yellow, red'));
        process.exit(1);
      }
      
      // Validate smoke test if provided
      if (options.smokeTest) {
        const smokeResult = CheckResultEnum.safeParse(options.smokeTest);
        if (!smokeResult.success) {
          console.error(chalk.red(`Error: Invalid smoke test result "${options.smokeTest}"`));
          console.error(chalk.dim('Valid values: pass, fail, na'));
          process.exit(1);
        }
      }
      
      // Read plan
      const plan = readPlan(options.id);
      const now = new Date().toISOString();
      const riskDefaults = getRiskDefaults(plan.risk.level);
      
      // Check risk constraints
      if (riskDefaults.qa_cannot_be_red && options.signal === 'red') {
        console.warn(chalk.yellow(`⚠ Warning: ${plan.risk.level} risk initiatives should not have red QA signal`));
      }
      
      // Update QA gate
      const previousSignal = plan.qa.signal;
      plan.qa.signal = options.signal;
      plan.qa.notes = options.notes || plan.qa.notes;
      
      if (options.owner) {
        plan.qa.owner = options.owner;
      }
      
      if (options.smokeTest) {
        plan.qa.checks.smoke_test = options.smokeTest;
      }
      
      if (options.rollbackPlan) {
        plan.qa.checks.rollback_plan_present = true;
      }
      
      // Add evidence links
      if (options.evidence) {
        for (const url of options.evidence) {
          const exists = plan.qa.evidence_links.some(e => e.url === url);
          if (!exists) {
            plan.qa.evidence_links.push({
              type: 'other',
              url,
              notes: 'Added via qa-pass command',
            });
          }
        }
      }
      
      // Set passed_at if green
      if (options.signal === 'green') {
        plan.qa.passed_at = now;
      }
      
      // Append history
      appendHistory(plan, 'qa-pass', `QA signal set to ${options.signal}`, {
        previous_signal: previousSignal,
        new_signal: options.signal,
        smoke_test: options.smokeTest,
        rollback_plan: options.rollbackPlan,
        evidence_count: options.evidence?.length || 0,
      });
      
      // Write updated plan
      writePlan(plan);
      
      // Display result
      console.log(chalk.green(`✅ Updated QA gate for ${options.id}`));
      console.log('');
      console.log(chalk.dim('QA Gate:'));
      console.log(`  Previous: ${getQASignalEmoji(previousSignal)} ${previousSignal || 'pending'}`);
      console.log(`  Current:  ${getQASignalEmoji(options.signal)} ${options.signal}`);
      
      if (options.owner) {
        console.log(`  Owner:    ${options.owner}`);
      }
      
      if (options.notes) {
        console.log(`  Notes:    ${options.notes}`);
      }
      
      console.log('');
      console.log(chalk.dim('Checks:'));
      console.log(`  Smoke test:    ${plan.qa.checks.smoke_test || 'not run'}`);
      console.log(`  Rollback plan: ${plan.qa.checks.rollback_plan_present ? '✓ present' : '✗ missing'}`);
      
      if (plan.qa.evidence_links.length > 0) {
        console.log('');
        console.log(chalk.dim(`Evidence links: ${plan.qa.evidence_links.length}`));
      }
      
      console.log('');
      
      // Risk-specific warnings
      if (plan.risk.level === 'high') {
        if (options.signal !== 'green') {
          console.log(chalk.yellow('⚠ High-risk initiatives require green QA signal for marketing approval'));
        }
        if (plan.qa.checks.smoke_test !== 'pass') {
          console.log(chalk.yellow('⚠ High-risk initiatives require smoke test to pass'));
        }
        if (!plan.qa.checks.rollback_plan_present) {
          console.log(chalk.yellow('⚠ High-risk initiatives require rollback plan'));
        }
      }
      
      // Next steps
      if (options.signal === 'green') {
        console.log(chalk.cyan('Next steps:'));
        console.log(`  gtm marketing-approve --id ${options.id} --reviewer "@name"`);
      } else if (options.signal === 'red') {
        console.log(chalk.yellow('QA blocked - address issues before proceeding'));
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
