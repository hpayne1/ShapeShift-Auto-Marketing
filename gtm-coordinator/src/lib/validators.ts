import type { GTMPlan, Status, ChannelName } from '../schema/gtmPlan.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';
import { getTierDefaults, getRiskDefaults } from './defaults.js';
import { isStatusReady, isStatusActionable } from './status.js';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  category: 'required' | 'tier' | 'risk' | 'format';
}

export interface ValidationWarning {
  field: string;
  message: string;
  category: 'content' | 'asset' | 'tracking' | 'channel';
}

/**
 * Check if a channel's status is ready for approval
 */
function isChannelReady(plan: GTMPlan, channel: ChannelName): boolean {
  const ch = plan.channels[channel];
  if (!ch.enabled) return true; // Disabled channels are always "ready"
  return isStatusReady(ch.status);
}

/**
 * Check if required assets are satisfied
 */
function areRequiredAssetsSatisfied(plan: GTMPlan): { satisfied: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const requiredType of plan.assets.required) {
    const matchingAssets = plan.assets.items.filter(a => a.type === requiredType);
    
    if (matchingAssets.length === 0) {
      missing.push(requiredType);
    } else {
      // Check if at least one is ready (not pending, not blocked)
      const hasReady = matchingAssets.some(a => isStatusReady(a.status));
      if (!hasReady) {
        missing.push(`${requiredType} (status not ready)`);
      }
    }
  }
  
  return { satisfied: missing.length === 0, missing };
}

/**
 * Validate a plan (basic validation)
 */
export function validatePlan(plan: GTMPlan): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const tierDefaults = getTierDefaults(plan.tier);
  const riskDefaults = getRiskDefaults(plan.risk.level);
  
  // ===== REQUIRED FIELDS =====
  if (!plan.id) {
    errors.push({ field: 'id', message: 'Initiative ID is required', category: 'required' });
  }
  if (!plan.title) {
    errors.push({ field: 'title', message: 'Title is required', category: 'required' });
  }
  
  // ===== TIER-BASED VALIDATION =====
  
  // Tier 2: Blog required
  if (tierDefaults.requires.blog) {
    if (!plan.channels.blog.enabled) {
      errors.push({
        field: 'channels.blog.enabled',
        message: 'Blog must be enabled for Tier 2 initiatives',
        category: 'tier',
      });
    }
    // Check if blog content exists
    if (!plan.content_outputs.blog_draft.artifact_path && !plan.content_outputs.blog_outline.artifact_path) {
      errors.push({
        field: 'content_outputs.blog',
        message: 'Blog content (outline or draft) is required for Tier 2',
        category: 'tier',
      });
    }
  }
  
  // Tier 2: Tracking URL required
  if (tierDefaults.requires.tracking_url) {
    if (!plan.tracking.canonical_url) {
      errors.push({
        field: 'tracking.canonical_url',
        message: 'Canonical URL is required for Tier 2',
        category: 'tier',
      });
    }
  }
  
  // Tier 2: Dashboard URL required
  if (tierDefaults.requires.dashboard_url) {
    if (plan.tracking.dashboard_urls.length === 0) {
      errors.push({
        field: 'tracking.dashboard_urls',
        message: 'At least one dashboard URL is required for Tier 2',
        category: 'tier',
      });
    }
  }
  
  // Tier 2: In-app surfaces must be explicitly set
  if (tierDefaults.requires.in_app_explicit) {
    const inAppChannels: ChannelName[] = ['in_app_banner', 'in_app_modal', 'push_notification'];
    const anyInAppEnabled = inAppChannels.some(ch => plan.channels[ch].enabled);
    
    if (!anyInAppEnabled) {
      warnings.push({
        field: 'channels.in_app',
        message: 'Consider enabling at least one in-app surface for Tier 2',
        category: 'channel',
      });
    }
  }
  
  // Tier 2: Partner brief required if partner outbounds enabled
  if (tierDefaults.requires.partner_brief && plan.channels.partner_outbounds.enabled) {
    if (!plan.content_outputs.partner_brief.artifact_path) {
      errors.push({
        field: 'content_outputs.partner_brief',
        message: 'Partner brief is required when partner outbounds are enabled',
        category: 'tier',
      });
    }
  }
  
  // Tier 2: Hero asset required
  if (tierDefaults.requires.hero_asset) {
    if (!plan.assets.hero.type || !plan.assets.hero.url) {
      errors.push({
        field: 'assets.hero',
        message: 'Hero asset (type and URL) is required for Tier 2',
        category: 'tier',
      });
    }
  }
  
  // ===== RISK-BASED VALIDATION =====
  
  // High risk: QA cannot be red
  if (riskDefaults.qa_cannot_be_red && plan.qa.signal === 'red') {
    errors.push({
      field: 'qa.signal',
      message: `QA signal cannot be red for ${plan.risk.level} risk initiatives`,
      category: 'risk',
    });
  }
  
  // High risk: Smoke test must pass
  if (riskDefaults.requires_smoke_test && plan.qa.checks.smoke_test !== 'pass') {
    errors.push({
      field: 'qa.checks.smoke_test',
      message: `Smoke test must pass for ${plan.risk.level} risk initiatives`,
      category: 'risk',
    });
  }
  
  // High risk: Rollback plan required
  if (riskDefaults.requires_rollback_plan && !plan.qa.checks.rollback_plan_present) {
    errors.push({
      field: 'qa.checks.rollback_plan_present',
      message: `Rollback plan is required for ${plan.risk.level} risk initiatives`,
      category: 'risk',
    });
  }
  
  // ===== CONTENT WARNINGS =====
  
  // Check enabled channels have content
  for (const channel of CHANNEL_NAMES) {
    const ch = plan.channels[channel];
    if (ch.enabled && !ch.artifact_path) {
      // Check content_outputs for matching artifact
      const contentKey = getContentKeyForChannel(channel);
      if (contentKey && !plan.content_outputs[contentKey]?.artifact_path) {
        warnings.push({
          field: `channels.${channel}`,
          message: `${channel} is enabled but no draft content exists`,
          category: 'content',
        });
      }
    }
  }
  
  // ===== ASSET WARNINGS =====
  
  // Check required assets
  const assetCheck = areRequiredAssetsSatisfied(plan);
  if (!assetCheck.satisfied) {
    for (const missing of assetCheck.missing) {
      warnings.push({
        field: 'assets.items',
        message: `Required asset missing or not ready: ${missing}`,
        category: 'asset',
      });
    }
  }
  
  // Check for pending assets when channels are enabled
  const pendingAssets = plan.assets.items.filter(a => a.status === 'pending');
  if (pendingAssets.length > 0) {
    warnings.push({
      field: 'assets.items',
      message: `${pendingAssets.length} asset(s) still in pending status`,
      category: 'asset',
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate for marketing approval (stricter)
 */
export function validateForMarketingApproval(plan: GTMPlan): ValidationResult {
  const baseResult = validatePlan(plan);
  const errors = [...baseResult.errors];
  const warnings = [...baseResult.warnings];
  const riskDefaults = getRiskDefaults(plan.risk.level);
  
  // QA must be passed (green or yellow for non-high-risk)
  if (!plan.qa.signal) {
    errors.push({
      field: 'qa.signal',
      message: 'QA gate must be recorded before marketing approval',
      category: 'required',
    });
  } else if (plan.qa.signal === 'red') {
    errors.push({
      field: 'qa.signal',
      message: 'QA gate cannot be red for marketing approval',
      category: 'required',
    });
  } else if (plan.qa.signal === 'yellow' && plan.risk.level === 'high') {
    errors.push({
      field: 'qa.signal',
      message: 'High-risk initiatives require green QA signal',
      category: 'risk',
    });
  }
  
  // Check enabled channels have ready status
  for (const channel of CHANNEL_NAMES) {
    const ch = plan.channels[channel];
    if (ch.enabled && !isStatusReady(ch.status)) {
      errors.push({
        field: `channels.${channel}`,
        message: `${channel} is enabled but status is not ready (current: ${ch.status})`,
        category: 'required',
      });
    }
  }
  
  // Required assets must be satisfied
  const assetCheck = areRequiredAssetsSatisfied(plan);
  if (!assetCheck.satisfied) {
    errors.push({
      field: 'assets',
      message: `Required assets not satisfied: ${assetCheck.missing.join(', ')}`,
      category: 'tier',
    });
  }
  
  // Check approval count
  const currentApprovals = plan.gates.marketing_gate.approvals.length;
  const requiredApprovals = riskDefaults.required_approvals;
  
  if (currentApprovals < requiredApprovals - 1) {
    // -1 because current approval will be the nth one
    errors.push({
      field: 'gates.marketing_gate.approvals',
      message: `${plan.risk.level} risk requires ${requiredApprovals} approval(s), only ${currentApprovals} recorded`,
      category: 'risk',
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get content output key for a channel
 */
function getContentKeyForChannel(channel: ChannelName): keyof GTMPlan['content_outputs'] | null {
  const mapping: Partial<Record<ChannelName, keyof GTMPlan['content_outputs']>> = {
    discord: 'discord_post',
    x: 'x_post',
    reddit: 'reddit_post',
    farcaster: 'farcaster_post',
    blog: 'blog_draft',
    partner_outbounds: 'partner_brief',
    release_notes: 'release_notes_short',
    app_store_ios: 'app_store_ios',
    app_store_android: 'app_store_android',
    email: 'email_template',
  };
  return mapping[channel] || null;
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];
  
  if (result.valid) {
    lines.push('✅ Validation passed');
  } else {
    lines.push('❌ Validation failed');
  }
  
  if (result.errors.length > 0) {
    lines.push('');
    lines.push('Errors:');
    for (const error of result.errors) {
      const tag = error.category !== 'required' ? ` [${error.category}]` : '';
      lines.push(`  ✖ ${error.field}: ${error.message}${tag}`);
    }
  }
  
  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  ⚠ ${warning.field}: ${warning.message}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Validate URLs (basic format check, no network calls)
 */
export function validateUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate all URLs in a plan
 */
export function validatePlanUrls(plan: GTMPlan): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Canonical URL
  if (plan.tracking.canonical_url) {
    if (validateUrl(plan.tracking.canonical_url)) {
      valid.push(`tracking.canonical_url: ${plan.tracking.canonical_url}`);
    } else {
      invalid.push(`tracking.canonical_url: ${plan.tracking.canonical_url}`);
    }
  }
  
  // Dashboard URLs
  for (const [i, url] of plan.tracking.dashboard_urls.entries()) {
    if (validateUrl(url)) {
      valid.push(`tracking.dashboard_urls[${i}]: ${url}`);
    } else {
      invalid.push(`tracking.dashboard_urls[${i}]: ${url}`);
    }
  }
  
  // PR URLs
  for (const [i, pr] of plan.provenance.git.prs.entries()) {
    if (validateUrl(pr.url)) {
      valid.push(`provenance.git.prs[${i}]: ${pr.url}`);
    } else {
      invalid.push(`provenance.git.prs[${i}]: ${pr.url}`);
    }
  }
  
  // Channel published URLs
  for (const channel of CHANNEL_NAMES) {
    const ch = plan.channels[channel];
    if (ch.published_url) {
      if (validateUrl(ch.published_url)) {
        valid.push(`channels.${channel}.published_url: ${ch.published_url}`);
      } else {
        invalid.push(`channels.${channel}.published_url: ${ch.published_url}`);
      }
    }
  }
  
  // Asset URLs
  if (plan.assets.hero.url) {
    if (validateUrl(plan.assets.hero.url)) {
      valid.push(`assets.hero.url: ${plan.assets.hero.url}`);
    } else {
      invalid.push(`assets.hero.url: ${plan.assets.hero.url}`);
    }
  }
  
  for (const [i, asset] of plan.assets.items.entries()) {
    if (asset.url) {
      if (validateUrl(asset.url)) {
        valid.push(`assets.items[${i}].url: ${asset.url}`);
      } else {
        invalid.push(`assets.items[${i}].url: ${asset.url}`);
      }
    }
  }
  
  // Evidence links
  for (const [i, evidence] of plan.qa.evidence_links.entries()) {
    if (validateUrl(evidence.url)) {
      valid.push(`qa.evidence_links[${i}].url: ${evidence.url}`);
    } else {
      invalid.push(`qa.evidence_links[${i}].url: ${evidence.url}`);
    }
  }
  
  return { valid, invalid };
}
