import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/constants/tools';
import { SITE_CONFIG } from '@/lib/constants/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_CONFIG.url}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...routes,
  ];
}
