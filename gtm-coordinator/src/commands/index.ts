import { Command } from 'commander';
import chalk from 'chalk';
import { listPlans, readPlan, writeIndex } from '../lib/io.js';
import { renderIndexEntry } from '../lib/render.js';
import { getQASignalEmoji, getGateStatusEmoji, getRiskLevelEmoji } from '../lib/status.js';

export const indexCommand = new Command('index')
  .description('Build index.json from all GTM plans')
  .option('--stdout', 'Output to stdout instead of file', false)
  .option('--table', 'Output as formatted table', false)
  .action((options) => {
    try {
      // List all plans
      const planIds = listPlans();
      
      if (planIds.length === 0) {
        console.log(chalk.yellow('No GTM plans found in .gtm/'));
        return;
      }
      
      // Build index entries
      const entries: Record<string, unknown>[] = [];
      
      for (const id of planIds) {
        try {
          const plan = readPlan(id);
          entries.push(renderIndexEntry(plan));
        } catch (error) {
          console.error(chalk.yellow(`Warning: Could not read ${id}: ${(error as Error).message}`));
        }
      }
      
      // Sort by updated_at descending
      entries.sort((a, b) => {
        const aTime = new Date(a.updated_at as string).getTime();
        const bTime = new Date(b.updated_at as string).getTime();
        return bTime - aTime;
      });
      
      const index = {
        generated_at: new Date().toISOString(),
        count: entries.length,
        initiatives: entries,
      };
      
      if (options.table) {
        // Output as formatted table
        console.log(chalk.bold('GTM Initiatives Index'));
        console.log('');
        console.log('| ID | Title | Tier | Risk | QA | Marketing | Release |');
        console.log('|----|-------|------|------|----|-----------|---------|');
        
        for (const entry of entries) {
          const qaIcon = getQASignalEmoji(entry.qa_signal as string | null);
          const mkgGate = entry.marketing_gate as { status: string; approvals_count: number; required_approvals: number };
          const mkgIcon = getGateStatusEmoji(mkgGate.status as any);
          const riskIcon = getRiskLevelEmoji(entry.risk_level as string);
          
          const title = (entry.title as string).length > 25 
            ? (entry.title as string).slice(0, 22) + '...'
            : entry.title;
          
          const releaseWindow = entry.release_window as { start: string | null; end: string | null };
          const release = releaseWindow.start || 'TBD';
          
          const mkgStatus = `${mkgIcon} ${mkgGate.approvals_count}/${mkgGate.required_approvals}`;
            
          console.log(`| ${entry.id} | ${title} | ${entry.tier} | ${riskIcon} | ${qaIcon} | ${mkgStatus} | ${release} |`);
        }
        
        console.log('');
        console.log(chalk.dim(`${entries.length} initiative(s) total`));
        
        // Summary stats
        const qaGreen = entries.filter(e => e.qa_signal === 'green').length;
        const mkgApproved = entries.filter(e => (e.marketing_gate as { status: string }).status === 'approved').length;
        const highRisk = entries.filter(e => e.risk_level === 'high').length;
        
        console.log('');
        console.log(chalk.dim('Summary:'));
        console.log(`  QA Green:           ${qaGreen}/${entries.length}`);
        console.log(`  Marketing Approved: ${mkgApproved}/${entries.length}`);
        console.log(`  High Risk:          ${highRisk}/${entries.length}`);
        
      } else if (options.stdout) {
        console.log(JSON.stringify(index, null, 2));
      } else {
        // Write to file
        writeIndex(index);
        
        console.log(chalk.green(`✅ Built index with ${entries.length} initiative(s)`));
        console.log('');
        console.log(chalk.dim('Output file:'));
        console.log(`  .gtm/index.json`);
        console.log('');
        
        // Summary
        console.log(chalk.dim('Summary:'));
        const qaGreen = entries.filter(e => e.qa_signal === 'green').length;
        const mkgApproved = entries.filter(e => (e.marketing_gate as { status: string }).status === 'approved').length;
        const tier2 = entries.filter(e => e.tier === 2).length;
        const highRisk = entries.filter(e => e.risk_level === 'high').length;
        
        console.log(`  Total initiatives:  ${entries.length}`);
        console.log(`  QA Green:           ${qaGreen}/${entries.length}`);
        console.log(`  Marketing Approved: ${mkgApproved}/${entries.length}`);
        console.log(`  Tier 2:             ${tier2}/${entries.length}`);
        console.log(`  High Risk:          ${highRisk}/${entries.length}`);
        
        // List locked initiatives
        const locked = entries.filter(e => e.commit_sha);
        if (locked.length > 0) {
          console.log('');
          console.log(chalk.dim(`Locked to commit: ${locked.length}`));
        }
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });
