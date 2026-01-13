# Analytics Worker Specification
## Pulls metrics and generates performance reports

---

## Overview

The Analytics Worker monitors published content performance by pulling metrics from platform APIs and UTM tracking. It generates human-readable reports and flags underperforming content.

**Role in system:** This is the "reporter" — it tells you what's working and what isn't.

---

## Interface

### Input

```
.gtm/{id}/plan.yaml
```

**Required fields:**
```yaml
id: string
channels:
  {channel}:
    status: published
    published_url: string       # URL to track
    published_at: datetime      # When it was posted
tracking:
  utm_base:
    source: string
    medium: string
    campaign: string
  dashboard_urls: string[]      # Optional: links to dashboards
```

### Output

```
.gtm/{id}/reports/
├── daily/
│   ├── 2026-02-01.md
│   ├── 2026-02-02.md
│   └── ...
├── weekly/
│   ├── week-1.md
│   ├── week-2.md
│   └── ...
└── summary.md                  # Rolling summary
```

**Report format:**
```markdown
---
generated_at: 2026-02-08T10:00:00Z
period: week-1
initiative: STRK-AGENT-001
---

# Week 1 Performance Report

## Summary
- Total impressions: 45,000
- Total engagements: 3,200 (7.1% rate)
- Link clicks: 890
- Estimated conversions: 45

## By Channel

### X (@ShapeShift)
| Metric | Value |
|--------|-------|
| Impressions | 32,000 |
| Likes | 1,200 |
| Retweets | 340 |
| Replies | 89 |
| Link clicks | 650 |

Post: https://x.com/ShapeShift/status/1234567890

### Discord
| Metric | Value |
|--------|-------|
| Views | 8,000 |
| Reactions | 450 |

## Top Performing Content
1. X launch post — 32K impressions, 4.8% engagement

## Underperforming / Flags
- None this week

## Recommendations
- Double down on X threads (higher engagement than single posts)
- Consider Discord follow-up content
```

---

## Commands

```bash
# Generate report for specific initiative
analytics-worker report --id STRK-AGENT-001

# Generate report for specific period
analytics-worker report --id STRK-AGENT-001 --period weekly

# Generate reports for all published initiatives
analytics-worker report --all

# Generate daily summary (for cron)
analytics-worker daily

# Generate weekly summary (for cron)
analytics-worker weekly

# Check specific post performance
analytics-worker check --url "https://x.com/ShapeShift/status/1234567890"

# Export metrics to CSV
analytics-worker export --id STRK-AGENT-001 --format csv
```

---

## Behavior

### Report Generation Flow

```
1. Load plan.yaml
   └─→ Find all channels with status=published
   └─→ Get published_url and published_at for each

2. For each published channel:
   └─→ Call platform API to fetch metrics
   └─→ Store raw metrics

3. Fetch UTM/conversion data
   └─→ Query analytics dashboard API
   └─→ Match UTM campaign to this initiative

4. Aggregate metrics
   └─→ Sum impressions, engagements, clicks
   └─→ Calculate rates (engagement %, CTR)

5. Analyze performance
   └─→ Compare to benchmarks
   └─→ Flag underperformers
   └─→ Identify top performers

6. Generate report
   └─→ Use LLM to write summary (optional)
   └─→ Or use template with data substitution
   └─→ Write to reports/{period}.md

7. Update summary.md with rolling totals
```

### Scheduling

| Report Type | Frequency | Trigger |
|-------------|-----------|---------|
| Daily snapshot | Daily | Cron at 9am |
| Weekly summary | Weekly | Cron on Monday |
| Monthly report | Monthly | Cron on 1st |
| On-demand | Manual | CLI command |

---

## Metrics by Platform

### X (Twitter)

**API:** X API v2 Analytics

**Metrics available:**
```typescript
interface XMetrics {
  impressions: number;
  engagements: number;  // Total interactions
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  url_clicks: number;
  profile_clicks: number;
  detail_expands: number;
}
```

**Endpoint:** `GET /2/tweets/:id?tweet.fields=public_metrics,non_public_metrics`

**Note:** Some metrics require elevated API access.

### Discord

**API:** Discord Bot API (limited analytics)

**Metrics available:**
```typescript
interface DiscordMetrics {
  // Direct metrics limited
  // Mostly rely on reaction counts
  reactions: number;
  // May need bot to track views
}
```

**Alternative:** Manual tracking or bot-based view counting.

### Farcaster

**API:** Neynar or hub queries

**Metrics available:**
```typescript
interface FarcasterMetrics {
  likes: number;
  recasts: number;
  replies: number;
  // Impressions not directly available
}
```

### Blog

**API:** CMS analytics or Google Analytics

**Metrics available:**
```typescript
interface BlogMetrics {
  pageviews: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
  scroll_depth: number;
}
```

### UTM Tracking

**API:** Google Analytics, Plausible, or custom

**Metrics available:**
```typescript
interface UTMMetrics {
  clicks: number;
  sessions: number;
  conversions: number;  // Defined events (swap started, etc.)
  bounce_rate: number;
}
```

**Query by:**
- `utm_source=shapeshift`
- `utm_medium=social`
- `utm_campaign={initiative_campaign}`

---

## Benchmarks & Alerts

### Performance Benchmarks

```yaml
benchmarks:
  x:
    engagement_rate_good: 0.03      # 3%+
    engagement_rate_warning: 0.01   # <1% = flag
    impressions_per_follower: 0.1   # Expect 10% of followers
    
  discord:
    reaction_rate_good: 0.05        # 5% of viewers react
    
  blog:
    avg_time_good: 120              # 2+ minutes
    bounce_rate_warning: 0.7        # >70% = flag
```

### Alert Triggers

| Condition | Alert Level | Action |
|-----------|-------------|--------|
| Engagement rate < 1% | Warning | Flag in report |
| Zero engagements after 24h | Error | Notify human |
| UTM clicks = 0 | Warning | Check tracking |
| Conversion rate way above normal | Info | Investigate what worked |

---

## Report Templates

### Daily Report Template

```markdown
# Daily Report: {{initiative_id}}
**Date:** {{date}}

## Quick Stats
| Metric | Today | Total |
|--------|-------|-------|
| Impressions | {{today_impressions}} | {{total_impressions}} |
| Engagements | {{today_engagements}} | {{total_engagements}} |
| Clicks | {{today_clicks}} | {{total_clicks}} |

## Notes
{{auto_generated_notes}}
```

### Weekly Report Template

```markdown
# Week {{week_number}} Report: {{initiative_id}}
**Period:** {{start_date}} - {{end_date}}

## Summary
{{llm_generated_summary}}

## Metrics by Channel
{{#each channels}}
### {{channel_name}}
| Metric | Value | vs Benchmark |
|--------|-------|--------------|
{{#each metrics}}
| {{name}} | {{value}} | {{benchmark_comparison}} |
{{/each}}
{{/each}}

## Top Performers
{{top_performers}}

## Flags
{{flags}}

## Recommendations
{{recommendations}}
```

---

## LLM Integration (Optional)

### Summary Generation

```typescript
async function generateSummary(metrics: AggregatedMetrics): Promise<string> {
  const prompt = `
    You are analyzing marketing performance for a crypto product launch.
    
    Metrics:
    ${JSON.stringify(metrics, null, 2)}
    
    Write a 2-3 sentence summary highlighting:
    - Overall performance (good/bad/neutral)
    - Top performing content
    - Any concerns
    
    Be concise and data-driven.
  `;
  
  return await llm.complete(prompt);
}
```

### Recommendation Generation

```typescript
async function generateRecommendations(
  metrics: AggregatedMetrics,
  benchmarks: Benchmarks
): Promise<string[]> {
  const prompt = `
    Based on these marketing metrics and benchmarks, 
    suggest 2-3 specific actions to improve performance.
    
    Metrics: ${JSON.stringify(metrics)}
    Benchmarks: ${JSON.stringify(benchmarks)}
    
    Return as JSON array of strings.
  `;
  
  return JSON.parse(await llm.complete(prompt));
}
```

---

## Environment Variables

```bash
# X Analytics
X_API_KEY=...
X_API_SECRET=...
X_BEARER_TOKEN=...

# Analytics Platform
GOOGLE_ANALYTICS_PROPERTY_ID=...
GOOGLE_ANALYTICS_CREDENTIALS=...
# Or
PLAUSIBLE_API_KEY=...
PLAUSIBLE_SITE_ID=...

# LLM (for summaries)
ANTHROPIC_API_KEY=...

# General
GTM_ROOT=./.gtm
REPORTS_RETENTION_DAYS=90
```

---

## Configuration

### config.yaml

```yaml
analytics:
  platforms:
    x:
      enabled: true
      api_version: "v2"
    discord:
      enabled: true
      method: reactions_only  # or bot_tracking
    farcaster:
      enabled: true
      provider: neynar
    blog:
      enabled: true
      provider: google_analytics
      
  utm:
    provider: google_analytics  # or plausible, custom
    
  reporting:
    daily: true
    weekly: true
    monthly: true
    
  alerts:
    slack_webhook: https://hooks.slack.com/...  # Optional
    email: marketing@shapeshift.com             # Optional

benchmarks:
  x:
    engagement_rate_good: 0.03
    engagement_rate_warning: 0.01
  # ... etc

llm:
  enabled: true
  provider: anthropic
  model: claude-3-5-sonnet
```

---

## Data Storage

### Raw Metrics (Optional)

For historical analysis, store raw metrics:

```
.gtm/{id}/metrics/
├── x/
│   ├── 2026-02-01.json
│   ├── 2026-02-02.json
│   └── ...
├── discord/
│   └── ...
└── utm/
    └── ...
```

### Aggregated Metrics

Keep a rolling aggregate in plan.yaml or separate file:

```yaml
# .gtm/{id}/metrics/aggregate.yaml
total:
  impressions: 150000
  engagements: 12000
  clicks: 3500
  conversions: 180
  
by_channel:
  x:
    impressions: 120000
    engagements: 9600
  discord:
    impressions: 30000
    engagements: 2400
    
by_week:
  - week: 1
    impressions: 45000
    engagements: 3200
  - week: 2
    impressions: 52000
    engagements: 4100
```

---

## Implementation Notes

### Recommended Structure (Node.js)

```
analytics-worker/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── reporter.ts           # Main reporting logic
│   ├── platforms/
│   │   ├── x.ts              # X metrics fetching
│   │   ├── discord.ts        # Discord metrics
│   │   ├── farcaster.ts      # Farcaster metrics
│   │   └── blog.ts           # Blog analytics
│   ├── utm/
│   │   ├── google.ts         # Google Analytics
│   │   └── plausible.ts      # Plausible Analytics
│   ├── analysis/
│   │   ├── benchmarks.ts     # Benchmark comparison
│   │   ├── alerts.ts         # Alert generation
│   │   └── llm.ts            # LLM summaries
│   ├── output/
│   │   ├── markdown.ts       # Report generation
│   │   └── csv.ts            # CSV export
│   └── config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Key Functions

```typescript
// Main entry point
async function generateReport(
  planPath: string,
  options: ReportOptions
): Promise<Report>

// Fetch metrics for a channel
async function fetchChannelMetrics(
  channel: string,
  url: string,
  since: Date
): Promise<ChannelMetrics>

// Fetch UTM/conversion data
async function fetchUTMMetrics(
  campaign: string,
  since: Date
): Promise<UTMMetrics>

// Analyze and flag issues
function analyzePerformance(
  metrics: AggregatedMetrics,
  benchmarks: Benchmarks
): Analysis

// Generate markdown report
function renderReport(
  analysis: Analysis,
  template: string
): string
```

---

## Testing

### Test Cases

1. **Happy path:** Published initiative, metrics fetched, report generated
2. **No published content:** Handles gracefully, empty report
3. **API failure:** Retries, reports partial data
4. **Benchmark alerts:** Correctly flags underperformers
5. **Historical reports:** Generates for past periods

### Mock Mode

```bash
# Use mock data for testing
analytics-worker report --id TEST-001 --mock
```

---

## Future Enhancements

- [ ] Real-time dashboard (web UI)
- [ ] Slack/Discord notifications for alerts
- [ ] Comparative analysis (this campaign vs past campaigns)
- [ ] Predictive analytics (expected final performance)
- [ ] Auto-optimization suggestions
- [ ] Integration with ad platforms (X Ads metrics)
- [ ] Cohort analysis (who engaged? who converted?)

---

*This worker closes the loop. Without measurement, you can't improve.*
