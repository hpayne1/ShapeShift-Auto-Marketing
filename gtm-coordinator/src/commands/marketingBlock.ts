import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { appendHistory } from '../lib/history.js';

export const marketingBlockCommand = new Command('marketing-block')
  .description('Block the marketing gate')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--reason <reason>', 'Reason for blocking')
  .option('--reviewer <name>', 'Reviewer name')
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      const now = new Date().toISOString();
      const previousStatus = plan.gates.marketing_gate.status;
      
      // Update marketing gate
      plan.gates.marketing_gate.status = 'blocked';
      plan.gates.marketing_gate.blocked_reason = options.reason;
      
      // Clear approvals on block (they need to re-approve after fix)
      const previousApprovals = plan.gates.marketing_gate.approvals.length;
      plan.gates.marketing_gate.approvals = [];
      
      // Append history
      appendHistory(plan, 'block', `Marketing gate blocked: ${options.reason}`, {
        reviewer: options.reviewer,
        reason: options.reason,
        previous_status: previousStatus,
        cleared_approvals: previousApprovals,
      });
      
      // Write updated plan
      writePlan(plan);
      
      console.log(chalk.red(`🚫 Marketing gate BLOCKED for ${options.id}`));
      console.log('');
      console.log(chalk.dim('Block details:'));
      console.log(`  Reason:     ${options.reason}`);
      console.log(`  Blocked at: ${now}`);
      
      if (options.reviewer) {
        console.log(`  Blocked by: ${options.reviewer}`);
      }
      
      if (previousApprovals > 0) {
        console.log('');
        console.log(chalk.yellow(`⚠ ${previousApprovals} previous approval(s) cleared - will need to re-approve after fix`));
      }
      
      console.log('');
      console.log(chalk.yellow('Next steps:'));
      console.log(`  1. Address the blocking reason`);
      console.log(`  2. Update relevant statuses and content`);
      console.log(`  3. gtm validate --id ${options.id}`);
      console.log(`  4. gtm packet --id ${options.id}`);
      console.log(`  5. gtm marketing-approve --id ${options.id} --reviewer "@name"`);
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
