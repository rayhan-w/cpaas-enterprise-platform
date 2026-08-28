import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    if (dbUrl.startsWith('file:')) {
      const rawPath = dbUrl.replace('file:', '').trim();
      let resolvedPath: string;

      if (path.isAbsolute(rawPath)) {
        resolvedPath = rawPath;
      } else {
        // Try searching in possible directory locations
        const candidates = [
          path.resolve(process.cwd(), 'prisma', rawPath.replace(/^\.\//, '').replace(/^prisma\//, '')),
          path.resolve(process.cwd(), rawPath.replace(/^\.\//, '')),
          path.resolve(__dirname, '../../prisma/dev.db'),
          path.resolve(__dirname, '../../../prisma/dev.db'),
        ];

        resolvedPath = candidates.find((c) => fs.existsSync(c)) || candidates[0];
      }

      // Ensure directory exists
      const dir = path.dirname(resolvedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Standardize Windows path for sqlite URI: file:C:/path/to/dev.db
      const normalizedPath = resolvedPath.replace(/\\/g, '/');
      dbUrl = `file:${normalizedPath}`;
    }

    super({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
