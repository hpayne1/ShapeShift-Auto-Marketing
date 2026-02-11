/**
 * Fetch and extract text content from a website
 */
export async function fetchWebsiteContent(url: string): Promise<{
  title: string;
  description: string;
  content: string;
  url: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GTM-Coordinator/0.2.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract main content (strip HTML tags, scripts, styles)
    let content = html
      // Remove script tags and content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      // Remove style tags and content
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove all HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Limit content length to avoid token limits
    if (content.length > 15000) {
      content = content.substring(0, 15000) + '...';
    }

    return { title, description, content, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch website content: ${message}`);
  }
}

/**
 * Fetch multiple pages from a website
 */
export async function fetchMultiplePages(baseUrl: string, paths: string[] = ['/']): Promise<string> {
  const results: string[] = [];
  
  for (const path of paths) {
    try {
      const url = new URL(path, baseUrl).toString();
      const { title, description, content } = await fetchWebsiteContent(url);
      results.push(`
## Page: ${title || path}
URL: ${url}
Description: ${description}

Content:
${content}
`);
    } catch (error) {
      // Skip failed pages
      console.warn(`Warning: Could not fetch ${path}`);
    }
  }

  return results.join('\n---\n');
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet?: string;
}

function decodeDuckDuckGoRedirectUrl(href: string): string {
  try {
    // DuckDuckGo often uses: https://duckduckgo.com/l/?uddg=<encoded>
    const u = new URL(href);
    const uddg = u.searchParams.get('uddg');
    if (uddg) return decodeURIComponent(uddg);
  } catch {
    // ignore
  }
  return href;
}

/**
 * Best-effort web search (no API key) using DuckDuckGo's HTML endpoint.
 * This is used to pull in timely political/technical context for press angles.
 */
export async function searchWeb(query: string, maxResults = 5): Promise<WebSearchResult[]> {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; GTM-Coordinator/0.2.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search web: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const results: WebSearchResult[] = [];

  // Extract titles/links. DuckDuckGo HTML uses result__a for result links.
  const linkRe = /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  const snippetRe = /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i;

  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(html)) && results.length < maxResults) {
    const rawHref = match[1];
    const rawTitle = match[2];
    const title = rawTitle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const href = decodeDuckDuckGoRedirectUrl(rawHref);

    // Try to grab a snippet from the surrounding HTML block (best effort).
    const after = html.slice(match.index, match.index + 2000);
    const sn = after.match(snippetRe);
    const snippet = sn ? sn[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : undefined;

    if (!title || !href) continue;
    results.push({ title, url: href, snippet });
  }

  return results;
}
