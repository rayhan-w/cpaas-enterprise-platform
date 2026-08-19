import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        entityId: dto.entityId || '17011582910283',
        balanceInr: 50.00, // Initial welcome bonus
        smsCredit: 416, // ~416 credits
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // Create default DLT header for new user
    await this.prisma.dltHeader.create({
      data: {
        userId: user.id,
        headerName: 'MYCPAAS',
        headerType: 'TRANSACTIONAL',
        status: 'ACTIVE',
      },
    });

    const tokens = await this.generateTokens(user);

    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        details: `Account registered: ${user.email}`,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        balanceInr: user.balanceInr,
        smsCredit: user.smsCredit,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress: string = '127.0.0.1') {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const tokens = await this.generateTokens(user);

    // Track activity log
    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        ipAddress,
        details: `User logged in from ${ipAddress}`,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        entityId: user.entityId,
        balanceInr: user.balanceInr,
        smsCredit: user.smsCredit,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'super_secret_jwt_cpaas_refresh_token_key_2026_y77z@';
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === 'SUSPENDED') {
        throw new UnauthorizedException('Invalid refresh token or user suspended');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      entityId: user.entityId,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'super_secret_jwt_cpaas_enterprise_access_key_2026_x89f!';
    const jwtExp = this.configService.get<string>('JWT_EXPIRATION') || '1d';

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'super_secret_jwt_cpaas_refresh_token_key_2026_y77z@';
    const refreshExp = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtExp as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExp as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400,
    };
  }
}
