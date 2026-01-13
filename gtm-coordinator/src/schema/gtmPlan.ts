import { z } from 'zod';

// ============================================================================
// NORMALIZED STATUS ENUM - Used everywhere
// ============================================================================
export const StatusEnum = z.enum([
  'not_applicable',
  'pending',
  'generated',
  'needs_review',
  'approved',
  'scheduled',
  'published',
  'blocked',
]);

export const QASignalEnum = z.enum(['green', 'yellow', 'red']);
export const TierEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);
export const RiskLevelEnum = z.enum(['low', 'medium', 'high']);
export const ClaimsPolicyEnum = z.enum(['standard', 'conservative']);
export const PublishModeEnum = z.enum(['manual', 'auto_when_green', 'auto_on_flag']);
export const GateStatusEnum = z.enum(['pending', 'approved', 'blocked']);
export const CheckResultEnum = z.enum(['pass', 'fail', 'na']);
export const AssetTypeEnum = z.enum(['video', 'image', 'gif', 'screenshot', 'loom', 'logo_lockup', 'graphic', 'other']);
export const InputTypeEnum = z.enum(['pr', 'doc', 'design', 'loom', 'spec', 'other']);
export const EvidenceTypeEnum = z.enum(['loom', 'test_run', 'screenshot', 'other']);
export const MeasuredInEnum = z.enum(['mixpanel', 'posthog', 'amplitude', 'other']);

// ============================================================================
// PROVENANCE - Git/time scoped grounding
// ============================================================================
export const PRLinkSchema = z.object({
  url: z.string(),
  base: z.string().optional(),
  head: z.string().optional(),
  merged_at: z.string().optional(),
});

export const InputSchema = z.object({
  type: InputTypeEnum,
  url: z.string(),
  notes: z.string().optional(),
});

export const ProvenanceSchema = z.object({
  generated_by: z.object({
    tool: z.string().default('gtm-coordinator'),
    version: z.string().default('0.2.0'),
    generated_at: z.string().nullable().default(null),
  }).default({}),
  git: z.object({
    commit_sha: z.string().nullable().default(null),
    prs: z.array(PRLinkSchema).default([]),
  }).default({}),
  inputs: z.array(InputSchema).default([]),
});

// ============================================================================
// RISK - Governance/approvals separate from tier
// ============================================================================
export const RiskSchema = z.object({
  level: RiskLevelEnum.default('low'),
  notes: z.string().nullable().default(null),
  claims_policy: ClaimsPolicyEnum.default('standard'),
});

// ============================================================================
// TIMING - Release windows and publish mode
// ============================================================================
export const DateWindowSchema = z.object({
  start: z.string().nullable().default(null),
  end: z.string().nullable().default(null),
});

export const BlackoutWindowSchema = z.object({
  start: z.string(),
  end: z.string(),
  reason: z.string().optional(),
});

export const TimingSchema = z.object({
  release_window: DateWindowSchema.default({}),
  publish_mode: PublishModeEnum.default('manual'),
  blackout_windows: z.array(BlackoutWindowSchema).default([]),
});

// ============================================================================
// QA - Quality assurance with evidence
// ============================================================================
export const EvidenceLinkSchema = z.object({
  type: EvidenceTypeEnum,
  url: z.string(),
  notes: z.string().optional(),
});

export const QAChecksSchema = z.object({
  smoke_test: CheckResultEnum.nullable().default(null),
  rollback_plan_present: z.boolean().default(false),
});

export const QASchema = z.object({
  signal: QASignalEnum.nullable().default(null),
  owner: z.string().nullable().default(null),
  checks: QAChecksSchema.default({}),
  notes: z.string().nullable().default(null),
  evidence_links: z.array(EvidenceLinkSchema).default([]),
  passed_at: z.string().nullable().default(null),
});

// ============================================================================
// TRACKING - Analytics and UTM configuration
// ============================================================================
export const UTMBaseSchema = z.object({
  source: z.string().nullable().default(null),
  medium: z.string().nullable().default(null),
  campaign: z.string().nullable().default(null),
});

export const TrackingEventSchema = z.object({
  name: z.string(),
  success_criteria: z.string().optional(),
  measured_in: MeasuredInEnum.default('mixpanel'),
  notes: z.string().optional(),
});

export const TrackingSchema = z.object({
  canonical_url: z.string().nullable().default(null),
  utm_base: UTMBaseSchema.default({}),
  events: z.array(TrackingEventSchema).default([]),
  dashboard_urls: z.array(z.string()).default([]),
  owner: z.string().nullable().default(null),
});

// ============================================================================
// ASSETS - Hero + required items with PII safety
// ============================================================================
export const HeroAssetSchema = z.object({
  type: AssetTypeEnum.nullable().default(null),
  url: z.string().nullable().default(null),
  pii_safe: z.boolean().default(true),
});

export const AssetItemSchema = z.object({
  type: AssetTypeEnum,
  status: StatusEnum.default('pending'),
  url: z.string().nullable().default(null),
  notes: z.string().optional(),
  pii_safe: z.boolean().default(true),
});

export const AssetsSchema = z.object({
  hero: HeroAssetSchema.default({}),
  required: z.array(z.string()).default([]),
  items: z.array(AssetItemSchema).default([]),
});

// ============================================================================
// CHANNELS - Normalized shape across all channels
// ============================================================================
export const ChannelSchema = z.object({
  enabled: z.boolean().default(false),
  status: StatusEnum.default('not_applicable'),
  owner: z.string().nullable().default(null),
  artifact_path: z.string().nullable().default(null),
  publish_window: DateWindowSchema.nullable().default(null),
  published_url: z.string().nullable().default(null),
});

export const ChannelsSchema = z.object({
  discord: ChannelSchema.default({}),
  x: ChannelSchema.default({}),
  reddit: ChannelSchema.default({}),
  farcaster: ChannelSchema.default({}),
  email: ChannelSchema.default({}),
  blog: ChannelSchema.default({}),
  landing_page: ChannelSchema.default({}),
  changelog: ChannelSchema.default({}),
  in_app_banner: ChannelSchema.default({}),
  in_app_modal: ChannelSchema.default({}),
  push_notification: ChannelSchema.default({}),
  partner_outbounds: ChannelSchema.default({}),
  release_notes: ChannelSchema.default({}),
  app_store_ios: ChannelSchema.default({}),
  app_store_android: ChannelSchema.default({}),
});

// ============================================================================
// GATES - Marketing gate with approval tracking
// ============================================================================
export const ApprovalRecordSchema = z.object({
  reviewer: z.string(),
  at: z.string(),
  notes: z.string().optional(),
});

export const MarketingGateSchema = z.object({
  status: GateStatusEnum.default('pending'),
  required_approvals: z.number().default(1),
  approvals: z.array(ApprovalRecordSchema).default([]),
  blocked_reason: z.string().nullable().default(null),
});

export const GatesSchema = z.object({
  marketing_gate: MarketingGateSchema.default({}),
});

// ============================================================================
// HISTORY - Append-only audit log
// ============================================================================
export const HistoryEntrySchema = z.object({
  at: z.string(),
  actor: z.string().default('local'),
  action: z.string(),
  summary: z.string(),
  changes: z.record(z.unknown()).optional(),
});

// ============================================================================
// CONTENT OUTPUTS - Pointers to draft files (not inline content)
// ============================================================================
export const DraftPointerSchema = z.object({
  artifact_path: z.string().nullable().default(null),
  status: StatusEnum.default('pending'),
  excerpt: z.string().optional(), // Optional short excerpt for quick view
});

export const ContentOutputsSchema = z.object({
  release_notes_short: DraftPointerSchema.default({}),
  release_notes_long: DraftPointerSchema.default({}),
  app_store_ios: DraftPointerSchema.default({}),
  app_store_android: DraftPointerSchema.default({}),
  discord_post: DraftPointerSchema.default({}),
  x_post: DraftPointerSchema.default({}),
  reddit_post: DraftPointerSchema.default({}),
  farcaster_post: DraftPointerSchema.default({}),
  blog_outline: DraftPointerSchema.default({}),
  blog_draft: DraftPointerSchema.default({}),
  partner_brief: DraftPointerSchema.default({}),
  email_template: DraftPointerSchema.default({}),
});

// ============================================================================
// MAIN GTM PLAN SCHEMA
// ============================================================================
export const GTMPlanSchema = z.object({
  // Core identity
  id: z.string().regex(/^INIT-\d+$/, 'ID must be in format INIT-####'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  tier: TierEnum.default(1),
  
  // New structured sections
  provenance: ProvenanceSchema.default({}),
  risk: RiskSchema.default({}),
  timing: TimingSchema.default({}),
  qa: QASchema.default({}),
  tracking: TrackingSchema.default({}),
  assets: AssetsSchema.default({}),
  channels: ChannelsSchema.default({}),
  gates: GatesSchema.default({}),
  
  // Content output pointers (draft files stored externally)
  content_outputs: ContentOutputsSchema.default({}),
  
  // Audit trail
  history: z.array(HistoryEntrySchema).default([]),
  
  // Metadata
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().optional(),
  version: z.number().default(2),
  schema_version: z.string().default('0.2.0'),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type GTMPlan = z.infer<typeof GTMPlanSchema>;
export type Status = z.infer<typeof StatusEnum>;
export type QASignal = z.infer<typeof QASignalEnum>;
export type RiskLevel = z.infer<typeof RiskLevelEnum>;
export type ClaimsPolicy = z.infer<typeof ClaimsPolicyEnum>;
export type PublishMode = z.infer<typeof PublishModeEnum>;
export type GateStatus = z.infer<typeof GateStatusEnum>;
export type CheckResult = z.infer<typeof CheckResultEnum>;
export type AssetType = z.infer<typeof AssetTypeEnum>;
export type Channel = z.infer<typeof ChannelSchema>;
export type AssetItem = z.infer<typeof AssetItemSchema>;
export type ApprovalRecord = z.infer<typeof ApprovalRecordSchema>;
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;
export type DraftPointer = z.infer<typeof DraftPointerSchema>;
export type PRLink = z.infer<typeof PRLinkSchema>;
export type Input = z.infer<typeof InputSchema>;
export type TrackingEvent = z.infer<typeof TrackingEventSchema>;
export type EvidenceLink = z.infer<typeof EvidenceLinkSchema>;

// Channel names for iteration
export const CHANNEL_NAMES = [
  'discord', 'x', 'reddit', 'farcaster', 'email',
  'blog', 'landing_page', 'changelog',
  'in_app_banner', 'in_app_modal', 'push_notification',
  'partner_outbounds', 'release_notes', 'app_store_ios', 'app_store_android',
] as const;

export type ChannelName = typeof CHANNEL_NAMES[number];
