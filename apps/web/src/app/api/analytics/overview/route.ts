import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Role check: If regular user, restrict to their links
    const linkFilter: any = {};
    if (user.role === RoleType.USER) {
      linkFilter.userId = user.id;
    }

    const userLinks = await prisma.link.findMany({
      where: linkFilter,
      select: { id: true },
    });
    const linkIds = userLinks.map((l) => l.id);

    // Fetch all matching events
    const events = await prisma.linkEvent.findMany({
      where: { linkId: { in: linkIds } },
      orderBy: { timestamp: 'desc' },
      take: 1000,
    });

    const totalVisits = events.length;
    const uniqueVisitors = new Set(events.map((e) => e.visitorHash)).size;

    // Daily breakdown for the last 30 days
    const daysMap = new Map<string, { visits: number; uniques: Set<string> }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      daysMap.set(d, { visits: 0, uniques: new Set() });
    }

    for (const ev of events) {
      const d = ev.timestamp.toISOString().split('T')[0];
      if (daysMap.has(d)) {
        const entry = daysMap.get(d)!;
        entry.visits += 1;
        entry.uniques.add(ev.visitorHash);
      }
    }

    const trafficOverTime = Array.from(daysMap.entries()).map(([date, val]) => ({
      date,
      visits: val.visits,
      uniqueVisitors: val.uniques.size,
    }));

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    for (const ev of events) {
      const d = ev.deviceCategory || 'Desktop';
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    }
    const deviceCategories = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

    // Browser breakdown
    const browserCounts: Record<string, number> = {};
    for (const ev of events) {
      const b = ev.browserFamily || 'Chrome';
      browserCounts[b] = (browserCounts[b] || 0) + 1;
    }
    const browserFamilies = Object.entries(browserCounts).map(([name, value]) => ({ name, value }));

    // Top Countries
    const countryCounts: Record<string, number> = {};
    for (const ev of events) {
      const c = ev.country || 'Global';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    }
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalLinks: userLinks.length,
        totalVisits,
        uniqueVisitors,
        activeLinksCount: await prisma.link.count({ where: { ...linkFilter, isActive: true } }),
      },
      trafficOverTime,
      deviceCategories,
      browserFamilies,
      topCountries,
    });
  } catch (err: any) {
    console.error('GET /api/analytics/overview Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve analytics overview.' }, { status: 500 });
  }
}
