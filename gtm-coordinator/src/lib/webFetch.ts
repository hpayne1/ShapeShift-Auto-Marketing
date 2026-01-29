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
