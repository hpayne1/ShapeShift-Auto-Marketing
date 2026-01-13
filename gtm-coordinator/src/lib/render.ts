import type { GTMPlan, ChannelName } from '../schema/gtmPlan.js';
import { CHANNEL_NAMES } from '../schema/gtmPlan.js';
import { validatePlan, formatValidationResult } from './validators.js';
import { getStatusEmoji, getGateStatusEmoji, getQASignalEmoji, getRiskLevelEmoji } from './status.js';
import { getDraftExcerpt } from './io.js';
import { getRiskDefaults } from './defaults.js';

const EXCERPT_LINES = 8;

export function renderPacket(plan: GTMPlan): string {
  const lines: string[] = [];
  const now = new Date().toISOString();
  const riskDefaults = getRiskDefaults(plan.risk.level);
  
  // Header
  lines.push(`# Marketing Review Packet: ${plan.title}`);
  lines.push('');
  lines.push(`**Initiative ID:** ${plan.id}  `);
  lines.push(`**Generated:** ${now}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // ===== SNAPSHOT =====
  lines.push('## 📊 Snapshot');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('|-------|-------|');
  lines.push(`| **Tier** | ${plan.tier} |`);
  lines.push(`| **Risk Level** | ${getRiskLevelEmoji(plan.risk.level)} ${plan.risk.level} |`);
  lines.push(`| **Release Window** | ${formatReleaseWindow(plan)} |`);
  lines.push(`| **Publish Mode** | ${plan.timing.publish_mode} |`);
  lines.push(`| **QA Signal** | ${getQASignalEmoji(plan.qa.signal)} ${plan.qa.signal || 'pending'} |`);
  lines.push(`| **Marketing Gate** | ${getGateStatusEmoji(plan.gates.marketing_gate.status)} ${plan.gates.marketing_gate.status} |`);
  lines.push(`| **Approvals** | ${plan.gates.marketing_gate.approvals.length}/${riskDefaults.required_approvals} |`);
  lines.push('');
  
  // CTA
  lines.push('### Call to Action');
  lines.push(getCTA(plan));
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // ===== PROVENANCE =====
  lines.push('## 🔗 Provenance');
  lines.push('');
  lines.push(`**Commit SHA:** ${plan.provenance.git.commit_sha || '_Not locked_'}`);
  lines.push('');
  
  if (plan.provenance.git.prs.length > 0) {
    lines.push('**Pull Requests:**');
    for (const pr of plan.provenance.git.prs) {
      lines.push(`- ${pr.url}${pr.merged_at ? ` (merged: ${pr.merged_at})` : ''}`);
    }
    lines.push('');
  }
  
  if (plan.provenance.inputs.length > 0) {
    lines.push('**Inputs:**');
    for (const input of plan.provenance.inputs) {
      lines.push(`- [${input.type}] ${input.url}${input.notes ? ` - ${input.notes}` : ''}`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  
  // ===== TRACKING =====
  lines.push('## 📈 Tracking');
  lines.push('');
  lines.push(`**Canonical URL:** ${plan.tracking.canonical_url || '_Not set_'}`);
  lines.push('');
  
  lines.push('| Item | Status |');
  lines.push('|------|--------|');
  lines.push(`| Canonical URL | ${plan.tracking.canonical_url ? '✅ Set' : '❌ Missing'} |`);
  lines.push(`| Dashboard URLs | ${plan.tracking.dashboard_urls.length > 0 ? `✅ ${plan.tracking.dashboard_urls.length} linked` : '❌ None'} |`);
  lines.push(`| Events Defined | ${plan.tracking.events.length > 0 ? `✅ ${plan.tracking.events.length} events` : '❌ None'} |`);
  lines.push(`| Owner | ${plan.tracking.owner || '_Unassigned_'} |`);
  lines.push('');
  
  if (plan.tracking.utm_base.campaign) {
    lines.push('**UTM Base:**');
    lines.push(`- Campaign: ${plan.tracking.utm_base.campaign}`);
    if (plan.tracking.utm_base.source) lines.push(`- Source: ${plan.tracking.utm_base.source}`);
    if (plan.tracking.utm_base.medium) lines.push(`- Medium: ${plan.tracking.utm_base.medium}`);
    lines.push('');
  }
  
  if (plan.tracking.dashboard_urls.length > 0) {
    lines.push('**Dashboards:**');
    for (const url of plan.tracking.dashboard_urls) {
      lines.push(`- ${url}`);
    }
    lines.push('');
  }
  
  if (plan.tracking.events.length > 0) {
    lines.push('**Tracking Events:**');
    for (const event of plan.tracking.events) {
      lines.push(`- **${event.name}** (${event.measured_in})${event.success_criteria ? `: ${event.success_criteria}` : ''}`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  
  // ===== CHANNELS READINESS =====
  lines.push('## ✅ Channels Readiness');
  lines.push('');
  lines.push('| Channel | Enabled | Status | Owner | Artifact |');
  lines.push('|---------|---------|--------|-------|----------|');
  
  for (const channel of CHANNEL_NAMES) {
    const ch = plan.channels[channel];
    const enabledIcon = ch.enabled ? '✅' : '❌';
    const statusIcon = getStatusEmoji(ch.status);
    const owner = ch.owner || '-';
    const artifact = ch.artifact_path ? `📄 ${ch.artifact_path}` : '-';
    lines.push(`| ${channel} | ${enabledIcon} | ${statusIcon} ${ch.status} | ${owner} | ${artifact} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // ===== ASSETS =====
  lines.push('## 🎨 Assets');
  lines.push('');
  
  // Hero asset
  lines.push('### Hero Asset');
  if (plan.assets.hero.type && plan.assets.hero.url) {
    lines.push(`- **Type:** ${plan.assets.hero.type}`);
    lines.push(`- **URL:** ${plan.assets.hero.url}`);
    lines.push(`- **PII Safe:** ${plan.assets.hero.pii_safe ? '✅' : '⚠️'}`);
  } else {
    lines.push('_Not set_');
  }
  lines.push('');
  
  // Required assets
  if (plan.assets.required.length > 0) {
    lines.push('### Required Assets');
    lines.push(`Required: ${plan.assets.required.join(', ')}`);
    lines.push('');
  }
  
  // Asset items
  if (plan.assets.items.length > 0) {
    lines.push('### Asset Items');
    lines.push('| Type | Status | URL | PII Safe |');
    lines.push('|------|--------|-----|----------|');
    for (const asset of plan.assets.items) {
      const statusIcon = getStatusEmoji(asset.status);
      const piiIcon = asset.pii_safe ? '✅' : '⚠️';
      lines.push(`| ${asset.type} | ${statusIcon} ${asset.status} | ${asset.url || '-'} | ${piiIcon} |`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  
  // ===== QA =====
  lines.push('## 🔬 QA Gate');
  lines.push('');
  lines.push(`**Signal:** ${getQASignalEmoji(plan.qa.signal)} ${plan.qa.signal || 'pending'}`);
  if (plan.qa.owner) lines.push(`**Owner:** ${plan.qa.owner}`);
  if (plan.qa.passed_at) lines.push(`**Passed At:** ${plan.qa.passed_at}`);
  if (plan.qa.notes) lines.push(`**Notes:** ${plan.qa.notes}`);
  lines.push('');
  
  lines.push('### Checks');
  lines.push(`- Smoke Test: ${plan.qa.checks.smoke_test || 'not run'}`);
  lines.push(`- Rollback Plan: ${plan.qa.checks.rollback_plan_present ? '✅ present' : '❌ missing'}`);
  lines.push('');
  
  if (plan.qa.evidence_links.length > 0) {
    lines.push('### Evidence');
    for (const evidence of plan.qa.evidence_links) {
      lines.push(`- [${evidence.type}] ${evidence.url}${evidence.notes ? ` - ${evidence.notes}` : ''}`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push('');
  
  // ===== DRAFT EXCERPTS =====
  lines.push('## 📝 Content Drafts');
  lines.push('');
  
  for (const [key, output] of Object.entries(plan.content_outputs) as Array<[string, typeof plan.content_outputs[keyof typeof plan.content_outputs]]>) {
    if (output.artifact_path) {
      const filename = output.artifact_path.replace('drafts/', '');
      const excerpt = getDraftExcerpt(plan.id, filename, EXCERPT_LINES);
      
      lines.push(`### ${formatDraftName(key)}`);
      lines.push(`**Status:** ${getStatusEmoji(output.status)} ${output.status}`);
      lines.push(`**File:** \`.gtm/${plan.id}/${output.artifact_path}\``);
      lines.push('');
      
      if (excerpt) {
        lines.push('```');
        lines.push(excerpt);
        lines.push('```');
      } else {
        lines.push('_No content_');
      }
      lines.push('');
    }
  }
  
  lines.push('---');
  lines.push('');
  
  // ===== APPROVE/BLOCK SECTION =====
  lines.push('## ✋ Approve / Block Section');
  lines.push('');
  
  // Current Status
  lines.push('### Current Status');
  lines.push(`- **QA Gate:** ${getQASignalEmoji(plan.qa.signal)} ${plan.qa.signal || 'pending'}${plan.qa.notes ? ` - ${plan.qa.notes}` : ''}`);
  lines.push(`- **Marketing Gate:** ${getGateStatusEmoji(plan.gates.marketing_gate.status)} ${plan.gates.marketing_gate.status}`);
  lines.push(`- **Required Approvals:** ${riskDefaults.required_approvals} (${plan.risk.level} risk)`);
  lines.push('');
  
  // Approvals
  if (plan.gates.marketing_gate.approvals.length > 0) {
    lines.push('### Recorded Approvals');
    for (const approval of plan.gates.marketing_gate.approvals) {
      lines.push(`- ${approval.reviewer} at ${approval.at}${approval.notes ? ` - ${approval.notes}` : ''}`);
    }
    lines.push('');
  }
  
  // Blocked reason
  if (plan.gates.marketing_gate.blocked_reason) {
    lines.push('### ⚠️ Block Reason');
    lines.push(plan.gates.marketing_gate.blocked_reason);
    lines.push('');
  }
  
  // Validation Results
  lines.push('### Validation Results');
  const validation = validatePlan(plan);
  lines.push('```');
  lines.push(formatValidationResult(validation));
  lines.push('```');
  lines.push('');
  
  // Next Actions
  lines.push('### Required Next Actions');
  if (validation.errors.length > 0) {
    for (const error of validation.errors) {
      lines.push(`- ❌ **${error.field}**: ${error.message}`);
    }
  } else if (validation.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️ **Warnings to address:**');
    for (const warning of validation.warnings) {
      lines.push(`- ⚠ ${warning.field}: ${warning.message}`);
    }
  } else {
    lines.push('');
    lines.push('✅ All requirements met. Ready for marketing approval.');
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  
  // ===== HISTORY =====
  if (plan.history.length > 0) {
    lines.push('## 📜 Recent History');
    lines.push('');
    const recentHistory = plan.history.slice(-10);
    for (const entry of recentHistory) {
      const date = new Date(entry.at).toISOString().split('T')[0];
      lines.push(`- **${date}** ${entry.actor}: ${entry.action} - ${entry.summary}`);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }
  
  // Footer
  lines.push(`*This packet was auto-generated by gtm-coordinator v${plan.schema_version}. Last updated: ${now}*`);
  
  return lines.join('\n');
}

function formatReleaseWindow(plan: GTMPlan): string {
  const { start, end } = plan.timing.release_window;
  if (!start && !end) return 'TBD';
  if (start === end) return start || 'TBD';
  return `${start || '?'} → ${end || '?'}`;
}

function getCTA(plan: GTMPlan): string {
  if (plan.gates.marketing_gate.status === 'approved') {
    return '✅ **Ready for launch!** All gates passed.';
  }
  
  if (plan.gates.marketing_gate.status === 'blocked') {
    return `🚫 **Blocked:** ${plan.gates.marketing_gate.blocked_reason || 'See validation errors'}`;
  }
  
  if (!plan.qa.signal || plan.qa.signal === 'red') {
    return '⏳ **Awaiting QA gate** - QA must pass before marketing review.';
  }
  
  const validation = validatePlan(plan);
  if (!validation.valid) {
    return `🔧 **Fix ${validation.errors.length} error(s)** before requesting marketing approval.`;
  }
  
  const riskDefaults = getRiskDefaults(plan.risk.level);
  const remainingApprovals = riskDefaults.required_approvals - plan.gates.marketing_gate.approvals.length;
  
  if (remainingApprovals > 0) {
    return `👀 **Ready for review** - ${remainingApprovals} approval(s) needed.`;
  }
  
  return '✅ **Ready for marketing approval** - All checks passed!';
}

function formatDraftName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function renderIndexEntry(plan: GTMPlan): Record<string, unknown> {
  const enabledChannels: string[] = [];
  const channelStatuses: Record<string, string> = {};
  
  for (const channel of CHANNEL_NAMES) {
    if (plan.channels[channel].enabled) {
      enabledChannels.push(channel);
      channelStatuses[channel] = plan.channels[channel].status;
    }
  }
  
  return {
    id: plan.id,
    title: plan.title,
    tier: plan.tier,
    risk_level: plan.risk.level,
    release_window: {
      start: plan.timing.release_window.start,
      end: plan.timing.release_window.end,
    },
    qa_signal: plan.qa.signal,
    marketing_gate: {
      status: plan.gates.marketing_gate.status,
      approvals_count: plan.gates.marketing_gate.approvals.length,
      required_approvals: getRiskDefaults(plan.risk.level).required_approvals,
    },
    channels_enabled: enabledChannels,
    channel_statuses: channelStatuses,
    commit_sha: plan.provenance.git.commit_sha,
    updated_at: plan.updated_at,
  };
}
