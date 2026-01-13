import type { Status, GateStatus } from '../schema/gtmPlan.js';

/**
 * Status progression levels for comparison
 */
export const STATUS_PROGRESSION: Record<Status, number> = {
  'not_applicable': 0,
  'pending': 1,
  'generated': 2,
  'needs_review': 3,
  'approved': 4,
  'scheduled': 5,
  'published': 6,
  'blocked': -1, // Blocked is a special state
};

/**
 * Check if a status is "ready" for marketing approval
 * (at least needs_review or higher, excluding blocked)
 */
export function isStatusReady(status: Status): boolean {
  return STATUS_PROGRESSION[status] >= STATUS_PROGRESSION['needs_review'] && status !== 'blocked';
}

/**
 * Check if a status is "complete" (approved, scheduled, or published)
 */
export function isStatusComplete(status: Status): boolean {
  return ['approved', 'scheduled', 'published'].includes(status);
}

/**
 * Check if a status indicates work has started
 */
export function isStatusStarted(status: Status): boolean {
  return STATUS_PROGRESSION[status] >= STATUS_PROGRESSION['generated'] && status !== 'blocked';
}

/**
 * Check if a status is actionable (not n/a, not blocked)
 */
export function isStatusActionable(status: Status): boolean {
  return status !== 'not_applicable' && status !== 'blocked';
}

/**
 * Get display emoji for status
 */
export function getStatusEmoji(status: Status): string {
  const emojis: Record<Status, string> = {
    'not_applicable': '⚫',
    'pending': '⏳',
    'generated': '📝',
    'needs_review': '👀',
    'approved': '✅',
    'scheduled': '📅',
    'published': '🚀',
    'blocked': '🚫',
  };
  return emojis[status] || '❓';
}

/**
 * Get display emoji for gate status
 */
export function getGateStatusEmoji(status: GateStatus): string {
  const emojis: Record<GateStatus, string> = {
    'pending': '⏳',
    'approved': '✅',
    'blocked': '🚫',
  };
  return emojis[status] || '❓';
}

/**
 * Get display emoji for QA signal
 */
export function getQASignalEmoji(signal: string | null): string {
  if (!signal) return '⏳';
  const emojis: Record<string, string> = {
    'green': '🟢',
    'yellow': '🟡',
    'red': '🔴',
  };
  return emojis[signal] || '⏳';
}

/**
 * Get display emoji for risk level
 */
export function getRiskLevelEmoji(level: string): string {
  const emojis: Record<string, string> = {
    'low': '🟢',
    'medium': '🟡',
    'high': '🔴',
  };
  return emojis[level] || '⚪';
}

/**
 * Format status for display
 */
export function formatStatus(status: Status): string {
  return `${getStatusEmoji(status)} ${status}`;
}

/**
 * All valid statuses
 */
export const ALL_STATUSES: Status[] = [
  'not_applicable',
  'pending',
  'generated',
  'needs_review',
  'approved',
  'scheduled',
  'published',
  'blocked',
];
