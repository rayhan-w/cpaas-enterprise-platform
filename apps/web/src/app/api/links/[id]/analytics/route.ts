import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const link = await prisma.link.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true, userId: true, destinationUrl: true, visitCount: true },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
    }

    // Ownership check
    if (user.role === RoleType.USER && link.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to view analytics for this link.' }, { status: 403 });
    }

    // Query all events for this link
    const events = await prisma.linkEvent.findMany({
      where: { linkId: link.id },
      orderBy: { timestamp: 'asc' },
    });

    const totalVisits = events.length;
    const uniqueVisitorsSet = new Set(events.map((e) => e.visitorHash));
    const uniqueVisitors = uniqueVisitorsSet.size;

    // Time-series aggregation (by day: YYYY-MM-DD)
    const timeMap = new Map<string, { visits: number; uniques: Set<string> }>();
    for (const ev of events) {
      const dateKey = ev.timestamp.toISOString().split('T')[0];
      if (!timeMap.has(dateKey)) {
        timeMap.set(dateKey, { visits: 0, uniques: new Set() });
      }
      const entry = timeMap.get(dateKey)!;
      entry.visits += 1;
      entry.uniques.add(ev.visitorHash);
    }

    const trafficOverTime = Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        visits: data.visits,
        uniqueVisitors: data.uniques.size,
      }));

    // Device breakdown
    const deviceMap = new Map<string, number>();
    for (const ev of events) {
      const cat = ev.deviceCategory || 'Other';
      deviceMap.set(cat, (deviceMap.get(cat) || 0) + 1);
    }
    const deviceCategories = Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value }));

    // Browser breakdown
    const browserMap = new Map<string, number>();
    for (const ev of events) {
      const b = ev.browserFamily || 'Other';
      browserMap.set(b, (browserMap.get(b) || 0) + 1);
    }
    const browserFamilies = Array.from(browserMap.entries()).map(([name, value]) => ({ name, value }));

    // OS breakdown
    const osMap = new Map<string, number>();
    for (const ev of events) {
      const o = ev.osFamily || 'Other';
      osMap.set(o, (osMap.get(o) || 0) + 1);
    }
    const osFamilies = Array.from(osMap.entries()).map(([name, value]) => ({ name, value }));

    // Country breakdown
    const countryMap = new Map<string, number>();
    for (const ev of events) {
      const c = ev.country || 'Global';
      countryMap.set(c, (countryMap.get(c) || 0) + 1);
    }
    const geographicRegions = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      link,
      analytics: {
        totalVisits,
        uniqueVisitors,
        trafficOverTime,
        deviceCategories,
        browserFamilies,
        osFamilies,
        geographicRegions,
      },
    });
  } catch (err: any) {
    console.error('GET /api/links/[id]/analytics Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve analytics.' }, { status: 500 });
  }
}
