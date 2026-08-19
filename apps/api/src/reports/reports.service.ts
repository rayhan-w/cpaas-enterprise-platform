import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getMessageReports(userId: string, query: ReportQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status && query.status !== 'ALL') {
      where.status = query.status.toUpperCase();
    }

    if (query.source && query.source !== 'ALL') {
      where.source = query.source.toUpperCase();
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (query.search) {
      where.OR = [
        { recipient: { contains: query.search } },
        { message: { contains: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.messageLog.findMany({
        where,
        include: {
          campaign: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.messageLog.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAnalyticsStats(userId: string) {
    const logs = await this.prisma.messageLog.findMany({
      where: { userId },
      select: {
        status: true,
        cost: true,
        source: true,
        createdAt: true,
      },
    });

    const total = logs.length;
    let delivered = 0;
    let sent = 0;
    let failed = 0;
    let dndFiltered = 0;
    let uiDispatched = 0;
    let apiDispatched = 0;
    let totalCost = 0;

    logs.forEach((l) => {
      if (l.status === 'DELIVERED') delivered++;
      else if (l.status === 'SENT') sent++;
      else if (l.status === 'FAILED') failed++;
      else if (l.status === 'DND_FILTERED') dndFiltered++;

      if (l.source === 'UI') uiDispatched++;
      else if (l.source === 'API') apiDispatched++;

      totalCost += l.cost;
    });

    const deliveryRate = total > 0 ? ((delivered + sent) / total) * 100 : 100;

    return {
      totalMessages: total,
      delivered,
      sent,
      failed,
      dndFiltered,
      deliveryRate: Number(deliveryRate.toFixed(1)),
      uiDispatched,
      apiDispatched,
      totalCostInr: Number(totalCost.toFixed(2)),
    };
  }

  async exportMessagesCsv(userId: string, query: ReportQueryDto): Promise<string> {
    const where: any = { userId };

    if (query.status && query.status !== 'ALL') {
      where.status = query.status.toUpperCase();
    }

    if (query.source && query.source !== 'ALL') {
      where.source = query.source.toUpperCase();
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const logs = await this.prisma.messageLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    const headers = ['Message ID', 'Recipient', 'Message Content', 'Status', 'Cost (INR)', 'Source', 'Error Detail', 'Date & Time'];
    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.recipient}"`,
      `"${l.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${l.status}"`,
      `"${l.cost.toFixed(2)}"`,
      `"${l.source}"`,
      `"${(l.errorMessage || '').replace(/"/g, '""')}"`,
      `"${l.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'REPORT_EXPORT',
        details: `Exported ${logs.length} message records to CSV`,
      },
    });

    return csvContent;
  }

  async getActivityLogs(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
