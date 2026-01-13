# Publisher Worker Specification
## Posts approved content to social channels

---

## Overview

The Publisher Worker reads approved content from GTM plan drafts and posts them to the actual social channels (X, Discord, Farcaster, etc.). It writes the published URLs back to the plan for tracking.

**Role in system:** This is the "poster" — it takes approved drafts and makes them live.

---

## Interface

### Input

```
.gtm/{id}/plan.yaml
.gtm/{id}/drafts/{channel}.md
```

**Required fields in plan.yaml:**
```yaml
id: string
gates:
  marketing_gate:
    status: approved          # Must be approved to publish
channels:
  {channel}:
    enabled: true
    status: approved          # Only publish approved content
    artifact_path: ./drafts/{channel}.md
timing:
  publish_mode: manual|auto_when_green|auto_on_flag
  publish_window:
    start: datetime|null      # Optional: don't publish before this
    end: datetime|null        # Optional: don't publish after this
```

### Output

**Updated plan.yaml:**
```yaml
channels:
  x:
    status: published
    published_url: "https://x.com/ShapeShift/status/1234567890"
    published_at: "2026-02-01T14:30:00Z"
history:
  - action: published
    timestamp: "2026-02-01T14:30:00Z"
    actor: publisher-worker
    channel: x
    details:
      url: "https://x.com/ShapeShift/status/1234567890"
      post_id: "1234567890"
```

---

## Commands

```bash
# Publish all approved channels for a plan
publisher-worker publish --plan .gtm/STRK-AGENT-001/plan.yaml

# Publish by initiative ID
publisher-worker publish --id STRK-AGENT-001

# Publish specific channel only
publisher-worker publish --id STRK-AGENT-001 --channel x

# Schedule for later (if supported by platform)
publisher-worker schedule --id STRK-AGENT-001 --channel x --time "2026-02-01T14:00:00Z"

# Dry run (show what would be posted, don't actually post)
publisher-worker publish --id STRK-AGENT-001 --dry-run

# Check publish status of all channels
publisher-worker status --id STRK-AGENT-001
```

---

## Behavior

### Publishing Flow

```
1. Load plan.yaml
   └─→ Validate gates.marketing_gate.status == approved
   └─→ If not approved, exit with error

2. Check publish window
   └─→ If publish_window.start > now, exit (not yet)
   └─→ If publish_window.end < now, warn (window passed)

3. For each enabled channel with status=approved:
   └─→ Load content from artifact_path
   └─→ Parse frontmatter (strip before posting)
   └─→ Validate content meets channel constraints
   └─→ Post to channel API
   └─→ Capture response (post ID, URL)
   └─→ Update channel.status = published
   └─→ Update channel.published_url
   └─→ Update channel.published_at
   └─→ Append to history

4. Save plan.yaml
```

### Channel Publishing Logic

#### X (Twitter)

```typescript
interface XPublishConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
}

// Single post
async function publishToX(content: string, config: XPublishConfig): Promise<{
  id: string;
  url: string;
}> {
  // Validate length <= 280
  // Call X API v2 POST /tweets
  // Return tweet ID and URL
}

// Thread
async function publishThreadToX(tweets: string[], config: XPublishConfig): Promise<{
  ids: string[];
  url: string;  // URL of first tweet
}> {
  // Post first tweet
  // Post subsequent tweets as replies
  // Return all IDs and thread URL
}
```

#### Discord

```typescript
interface DiscordPublishConfig {
  webhookUrl: string;
}

async function publishToDiscord(content: string, config: DiscordPublishConfig): Promise<{
  id: string;
  url: string;
}> {
  // POST to webhook URL
  // Discord webhooks return message ID
  // Construct URL from guild/channel/message IDs
}
```

#### Farcaster

```typescript
interface FarcasterPublishConfig {
  signerUuid: string;
  fid: number;
}

async function publishToFarcaster(content: string, config: FarcasterPublishConfig): Promise<{
  hash: string;
  url: string;
}> {
  // Validate length <= 320
  // Call Farcaster hub API
  // Return cast hash and warpcast URL
}
```

#### Blog

```typescript
interface BlogPublishConfig {
  cmsApiKey: string;
  cmsEndpoint: string;
}

async function publishToBlog(content: string, metadata: BlogMetadata, config: BlogPublishConfig): Promise<{
  id: string;
  url: string;
}> {
  // Parse markdown content
  // Extract title, description, tags
  // POST to CMS API
  // Return post ID and URL
}
```

---

## Platform Integrations

### X (Twitter) API v2

**Required scopes:** `tweet.read`, `tweet.write`, `users.read`

**Endpoints:**
- `POST /2/tweets` — Create tweet
- `GET /2/tweets/:id` — Get tweet (for verification)

**Rate limits:** 
- 200 tweets per 15-minute window (user auth)
- 300 tweets per 15-minute window (app auth)

**Implementation notes:**
- Use OAuth 1.0a User Context for posting
- Handle media upload separately if images included
- For threads, use `reply.in_reply_to_tweet_id`

### Discord Webhooks

**Setup:**
- Create webhook in Discord server settings
- Store webhook URL securely

**Payload:**
```json
{
  "content": "Message text",
  "embeds": [{
    "title": "Optional embed",
    "description": "Embed content",
    "color": 3447003
  }]
}
```

**Implementation notes:**
- Webhooks are simpler than bot auth
- Can include rich embeds
- No rate limit concerns for low volume

### Farcaster

**Options:**
- Neynar API (managed)
- Direct hub submission

**Implementation notes:**
- Need a signer (managed key)
- 320 character limit
- Can include embeds (URLs auto-preview)

---

## Scheduling

### Immediate Publishing (Default)
Posts immediately when command is run.

### Scheduled Publishing
```bash
publisher-worker schedule --id STRK-AGENT-001 --channel x --time "2026-02-01T14:00:00Z"
```

**Options:**
1. **Platform native:** Use X's scheduled tweets feature
2. **Worker-managed:** Store schedule in plan, cron job checks and publishes
3. **External scheduler:** GitHub Actions scheduled workflow

**Recommended:** Worker-managed with cron for simplicity.

### Publish Window Enforcement

```yaml
timing:
  publish_window:
    start: "2026-02-01T09:00:00Z"  # Don't publish before 9am
    end: "2026-02-01T18:00:00Z"    # Don't publish after 6pm
```

Worker checks:
- If `now < start`: Exit, not yet
- If `now > end`: Warn, window passed (still allow with `--force`)

---

## Error Handling

| Error | Handling |
|-------|----------|
| Marketing gate not approved | Exit with clear error message |
| Channel not in approved status | Skip channel, continue others |
| API rate limit | Retry with backoff, fail after 3 attempts |
| API auth failure | Exit with error, check credentials |
| Content too long | Exit with validation error |
| Publish window passed | Warn, require --force to proceed |
| Network failure | Retry 3x, then fail |

### Rollback

If publishing fails mid-way:
- Channels already published remain published
- Failed channel stays in `approved` status
- History records partial publish
- Human can retry failed channels individually

---

## Environment Variables

```bash
# X (Twitter)
X_API_KEY=...
X_API_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_TOKEN_SECRET=...

# Discord
DISCORD_WEBHOOK_ANNOUNCEMENTS=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_GENERAL=https://discord.com/api/webhooks/...

# Farcaster
FARCASTER_SIGNER_UUID=...
FARCASTER_FID=...
NEYNAR_API_KEY=...  # If using Neynar

# Blog CMS
BLOG_CMS_API_KEY=...
BLOG_CMS_ENDPOINT=https://cms.shapeshift.com/api/...

# General
GTM_ROOT=./.gtm
```

---

## Configuration

### config.yaml

```yaml
channels:
  x:
    enabled: true
    max_length: 280
    thread_max_tweets: 10
    
  discord:
    enabled: true
    webhook_channel: announcements  # Maps to env var
    max_length: 2000
    
  farcaster:
    enabled: true
    max_length: 320
    
  blog:
    enabled: true
    cms_type: ghost  # or wordpress, notion, etc.

scheduling:
  default_timezone: "America/Los_Angeles"
  check_interval_minutes: 15  # For scheduled posts

retry:
  max_attempts: 3
  backoff_seconds: [5, 30, 120]
```

---

## Security Considerations

### Credential Management
- Never store credentials in code or plan files
- Use environment variables or secrets manager
- Rotate tokens periodically

### Content Validation
- Re-validate content length before posting
- Check for forbidden content patterns
- Log all publishing attempts

### Audit Trail
- Every publish action recorded in history
- Include actor, timestamp, channel, URL
- Plan YAML is the source of truth

---

## Implementation Notes

### Recommended Structure (Node.js)

```
publisher-worker/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── publisher.ts          # Main publishing logic
│   ├── channels/
│   │   ├── x.ts              # X/Twitter integration
│   │   ├── discord.ts        # Discord integration
│   │   ├── farcaster.ts      # Farcaster integration
│   │   └── blog.ts           # Blog CMS integration
│   ├── scheduler.ts          # Scheduling logic
│   ├── validator.ts          # Content validation
│   └── config.ts             # Configuration loading
├── package.json
├── tsconfig.json
└── README.md
```

### Key Functions

```typescript
// Main entry point
async function publish(planPath: string, options: PublishOptions): Promise<void>

// Check if ready to publish
function validatePublishReady(plan: GTMPlan): ValidationResult

// Publish to a specific channel
async function publishChannel(
  channel: string,
  content: string,
  config: ChannelConfig
): Promise<PublishResult>

// Update plan with publish result
async function recordPublish(
  planPath: string,
  channel: string,
  result: PublishResult
): Promise<void>
```

---

## Testing

### Test Cases

1. **Happy path:** Approved plan, all channels publish successfully
2. **Gate check:** Unapproved plan rejected
3. **Partial publish:** Some channels fail, others succeed
4. **Dry run:** No actual posts, shows what would happen
5. **Schedule:** Posts scheduled for future time
6. **Window enforcement:** Respects publish window

### Mock Mode

```bash
# Use mock APIs for testing
publisher-worker publish --id TEST-001 --mock
```

Mock mode:
- Doesn't call real APIs
- Returns fake post IDs/URLs
- Still updates plan.yaml
- Useful for testing flow

---

## Future Enhancements

- [ ] Image/media upload support
- [ ] Platform-native scheduling (X scheduled tweets)
- [ ] Retry queue for failed posts
- [ ] Webhook notifications on publish
- [ ] Multi-account support (different X accounts per campaign)
- [ ] A/B testing (post variants, measure performance)

---

*This worker is the bridge to the outside world. Keep it simple, reliable, and auditable.*
