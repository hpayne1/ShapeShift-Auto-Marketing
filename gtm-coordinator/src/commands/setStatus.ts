import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan, setNestedValue, getNestedValue } from '../lib/io.js';
import { StatusEnum } from '../schema/gtmPlan.js';
import { appendHistory } from '../lib/history.js';
import { getStatusEmoji, ALL_STATUSES } from '../lib/status.js';

export const setStatusCommand = new Command('set-status')
  .description('Update a status field in a GTM plan')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .requiredOption('--field <path>', 'Field path (e.g., channels.discord.status)')
  .requiredOption('--value <status>', `Status value (${ALL_STATUSES.join(', ')})`)
  .option('--notes <notes>', 'Optional notes to add')
  .option('--owner <owner>', 'Optional owner to set')
  .action((options) => {
    try {
      // Validate status value
      const parseResult = StatusEnum.safeParse(options.value);
      if (!parseResult.success) {
        console.error(chalk.red(`Error: Invalid status "${options.value}"`));
        console.error(chalk.dim(`Valid values: ${ALL_STATUSES.join(', ')}`));
        process.exit(1);
      }
      
      // Read plan
      const plan = readPlan(options.id);
      
      // Get current value for display
      const currentValue = getNestedValue(plan as unknown as Record<string, unknown>, options.field);
      
      // Set the new value
      setNestedValue(plan as unknown as Record<string, unknown>, options.field, options.value);
      
      // If setting channel status, also set owner if provided
      if (options.owner && options.field.match(/^channels\.\w+\.status$/)) {
        const ownerField = options.field.replace('.status', '.owner');
        setNestedValue(plan as unknown as Record<string, unknown>, ownerField, options.owner);
      }
      
      // If setting content_outputs status, update it
      if (options.field.match(/^content_outputs\.\w+\.status$/)) {
        // Just set the status, artifact_path should already be set
      }
      
      // Append history
      appendHistory(plan, 'set-status', `Updated ${options.field} from ${currentValue} to ${options.value}`, {
        field: options.field,
        from: currentValue,
        to: options.value,
        owner: options.owner,
      });
      
      // Write updated plan
      writePlan(plan);
      
      console.log(chalk.green(`✅ Updated ${options.field}`));
      console.log('');
      console.log(chalk.dim('Change:'));
      console.log(`  Field: ${options.field}`);
      console.log(`  From:  ${getStatusEmoji(currentValue as any)} ${currentValue ?? '(not set)'}`);
      console.log(`  To:    ${getStatusEmoji(options.value)} ${options.value}`);
      
      if (options.owner) {
        console.log(`  Owner: ${options.owner}`);
      }
      
      if (options.notes) {
        console.log(`  Notes: ${options.notes}`);
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
