import type { GTMPlan, HistoryEntry } from '../schema/gtmPlan.js';

export type ActionType = 
  | 'init'
  | 'enrich'
  | 'lock'
  | 'set-status'
  | 'qa-pass'
  | 'approve'
  | 'block'
  | 'migrate'
  | 'links-check'
  | 'utm-generate'
  | 'packet-generate';

/**
 * Create a history entry
 */
export function createHistoryEntry(
  action: ActionType,
  summary: string,
  changes?: Record<string, unknown>,
  actor: string = 'local'
): HistoryEntry {
  return {
    at: new Date().toISOString(),
    actor,
    action,
    summary,
    changes,
  };
}

/**
 * Append a history entry to a plan
 */
export function appendHistory(
  plan: GTMPlan,
  action: ActionType,
  summary: string,
  changes?: Record<string, unknown>,
  actor: string = 'local'
): void {
  plan.history.push(createHistoryEntry(action, summary, changes, actor));
}

/**
 * Get the last N history entries
 */
export function getRecentHistory(plan: GTMPlan, count: number = 10): HistoryEntry[] {
  return plan.history.slice(-count);
}

/**
 * Format history entries for display
 */
export function formatHistory(entries: HistoryEntry[]): string {
  if (entries.length === 0) {
    return 'No history entries.';
  }
  
  return entries.map(entry => {
    const date = new Date(entry.at);
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toISOString().split('T')[1].substring(0, 8);
    return `[${dateStr} ${timeStr}] ${entry.actor}: ${entry.action} - ${entry.summary}`;
  }).join('\n');
}

/**
 * Get history entries for a specific action type
 */
export function getHistoryByAction(plan: GTMPlan, action: ActionType): HistoryEntry[] {
  return plan.history.filter(entry => entry.action === action);
}
