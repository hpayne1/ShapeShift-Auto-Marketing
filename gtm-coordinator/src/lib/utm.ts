import type { GTMPlan, ChannelName } from '../schema/gtmPlan.js';

/**
 * Default UTM parameters by channel
 */
export const CHANNEL_UTM_DEFAULTS: Record<ChannelName, { source: string; medium: string }> = {
  discord: { source: 'discord', medium: 'social' },
  x: { source: 'twitter', medium: 'social' },
  reddit: { source: 'reddit', medium: 'social' },
  farcaster: { source: 'farcaster', medium: 'social' },
  email: { source: 'email', medium: 'email' },
  blog: { source: 'blog', medium: 'content' },
  landing_page: { source: 'website', medium: 'web' },
  changelog: { source: 'changelog', medium: 'content' },
  in_app_banner: { source: 'app', medium: 'in_app' },
  in_app_modal: { source: 'app', medium: 'in_app' },
  push_notification: { source: 'push', medium: 'notification' },
  partner_outbounds: { source: 'partner', medium: 'referral' },
  release_notes: { source: 'release_notes', medium: 'content' },
  app_store_ios: { source: 'appstore', medium: 'store' },
  app_store_android: { source: 'playstore', medium: 'store' },
};

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * Build UTM parameters for a channel
 */
export function buildUTMParams(
  plan: GTMPlan,
  channel: ChannelName,
  overrides?: Partial<UTMParams>
): UTMParams {
  const channelDefaults = CHANNEL_UTM_DEFAULTS[channel];
  const trackingBase = plan.tracking.utm_base;
  
  // Generate campaign from plan ID if not set
  const campaign = trackingBase.campaign || plan.id.toLowerCase().replace('init-', 'gtm-');
  
  return {
    utm_source: overrides?.utm_source || trackingBase.source || channelDefaults.source,
    utm_medium: overrides?.utm_medium || trackingBase.medium || channelDefaults.medium,
    utm_campaign: overrides?.utm_campaign || campaign,
    ...(overrides?.utm_content && { utm_content: overrides.utm_content }),
    ...(overrides?.utm_term && { utm_term: overrides.utm_term }),
  };
}

/**
 * Compose a full URL with UTM parameters
 */
export function composeUTMUrl(
  baseUrl: string,
  utmParams: UTMParams
): string {
  const url = new URL(baseUrl);
  
  // Add UTM parameters
  url.searchParams.set('utm_source', utmParams.utm_source);
  url.searchParams.set('utm_medium', utmParams.utm_medium);
  url.searchParams.set('utm_campaign', utmParams.utm_campaign);
  
  if (utmParams.utm_content) {
    url.searchParams.set('utm_content', utmParams.utm_content);
  }
  if (utmParams.utm_term) {
    url.searchParams.set('utm_term', utmParams.utm_term);
  }
  
  return url.toString();
}

/**
 * Build a full UTM URL for a channel
 */
export function buildChannelUTMUrl(
  plan: GTMPlan,
  channel: ChannelName
): string | null {
  if (!plan.tracking.canonical_url) {
    return null;
  }
  
  const utmParams = buildUTMParams(plan, channel);
  return composeUTMUrl(plan.tracking.canonical_url, utmParams);
}

/**
 * Validate URL format (basic, no network calls)
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL has UTM parameters
 */
export function hasUTMParams(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.has('utm_source') ||
           parsed.searchParams.has('utm_medium') ||
           parsed.searchParams.has('utm_campaign');
  } catch {
    return false;
  }
}

/**
 * Extract UTM parameters from URL
 */
export function extractUTMParams(url: string): Partial<UTMParams> {
  try {
    const parsed = new URL(url);
    const params: Partial<UTMParams> = {};
    
    if (parsed.searchParams.has('utm_source')) {
      params.utm_source = parsed.searchParams.get('utm_source')!;
    }
    if (parsed.searchParams.has('utm_medium')) {
      params.utm_medium = parsed.searchParams.get('utm_medium')!;
    }
    if (parsed.searchParams.has('utm_campaign')) {
      params.utm_campaign = parsed.searchParams.get('utm_campaign')!;
    }
    if (parsed.searchParams.has('utm_content')) {
      params.utm_content = parsed.searchParams.get('utm_content')!;
    }
    if (parsed.searchParams.has('utm_term')) {
      params.utm_term = parsed.searchParams.get('utm_term')!;
    }
    
    return params;
  } catch {
    return {};
  }
}

/**
 * Format UTM URL for display
 */
export function formatUTMUrl(url: string, maxLength: number = 80): string {
  if (url.length <= maxLength) {
    return url;
  }
  return url.substring(0, maxLength - 3) + '...';
}
