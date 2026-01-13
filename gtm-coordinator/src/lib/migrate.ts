import type { GTMPlan, Status, ChannelName } from '../schema/gtmPlan.js';
import { GTMPlanSchema, CHANNEL_NAMES } from '../schema/gtmPlan.js';

/**
 * Check if a plan needs migration (v1 -> v2)
 */
export function needsMigration(data: Record<string, unknown>): boolean {
  // Check for v1 indicators
  const hasOldChannels = data.channels && 
    typeof data.channels === 'object' && 
    'customer_outbounds' in (data.channels as Record<string, unknown>);
  
  const hasOldContentOutputs = data.content_outputs &&
    typeof data.content_outputs === 'object' &&
    'release_notes_draft' in (data.content_outputs as Record<string, unknown>) &&
    typeof (data.content_outputs as Record<string, unknown>).release_notes_draft === 'object' &&
    'short' in ((data.content_outputs as Record<string, unknown>).release_notes_draft as Record<string, unknown>);
  
  const hasOldExecutionStatus = 'execution_status' in data;
  
  const missingProvenance = !('provenance' in data);
  const missingRisk = !('risk' in data);
  const missingTiming = !('timing' in data);
  
  return hasOldChannels || hasOldContentOutputs || hasOldExecutionStatus || 
         missingProvenance || missingRisk || missingTiming;
}

/**
 * Map old status values to new normalized status
 */
function mapOldStatus(oldStatus: string | undefined): Status {
  const statusMap: Record<string, Status> = {
    'pending': 'pending',
    'in_progress': 'needs_review',
    'needs_review': 'needs_review',
    'approved': 'approved',
    'scheduled': 'scheduled',
    'completed': 'published',
    'blocked': 'blocked',
    'skipped': 'not_applicable',
    'not_applicable': 'not_applicable',
  };
  return statusMap[oldStatus || 'pending'] || 'pending';
}

/**
 * Migrate v1 plan to v2 schema
 */
export function migrateV1ToV2(data: Record<string, unknown>): GTMPlan {
  const now = new Date().toISOString();
  const id = data.id as string;
  
  // Build provenance from old data
  const provenance = {
    generated_by: {
      tool: 'gtm-coordinator',
      version: '0.2.0',
      generated_at: data.created_at as string || now,
    },
    git: {
      commit_sha: null,
      prs: [] as Array<{ url: string }>,
    },
    inputs: [] as Array<{ type: 'pr' | 'doc' | 'design' | 'loom' | 'spec' | 'other'; url: string }>,
  };
  
  // Migrate links.prs to provenance.git.prs
  const oldLinks = data.links as Record<string, unknown> | undefined;
  if (oldLinks?.prs && Array.isArray(oldLinks.prs)) {
    provenance.git.prs = (oldLinks.prs as string[]).map(url => ({ url }));
    provenance.inputs = (oldLinks.prs as string[]).map(url => ({ type: 'pr' as const, url }));
  }
  
  // Build risk section
  const risk = {
    level: 'low' as const,
    notes: null,
    claims_policy: 'standard' as const,
  };
  
  // Build timing section from old release_window
  const timing = {
    release_window: {
      start: data.release_window as string || null,
      end: data.release_window as string || null,
    },
    publish_mode: 'manual' as const,
    blackout_windows: [],
  };
  
  // Migrate QA from old gates.qa_gate
  const oldGates = data.gates as Record<string, unknown> | undefined;
  const oldQaGate = oldGates?.qa_gate as Record<string, unknown> | undefined;
  const qa = {
    signal: (oldQaGate?.signal as 'green' | 'yellow' | 'red') || null,
    owner: null,
    checks: {
      smoke_test: null,
      rollback_plan_present: false,
    },
    notes: oldQaGate?.notes as string || null,
    evidence_links: [],
    passed_at: oldQaGate?.passed_at as string || null,
  };
  
  // Migrate tracking from old data
  const oldTracking = data.tracking as Record<string, unknown> | undefined;
  const tracking = {
    canonical_url: null,
    utm_base: {
      source: null,
      medium: null,
      campaign: id.toLowerCase().replace('init-', 'gtm-'),
    },
    events: [] as Array<{ name: string; success_criteria?: string; measured_in: 'mixpanel' | 'posthog' | 'amplitude' | 'other' }>,
    dashboard_urls: [] as string[],
    owner: null,
  };
  
  if (oldTracking?.mixpanel_dashboard) {
    tracking.dashboard_urls.push(oldTracking.mixpanel_dashboard as string);
  }
  if (oldTracking?.amplitude_dashboard) {
    tracking.dashboard_urls.push(oldTracking.amplitude_dashboard as string);
  }
  if (oldTracking?.success_metrics && Array.isArray(oldTracking.success_metrics)) {
    tracking.events = (oldTracking.success_metrics as string[]).map(metric => ({
      name: metric,
      measured_in: 'mixpanel' as const,
    }));
  }
  
  // Migrate assets
  const oldAssets = data.assets as Record<string, unknown> | undefined;
  const assets = {
    hero: { type: null, url: null, pii_safe: true },
    required: [] as string[],
    items: [] as Array<{ type: 'screenshot' | 'loom' | 'other'; status: Status; url: string | null; pii_safe: boolean }>,
  };
  
  // Determine required assets based on tier
  const tier = (data.tier as number) || 1;
  if (tier >= 1) {
    assets.required = ['screenshot', 'loom'];
  }
  if (tier >= 2) {
    assets.required.push('logo_lockup');
  }
  
  // Migrate old assets
  if (oldAssets?.screenshots && Array.isArray(oldAssets.screenshots)) {
    for (const item of oldAssets.screenshots as Array<Record<string, unknown>>) {
      assets.items.push({
        type: 'screenshot',
        status: mapOldStatus(item.status as string),
        url: item.url as string || null,
        pii_safe: true,
      });
    }
  }
  if (oldAssets?.looms && Array.isArray(oldAssets.looms)) {
    for (const item of oldAssets.looms as Array<Record<string, unknown>>) {
      assets.items.push({
        type: 'loom',
        status: mapOldStatus(item.status as string),
        url: item.url as string || null,
        pii_safe: true,
      });
    }
  }
  
  // Migrate channels to normalized shape
  const channels: Record<ChannelName, { enabled: boolean; status: Status; owner: string | null; artifact_path: string | null; publish_window: null; published_url: string | null }> = {} as Record<ChannelName, { enabled: boolean; status: Status; owner: string | null; artifact_path: string | null; publish_window: null; published_url: string | null }>;
  const oldChannels = data.channels as Record<string, unknown> | undefined;
  const oldExecStatus = data.execution_status as Record<string, unknown> | undefined;
  
  for (const channelName of CHANNEL_NAMES) {
    channels[channelName] = {
      enabled: false,
      status: 'not_applicable' as Status,
      owner: null,
      artifact_path: null,
      publish_window: null,
      published_url: null,
    };
  }
  
  // Map old channel structure to new
  if (oldChannels?.customer_outbounds) {
    const co = oldChannels.customer_outbounds as Record<string, Record<string, unknown>>;
    if (co.discord?.enabled) {
      channels.discord.enabled = true;
      channels.discord.status = mapOldStatus(oldExecStatus?.discord as string);
    }
    if (co.x?.enabled) {
      channels.x.enabled = true;
      channels.x.status = mapOldStatus(oldExecStatus?.x as string);
    }
    if (co.reddit?.enabled) {
      channels.reddit.enabled = true;
      channels.reddit.status = mapOldStatus(oldExecStatus?.reddit as string);
    }
    if (co.farcaster?.enabled) {
      channels.farcaster.enabled = true;
      channels.farcaster.status = mapOldStatus(oldExecStatus?.farcaster as string);
    }
    if (co.email?.enabled) {
      channels.email.enabled = true;
      channels.email.status = mapOldStatus(oldExecStatus?.email as string);
    }
  }
  
  if (oldChannels?.web_surfaces) {
    const ws = oldChannels.web_surfaces as Record<string, Record<string, unknown>>;
    if (ws.blog?.enabled) {
      channels.blog.enabled = true;
      channels.blog.status = mapOldStatus(oldExecStatus?.blog as string);
    }
    if (ws.landing_page?.enabled) {
      channels.landing_page.enabled = true;
      channels.landing_page.status = mapOldStatus(oldExecStatus?.landing_page as string);
    }
    if (ws.changelog?.enabled) {
      channels.changelog.enabled = true;
      channels.changelog.status = mapOldStatus(oldExecStatus?.changelog as string);
    }
  }
  
  if (oldChannels?.in_app) {
    const ia = oldChannels.in_app as Record<string, Record<string, unknown>>;
    if (ia.banner?.enabled) {
      channels.in_app_banner.enabled = true;
      channels.in_app_banner.status = mapOldStatus(oldExecStatus?.in_app_banner as string);
    }
    if (ia.modal?.enabled) {
      channels.in_app_modal.enabled = true;
      channels.in_app_modal.status = mapOldStatus(oldExecStatus?.in_app_modal as string);
    }
  }
  
  if (oldChannels?.partner_outbounds) {
    const po = oldChannels.partner_outbounds as Record<string, unknown>;
    if (po.enabled) {
      channels.partner_outbounds.enabled = true;
      channels.partner_outbounds.status = mapOldStatus(oldExecStatus?.partner_outbounds as string);
    }
  }
  
  // Always enable release notes
  channels.release_notes.enabled = true;
  channels.release_notes.status = mapOldStatus(oldExecStatus?.release_notes as string);
  
  // Migrate gates
  const oldMarketingGate = oldGates?.marketing_gate as Record<string, unknown> | undefined;
  const gates = {
    marketing_gate: {
      status: (oldMarketingGate?.status as 'pending' | 'approved' | 'blocked') || 'pending',
      required_approvals: 1,
      approvals: [] as Array<{ reviewer: string; at: string; notes?: string }>,
      blocked_reason: null,
    },
  };
  
  // If old gate was approved, create an approval record
  if (oldMarketingGate?.status === 'approved' && oldMarketingGate.reviewer) {
    gates.marketing_gate.approvals.push({
      reviewer: oldMarketingGate.reviewer as string,
      at: oldMarketingGate.reviewed_at as string || now,
      notes: oldMarketingGate.notes as string,
    });
  }
  
  // Content outputs - just pointers now (drafts migrated separately)
  const content_outputs = {
    release_notes_short: { artifact_path: null, status: 'pending' as Status },
    release_notes_long: { artifact_path: null, status: 'pending' as Status },
    app_store_ios: { artifact_path: null, status: 'pending' as Status },
    app_store_android: { artifact_path: null, status: 'pending' as Status },
    discord_post: { artifact_path: null, status: 'pending' as Status },
    x_post: { artifact_path: null, status: 'pending' as Status },
    reddit_post: { artifact_path: null, status: 'pending' as Status },
    farcaster_post: { artifact_path: null, status: 'pending' as Status },
    blog_outline: { artifact_path: null, status: 'pending' as Status },
    blog_draft: { artifact_path: null, status: 'pending' as Status },
    partner_brief: { artifact_path: null, status: 'pending' as Status },
    email_template: { artifact_path: null, status: 'pending' as Status },
  };
  
  // Build migrated plan
  const migratedData = {
    id,
    title: data.title as string,
    description: data.description as string || '',
    tier,
    provenance,
    risk,
    timing,
    qa,
    tracking,
    assets,
    channels,
    gates,
    content_outputs,
    history: [
      {
        at: now,
        actor: 'local',
        action: 'migrate',
        summary: 'Migrated from v1 to v2 schema',
        changes: { from_version: 1, to_version: 2 },
      },
    ],
    created_at: data.created_at as string || now,
    updated_at: now,
    created_by: data.created_by as string,
    version: 2,
    schema_version: '0.2.0',
  };
  
  // Parse through Zod to ensure validity and apply defaults
  return GTMPlanSchema.parse(migratedData);
}

/**
 * Extract draft content from v1 plan for file storage
 */
export function extractV1Drafts(data: Record<string, unknown>): Record<string, string> {
  const drafts: Record<string, string> = {};
  const oldContent = data.content_outputs as Record<string, unknown> | undefined;
  
  if (!oldContent) return drafts;
  
  // Release notes
  const releaseNotes = oldContent.release_notes_draft as Record<string, unknown> | undefined;
  if (releaseNotes?.short) {
    drafts['release_notes_short.md'] = releaseNotes.short as string;
  }
  if (releaseNotes?.long) {
    drafts['release_notes_long.md'] = releaseNotes.long as string;
  }
  
  // App store notes
  const appStore = oldContent.app_store_notes_draft as Record<string, unknown> | undefined;
  if (appStore?.ios) {
    drafts['app_store_ios.md'] = appStore.ios as string;
  }
  if (appStore?.android) {
    drafts['app_store_android.md'] = appStore.android as string;
  }
  
  // Social drafts
  const social = oldContent.social_drafts as Record<string, unknown> | undefined;
  if (social?.discord) {
    drafts['discord_post.md'] = social.discord as string;
  }
  if (social?.x) {
    drafts['x_post.md'] = social.x as string;
  }
  if (social?.reddit) {
    drafts['reddit_post.md'] = social.reddit as string;
  }
  if (social?.farcaster) {
    drafts['farcaster_post.md'] = social.farcaster as string;
  }
  
  // Blog
  const blog = oldContent.blog as Record<string, unknown> | undefined;
  if (blog?.outline) {
    drafts['blog_outline.md'] = blog.outline as string;
  }
  if (blog?.draft) {
    drafts['blog_draft.md'] = blog.draft as string;
  }
  
  // Partner brief
  const partnerBrief = oldContent.partner_brief as Record<string, unknown> | undefined;
  if (partnerBrief?.content) {
    drafts['partner_brief.md'] = partnerBrief.content as string;
  }
  
  return drafts;
}

/**
 * Get the status from old content outputs
 */
export function getOldContentStatus(data: Record<string, unknown>, key: string): Status {
  const oldContent = data.content_outputs as Record<string, unknown> | undefined;
  if (!oldContent) return 'pending';
  
  const section = oldContent[key] as Record<string, unknown> | undefined;
  if (!section?.status) return 'pending';
  
  return mapOldStatus(section.status as string);
}
