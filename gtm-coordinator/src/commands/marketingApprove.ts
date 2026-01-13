import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { validateForMarketingApproval, formatValidationResult } from '../lib/validators.js';
import { appendHistory } from '../lib/history.js';
import { getRiskDefaults } from '../lib/defaults.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';

export const marketingApproveCommand = new Command('marketing-approve')
  .description('Approve the marketing gate')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--reviewer <name>', 'Reviewer name (e.g., @houston)')
  .option('--notes <notes>', 'Approval notes')
  .option('--force', 'Force approval even with validation errors', false)
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      const riskDefaults = getRiskDefaults(plan.risk.level);
      const now = new Date().toISOString();
      
      // Run validation
      const validation = validateForMarketingApproval(plan);
      
      console.log(chalk.bold(`Marketing Approval for ${plan.id}`));
      console.log(chalk.dim(`Tier ${plan.tier} | Risk ${plan.risk.level} | ${riskDefaults.required_approvals} approval(s) required`));
      console.log('');
      console.log(formatValidationResult(validation));
      console.log('');
      
      if (!validation.valid && !options.force) {
        console.log(chalk.red('❌ Marketing approval blocked'));
        console.log('');
        console.log(chalk.yellow('Fix the errors above or use --force to override.'));
        process.exit(1);
      }
      
      if (!validation.valid && options.force) {
        console.log(chalk.yellow('⚠️ Forcing approval despite validation errors'));
        console.log('');
      }
      
      // Check if this reviewer has already approved
      const existingApproval = plan.gates.marketing_gate.approvals.find(
        a => a.reviewer === options.reviewer
      );
      
      if (existingApproval) {
        console.log(chalk.yellow(`⚠ ${options.reviewer} has already approved this initiative`));
        console.log(chalk.dim(`  Previous approval: ${existingApproval.at}`));
        console.log('');
      }
      
      // Add approval record
      if (!existingApproval) {
        plan.gates.marketing_gate.approvals.push({
          reviewer: options.reviewer,
          at: now,
          notes: options.notes,
        });
      }
      
      // Check if we have enough approvals
      const currentApprovals = plan.gates.marketing_gate.approvals.length;
      const requiredApprovals = riskDefaults.required_approvals;
      
      if (currentApprovals >= requiredApprovals) {
        // Gate is approved
        plan.gates.marketing_gate.status = 'approved';
        plan.gates.marketing_gate.blocked_reason = null;
        
        // Update enabled channel statuses from needs_review to approved
        for (const channel of CHANNEL_NAMES) {
          const ch = plan.channels[channel];
          if (ch.enabled && ch.status === 'needs_review') {
            ch.status = 'approved';
          }
        }
        
        // Update content output statuses
        for (const key of Object.keys(plan.content_outputs) as Array<keyof typeof plan.content_outputs>) {
          if (plan.content_outputs[key].status === 'needs_review') {
            plan.content_outputs[key].status = 'approved';
          }
        }
        
        // Append history
        appendHistory(plan, 'approve', `Marketing gate approved by ${options.reviewer}`, {
          reviewer: options.reviewer,
          approval_count: currentApprovals,
          required_count: requiredApprovals,
          forced: !validation.valid && options.force,
        });
        
        // Write updated plan
        writePlan(plan);
        
        console.log(chalk.green(`✅ Marketing gate APPROVED for ${options.id}`));
        console.log('');
        console.log(chalk.dim('Approval details:'));
        console.log(`  Reviewer:    ${options.reviewer}`);
        console.log(`  Approved at: ${now}`);
        console.log(`  Approvals:   ${currentApprovals}/${requiredApprovals}`);
        
        if (options.notes) {
          console.log(`  Notes:       ${options.notes}`);
        }
        
        console.log('');
        console.log(chalk.cyan('🚀 Initiative is ready for execution!'));
        console.log('');
        console.log(chalk.dim('Next steps:'));
        console.log(`  - Execute channel posts using drafts in .gtm/${options.id}/drafts/`);
        console.log(`  - Update statuses: gtm set-status --id ${options.id} --field channels.<channel>.status --value published`);
        console.log(`  - Regenerate packet: gtm packet --id ${options.id}`);
        
      } else {
        // Need more approvals
        writePlan(plan);
        
        console.log(chalk.yellow(`⏳ Approval recorded, but more approvals needed`));
        console.log('');
        console.log(chalk.dim('Approval status:'));
        console.log(`  Current:  ${currentApprovals}/${requiredApprovals}`);
        console.log(`  Remaining: ${requiredApprovals - currentApprovals}`);
        console.log('');
        console.log(chalk.dim('Recorded approvals:'));
        for (const approval of plan.gates.marketing_gate.approvals) {
          console.log(`  - ${approval.reviewer} at ${approval.at}`);
        }
        console.log('');
        console.log(chalk.cyan(`This ${plan.risk.level} risk initiative requires ${requiredApprovals} approval(s).`));
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
