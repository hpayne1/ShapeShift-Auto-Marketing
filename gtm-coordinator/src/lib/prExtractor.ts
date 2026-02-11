/**
 * Extract structured data from a GitHub PR (source of truth for GTM).
 * Uses GitHub API when GITHUB_TOKEN is set; falls back to HTML fetch for public repos.
 */

export interface PRExtraction {
  title: string;
  description: string;
  url: string;
  filesChanged: string[];
  labels: string[];
  featureSummary: string;
  mergedAt?: string;
  state?: string;
  author?: string;
}

function parsePrUrl(prUrl: string): { owner: string; repo: string; number: string } | null {
  // https://github.com/shapeshift/foo/pull/123
  const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2], number: match[3] };
}

function deriveFeatureSummary(title: string, body: string, filesChanged: string[]): string {
  const bodyFirst = body ? body.split('\n\n')[0].trim().slice(0, 500) : '';
  const combined = `${title}. ${bodyFirst}`.trim();
  if (combined.length > 20) {
    return combined.slice(0, 400) + (combined.length > 400 ? '...' : '');
  }
  // Fallback from file paths
  const paths = filesChanged.join(' ').toLowerCase();
  if (paths.includes('staking') || paths.includes('stake')) return 'Staking feature.';
  if (paths.includes('yield') || paths.includes('earn')) return 'Yield/earn feature.';
  if (paths.includes('swap') || paths.includes('trade')) return 'Swap/trade feature.';
  if (paths.includes('bridge')) return 'Bridge feature.';
  return title || 'Feature implementation.';
}

export async function extractPr(prUrl: string): Promise<PRExtraction> {
  const parsed = parsePrUrl(prUrl);
  if (!parsed) {
    throw new Error(`Invalid PR URL: ${prUrl}. Expected format: https://github.com/owner/repo/pull/123`);
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GTM-Coordinator/0.2.0',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const base = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/pulls/${parsed.number}`;

  try {
    const [prRes, filesRes] = await Promise.all([
      fetch(`${base}`, { headers }),
      fetch(`${base}/files`, { headers }),
    ]);

    if (!prRes.ok) {
      if (prRes.status === 404 && !token) {
        throw new Error(
          'PR not found. Private repos require GITHUB_TOKEN. Set with: export GITHUB_TOKEN="ghp_..."'
        );
      }
      throw new Error(`GitHub API error: ${prRes.status} ${prRes.statusText}`);
    }

    const pr = (await prRes.json()) as {
      title: string;
      body: string | null;
      html_url: string;
      labels: { name: string }[];
      merged_at: string | null;
      state: string;
      user?: { login: string };
    };
    const files = prRes.ok && filesRes.ok
      ? ((await filesRes.json()) as { filename: string }[]).map((f) => f.filename)
      : [];

    const featureSummary = deriveFeatureSummary(
      pr.title,
      pr.body || '',
      files
    );

    return {
      title: pr.title,
      description: (pr.body || '').trim(),
      url: pr.html_url,
      filesChanged: files,
      labels: (pr.labels || []).map((l) => l.name),
      featureSummary,
      mergedAt: pr.merged_at || undefined,
      state: pr.state,
      author: pr.user?.login,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`PR extraction failed: ${msg}`);
  }
}
