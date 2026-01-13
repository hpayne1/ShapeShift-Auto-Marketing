import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan, listPlans, isLegacyPlan, getLegacyPlanPath, getNewPlanPath } from '../lib/io.js';
import { existsSync, rmSync } from 'fs';

export const migrateCommand = new Command('migrate')
  .description('Migrate GTM plan(s) from v1 to v2 schema')
  .option('--id <id>', 'Initiative ID to migrate (e.g., INIT-1234)')
  .option('--all', 'Migrate all legacy plans', false)
  .option('--cleanup', 'Remove legacy files after migration', false)
  .option('--dry-run', 'Show what would be migrated without making changes', false)
  .action((options) => {
    try {
      const plansToMigrate: string[] = [];
      
      if (options.id) {
        // Migrate specific plan
        if (isLegacyPlan(options.id)) {
          plansToMigrate.push(options.id);
        } else {
          console.log(chalk.yellow(`Plan ${options.id} is already in v2 format or doesn't exist`));
          return;
        }
      } else if (options.all) {
        // Find all legacy plans
        const allPlans = listPlans();
        for (const id of allPlans) {
          if (isLegacyPlan(id)) {
            plansToMigrate.push(id);
          }
        }
      } else {
        // Show status of all plans
        const allPlans = listPlans();
        console.log(chalk.bold('GTM Plan Migration Status'));
        console.log('');
        
        let legacyCount = 0;
        let modernCount = 0;
        
        for (const id of allPlans) {
          if (isLegacyPlan(id)) {
            console.log(`  ${chalk.yellow('⚠')} ${id} - legacy v1 format`);
            legacyCount++;
          } else {
            console.log(`  ${chalk.green('✓')} ${id} - v2 format`);
            modernCount++;
          }
        }
        
        console.log('');
        console.log(chalk.dim(`Total: ${allPlans.length} plans (${modernCount} v2, ${legacyCount} legacy)`));
        
        if (legacyCount > 0) {
          console.log('');
          console.log(chalk.cyan('To migrate:'));
          console.log(`  gtm migrate --all           # Migrate all legacy plans`);
          console.log(`  gtm migrate --id INIT-####  # Migrate specific plan`);
        }
        return;
      }
      
      if (plansToMigrate.length === 0) {
        console.log(chalk.green('No legacy plans found to migrate'));
        return;
      }
      
      console.log(chalk.bold(`Migrating ${plansToMigrate.length} plan(s) to v2 schema`));
      console.log('');
      
      for (const id of plansToMigrate) {
        if (options.dryRun) {
          console.log(chalk.dim(`[DRY RUN] Would migrate: ${id}`));
          console.log(chalk.dim(`  From: ${getLegacyPlanPath(id)}`));
          console.log(chalk.dim(`  To:   ${getNewPlanPath(id)}`));
          continue;
        }
        
        try {
          // readPlan will auto-migrate if needed
          const plan = readPlan(id);
          
          // writePlan writes to new location
          writePlan(plan);
          
          console.log(chalk.green(`✅ Migrated: ${id}`));
          console.log(chalk.dim(`   Schema: v${plan.version} (${plan.schema_version})`));
          console.log(chalk.dim(`   Location: .gtm/${id}/plan.yaml`));
          
          // Cleanup legacy file if requested
          if (options.cleanup) {
            const legacyPath = getLegacyPlanPath(id);
            if (existsSync(legacyPath)) {
              rmSync(legacyPath);
              console.log(chalk.dim(`   Removed: ${legacyPath}`));
            }
          }
          
        } catch (error) {
          console.error(chalk.red(`❌ Failed to migrate ${id}: ${(error as Error).message}`));
        }
        
        console.log('');
      }
      
      if (!options.dryRun) {
        console.log(chalk.green(`Migration complete!`));
        
        if (!options.cleanup) {
          console.log('');
          console.log(chalk.dim('Legacy files preserved. Run with --cleanup to remove them.'));
        }
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
