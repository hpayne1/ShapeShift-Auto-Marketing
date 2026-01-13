import { Command } from 'commander';
import chalk from 'chalk';
import { readPlan, writePlan, readDraft, writeDraft } from '../lib/io.js';
import { buildUTMParams, composeUTMUrl, buildChannelUTMUrl, CHANNEL_UTM_DEFAULTS } from '../lib/utm.js';
import { appendHistory } from '../lib/history.js';
import { CHANNEL_NAMES, type ChannelName } from '../schema/gtmPlan.js';

export const utmCommand = new Command('utm')
  .description('Generate UTM-tagged URLs for a channel')
  .requiredOption('--id <id>', 'Initiative ID (e.g., INIT-1234)')
  .option('--channel <channel>', 'Channel name (discord, x, blog, etc.)')
  .option('--all', 'Generate URLs for all enabled channels', false)
  .option('--content <content>', 'Custom utm_content parameter')
  .option('--write-back', 'Write the UTM URL back to channel metadata', false)
  .action((options) => {
    try {
      // Read plan
      const plan = readPlan(options.id);
      
      // Check canonical URL
      if (!plan.tracking.canonical_url) {
        console.error(chalk.red('Error: No canonical_url set in tracking'));
        console.error(chalk.dim('Set it with: gtm enrich --id ' + options.id + ' --canonical-url <url>'));
        process.exit(1);
      }
      
      const results: Array<{ channel: string; url: string }> = [];
      
      if (options.all) {
        // Generate for all enabled channels
        for (const channel of CHANNEL_NAMES) {
          if (plan.channels[channel].enabled) {
            const url = buildChannelUTMUrl(plan, channel);
            if (url) {
              results.push({ channel, url });
              
              if (options.writeBack) {
                // Could write to channel metadata or draft
              }
            }
          }
        }
      } else if (options.channel) {
        // Validate channel
        if (!CHANNEL_NAMES.includes(options.channel as ChannelName)) {
          console.error(chalk.red(`Error: Invalid channel "${options.channel}"`));
          console.error(chalk.dim(`Valid channels: ${CHANNEL_NAMES.join(', ')}`));
          process.exit(1);
        }
        
        const channel = options.channel as ChannelName;
        const utmParams = buildUTMParams(plan, channel, {
          utm_content: options.content,
        });
        
        const url = composeUTMUrl(plan.tracking.canonical_url, utmParams);
        results.push({ channel, url });
        
        if (options.writeBack) {
          // Write URL to channel draft if it exists
          const draftFile = getDraftFileForChannel(channel);
          if (draftFile && plan.content_outputs[draftFile as keyof typeof plan.content_outputs]?.artifact_path) {
            const draftContent = readDraft(options.id, `${draftFile}.md`);
            if (draftContent) {
              // Append UTM URL to draft
              const updatedContent = draftContent + `\n\n---\n**Tracked URL:** ${url}\n`;
              writeDraft(options.id, `${draftFile}.md`, updatedContent);
              console.log(chalk.dim(`Updated ${draftFile}.md with UTM URL`));
            }
          }
        }
      } else {
        // Show UTM configuration
        console.log(chalk.bold(`UTM Configuration for ${plan.id}`));
        console.log('');
        console.log(chalk.dim('Base configuration:'));
        console.log(`  Canonical URL: ${plan.tracking.canonical_url}`);
        console.log(`  Campaign:      ${plan.tracking.utm_base.campaign || plan.id.toLowerCase().replace('init-', 'gtm-')}`);
        console.log(`  Source:        ${plan.tracking.utm_base.source || '(per-channel default)'}`);
        console.log(`  Medium:        ${plan.tracking.utm_base.medium || '(per-channel default)'}`);
        console.log('');
        console.log(chalk.dim('Channel defaults:'));
        for (const channel of CHANNEL_NAMES) {
          if (plan.channels[channel].enabled) {
            const defaults = CHANNEL_UTM_DEFAULTS[channel];
            console.log(`  ${channel}: source=${defaults.source}, medium=${defaults.medium}`);
          }
        }
        console.log('');
        console.log(chalk.cyan('Usage:'));
        console.log(`  gtm utm --id ${options.id} --channel discord`);
        console.log(`  gtm utm --id ${options.id} --all`);
        return;
      }
      
      // Display results
      console.log(chalk.bold(`UTM URLs for ${plan.id}`));
      console.log('');
      
      for (const result of results) {
        console.log(chalk.green(`${result.channel}:`));
        console.log(`  ${result.url}`);
        console.log('');
      }
      
      // Show copy-paste friendly format
      if (results.length === 1) {
        console.log(chalk.dim('Copy-paste ready:'));
        console.log(results[0].url);
      }
      
      // Append history
      appendHistory(plan, 'utm-generate', `Generated UTM URLs for ${results.length} channel(s)`, {
        channels: results.map(r => r.channel),
      });
      
      writePlan(plan);
      
    } catch (error) {
      console.error(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  });

function getDraftFileForChannel(channel: ChannelName): string | null {
  const mapping: Partial<Record<ChannelName, string>> = {
    discord: 'discord_post',
    x: 'x_post',
    reddit: 'reddit_post',
    farcaster: 'farcaster_post',
    blog: 'blog_draft',
    email: 'email_template',
    partner_outbounds: 'partner_brief',
  };
  return mapping[channel] || null;
}
