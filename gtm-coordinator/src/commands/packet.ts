import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePacket, writePlan } from '../lib/io.js';
import { renderPacket } from '../lib/render.js';
import { appendHistory } from '../lib/history.js';

export const packetCommand = new Command('packet')
  .description('Generate a Marketing Review Packet')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .option('--stdout', 'Output to stdout instead of file', false)
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      
      // Generate packet content
      const content = renderPacket(plan);
      
      if (options.stdout) {
        console.log(content);
      } else {
        // Write packet
        writePacket(options.id, content);
        
        // Append history
        appendHistory(plan, 'packet-generate', 'Generated Marketing Review Packet');
        writePlan(plan);
        
        console.log(chalk.green(`✅ Generated Marketing Review Packet`));
        console.log('');
        console.log(chalk.dim('Output file:'));
        console.log(`  .gtm/${options.id}/review.md`);
        console.log('');
        console.log(chalk.dim('Contents include:'));
        console.log('  - Snapshot (tier, risk, release window, gates)');
        console.log('  - Provenance (commit SHA, PRs, inputs)');
        console.log('  - Tracking (canonical URL, UTMs, dashboards, events)');
        console.log('  - Channels readiness');
        console.log('  - Assets checklist');
        console.log('  - QA gate status');
        console.log('  - Draft excerpts');
        console.log('  - Validation results');
        console.log('  - Recent history');
        console.log('');
        console.log(chalk.cyan('Next steps:'));
        console.log(`  1. Review the packet at .gtm/${options.id}/review.md`);
        console.log(`  2. Address any blockers listed`);
        console.log(`  3. gtm qa-pass --id ${options.id} --signal green`);
        console.log(`  4. gtm marketing-approve --id ${options.id} --reviewer "@name"`);
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
