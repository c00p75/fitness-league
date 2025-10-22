/**
 * YouTube utility functions for video handling
 */

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+\/.*#(?:.*\/)?([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate YouTube thumbnail URL
 */
export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    standard: 'sddefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Generate YouTube embed URL
 */
export function getEmbedUrl(videoId: string, options: {
  autoplay?: boolean;
  start?: number;
  end?: number;
  controls?: boolean;
  loop?: boolean;
  modestbranding?: boolean;
} = {}): string {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.set('autoplay', '1');
  if (options.start) params.set('start', options.start.toString());
  if (options.end) params.set('end', options.end.toString());
  if (options.controls === false) params.set('controls', '0');
  if (options.loop) params.set('loop', '1');
  if (options.modestbranding) params.set('modestbranding', '1');

  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Validate YouTube video ID format
 */
export function isValidVideoId(videoId: string): boolean {
  // YouTube video IDs are typically 11 characters long
  // and contain only alphanumeric characters, hyphens, and underscores
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

/**
 * Get YouTube video URL from video ID
 */
export function getVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  const youtubeDomains = [
    'youtube.com',
    'youtu.be',
    'www.youtube.com',
    'm.youtube.com',
  ];

  try {
    const urlObj = new URL(url);
    return youtubeDomains.includes(urlObj.hostname);
  } catch {
    return false;
  }
}
