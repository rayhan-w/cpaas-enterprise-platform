import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extract key from X-API-Key or Authorization header
    let apiKey = request.headers['x-api-key'] as string;
    
    if (!apiKey) {
      const authHeader = request.headers['authorization'] as string;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token.startsWith('cpaas_live_') || token.startsWith('cpaas_test_')) {
          apiKey = token;
        }
      }
    }

    if (!apiKey) {
      throw new UnauthorizedException(
        'Missing API Key. Pass "X-API-Key: cpaas_live_..." header or "Authorization: Bearer cpaas_live_..."',
      );
    }

    // Compute SHA-256 hash
    const keyHash = crypto.createHash('sha256').update(apiKey.trim()).digest('hex');

    const keyRecord = await this.prisma.apiKey.findFirst({
      where: { keyHash, isActive: true },
      include: { user: true },
    });

    if (!keyRecord || !keyRecord.user || keyRecord.user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Invalid or inactive API Key');
    }

    // Update lastUsedAt asynchronously
    await this.prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    // Attach user to request
    request.user = keyRecord.user;
    request.apiKey = keyRecord;

    return true;
  }
}
