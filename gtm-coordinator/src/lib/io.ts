import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import * as YAML from 'yaml';
import { GTMPlan, GTMPlanSchema } from '../schema/gtmPlan.js';
import { needsMigration, migrateV1ToV2, extractV1Drafts, getOldContentStatus } from './migrate.js';

const GTM_DIR = '.gtm';

// ============================================================================
// DIRECTORY MANAGEMENT
// ============================================================================

export function ensureGtmDir(): void {
  if (!existsSync(GTM_DIR)) {
    mkdirSync(GTM_DIR, { recursive: true });
  }
}

export function ensurePlanDir(id: string): string {
  const planDir = join(GTM_DIR, id);
  if (!existsSync(planDir)) {
    mkdirSync(planDir, { recursive: true });
  }
  return planDir;
}

export function ensureDraftsDir(id: string): string {
  const draftsDir = join(GTM_DIR, id, 'drafts');
  if (!existsSync(draftsDir)) {
    mkdirSync(draftsDir, { recursive: true });
  }
  return draftsDir;
}

// ============================================================================
// PATH HELPERS
// ============================================================================

export function getPlanPath(id: string): string {
  // Check for new structure first (plan.yaml in folder)
  const newPath = join(GTM_DIR, id, 'plan.yaml');
  if (existsSync(newPath)) {
    return newPath;
  }
  // Fall back to legacy flat file
  return join(GTM_DIR, `${id}.yaml`);
}

export function getNewPlanPath(id: string): string {
  return join(GTM_DIR, id, 'plan.yaml');
}

export function getLegacyPlanPath(id: string): string {
  return join(GTM_DIR, `${id}.yaml`);
}

export function getPacketPath(id: string): string {
  return join(GTM_DIR, id, 'review.md');
}

export function getIndexPath(): string {
  return join(GTM_DIR, 'index.json');
}

export function getDraftPath(id: string, filename: string): string {
  return join(GTM_DIR, id, 'drafts', filename);
}

// ============================================================================
// PLAN EXISTENCE CHECKS
// ============================================================================

export function planExists(id: string): boolean {
  return existsSync(getNewPlanPath(id)) || existsSync(getLegacyPlanPath(id));
}

export function isLegacyPlan(id: string): boolean {
  return existsSync(getLegacyPlanPath(id)) && !existsSync(getNewPlanPath(id));
}

// ============================================================================
// PLAN READ/WRITE
// ============================================================================

export function readPlan(id: string): GTMPlan {
  const newPath = getNewPlanPath(id);
  const legacyPath = getLegacyPlanPath(id);
  
  let path: string;
  if (existsSync(newPath)) {
    path = newPath;
  } else if (existsSync(legacyPath)) {
    path = legacyPath;
  } else {
    throw new Error(`Plan not found: ${id}`);
  }
  
  const content = readFileSync(path, 'utf-8');
  const data = YAML.parse(content);
  
  // Check if migration is needed
  if (needsMigration(data)) {
    // Extract and save drafts from v1
    const drafts = extractV1Drafts(data);
    
    // Migrate to v2
    const migratedPlan = migrateV1ToV2(data);
    
    // Save drafts to files
    if (Object.keys(drafts).length > 0) {
      const draftsDir = ensureDraftsDir(id);
      for (const [filename, content] of Object.entries(drafts)) {
        const draftPath = join(draftsDir, filename);
        writeFileSync(draftPath, content, 'utf-8');
        
        // Update artifact_path in plan
        const key = filename.replace('.md', '');
        if (key in migratedPlan.content_outputs) {
          (migratedPlan.content_outputs as Record<string, { artifact_path: string | null; status: string }>)[key].artifact_path = `drafts/${filename}`;
          (migratedPlan.content_outputs as Record<string, { artifact_path: string | null; status: string }>)[key].status = getOldContentStatus(data, getOldContentKey(key));
        }
      }
    }
    
    // Write migrated plan to new location
    writePlan(migratedPlan);
    
    // Remove legacy file if it exists and new file was created
    if (existsSync(legacyPath) && existsSync(newPath)) {
      // Keep legacy for safety, but could rmSync(legacyPath) if desired
    }
    
    return migratedPlan;
  }
  
  // Validate with Zod
  const result = GTMPlanSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid plan format: ${result.error.message}`);
  }
  
  return result.data;
}

function getOldContentKey(newKey: string): string {
  const mapping: Record<string, string> = {
    'release_notes_short': 'release_notes_draft',
    'release_notes_long': 'release_notes_draft',
    'app_store_ios': 'app_store_notes_draft',
    'app_store_android': 'app_store_notes_draft',
    'discord_post': 'social_drafts',
    'x_post': 'social_drafts',
    'reddit_post': 'social_drafts',
    'farcaster_post': 'social_drafts',
    'blog_outline': 'blog',
    'blog_draft': 'blog',
    'partner_brief': 'partner_brief',
  };
  return mapping[newKey] || newKey;
}

export function writePlan(plan: GTMPlan): void {
  // Ensure directory structure exists
  ensurePlanDir(plan.id);
  
  // Update timestamp
  plan.updated_at = new Date().toISOString();
  
  const path = getNewPlanPath(plan.id);
  const content = YAML.stringify(plan, {
    indent: 2,
    lineWidth: 120,
    nullStr: 'null',
  });
  
  writeFileSync(path, content, 'utf-8');
}

// ============================================================================
// DRAFT FILE OPERATIONS
// ============================================================================

export function readDraft(id: string, filename: string): string | null {
  const draftPath = getDraftPath(id, filename);
  if (!existsSync(draftPath)) {
    return null;
  }
  return readFileSync(draftPath, 'utf-8');
}

export function writeDraft(id: string, filename: string, content: string): string {
  const draftsDir = ensureDraftsDir(id);
  const draftPath = join(draftsDir, filename);
  writeFileSync(draftPath, content, 'utf-8');
  return `drafts/${filename}`;
}

export function listDrafts(id: string): string[] {
  const draftsDir = join(GTM_DIR, id, 'drafts');
  if (!existsSync(draftsDir)) {
    return [];
  }
  return readdirSync(draftsDir).filter(f => f.endsWith('.md'));
}

export function getDraftExcerpt(id: string, filename: string, lines: number = 5): string | null {
  const content = readDraft(id, filename);
  if (!content) return null;
  
  const contentLines = content.split('\n');
  const excerpt = contentLines.slice(0, lines).join('\n');
  
  if (contentLines.length > lines) {
    return excerpt + '\n...';
  }
  return excerpt;
}

// ============================================================================
// PACKET AND INDEX
// ============================================================================

export function writePacket(id: string, content: string): void {
  ensurePlanDir(id);
  const path = getPacketPath(id);
  writeFileSync(path, content, 'utf-8');
}

export function writeIndex(data: unknown): void {
  ensureGtmDir();
  const path = getIndexPath();
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================================================
// LISTING
// ============================================================================

export function listPlans(): string[] {
  ensureGtmDir();
  
  const entries = readdirSync(GTM_DIR, { withFileTypes: true });
  const plans: string[] = [];
  
  // Check for new-style plans (folders with plan.yaml)
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.match(/^INIT-\d+$/)) {
      const planPath = join(GTM_DIR, entry.name, 'plan.yaml');
      if (existsSync(planPath)) {
        plans.push(entry.name);
      }
    }
  }
  
  // Check for legacy flat files
  for (const entry of entries) {
    if (entry.isFile() && entry.name.match(/^INIT-\d+\.yaml$/)) {
      const id = entry.name.replace('.yaml', '');
      if (!plans.includes(id)) {
        plans.push(id);
      }
    }
  }
  
  return plans.sort();
}

// ============================================================================
// TEMPLATE READING
// ============================================================================

export function readTemplate(name: string): string {
  const templatePath = join('templates', name);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${name}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

// ============================================================================
// NESTED VALUE HELPERS
// ============================================================================

export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
}

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return current;
}
