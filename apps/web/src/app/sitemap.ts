import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solvear.in';
  const lastModified = new Date();

  const routes = [
    '',
    '/products',
    '/features',
    '/pricing',
    '/white-label',
    '/integrations',
    '/channels/whatsapp',
    '/channels/instagram',
    '/channels/messenger',
    '/channels/telegram',
    '/channels/webchat',
    '/about',
    '/contact',
    '/login',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/products' ? 0.9 : 0.8,
  }));
}
