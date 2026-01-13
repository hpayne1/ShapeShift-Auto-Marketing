import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { appendHistory } from '../lib/history.js';

export const lockCommand = new Command('lock')
  .description('Lock a GTM plan to a specific git commit SHA for traceability')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--sha <sha>', 'Git commit SHA to lock to')
  .option('--force', 'Overwrite existing SHA lock', false)
  .action((options) => {
    try {
      // Validate SHA format (basic check for 7-40 char hex string)
      if (!/^[a-f0-9]{7,40}$/i.test(options.sha)) {
        console.error(chalk.red('Error: SHA must be a valid git commit hash (7-40 hex characters)'));
        process.exit(1);
      }
      
      // Read plan
      const plan = readPlan(options.id);
      
      // Check if already locked
      if (plan.provenance.git.commit_sha && !options.force) {
        console.error(chalk.red(`Error: Plan ${options.id} is already locked to SHA: ${plan.provenance.git.commit_sha}`));
        console.error(chalk.dim('Use --force to overwrite the existing lock'));
        process.exit(1);
      }
      
      const previousSha = plan.provenance.git.commit_sha;
      
      // Set SHA
      plan.provenance.git.commit_sha = options.sha;
      
      // Append history
      appendHistory(plan, 'lock', `Locked plan to commit ${options.sha.substring(0, 7)}`, {
        previous_sha: previousSha,
        new_sha: options.sha,
      });
      
      // Write updated plan
      writePlan(plan);
      
      console.log(chalk.green(`✅ Locked ${options.id} to commit`));
      console.log('');
      console.log(chalk.dim('Provenance:'));
      console.log(`  Commit SHA: ${options.sha}`);
      if (previousSha) {
        console.log(`  Previous:   ${previousSha}`);
      }
      console.log('');
      
      // Show linked PRs
      if (plan.provenance.git.prs.length > 0) {
        console.log(chalk.dim('Linked PRs:'));
        for (const pr of plan.provenance.git.prs) {
          console.log(`  ${pr.url}`);
        }
        console.log('');
      }
      
      console.log(chalk.cyan('The plan is now locked to this commit for traceability.'));
      console.log(chalk.dim('Workers processing this plan will reference this SHA.'));
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
