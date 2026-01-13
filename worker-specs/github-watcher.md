# GitHub Watcher Specification
## Monitors GitHub for ship events → triggers GTM workflow

---

## Overview

The GitHub Watcher monitors ShapeShift repositories for release events (PR merges, releases, tags) and triggers the GTM workflow — including notifying contributors that it's time to QT.

**Role in system:** This is the "trigger" — it knows when something ships and kicks off marketing.

---

## What It Watches

| Event | Trigger | Action |
|-------|---------|--------|
| PR merged with label `gtm-ready` | Webhook | Create GTM plan, notify contributors |
| Release published | Webhook | Generate content, alert for QT |
| Tag pushed (v*) | Webhook | Check if GTM plan exists, alert if not |

---

## Workflow

```
1. GitHub Event (PR merged / release)
   ↓
2. Watcher receives webhook
   ↓
3. Check: Does GTM plan exist for this feature?
   ├─→ No: Create one automatically (gtm init)
   └─→ Yes: Update status to "shipped"
   ↓
4. Trigger content generation (if not already generated)
   ↓
5. Notify contributors: "Time to QT!"
   ↓
6. Provide QT prompts/templates
```

---

## Notification System

### Who Gets Notified

```yaml
# config/contributors.yaml
contributors:
  - name: "Harper"
    github: "twblack88"
    discord: "harper#1234"
    x_handle: "@harper"
    notify_via: [discord, email]
    
  - name: "Apotheosis"
    github: "0xApotheosis"
    discord: "apotheosis#5678"
    x_handle: "@0xApotheosis"
    notify_via: [discord]
```

### Notification Channels

| Channel | Method | Use Case |
|---------|--------|----------|
| Discord | Webhook to #contributor-alerts | Primary notification |
| Email | SendGrid/SES | Backup / formal |
| Slack | Webhook | If team uses Slack |
| GitHub Issue | Auto-comment | Keep it in GitHub |

### Notification Message

```markdown
🚀 **GTM Alert: [Feature] just shipped!**

**What:** [PR title / release name]
**Repo:** [repo link]
**GTM Plan:** [link to .gtm/INIT-XXX/]

**Action needed:**
1. Main account post is ready: [link to draft]
2. QT this with your take!

**QT Prompts (pick one or riff):**
- "Been testing this for [X] — here's what I found..."
- "Quick walkthrough of [feature]: [your Loom]"
- "This is huge for [audience] because..."

**Post goes live:** [scheduled time or "waiting for your QT"]

React with ✅ when you've QT'd!
```

---

## GitHub Webhook Setup

### Webhook Configuration

```yaml
# In GitHub repo settings → Webhooks
Payload URL: https://your-server.com/webhooks/github
Content type: application/json
Secret: [your-secret]

Events:
  - Pull requests (merged)
  - Releases
  - Push (tags)
```

### Webhook Handler

```typescript
// POST /webhooks/github
async function handleGitHubWebhook(req: Request) {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  switch (event) {
    case 'pull_request':
      if (payload.action === 'closed' && payload.pull_request.merged) {
        await handlePRMerged(payload.pull_request);
      }
      break;
      
    case 'release':
      if (payload.action === 'published') {
        await handleRelease(payload.release);
      }
      break;
      
    case 'push':
      if (payload.ref.startsWith('refs/tags/v')) {
        await handleTagPush(payload);
      }
      break;
  }
}
```

---

## PR Label System

Use GitHub labels to signal GTM readiness:

| Label | Meaning | Action |
|-------|---------|--------|
| `gtm-ready` | Ready for marketing | Trigger full GTM flow |
| `gtm-tier-0` | Silent release | Release notes only |
| `gtm-tier-1` | Standard launch | Social + Discord |
| `gtm-tier-2` | Major launch | Full blitz |
| `gtm-skip` | No marketing needed | Ignore |

### Auto-Detection

If no label, try to infer from:
- PR title contains "feat:" → likely gtm-ready
- PR changes `/chains/` directory → chain integration
- Release notes mention "breaking" → higher tier

---

## GTM Plan Auto-Creation

When a `gtm-ready` PR merges:

```typescript
async function handlePRMerged(pr: PullRequest) {
  // Check for GTM label
  const gtmLabel = pr.labels.find(l => l.name.startsWith('gtm-'));
  if (!gtmLabel || gtmLabel.name === 'gtm-skip') return;
  
  // Determine tier
  const tier = parseTier(gtmLabel.name); // gtm-tier-2 → 2
  
  // Create GTM plan
  const id = generateId(pr); // e.g., "STRK-123" from PR
  
  await exec(`gtm init \
    --id ${id} \
    --title "${pr.title}" \
    --tier ${tier} \
    --risk medium \
    --release "${new Date().toISOString()}"`);
    
  // Enrich with PR link
  await exec(`gtm enrich --id ${id} --pr "${pr.html_url}"`);
  
  // Trigger content generation
  await triggerContentWorker(id);
  
  // Notify contributors
  await notifyContributors(id, pr);
}
```

---

## Contributor QT Tracking

Track who has QT'd:

```yaml
# In plan.yaml
qt_status:
  main_post:
    status: published
    url: "https://x.com/ShapeShift/status/123"
    published_at: "2026-02-01T14:00:00Z"
  contributor_qts:
    - contributor: "@harper"
      status: pending  # pending | posted | skipped
      notified_at: "2026-02-01T14:00:00Z"
      posted_at: null
      url: null
    - contributor: "@0xApotheosis"
      status: posted
      notified_at: "2026-02-01T14:00:00Z"
      posted_at: "2026-02-01T14:15:00Z"
      url: "https://x.com/0xApotheosis/status/456"
```

### Follow-Up Notifications

```
If QT not posted within 2 hours:
  → Send reminder: "Still need your QT! Post is live: [link]"
  
If QT not posted within 24 hours:
  → Mark as skipped, move on
```

---

## Integration with Content Worker

When GitHub event triggers:

```
1. GitHub Watcher creates/updates GTM plan
   ↓
2. Calls Content Worker to generate drafts
   ↓
3. Content Worker reads PR description, diff summary
   ↓
4. Generates main post + QT prompts for contributors
   ↓
5. Watcher notifies contributors with prompts
```

---

## Environment Variables

```bash
GITHUB_WEBHOOK_SECRET=your-secret
GITHUB_TOKEN=ghp_xxx  # For API calls
DISCORD_WEBHOOK_CONTRIBUTORS=https://discord.com/api/webhooks/...
SENDGRID_API_KEY=SG.xxx  # For email notifications
GTM_ROOT=./.gtm
```

---

## Commands

```bash
# Manual trigger (for testing)
github-watcher trigger --pr https://github.com/shapeshift/web/pull/123

# Check webhook status
github-watcher status

# List pending QTs
github-watcher pending-qts

# Remind contributors
github-watcher remind --id STRK-001
```

---

## Example: Starknet PR Merges

1. PR #456 "feat: Add Starknet chain support" merges with label `gtm-tier-2`

2. Watcher receives webhook, creates GTM plan:
   ```
   .gtm/STRK-456/
   ├── plan.yaml
   └── drafts/
   ```

3. Content Worker generates:
   ```
   drafts/
   ├── x_post.md (main account post)
   ├── qt_prompts.md (for contributors)
   └── discord_post.md
   ```

4. Watcher sends Discord notification:
   ```
   🚀 **Starknet just shipped!**
   
   Main post draft ready. QT prompts:
   - "Finally! Been waiting for Starknet on ShapeShift..."
   - "Here's a quick walkthrough of BTC → STRK..."
   
   React ✅ when you've QT'd!
   ```

5. Contributors QT, watcher tracks completion

---

## Future: Auto-Walkthrough Integration

Connect to screen recording system:

```
1. GitHub Watcher detects ship
   ↓
2. Triggers test flow in staging
   ↓
3. Screen recorder captures the flow
   ↓
4. AI summarizes recording into walkthrough script
   ↓
5. Contributor reviews/narrates over recording
   ↓
6. Published as Loom-style content
```

(See `walkthrough-generator.md` for full spec)

---

*This worker is the starting gun. When code ships, marketing starts.*
