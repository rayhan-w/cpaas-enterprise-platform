import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        entityId: true,
        balanceInr: true,
        smsCredit: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            headers: true,
            templates: true,
            campaigns: true,
            contactGroups: true,
            apiKeys: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; entityId?: string }) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.entityId && { entityId: data.entityId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        entityId: true,
        balanceInr: true,
        smsCredit: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'PROFILE_UPDATE',
        details: `Profile updated: Name=${data.name || 'Unchanged'}, EntityID=${data.entityId || 'Unchanged'}`,
      },
    });

    return updated;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        entityId: true,
        balanceInr: true,
        smsCredit: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
