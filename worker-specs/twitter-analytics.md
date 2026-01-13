# Twitter/X Analytics Integration
## Pull metrics from X API for data-driven posting

---

## Overview

This component pulls analytics from the X API to:
1. Track performance of published content
2. Inform data posts (what to highlight)
3. Identify optimal posting times
4. Feed the Analytics Worker with metrics

---

## X API Access Levels

| Tier | Cost | Rate Limits | What You Get |
|------|------|-------------|--------------|
| **Free** | $0 | Very limited | Basic post/read |
| **Basic** | $100/mo | 10K reads/mo | Enough for small ops |
| **Pro** | $5,000/mo | 1M reads/mo | Full analytics |

**Recommendation:** Start with Basic ($100/mo), upgrade if needed.

---

## Data We Can Pull

### Per-Tweet Metrics (public_metrics)
```typescript
interface TweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
}
```

### Per-Tweet Metrics (non_public_metrics) — Requires elevated access
```typescript
interface TweetNonPublicMetrics {
  impression_count: number;
  url_link_clicks: number;
  user_profile_clicks: number;
}
```

### Account-Level Metrics
```typescript
interface AccountMetrics {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
}
```

---

## API Endpoints

### Get Tweet by ID
```
GET /2/tweets/:id
?tweet.fields=public_metrics,non_public_metrics,created_at
```

### Get User Tweets
```
GET /2/users/:id/tweets
?tweet.fields=public_metrics,created_at
&max_results=100
```

### Search Recent Tweets
```
GET /2/tweets/search/recent
?query=from:ShapeShift
&tweet.fields=public_metrics
```

---

## Implementation

### Twitter Client Setup

```typescript
// lib/twitter-client.ts
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

export const twitter = client.readWrite;
```

### Fetch Tweet Metrics

```typescript
async function getTweetMetrics(tweetId: string): Promise<TweetMetrics> {
  const tweet = await twitter.v2.singleTweet(tweetId, {
    'tweet.fields': ['public_metrics', 'non_public_metrics', 'created_at'],
  });
  
  return {
    id: tweet.data.id,
    text: tweet.data.text,
    created_at: tweet.data.created_at,
    metrics: {
      impressions: tweet.data.public_metrics.impression_count,
      likes: tweet.data.public_metrics.like_count,
      retweets: tweet.data.public_metrics.retweet_count,
      replies: tweet.data.public_metrics.reply_count,
      quotes: tweet.data.public_metrics.quote_count,
      link_clicks: tweet.data.non_public_metrics?.url_link_clicks || null,
    },
  };
}
```

### Fetch Recent Account Performance

```typescript
async function getRecentPerformance(days: number = 7): Promise<PerformanceSummary> {
  const userId = await getUserId('ShapeShift');
  
  const tweets = await twitter.v2.userTimeline(userId, {
    max_results: 100,
    'tweet.fields': ['public_metrics', 'created_at'],
    start_time: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
  });
  
  const metrics = tweets.data.data.map(t => t.public_metrics);
  
  return {
    period_days: days,
    total_tweets: tweets.data.data.length,
    total_impressions: sum(metrics, 'impression_count'),
    total_engagements: sum(metrics, m => m.like_count + m.retweet_count + m.reply_count),
    avg_engagement_rate: calculateEngagementRate(metrics),
    top_tweet: findTopTweet(tweets.data.data),
  };
}
```

---

## Automated Data Collection

### Scheduled Job

```typescript
// Run daily at 9am
// Collects metrics for all published GTM content

async function dailyMetricsCollection() {
  // Get all GTM plans with published X content
  const plans = await getPublishedPlans();
  
  for (const plan of plans) {
    const tweetUrl = plan.channels.x.published_url;
    if (!tweetUrl) continue;
    
    const tweetId = extractTweetId(tweetUrl);
    const metrics = await getTweetMetrics(tweetId);
    
    // Store in plan
    await updatePlanMetrics(plan.id, 'x', metrics);
    
    // Store in time-series (for historical analysis)
    await storeMetricSnapshot(plan.id, 'x', metrics);
  }
  
  // Generate daily summary
  await generateDailySummary();
}
```

### Metrics Storage

```yaml
# .gtm/STRK-001/metrics/x.yaml
tweet_id: "1234567890"
collected_at: "2026-02-01T09:00:00Z"

snapshots:
  - timestamp: "2026-01-31T09:00:00Z"
    impressions: 5000
    likes: 120
    retweets: 45
    replies: 12
    
  - timestamp: "2026-02-01T09:00:00Z"
    impressions: 12000
    likes: 280
    retweets: 98
    replies: 34

derived:
  engagement_rate: 0.034  # (likes + RTs + replies) / impressions
  growth_24h:
    impressions: +7000
    likes: +160
```

---

## Data Post Generation

### Identify Highlights

```typescript
async function generateDataPostContent(): Promise<DataPost> {
  const weeklyMetrics = await getRecentPerformance(7);
  const topTweets = await getTopTweets(7, 3); // Last 7 days, top 3
  
  // Find interesting data points
  const highlights = [];
  
  // Volume/growth highlights
  if (weeklyMetrics.total_impressions > 100000) {
    highlights.push({
      type: 'milestone',
      text: `${formatNumber(weeklyMetrics.total_impressions)} impressions this week`,
    });
  }
  
  // Top performing content
  if (topTweets[0].metrics.engagement_rate > 0.05) {
    highlights.push({
      type: 'top_content',
      text: `Top post hit ${topTweets[0].metrics.engagement_rate * 100}% engagement`,
      link: topTweets[0].url,
    });
  }
  
  // Chain/route data (from on-chain analytics)
  // ... integrate with your volume data
  
  return {
    highlights,
    suggested_post: generateDataPostDraft(highlights),
  };
}
```

### Data Post Template

```typescript
function generateDataPostDraft(highlights: Highlight[]): string {
  return `
This week on ShapeShift:

📊 ${highlights.find(h => h.type === 'volume')?.text || 'X volume'}
📈 ${highlights.find(h => h.type === 'growth')?.text || 'Growth metric'}
🔥 ${highlights.find(h => h.type === 'top')?.text || 'Top highlight'}

[insight or observation]
  `.trim();
}
```

---

## Optimal Posting Time Analysis

### Collect Historical Data

```typescript
async function analyzeOptimalPostingTimes(): Promise<PostingTimeAnalysis> {
  const tweets = await getHistoricalTweets(90); // Last 90 days
  
  // Group by day of week and hour
  const byDayHour = groupBy(tweets, t => {
    const date = new Date(t.created_at);
    return `${date.getDay()}-${date.getHours()}`;
  });
  
  // Calculate avg engagement per time slot
  const timeSlotPerformance = Object.entries(byDayHour).map(([slot, tweets]) => ({
    slot,
    day: parseInt(slot.split('-')[0]),
    hour: parseInt(slot.split('-')[1]),
    avg_engagement_rate: average(tweets.map(t => calculateEngagementRate(t))),
    sample_size: tweets.length,
  }));
  
  // Find best times
  const bestTimes = timeSlotPerformance
    .filter(t => t.sample_size >= 5) // Enough data
    .sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)
    .slice(0, 5);
    
  return {
    best_times: bestTimes,
    worst_times: timeSlotPerformance.sort((a, b) => a.avg_engagement_rate - b.avg_engagement_rate).slice(0, 3),
    recommendation: formatRecommendation(bestTimes),
  };
}
```

### Output

```yaml
# Best posting times based on 90-day analysis
best_times:
  - day: 2  # Tuesday
    hour: 14  # 2pm UTC
    avg_engagement_rate: 0.042
    
  - day: 4  # Thursday
    hour: 15  # 3pm UTC
    avg_engagement_rate: 0.039
    
  - day: 1  # Monday
    hour: 13  # 1pm UTC
    avg_engagement_rate: 0.037

recommendation: "Best times: Tue/Thu 2-3pm UTC. Avoid weekends before 10am."
```

---

## Integration with GTM System

### Analytics Worker Uses This Data

```typescript
// analytics-worker reads from Twitter API
async function generateReport(planId: string) {
  // Get published tweet URL from plan
  const plan = await loadPlan(planId);
  const tweetUrl = plan.channels.x.published_url;
  
  // Fetch current metrics
  const metrics = await getTweetMetrics(extractTweetId(tweetUrl));
  
  // Compare to benchmarks
  const benchmark = await getAccountBenchmarks();
  const performance = compareToAverage(metrics, benchmark);
  
  // Generate report section
  return {
    channel: 'x',
    metrics,
    vs_benchmark: performance,
    recommendation: performance.below_average 
      ? "Consider boosting or creating follow-up content"
      : "Performing well, amplify with QTs"
  };
}
```

### Data Post Scheduling

```typescript
// Weekly data post automation
async function weeklyDataPost() {
  // 1. Pull metrics
  const weeklyMetrics = await getRecentPerformance(7);
  
  // 2. Pull on-chain data (volumes, routes)
  const volumeData = await getShapeShiftVolumes(7);
  
  // 3. Generate data post
  const post = `
This week on ShapeShift:

📊 $${formatNumber(volumeData.total_volume)} trading volume
📈 ${volumeData.top_chain} swaps up ${volumeData.top_chain_growth}%
🔥 Top route: ${volumeData.top_route}

${weeklyMetrics.total_tweets} posts | ${formatNumber(weeklyMetrics.total_impressions)} impressions
  `.trim();
  
  // 4. Create GTM plan for the data post
  await createDataPostPlan(post);
  
  // 5. Queue for optimal time
  const bestTime = await getNextBestPostingTime();
  await schedulePost(post, bestTime);
}
```

---

## Environment Variables

```bash
# X/Twitter API
X_API_KEY=your-api-key
X_API_SECRET=your-api-secret
X_ACCESS_TOKEN=your-access-token
X_ACCESS_TOKEN_SECRET=your-access-token-secret
X_BEARER_TOKEN=your-bearer-token  # For app-only auth

# ShapeShift account ID
X_SHAPESHIFT_USER_ID=123456789
```

---

## Rate Limit Management

```typescript
const rateLimiter = {
  requests_per_15_min: 0,
  reset_at: null,
  
  async throttle() {
    if (this.requests_per_15_min >= 450) { // Leave buffer
      const waitTime = this.reset_at - Date.now();
      if (waitTime > 0) {
        await sleep(waitTime);
      }
    }
    this.requests_per_15_min++;
  },
  
  handleRateLimit(headers: Headers) {
    this.reset_at = parseInt(headers.get('x-rate-limit-reset')) * 1000;
    this.requests_per_15_min = parseInt(headers.get('x-rate-limit-remaining'));
  }
};
```

---

## Commands

```bash
# Pull metrics for a specific tweet
twitter-analytics tweet --id 1234567890

# Get account performance summary
twitter-analytics summary --days 7

# Analyze best posting times
twitter-analytics optimal-times --days 90

# Generate data post draft
twitter-analytics data-post --period weekly

# Export all metrics
twitter-analytics export --format csv --days 30
```

---

*This is the data source for understanding what's working and what to post next.*
