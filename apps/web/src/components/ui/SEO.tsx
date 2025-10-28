import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function SEO({
  title = 'Fitness League - Gamified Fitness Tracking',
  description = 'Track your fitness goals, earn badges, and maintain streaks with our gamified fitness tracking app. Personalized workout plans and progress visualization.',
  keywords = ['fitness', 'workout', 'tracking', 'goals', 'gamification', 'health', 'exercise'],
  image = '/images/og-image.jpg',
  url = 'https://fit-league-930c6.web.app',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOProps) {
  const fullTitle = title.includes('Fitness League') ? title : `${title} | Fitness League`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullKeywords = [...keywords, 'fitness league', 'workout tracker', 'fitness app'].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author || 'Fitness League'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Fitness League" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#77e3f8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://img.youtube.com" />
    </Helmet>
  );
}

// Predefined SEO configurations for common pages
export const SEOConfigs = {
  home: {
    title: 'Fitness League - Gamified Fitness Tracking',
    description: 'Track your fitness goals, earn badges, and maintain streaks with our gamified fitness tracking app.',
    keywords: ['fitness', 'workout', 'tracking', 'goals', 'gamification'],
  },
  dashboard: {
    title: 'Dashboard',
    description: 'View your fitness progress, upcoming workouts, and achievements.',
    keywords: ['dashboard', 'progress', 'workouts', 'achievements'],
  },
  goals: {
    title: 'Goals',
    description: 'Set and track your fitness goals with personalized workout plans.',
    keywords: ['goals', 'fitness goals', 'workout plans', 'tracking'],
  },
  profile: {
    title: 'Profile',
    description: 'Manage your fitness profile and personal information.',
    keywords: ['profile', 'personal information', 'fitness profile'],
  },
  videos: {
    title: 'Workout Videos',
    description: 'Access curated workout videos and create custom playlists.',
    keywords: ['videos', 'workout videos', 'playlists', 'exercise videos'],
  },
} as const;
