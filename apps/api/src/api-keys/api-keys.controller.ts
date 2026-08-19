import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async listKeys(@CurrentUser('id') userId: string) {
    return this.apiKeysService.listKeys(userId);
  }

  @Post()
  async generateKey(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.generateKey(userId, dto);
  }

  @Delete(':id')
  async revokeKey(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.apiKeysService.revokeKey(userId, id);
  }
}
