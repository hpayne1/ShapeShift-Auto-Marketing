/**
 * Enrich GTM context from protocol website, Twitter, and Farcaster.
 * Pulls branding, messaging, and social tone for alignment.
 */

import { fetchWebsiteContent } from './webFetch.js';

export interface ProtocolEnrichment {
  website?: {
    tagline?: string;
    heroCopy?: string;
    terminology: string[];
  };
  twitter?: {
    recentPosts: string[];
    ctas: string[];
    tone: string;
    whatWorks?: string;
  };
  farcaster?: {
    recentCasts: string[];
    tone: string;
    formats: string[];
  };
  messagingAlignment?: {
    useTerms: string[];
    channelTone: Record<string, string>;
  };
}

function extractTextFromHtml(html: string, maxChars = 8000): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

function extractJsonLdOrMeta(html: string): { description?: string; name?: string } {
  const meta = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ||
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  const desc = meta ? meta[1].trim() : undefined;
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const name = title ? title[1].trim() : undefined;
  return { description: desc, name };
}

async function enrichFromWebsite(url: string): Promise<ProtocolEnrichment['website']> {
  try {
    const { content, title, description } = await fetchWebsiteContent(url);
    const text = content || '';
    const hero = description || text.slice(0, 300);
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const terms = [...new Set(words)].slice(0, 20);
    return {
      tagline: title || undefined,
      heroCopy: hero,
      terminology: terms,
    };
  } catch {
    return undefined;
  }
}

async function enrichFromTwitter(url: string): Promise<ProtocolEnrichment['twitter']> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GTM-Coordinator/0.2.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const text = extractTextFromHtml(html, 6000);
    const { description } = extractJsonLdOrMeta(html);
    const posts: string[] = [];
    const tweetMatches = text.match(/[A-Z][^.!?]*[.!?]/g) || [];
    posts.push(...tweetMatches.slice(0, 5).filter((p) => p.length > 20 && p.length < 280));
    return {
      recentPosts: posts.length ? posts : [description || text.slice(0, 500)],
      ctas: [],
      tone: 'Best-effort extraction; verify manually.',
      whatWorks: 'Infer from structure: short threads, questions, direct CTAs.',
    };
  } catch {
    return undefined;
  }
}

async function enrichFromFarcaster(url: string): Promise<ProtocolEnrichment['farcaster']> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GTM-Coordinator/0.2.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const text = extractTextFromHtml(html, 6000);
    const casts: string[] = [];
    const sentences = text.match(/[A-Z][^.!?]*[.!?]/g) || [];
    casts.push(...sentences.slice(0, 5).filter((s) => s.length > 15 && s.length < 320));
    return {
      recentCasts: casts.length ? casts : [text.slice(0, 400)],
      tone: 'Best-effort extraction; verify manually.',
      formats: [],
    };
  } catch {
    return undefined;
  }
}

export async function enrichProtocol(opts: {
  websiteUrl?: string;
  twitterUrl?: string;
  farcasterUrl?: string;
}): Promise<ProtocolEnrichment> {
  const { websiteUrl, twitterUrl, farcasterUrl } = opts;
  const result: ProtocolEnrichment = {};

  if (websiteUrl) {
    result.website = await enrichFromWebsite(websiteUrl);
  }
  if (twitterUrl) {
    result.twitter = await enrichFromTwitter(twitterUrl);
  }
  if (farcasterUrl) {
    result.farcaster = await enrichFromFarcaster(farcasterUrl);
  }

  if (result.website?.terminology?.length || result.twitter || result.farcaster) {
    result.messagingAlignment = {
      useTerms: result.website?.terminology?.slice(0, 10) || [],
      channelTone: {
        ...(result.twitter && { twitter: result.twitter.tone }),
        ...(result.farcaster && { farcaster: result.farcaster.tone }),
      },
    };
  }

  return result;
}
