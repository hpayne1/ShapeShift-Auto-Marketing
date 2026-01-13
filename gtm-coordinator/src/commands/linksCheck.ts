import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan } from '../lib/io.js';
import { validatePlanUrls } from '../lib/validators.js';
import { hasUTMParams } from '../lib/utm.js';
import { appendHistory } from '../lib/history.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';

export const linksCheckCommand = new Command('links-check')
  .description('Validate all URLs in a GTM plan (no network calls)')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .option('--require-utm', 'Require UTM parameters on canonical URL', false)
  .option('--json', 'Output as JSON', false)
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      
      // Validate URLs
      const { valid, invalid } = validatePlanUrls(plan);
      
      // Check UTM on canonical URL if required
      const utmIssues: string[] = [];
      if (options.requireUtm && plan.tracking.canonical_url) {
        if (!hasUTMParams(plan.tracking.canonical_url)) {
          utmIssues.push('Canonical URL does not have UTM parameters');
        }
      }
      
      // Check for missing required URLs
      const missingUrls: string[] = [];
      
      // Tier 2 requires canonical URL
      if (plan.tier === 2 && !plan.tracking.canonical_url) {
        missingUrls.push('tracking.canonical_url (required for Tier 2)');
      }
      
      // Tier 2 requires dashboard URLs
      if (plan.tier === 2 && plan.tracking.dashboard_urls.length === 0) {
        missingUrls.push('tracking.dashboard_urls (required for Tier 2)');
      }
      
      // Check enabled channels for artifact paths
      for (const channel of CHANNEL_NAMES) {
        const ch = plan.channels[channel];
        if (ch.enabled && !ch.artifact_path && ch.status !== 'not_applicable') {
          missingUrls.push(`channels.${channel}.artifact_path (channel enabled but no draft)`);
        }
      }
      
      // Check hero asset for Tier 2
      if (plan.tier === 2 && !plan.assets.hero.url) {
        missingUrls.push('assets.hero.url (required for Tier 2)');
      }
      
      const allPassed = invalid.length === 0 && utmIssues.length === 0 && missingUrls.length === 0;
      
      if (options.json) {
        console.log(JSON.stringify({
          id: plan.id,
          passed: allPassed,
          valid_urls: valid,
          invalid_urls: invalid,
          utm_issues: utmIssues,
          missing_urls: missingUrls,
        }, null, 2));
      } else {
        console.log(chalk.bold(`Links Check for ${plan.id}`));
        console.log('');
        
        // Valid URLs
        if (valid.length > 0) {
          console.log(chalk.green(`✅ Valid URLs (${valid.length}):`));
          for (const url of valid.slice(0, 10)) {
            console.log(`   ${url}`);
          }
          if (valid.length > 10) {
            console.log(chalk.dim(`   ... and ${valid.length - 10} more`));
          }
          console.log('');
        }
        
        // Invalid URLs
        if (invalid.length > 0) {
          console.log(chalk.red(`❌ Invalid URLs (${invalid.length}):`));
          for (const url of invalid) {
            console.log(`   ${url}`);
          }
          console.log('');
        }
        
        // UTM issues
        if (utmIssues.length > 0) {
          console.log(chalk.yellow(`⚠ UTM Issues:`));
          for (const issue of utmIssues) {
            console.log(`   ${issue}`);
          }
          console.log('');
        }
        
        // Missing URLs
        if (missingUrls.length > 0) {
          console.log(chalk.yellow(`⚠ Missing URLs:`));
          for (const missing of missingUrls) {
            console.log(`   ${missing}`);
          }
          console.log('');
        }
        
        // Summary
        if (allPassed) {
          console.log(chalk.green('✅ All link checks passed'));
        } else {
          console.log(chalk.red('❌ Some link checks failed'));
          process.exit(1);
        }
      }
      
      // Append history
      appendHistory(plan, 'links-check', `Links check: ${allPassed ? 'passed' : 'failed'}`, {
        valid_count: valid.length,
        invalid_count: invalid.length,
        missing_count: missingUrls.length,
      });
      
      writePlan(plan);
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
