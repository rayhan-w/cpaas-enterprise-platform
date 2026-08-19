import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const corsOrigins = configService.get<string>('CORS_ORIGINS') || 'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000';

  // 1. Layer 1: Helmet security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Next.js iframe/asset integrations if proxied
      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Layer 2: CORS Whitelist
  const allowedOrigins = corsOrigins.split(',').map((o) => o.trim());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-API-Key, X-Requested-With, x-razorpay-signature, x-verify',
  });

  // 3. Layer 3: Global Validation Pipe & Input Sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 4. Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Prefix for internal API endpoints (e.g. /api/auth/login) while public is /api/v1/sms/send
  app.setGlobalPrefix('api');

  await app.listen(port);
  logger.log(`🚀 CPaaS Modular Monolith API running on: http://localhost:${port}/api`);
}

bootstrap();
