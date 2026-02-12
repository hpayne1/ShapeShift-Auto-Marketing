import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import {
  generateSeoArticle,
  type ProtocolAnalysis,
  type MarketingBrief,
  type FullPacketOptions,
} from '../lib/fullPacketGenerator.js';

/**
 * Parse seo_topics.md to extract topic strings.
 * Expects a table with a "Topic" column or simple lines like "1. How to earn..."
 */
function parseTopicsFile(content: string): string[] {
  const topics: string[] = [];

  // Strategy 1: Parse markdown table rows — look for "| # | Topic |" columns
  const tableRowRegex = /^\|\s*\d+\s*\|\s*(.+?)\s*\|/gm;
  let match: RegExpExecArray | null;
  while ((match = tableRowRegex.exec(content)) !== null) {
    const topic = match[1].trim();
    // Skip header rows
    if (topic && !topic.startsWith('---') && topic.toLowerCase() !== 'topic') {
      topics.push(topic);
    }
  }

  if (topics.length > 0) return [...new Set(topics)]; // deduplicate

  // Strategy 2: Simple numbered list "1. How to earn..."
  const numberedRegex = /^\d+\.\s+(.+)$/gm;
  while ((match = numberedRegex.exec(content)) !== null) {
    const topic = match[1].trim();
    if (topic) topics.push(topic);
  }

  if (topics.length > 0) return [...new Set(topics)];

  // Strategy 3: Bullet list "- How to earn..."
  const bulletRegex = /^[-*]\s+(.+)$/gm;
  while ((match = bulletRegex.exec(content)) !== null) {
    const topic = match[1].trim();
    // Skip metadata-like lines
    if (topic && !topic.startsWith('**') && !topic.startsWith('Generated') && !topic.startsWith('Packet')) {
      topics.push(topic);
    }
  }

  return [...new Set(topics)];
}

export const seoBatchCommand = new Command('seo-batch')
  .description('Generate SEO articles from a topics file (produced by gtm-seo-topic-generator skill)')
  .requiredOption('--packet <dir>', 'Path to the packet directory (e.g. research-output/yield-xyz)')
  .option('--topics-file <path>', 'Path to seo_topics.md (default: <packet>/research/seo_topics.md)')
  .option('--concurrency <n>', 'Number of articles to generate in parallel', '3')
  .option('--dry-run', 'Parse topics and show what would be generated without calling OpenAI', false)
  .action(async (options) => {
    const { packet, topicsFile, concurrency: concurrencyStr, dryRun } = options;
    const concurrency = parseInt(concurrencyStr, 10) || 3;

    // Validate packet directory
    const packetDir = path.resolve(packet);
    if (!fs.existsSync(packetDir)) {
      console.error(chalk.red(`Error: Packet directory not found: ${packetDir}`));
      process.exit(1);
    }

    // Check for API key (unless dry run)
    if (!dryRun && !process.env.OPENAI_API_KEY) {
      console.error(chalk.red('Error: OPENAI_API_KEY environment variable is required.'));
      console.error(chalk.yellow('Set it with: export OPENAI_API_KEY="sk-..."'));
      process.exit(1);
    }

    // Read topics file
    const topicsPath = topicsFile
      ? path.resolve(topicsFile)
      : path.join(packetDir, 'research', 'seo_topics.md');

    if (!fs.existsSync(topicsPath)) {
      console.error(chalk.red(`Error: Topics file not found: ${topicsPath}`));
      console.error(chalk.yellow('\nRun the gtm-seo-topic-generator skill first to create research/seo_topics.md'));
      process.exit(1);
    }

    const topicsContent = fs.readFileSync(topicsPath, 'utf-8');
    const topics = parseTopicsFile(topicsContent);

    if (topics.length === 0) {
      console.error(chalk.red('Error: No topics found in topics file.'));
      console.error(chalk.yellow('Expected format: markdown table with Topic column, numbered list, or bullet list.'));
      process.exit(1);
    }

    console.log(chalk.blue.bold(`\nSEO Batch Generator\n`));
    console.log(chalk.gray(`Packet: ${packetDir}`));
    console.log(chalk.gray(`Topics file: ${topicsPath}`));
    console.log(chalk.gray(`Topics found: ${topics.length}`));
    console.log(chalk.gray(`Concurrency: ${concurrency}`));
    console.log();

    if (dryRun) {
      console.log(chalk.yellow('DRY RUN — showing topics that would be generated:\n'));
      topics.forEach((t, i) => {
        console.log(chalk.white(`  ${String(i + 1).padStart(2)}. ${t}`));
      });
      console.log(chalk.green(`\n${topics.length} articles would be generated.`));
      return;
    }

    // Load protocol analysis and marketing brief
    const analysisPath = path.join(packetDir, 'research', 'protocol_analysis.json');
    if (!fs.existsSync(analysisPath)) {
      console.error(chalk.red(`Error: protocol_analysis.json not found in ${packetDir}/research/`));
      process.exit(1);
    }
    const analysis: ProtocolAnalysis = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));

    const briefPath = path.join(packetDir, 'marketing_brief.json');
    const briefMdPath = path.join(packetDir, 'marketing_brief.md');
    let brief: MarketingBrief;
    if (fs.existsSync(briefPath)) {
      brief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'));
    } else if (fs.existsSync(briefMdPath)) {
      // Fallback: create a minimal brief from marketing_brief.md
      const mdContent = fs.readFileSync(briefMdPath, 'utf-8');
      brief = {
        targetAudience: { who: extractMdValue(mdContent, 'Target Audience') || 'DeFi users', whatWeKnow: '', psychographics: '' },
        problemSolved: { problem: extractMdValue(mdContent, 'The Problem') || '', ahaMonent: '', beforeAfter: '' },
        gtmOneSentence: extractMdValue(mdContent, 'GTM Idea') || '',
        businessOutcomes: { outcomes: [], metrics: [] },
        wildSuccess: { vision: '', indicators: [] },
        uniqueVsCompetitors: { differentiators: [], positioningStatement: '' },
        keyMessages: {
          primary: extractMdValue(mdContent, 'Primary Message') || analysis.valueProposition,
          supporting: [],
          tweetReady: extractMdValue(mdContent, 'Tweet-Ready') || '',
        },
      };
    } else {
      console.error(chalk.red(`Error: No marketing_brief.json or marketing_brief.md found in ${packetDir}`));
      process.exit(1);
    }

    // Determine campaign type and CTA from packet
    const opts: FullPacketOptions = {
      campaignType: 'integration',
      ctaUrl: 'app.shapeshift.com',
    };

    // Try to read CTA from marketing brief
    if (fs.existsSync(briefMdPath)) {
      const mdContent = fs.readFileSync(briefMdPath, 'utf-8');
      const ctaMatch = mdContent.match(/CTA[:\s]+(https?:\/\/\S+|app\.shapeshift\.\S+)/i);
      if (ctaMatch) opts.ctaUrl = ctaMatch[1];
    }

    // Ensure seo output directory exists
    const seoDir = path.join(packetDir, 'seo');
    if (!fs.existsSync(seoDir)) {
      fs.mkdirSync(seoDir, { recursive: true });
    }

    // Find existing SEO articles to determine start index
    const existingFiles = fs.readdirSync(seoDir).filter(f => f.startsWith('seo_article_') && f.endsWith('.md'));
    const startIndex = existingFiles.length + 1;

    console.log(chalk.cyan(`Generating ${topics.length} SEO articles (starting at #${startIndex})...\n`));

    const startTime = Date.now();
    let completed = 0;

    // Process in batches for concurrency
    for (let i = 0; i < topics.length; i += concurrency) {
      const batch = topics.slice(i, i + concurrency);
      const results = await Promise.all(
        batch.map(async (topic, batchIdx) => {
          const globalIdx = i + batchIdx;
          const articleNum = startIndex + globalIdx;
          const filename = `seo_article_${String(articleNum).padStart(2, '0')}.md`;

          try {
            const content = await generateSeoArticle(
              analysis.name,
              analysis,
              brief,
              opts,
              topic
            );
            return { filename, topic, content, error: null };
          } catch (e) {
            return { filename, topic, content: null, error: (e as Error).message };
          }
        })
      );

      // Write results
      for (const result of results) {
        if (result.content) {
          fs.writeFileSync(
            path.join(seoDir, result.filename),
            `# ${result.topic}\n\n${result.content}`
          );
          completed++;
          console.log(chalk.green(`  ✓ ${result.filename}`) + chalk.gray(` — ${truncateStr(result.topic, 60)}`));
        } else {
          console.log(chalk.red(`  ✗ ${result.filename}`) + chalk.gray(` — ${result.error}`));
        }
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(chalk.green(`\n✅ Generated ${completed}/${topics.length} SEO articles in ${elapsed}s`));
    console.log(chalk.gray(`Output: ${seoDir}/`));

    // Update index.html if it exists (add new SEO article links)
    const indexHtmlPath = path.join(packetDir, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      console.log(chalk.yellow('\nNote: Run `gtm full-packet` or manually update index.html to include new SEO articles.'));
    }
  });

/** Extract a value after a label in markdown (e.g. "**Target Audience:** ...") */
function extractMdValue(md: string, label: string): string {
  const regex = new RegExp(`\\*\\*${label}:?\\*\\*\\s*(.+?)(?:\\n|$)`, 'i');
  const match = md.match(regex);
  if (match) return match[1].trim();
  // Try block quote
  const blockRegex = new RegExp(`${label}[\\s\\S]*?^>\\s*(.+?)$`, 'im');
  const blockMatch = md.match(blockRegex);
  return blockMatch ? blockMatch[1].trim() : '';
}

function truncateStr(text: string, maxLen: number): string {
  return text.length <= maxLen ? text : text.slice(0, maxLen - 3) + '...';
}
