import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async listKeys(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        permissions: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateKey(userId: string, dto: CreateApiKeyDto) {
    // Generate 32 bytes hex token
    const randomEntropy = crypto.randomBytes(24).toString('hex');
    const rawApiKey = `cpaas_live_${randomEntropy}`;
    const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');
    const keyPrefix = `${rawApiKey.substring(0, 10)}...`;

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        name: dto.name.trim(),
        keyHash,
        keyPrefix,
        permissions: dto.permissions || 'sms:send,sms:read,reports:read',
        isActive: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'API_KEY_CREATED',
        details: `Generated API Key: "${apiKey.name}" (${keyPrefix})`,
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      rawApiKey, // ONLY returned once upon generation
      permissions: apiKey.permissions,
      createdAt: apiKey.createdAt,
    };
  }

  async revokeKey(userId: string, keyId: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!key) {
      throw new NotFoundException('API Key not found');
    }

    const updated = await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'API_KEY_REVOKED',
        details: `Revoked API Key: "${key.name}" (${key.keyPrefix})`,
      },
    });

    return {
      success: true,
      message: 'API Key revoked successfully',
      id: updated.id,
    };
  }
}
