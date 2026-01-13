import type { GTMPlan, ChannelName, RiskLevel } from '../schema/gtmPlan.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';

export interface TierDefaults {
  enabledChannels: ChannelName[];
  requiredAssets: string[];
  requires: {
    blog: boolean;
    tracking_url: boolean;
    dashboard_url: boolean;
    in_app_explicit: boolean;
    partner_brief: boolean;
    hero_asset: boolean;
  };
}

export interface RiskDefaults {
  required_approvals: number;
  requires_smoke_test: boolean;
  requires_rollback_plan: boolean;
  qa_cannot_be_red: boolean;
}

/**
 * Get tier-based defaults
 */
export function getTierDefaults(tier: number): TierDefaults {
  switch (tier) {
    case 0:
      // Tier 0: Release notes only, minimal
      return {
        enabledChannels: ['release_notes', 'changelog'],
        requiredAssets: [],
        requires: {
          blog: false,
          tracking_url: false,
          dashboard_url: false,
          in_app_explicit: false,
          partner_brief: false,
          hero_asset: false,
        },
      };
    case 1:
      // Tier 1: Release notes + discord/x, assets checklist required
      return {
        enabledChannels: ['release_notes', 'changelog', 'discord', 'x'],
        requiredAssets: ['screenshot', 'loom'],
        requires: {
          blog: false,
          tracking_url: false,
          dashboard_url: false,
          in_app_explicit: false,
          partner_brief: false,
          hero_asset: false,
        },
      };
    case 2:
      // Tier 2: Full marketing push
      return {
        enabledChannels: [
          'release_notes', 'changelog', 'discord', 'x', 'reddit', 'farcaster',
          'email', 'blog', 'in_app_banner', 'partner_outbounds',
        ],
        requiredAssets: ['screenshot', 'loom', 'logo_lockup'],
        requires: {
          blog: true,
          tracking_url: true,
          dashboard_url: true,
          in_app_explicit: true,
          partner_brief: true,
          hero_asset: true,
        },
      };
    default:
      throw new Error(`Invalid tier: ${tier}`);
  }
}

/**
 * Get risk-based defaults
 */
export function getRiskDefaults(level: RiskLevel): RiskDefaults {
  switch (level) {
    case 'low':
      return {
        required_approvals: 1,
        requires_smoke_test: false,
        requires_rollback_plan: false,
        qa_cannot_be_red: false,
      };
    case 'medium':
      return {
        required_approvals: 1,
        requires_smoke_test: false,
        requires_rollback_plan: false,
        qa_cannot_be_red: true, // Stricter
      };
    case 'high':
      return {
        required_approvals: 2,
        requires_smoke_test: true,
        requires_rollback_plan: true,
        qa_cannot_be_red: true,
      };
    default:
      throw new Error(`Invalid risk level: ${level}`);
  }
}

/**
 * Apply tier defaults to a plan
 */
export function applyTierDefaults(plan: GTMPlan): GTMPlan {
  const defaults = getTierDefaults(plan.tier);
  
  // Enable default channels
  for (const channel of CHANNEL_NAMES) {
    if (defaults.enabledChannels.includes(channel)) {
      plan.channels[channel].enabled = true;
      if (plan.channels[channel].status === 'not_applicable') {
        plan.channels[channel].status = 'pending';
      }
    }
  }
  
  // Set required assets
  plan.assets.required = defaults.requiredAssets;
  
  return plan;
}

/**
 * Apply risk defaults to a plan
 */
export function applyRiskDefaults(plan: GTMPlan): GTMPlan {
  const defaults = getRiskDefaults(plan.risk.level);
  
  plan.gates.marketing_gate.required_approvals = defaults.required_approvals;
  
  return plan;
}

/**
 * Create a new default plan
 */
export function createDefaultPlan(
  id: string,
  title: string,
  tier: number,
  releaseWindow?: string,
  riskLevel: RiskLevel = 'low'
): GTMPlan {
  const now = new Date().toISOString();
  
  // Initialize all channels with defaults
  const channels: GTMPlan['channels'] = {} as GTMPlan['channels'];
  for (const channel of CHANNEL_NAMES) {
    channels[channel] = {
      enabled: false,
      status: 'not_applicable',
      owner: null,
      artifact_path: null,
      publish_window: null,
      published_url: null,
    };
  }
  
  const plan: GTMPlan = {
    id,
    title,
    description: '',
    tier: tier as 0 | 1 | 2,
    
    provenance: {
      generated_by: {
        tool: 'gtm-coordinator',
        version: '0.2.0',
        generated_at: now,
      },
      git: {
        commit_sha: null,
        prs: [],
      },
      inputs: [],
    },
    
    risk: {
      level: riskLevel,
      notes: null,
      claims_policy: 'standard',
    },
    
    timing: {
      release_window: {
        start: releaseWindow || null,
        end: releaseWindow || null,
      },
      publish_mode: 'manual',
      blackout_windows: [],
    },
    
    qa: {
      signal: null,
      owner: null,
      checks: {
        smoke_test: null,
        rollback_plan_present: false,
      },
      notes: null,
      evidence_links: [],
      passed_at: null,
    },
    
    tracking: {
      canonical_url: null,
      utm_base: {
        source: null,
        medium: null,
        campaign: id.toLowerCase().replace('init-', 'gtm-'),
      },
      events: [],
      dashboard_urls: [],
      owner: null,
    },
    
    assets: {
      hero: { type: null, url: null, pii_safe: true },
      required: [],
      items: [],
    },
    
    channels,
    
    gates: {
      marketing_gate: {
        status: 'pending',
        required_approvals: 1,
        approvals: [],
        blocked_reason: null,
      },
    },
    
    content_outputs: {
      release_notes_short: { artifact_path: null, status: 'pending' },
      release_notes_long: { artifact_path: null, status: 'pending' },
      app_store_ios: { artifact_path: null, status: 'pending' },
      app_store_android: { artifact_path: null, status: 'pending' },
      discord_post: { artifact_path: null, status: 'pending' },
      x_post: { artifact_path: null, status: 'pending' },
      reddit_post: { artifact_path: null, status: 'pending' },
      farcaster_post: { artifact_path: null, status: 'pending' },
      blog_outline: { artifact_path: null, status: 'pending' },
      blog_draft: { artifact_path: null, status: 'pending' },
      partner_brief: { artifact_path: null, status: 'pending' },
      email_template: { artifact_path: null, status: 'pending' },
    },
    
    history: [
      {
        at: now,
        actor: 'local',
        action: 'init',
        summary: `Created GTM plan: ${title} (Tier ${tier}, Risk ${riskLevel})`,
      },
    ],
    
    created_at: now,
    updated_at: now,
    version: 2,
    schema_version: '0.2.0',
  };
  
  // Apply tier and risk defaults
  applyTierDefaults(plan);
  applyRiskDefaults(plan);
  
  return plan;
}
